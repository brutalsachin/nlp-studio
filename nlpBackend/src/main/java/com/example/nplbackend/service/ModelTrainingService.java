package com.example.nplbackend.service;

import com.example.nplbackend.dto.FeatureExtractionRequest;
import com.example.nplbackend.dto.ModelPredictionRequest;
import com.example.nplbackend.dto.ModelPredictionResponse;
import com.example.nplbackend.dto.ModelRequest;
import com.example.nplbackend.dto.ModelResponse;
import com.example.nplbackend.dto.PreprocessingRequest;
import com.example.nplbackend.dto.PreprocessingResponse;
import com.example.nplbackend.dto.VectorizationRequest;
import com.example.nplbackend.dto.VectorizationResponse;
import com.example.nplbackend.exception.ModelBadRequestException;
import com.example.nplbackend.exception.ModelNotTrainedException;
import com.example.nplbackend.model.ModelType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.lang.reflect.Method;
import org.springframework.stereotype.Service;

@Service
public class ModelTrainingService {
    private final EvaluationService evaluationService;
    private final PreprocessingService preprocessingService;
    private final FeatureExtractionService featureExtractionService;
    private final VectorizationService vectorizationService;
    private final DatasetService datasetService;

    private volatile TrainedModel trainedModel;

    public ModelTrainingService(
        EvaluationService evaluationService,
        PreprocessingService preprocessingService,
        FeatureExtractionService featureExtractionService,
        VectorizationService vectorizationService,
        DatasetService datasetService
    ) {
        this.evaluationService = evaluationService;
        this.preprocessingService = preprocessingService;
        this.featureExtractionService = featureExtractionService;
        this.vectorizationService = vectorizationService;
        this.datasetService = datasetService;
    }

    public ModelResponse train(ModelRequest request) {
        validateTrainRequest(request);
        TrainingData trainingData = resolveTrainingData(request);
        double[][] x = toFeatureMatrix(trainingData.features());
        LabelEncoding labelEncoding = encodeLabels(trainingData.labels());
        ModelType modelType = ModelType.fromValue(request.getModelType());

        PredictiveModel model;
        if (modelType == ModelType.NAIVE_BAYES) {
            model = trainNaiveBayes(x, labelEncoding.encodedLabels, labelEncoding.indexToLabel.size(), request);
        } else {
            model = trainLogisticRegression(x, labelEncoding.encodedLabels);
        }

        this.trainedModel = new TrainedModel(
            modelType,
            model,
            labelEncoding.indexToLabel,
            x[0].length,
            TrainingPipelineConfig.from(request)
        );

        List<String> predicted = predictLabels(x, this.trainedModel);
        return evaluationService.evaluate(trainingData.labels(), predicted);
    }

    public ModelResponse evaluate(ModelRequest request) {
        TrainedModel current = requireTrainedModel();
        validateEvaluationRequest(request);

        double[][] x = toFeatureMatrix(request.getFeatures());
        if (x[0].length != current.featureCount) {
            throw new ModelBadRequestException("Feature size mismatch with trained model");
        }
        if (request.getLabels().size() != x.length) {
            throw new ModelBadRequestException("labels size must match number of feature rows");
        }

        List<String> predicted = predictLabels(x, current);
        return evaluationService.evaluate(request.getLabels(), predicted);
    }

    public ModelPredictionResponse predict(ModelPredictionRequest request) {
        TrainedModel current = requireTrainedModel();
        if (request == null || request.getText() == null || request.getText().isBlank()) {
            throw new ModelBadRequestException("text must not be blank");
        }

        TrainingPipelineConfig config = current.pipelineConfig;
        if (config.selectedFeatures.isEmpty()) {
            throw new ModelBadRequestException(
                "Prediction requires selectedFeatures from training configuration"
            );
        }

        PreprocessingRequest preprocessingRequest = new PreprocessingRequest();
        preprocessingRequest.setText(request.getText());
        preprocessingRequest.setNormalization(config.normalization);
        preprocessingRequest.setRemoveStopwords(config.removeStopwords);
        preprocessingRequest.setLowercase(config.lowercase);
        preprocessingRequest.setRemovePunctuation(config.removePunctuation);
        preprocessingRequest.setRemoveNumbers(config.removeNumbers);
        PreprocessingResponse preprocessingResponse = preprocessingService.preview(preprocessingRequest);

        FeatureExtractionRequest featureExtractionRequest = new FeatureExtractionRequest();
        featureExtractionRequest.setText(preprocessingResponse.getProcessedText());
        featureExtractionRequest.setNgramType(config.ngramType);
        featureExtractionRequest.setMinDocumentFrequency(1);
        featureExtractionRequest.setMaxFeatures(Math.max(config.selectedFeatures.size(), 1));
        featureExtractionService.preview(featureExtractionRequest);

        VectorizationRequest vectorizationRequest = new VectorizationRequest();
        vectorizationRequest.setText(preprocessingResponse.getProcessedText());
        vectorizationRequest.setNgramType(config.ngramType);
        vectorizationRequest.setVectorizationType(config.vectorizationType);
        vectorizationRequest.setSelectedFeatures(config.selectedFeatures);
        VectorizationResponse vectorizationResponse = vectorizationService.preview(vectorizationRequest);

        double[] rawFeatures = toFeatureVector(vectorizationResponse.getVector());
        double[] aligned = alignFeatureVector(rawFeatures, current.featureCount);

        PredictionResult prediction = current.model.predict(aligned);
        String label = current.indexToLabel.getOrDefault(prediction.labelIndex, "unknown");
        return new ModelPredictionResponse(label, roundToFour(prediction.confidence));
    }

    private List<String> predictLabels(double[][] x, TrainedModel current) {
        List<String> predicted = new ArrayList<>(x.length);
        for (double[] row : x) {
            PredictionResult result = current.model.predict(row);
            String label = current.indexToLabel.getOrDefault(result.labelIndex, "unknown");
            predicted.add(label);
        }
        return predicted;
    }

    private TrainedModel requireTrainedModel() {
        TrainedModel current = this.trainedModel;
        if (current == null) {
            throw new ModelNotTrainedException("No trained model found. Call /api/model/train first");
        }
        return current;
    }

    private void validateTrainRequest(ModelRequest request) {
        if (request == null) {
            throw new ModelBadRequestException("Request body must not be null");
        }
        if (request.getModelType() == null || request.getModelType().isBlank()) {
            throw new ModelBadRequestException("modelType must not be blank");
        }
        boolean hasFeatures = request.getFeatures() != null && !request.getFeatures().isEmpty();
        boolean hasLabels = request.getLabels() != null && !request.getLabels().isEmpty();
        if (hasFeatures != hasLabels) {
            throw new ModelBadRequestException("features and labels must be provided together");
        }
        if (hasFeatures && request.getSelectedFeatures() != null && !request.getSelectedFeatures().isEmpty()) {
            int vectorSize = request.getFeatures().get(0) == null ? 0 : request.getFeatures().get(0).size();
            if (vectorSize != request.getSelectedFeatures().size()) {
                throw new ModelBadRequestException("selectedFeatures size must match feature vector size");
            }
        }
    }

    private TrainingData resolveTrainingData(ModelRequest request) {
        boolean hasFeatures = request.getFeatures() != null && !request.getFeatures().isEmpty();
        boolean hasLabels = request.getLabels() != null && !request.getLabels().isEmpty();

        if (hasFeatures && hasLabels) {
            if (request.getFeatures().size() != request.getLabels().size()) {
                throw new ModelBadRequestException("labels size must match number of feature rows");
            }
            return new TrainingData(request.getFeatures(), request.getLabels());
        }

        if (!hasFeatures && !hasLabels) {
            return buildTrainingDataFromUploadedDataset(request);
        }

        throw new ModelBadRequestException("features and labels must be provided together");
    }

    private TrainingData buildTrainingDataFromUploadedDataset(ModelRequest request) {
        DatasetService.UploadedDataset uploaded = datasetService.requireUploadedDataset();
        if (uploaded.texts().isEmpty() || uploaded.labels().isEmpty()) {
            throw new ModelBadRequestException(
                "Uploaded dataset has no valid text+label rows. Verify CSV text/label columns."
            );
        }
        if (uploaded.texts().size() != uploaded.labels().size()) {
            throw new ModelBadRequestException(
                "Uploaded dataset text/label row count mismatch"
            );
        }
        long distinctLabels = uploaded.labels().stream()
            .filter(label -> label != null && !label.isBlank())
            .distinct()
            .count();
        if (distinctLabels < 2) {
            throw new ModelBadRequestException(
                "Uploaded dataset must contain at least 2 distinct labels"
            );
        }
        if (request.getSelectedFeatures() == null || request.getSelectedFeatures().isEmpty()) {
            throw new ModelBadRequestException(
                "selectedFeatures are required when training from uploaded dataset"
            );
        }

        List<List<Double>> featureRows = new ArrayList<>(uploaded.texts().size());
        for (String text : uploaded.texts()) {
            PreprocessingRequest preprocessingRequest = new PreprocessingRequest();
            preprocessingRequest.setText(text);
            preprocessingRequest.setNormalization(request.getNormalization());
            preprocessingRequest.setRemoveStopwords(request.isRemoveStopwords());
            preprocessingRequest.setLowercase(request.isLowercase());
            preprocessingRequest.setRemovePunctuation(request.isRemovePunctuation());
            preprocessingRequest.setRemoveNumbers(request.isRemoveNumbers());
            PreprocessingResponse preprocessingResponse = preprocessingService.preview(preprocessingRequest);

            VectorizationRequest vectorizationRequest = new VectorizationRequest();
            vectorizationRequest.setText(preprocessingResponse.getProcessedText());
            vectorizationRequest.setNgramType(request.getNgramType());
            vectorizationRequest.setVectorizationType(request.getVectorizationType());
            vectorizationRequest.setSelectedFeatures(request.getSelectedFeatures());
            VectorizationResponse vectorizationResponse = vectorizationService.preview(vectorizationRequest);

            featureRows.add(new ArrayList<>(vectorizationResponse.getVector()));
        }
        return new TrainingData(featureRows, uploaded.labels());
    }

    private void validateEvaluationRequest(ModelRequest request) {
        if (request == null) {
            throw new ModelBadRequestException("Request body must not be null");
        }
        if (request.getFeatures() == null || request.getFeatures().isEmpty()) {
            throw new ModelBadRequestException("features must not be empty");
        }
        if (request.getLabels() == null || request.getLabels().isEmpty()) {
            throw new ModelBadRequestException("labels must not be empty");
        }
    }

    private double[][] toFeatureMatrix(List<List<Double>> features) {
        if (features == null || features.isEmpty()) {
            throw new ModelBadRequestException("features must not be empty");
        }
        List<Double> first = features.get(0);
        if (first == null || first.isEmpty()) {
            throw new ModelBadRequestException("feature vectors must not be empty");
        }

        int rows = features.size();
        int cols = first.size();
        double[][] matrix = new double[rows][cols];

        for (int i = 0; i < rows; i++) {
            List<Double> row = features.get(i);
            if (row == null || row.size() != cols) {
                throw new ModelBadRequestException("all feature rows must have same length");
            }
            for (int j = 0; j < cols; j++) {
                Double value = row.get(j);
                matrix[i][j] = value == null ? 0.0 : value;
            }
        }
        return matrix;
    }

    private double[] toFeatureVector(List<Double> featureValues) {
        if (featureValues == null || featureValues.isEmpty()) {
            return new double[0];
        }
        double[] vector = new double[featureValues.size()];
        for (int i = 0; i < featureValues.size(); i++) {
            Double value = featureValues.get(i);
            vector[i] = value == null ? 0.0 : value;
        }
        return vector;
    }

    private double[] alignFeatureVector(double[] vector, int targetSize) {
        if (vector.length == targetSize) {
            return vector;
        }
        double[] aligned = new double[targetSize];
        int copyLength = Math.min(vector.length, targetSize);
        System.arraycopy(vector, 0, aligned, 0, copyLength);
        return aligned;
    }

    private LabelEncoding encodeLabels(List<String> labels) {
        Map<String, Integer> labelToIndex = new LinkedHashMap<>();
        Map<Integer, String> indexToLabel = new LinkedHashMap<>();
        int[] encoded = new int[labels.size()];

        int index = 0;
        for (int i = 0; i < labels.size(); i++) {
            String label = labels.get(i);
            if (label == null || label.isBlank()) {
                throw new ModelBadRequestException("labels must not contain blank values");
            }
            Integer mapped = labelToIndex.get(label);
            if (mapped == null) {
                mapped = index++;
                labelToIndex.put(label, mapped);
                indexToLabel.put(mapped, label);
            }
            encoded[i] = mapped;
        }

        if (indexToLabel.size() < 2) {
            throw new ModelBadRequestException("At least 2 distinct labels are required");
        }

        return new LabelEncoding(encoded, indexToLabel);
    }

    private PredictiveModel trainNaiveBayes(double[][] x, int[] y, int classCount, ModelRequest request) {
        double alpha = request.getAlpha() == null ? 1.0 : request.getAlpha();
        boolean fitPrior = request.getFitPrior() == null || request.getFitPrior();

        if (alpha <= 0.0) {
            throw new ModelBadRequestException("alpha must be greater than 0");
        }

        int features = x[0].length;
        double[][] featureSums = new double[classCount][features];
        double[] classTotals = new double[classCount];
        int[] classCounts = new int[classCount];

        for (int i = 0; i < x.length; i++) {
            int label = y[i];
            classCounts[label]++;
            for (int j = 0; j < features; j++) {
                double value = Math.max(x[i][j], 0.0);
                featureSums[label][j] += value;
                classTotals[label] += value;
            }
        }

        double[] logPrior = new double[classCount];
        for (int c = 0; c < classCount; c++) {
            if (fitPrior) {
                logPrior[c] = Math.log((classCounts[c] + alpha) / (x.length + alpha * classCount));
            } else {
                logPrior[c] = Math.log(1.0 / classCount);
            }
        }

        double[][] logLikelihood = new double[classCount][features];
        for (int c = 0; c < classCount; c++) {
            double denominator = classTotals[c] + alpha * features;
            for (int j = 0; j < features; j++) {
                double numerator = featureSums[c][j] + alpha;
                logLikelihood[c][j] = Math.log(numerator / denominator);
            }
        }

        return new NaiveBayesModel(logPrior, logLikelihood);
    }

    private PredictiveModel trainLogisticRegression(double[][] x, int[] y) {
        PredictiveModel smileBackedModel = trainSmileLogisticRegression(x, y);
        if (smileBackedModel != null) {
            return smileBackedModel;
        }
        return trainInHouseLogisticRegression(x, y);
    }

    private PredictiveModel trainSmileLogisticRegression(double[][] x, int[] y) {
        try {
            Class<?> logisticClass = Class.forName("smile.classification.LogisticRegression");
            Method fitMethod = logisticClass.getMethod("fit", double[][].class, int[].class);
            Object trained = fitMethod.invoke(null, x, y);
            return new SmileLogisticRegressionModel(trained);
        } catch (ReflectiveOperationException | RuntimeException ex) {
            return null;
        }
    }

    private PredictiveModel trainInHouseLogisticRegression(double[][] x, int[] y) {
        int classCount = distinctClassCount(y);
        int featureCount = x[0].length;
        double[][] weights = new double[classCount][featureCount + 1];

        double learningRate = 0.05;
        int epochs = 300;
        double l2 = 1e-4;

        for (int c = 0; c < classCount; c++) {
            double[] wc = weights[c];
            for (int epoch = 0; epoch < epochs; epoch++) {
                for (int i = 0; i < x.length; i++) {
                    double[] row = x[i];
                    double target = y[i] == c ? 1.0 : 0.0;
                    double prediction = sigmoid(dotWithBias(wc, row));
                    double error = prediction - target;

                    wc[0] -= learningRate * error;
                    for (int j = 0; j < featureCount; j++) {
                        double gradient = error * row[j] + l2 * wc[j + 1];
                        wc[j + 1] -= learningRate * gradient;
                    }
                }
            }
        }
        return new InHouseLogisticRegressionModel(weights);
    }

    private int distinctClassCount(int[] y) {
        int max = 0;
        for (int value : y) {
            if (value > max) {
                max = value;
            }
        }
        return max + 1;
    }

    private double dotWithBias(double[] weights, double[] features) {
        double result = weights[0];
        for (int i = 0; i < features.length; i++) {
            result += weights[i + 1] * features[i];
        }
        return result;
    }

    private double sigmoid(double value) {
        if (value >= 0) {
            double z = Math.exp(-value);
            return 1.0 / (1.0 + z);
        }
        double z = Math.exp(value);
        return z / (1.0 + z);
    }

    private double roundToFour(double value) {
        return Math.round(value * 10000.0) / 10000.0;
    }

    private record LabelEncoding(int[] encodedLabels, Map<Integer, String> indexToLabel) {
    }

    private record TrainingData(List<List<Double>> features, List<String> labels) {
    }

    private static final class TrainingPipelineConfig {
        private final List<String> selectedFeatures;
        private final com.example.nplbackend.model.NgramType ngramType;
        private final com.example.nplbackend.model.VectorizationType vectorizationType;
        private final com.example.nplbackend.model.NormalizationType normalization;
        private final boolean removeStopwords;
        private final boolean lowercase;
        private final boolean removePunctuation;
        private final boolean removeNumbers;

        private TrainingPipelineConfig(
            List<String> selectedFeatures,
            com.example.nplbackend.model.NgramType ngramType,
            com.example.nplbackend.model.VectorizationType vectorizationType,
            com.example.nplbackend.model.NormalizationType normalization,
            boolean removeStopwords,
            boolean lowercase,
            boolean removePunctuation,
            boolean removeNumbers
        ) {
            this.selectedFeatures = selectedFeatures == null ? new ArrayList<>() : new ArrayList<>(selectedFeatures);
            this.ngramType = ngramType;
            this.vectorizationType = vectorizationType;
            this.normalization = normalization;
            this.removeStopwords = removeStopwords;
            this.lowercase = lowercase;
            this.removePunctuation = removePunctuation;
            this.removeNumbers = removeNumbers;
        }

        private static TrainingPipelineConfig from(ModelRequest request) {
            return new TrainingPipelineConfig(
                request.getSelectedFeatures(),
                request.getNgramType(),
                request.getVectorizationType(),
                request.getNormalization(),
                request.isRemoveStopwords(),
                request.isLowercase(),
                request.isRemovePunctuation(),
                request.isRemoveNumbers()
            );
        }
    }

    private record TrainedModel(
        ModelType modelType,
        PredictiveModel model,
        Map<Integer, String> indexToLabel,
        int featureCount,
        TrainingPipelineConfig pipelineConfig
    ) {
    }

    private interface PredictiveModel {
        PredictionResult predict(double[] features);
    }

    private record PredictionResult(int labelIndex, double confidence) {
    }

    private static final class NaiveBayesModel implements PredictiveModel {
        private final double[] logPrior;
        private final double[][] logLikelihood;

        private NaiveBayesModel(double[] logPrior, double[][] logLikelihood) {
            this.logPrior = logPrior;
            this.logLikelihood = logLikelihood;
        }

        @Override
        public PredictionResult predict(double[] features) {
            int classCount = logPrior.length;
            double[] scores = new double[classCount];
            Arrays.fill(scores, 0.0);

            for (int c = 0; c < classCount; c++) {
                double score = logPrior[c];
                for (int j = 0; j < features.length; j++) {
                    double value = Math.max(features[j], 0.0);
                    score += value * logLikelihood[c][j];
                }
                scores[c] = score;
            }

            int bestIndex = 0;
            double bestValue = scores[0];
            for (int c = 1; c < classCount; c++) {
                if (scores[c] > bestValue) {
                    bestValue = scores[c];
                    bestIndex = c;
                }
            }

            double confidence = softmaxProbability(scores, bestIndex);
            return new PredictionResult(bestIndex, confidence);
        }

        private double softmaxProbability(double[] logits, int targetIndex) {
            double max = logits[0];
            for (int i = 1; i < logits.length; i++) {
                if (logits[i] > max) {
                    max = logits[i];
                }
            }

            double sum = 0.0;
            for (double logit : logits) {
                sum += Math.exp(logit - max);
            }
            if (sum == 0.0) {
                return 0.0;
            }
            return Math.exp(logits[targetIndex] - max) / sum;
        }
    }

    private static final class SmileLogisticRegressionModel implements PredictiveModel {
        private final Object model;
        private final Method predictWithPosterior;
        private final Method predictOnly;

        private SmileLogisticRegressionModel(Object model) throws ReflectiveOperationException {
            this.model = model;
            Class<?> modelClass = model.getClass();
            Method withPosterior = null;
            Method only = null;
            try {
                withPosterior = modelClass.getMethod("predict", double[].class, double[].class);
            } catch (NoSuchMethodException ignored) {
                withPosterior = null;
            }
            try {
                only = modelClass.getMethod("predict", double[].class);
            } catch (NoSuchMethodException ignored) {
                only = null;
            }
            if (withPosterior == null && only == null) {
                throw new NoSuchMethodException("No supported predict method found in Smile logistic model");
            }
            this.predictWithPosterior = withPosterior;
            this.predictOnly = only;
        }

        @Override
        public PredictionResult predict(double[] features) {
            try {
                if (predictWithPosterior != null) {
                    double[] posterior = new double[Math.max(features.length, 2)];
                    int predicted = (int) predictWithPosterior.invoke(model, features, posterior);
                    double confidence = 0.0;
                    if (predicted >= 0 && predicted < posterior.length) {
                        confidence = posterior[predicted];
                    }
                    return new PredictionResult(predicted, confidence);
                }

                int predicted = (int) predictOnly.invoke(model, features);
                return new PredictionResult(predicted, 1.0);
            } catch (ReflectiveOperationException ex) {
                throw new ModelBadRequestException("Failed to run logistic regression prediction");
            }
        }
    }

    private static final class InHouseLogisticRegressionModel implements PredictiveModel {
        private final double[][] weights;

        private InHouseLogisticRegressionModel(double[][] weights) {
            this.weights = weights;
        }

        @Override
        public PredictionResult predict(double[] features) {
            double[] classScores = new double[weights.length];
            int bestIndex = 0;
            double bestScore = Double.NEGATIVE_INFINITY;

            for (int c = 0; c < weights.length; c++) {
                double score = weights[c][0];
                for (int j = 0; j < features.length; j++) {
                    score += weights[c][j + 1] * features[j];
                }
                classScores[c] = score;
                if (score > bestScore) {
                    bestScore = score;
                    bestIndex = c;
                }
            }

            double confidence = softmaxProbability(classScores, bestIndex);
            return new PredictionResult(bestIndex, confidence);
        }

        private double softmaxProbability(double[] logits, int targetIndex) {
            double max = logits[0];
            for (int i = 1; i < logits.length; i++) {
                if (logits[i] > max) {
                    max = logits[i];
                }
            }

            double sum = 0.0;
            for (double logit : logits) {
                sum += Math.exp(logit - max);
            }
            if (sum == 0.0) {
                return 0.0;
            }
            return Math.exp(logits[targetIndex] - max) / sum;
        }
    }
}
