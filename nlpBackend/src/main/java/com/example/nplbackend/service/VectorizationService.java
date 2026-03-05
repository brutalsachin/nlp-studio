package com.example.nplbackend.service;

import com.example.nplbackend.dto.VectorizationRequest;
import com.example.nplbackend.dto.VectorizationResponse;
import com.example.nplbackend.exception.VectorizationBadRequestException;
import com.example.nplbackend.model.NgramType;
import com.example.nplbackend.model.VectorizationType;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class VectorizationService {
    private static final double PREVIEW_IDF = 1.0;

    public VectorizationResponse preview(VectorizationRequest request) {
        validateRequest(request);

        String text = request.getText() == null ? "" : request.getText().trim().toLowerCase(Locale.ROOT);
        NgramType ngramType = request.getNgramType() == null ? NgramType.UNIGRAM : request.getNgramType();
        VectorizationType vectorizationType = request.getVectorizationType() == null
            ? VectorizationType.TF_IDF
            : request.getVectorizationType();

        List<String> selectedFeatures = sanitizeFeatures(request.getSelectedFeatures());
        List<String> tokens = tokenize(text);
        List<String> ngrams = generateNgrams(tokens, ngramType);
        Map<String, Integer> counts = buildFrequency(ngrams);

        List<Double> vector = new ArrayList<>(selectedFeatures.size());
        int nonZeroValues = 0;
        int matchedFeatures = 0;
        int totalNgramCount = ngrams.size();

        for (String feature : selectedFeatures) {
            int count = counts.getOrDefault(feature, 0);
            double value = computeValue(vectorizationType, count, totalNgramCount);
            value = roundToTwo(value);
            vector.add(value);

            if (count > 0) {
                matchedFeatures++;
            }
            if (value > 0.0) {
                nonZeroValues++;
            }
        }

        int totalFeatures = selectedFeatures.size();
        double featureDensity = totalFeatures == 0 ? 0.0 : (nonZeroValues * 100.0) / totalFeatures;
        double matrixSparsity = 100.0 - featureDensity;
        double vocabCoverage = totalFeatures == 0 ? 0.0 : (matchedFeatures * 100.0) / totalFeatures;

        return new VectorizationResponse(
            vectorizationType.name(),
            vector,
            totalFeatures,
            roundToTwo(featureDensity),
            roundToTwo(matrixSparsity),
            roundToTwo(vocabCoverage)
        );
    }

    private void validateRequest(VectorizationRequest request) {
        if (request == null) {
            throw new VectorizationBadRequestException("Request body must not be null");
        }
        if (request.getText() == null || request.getText().isBlank()) {
            throw new VectorizationBadRequestException("text must not be blank");
        }
        List<String> features = request.getSelectedFeatures();
        if (features == null || features.isEmpty()) {
            throw new VectorizationBadRequestException("selectedFeatures must not be empty");
        }
        boolean hasUsableFeature = false;
        for (String feature : features) {
            if (feature != null && !feature.isBlank()) {
                hasUsableFeature = true;
                break;
            }
        }
        if (!hasUsableFeature) {
            throw new VectorizationBadRequestException("selectedFeatures must contain at least one non-blank value");
        }
    }

    private List<String> sanitizeFeatures(List<String> features) {
        if (features == null || features.isEmpty()) {
            return Collections.emptyList();
        }
        List<String> cleaned = new ArrayList<>();
        for (String feature : features) {
            if (feature != null && !feature.isBlank()) {
                cleaned.add(feature.trim().toLowerCase(Locale.ROOT));
            }
        }
        return cleaned;
    }

    private List<String> tokenize(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptyList();
        }
        String[] raw = text.split("\\s+");
        List<String> tokens = new ArrayList<>();
        for (String token : raw) {
            if (token != null && !token.isBlank()) {
                tokens.add(token);
            }
        }
        return tokens;
    }

    private List<String> generateNgrams(List<String> tokens, NgramType ngramType) {
        if (tokens == null || tokens.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> ngrams = new ArrayList<>();
        if (ngramType == NgramType.UNIGRAM) {
            ngrams.addAll(tokens);
            return ngrams;
        }

        if (ngramType == NgramType.BIGRAM) {
            for (int i = 0; i < tokens.size() - 1; i++) {
                String first = safeToken(tokens, i);
                String second = safeToken(tokens, i + 1);
                if (first != null && second != null) {
                    ngrams.add(first + " " + second);
                }
            }
            return ngrams;
        }

        for (int i = 0; i < tokens.size() - 2; i++) {
            String first = safeToken(tokens, i);
            String second = safeToken(tokens, i + 1);
            String third = safeToken(tokens, i + 2);
            if (first != null && second != null && third != null) {
                ngrams.add(first + " " + second + " " + third);
            }
        }
        return ngrams;
    }

    private String safeToken(List<String> tokens, int index) {
        if (tokens == null || index < 0 || index >= tokens.size()) {
            return null;
        }
        String token = tokens.get(index);
        if (token == null || token.isBlank()) {
            return null;
        }
        return token;
    }

    private Map<String, Integer> buildFrequency(List<String> ngrams) {
        Map<String, Integer> freq = new LinkedHashMap<>();
        if (ngrams == null || ngrams.isEmpty()) {
            return freq;
        }
        for (String gram : ngrams) {
            if (gram != null && !gram.isBlank()) {
                freq.put(gram, freq.getOrDefault(gram, 0) + 1);
            }
        }
        return freq;
    }

    private double computeValue(VectorizationType type, int count, int totalNgramCount) {
        if (type == VectorizationType.BAG_OF_WORDS) {
            return count;
        }
        if (type == VectorizationType.ONE_HOT) {
            return count > 0 ? 1.0 : 0.0;
        }
        if (totalNgramCount <= 0 || count <= 0) {
            return 0.0;
        }
        double tf = (double) count / totalNgramCount;
        return tf * PREVIEW_IDF;
    }

    private double roundToTwo(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
