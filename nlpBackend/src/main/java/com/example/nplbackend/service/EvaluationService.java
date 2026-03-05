package com.example.nplbackend.service;

import com.example.nplbackend.dto.ModelResponse;
import com.example.nplbackend.exception.ModelBadRequestException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class EvaluationService {

    public ModelResponse evaluate(List<String> actualLabels, List<String> predictedLabels) {
        validateInputs(actualLabels, predictedLabels);

        int n = actualLabels.size();
        int correct = 0;
        for (int i = 0; i < n; i++) {
            if (actualLabels.get(i).equals(predictedLabels.get(i))) {
                correct++;
            }
        }
        double accuracy = safeDivide(correct, n);

        Map<String, LabelStats> stats = buildLabelStats(actualLabels, predictedLabels);
        double precision = 0.0;
        double recall = 0.0;
        double f1Score = 0.0;
        List<ModelResponse.ClassMetric> classMetrics = new ArrayList<>();
        List<String> labels = new ArrayList<>(stats.keySet());
        Map<String, Integer> labelToIndex = buildLabelToIndex(labels);
        int[][] confusion = buildConfusionMatrix(actualLabels, predictedLabels, labelToIndex);

        int labelCount = stats.size();
        if (labelCount > 0) {
            for (Map.Entry<String, LabelStats> entry : stats.entrySet()) {
                LabelStats labelStats = entry.getValue();
                double p = safeDivide(labelStats.truePositive, labelStats.truePositive + labelStats.falsePositive);
                double r = safeDivide(labelStats.truePositive, labelStats.truePositive + labelStats.falseNegative);
                double f1 = (p + r) == 0.0 ? 0.0 : (2.0 * p * r) / (p + r);

                precision += p;
                recall += r;
                f1Score += f1;

                classMetrics.add(
                    new ModelResponse.ClassMetric(
                        entry.getKey(),
                        roundToFour(p),
                        roundToFour(r),
                        roundToFour(f1),
                        labelStats.support
                    )
                );
            }
            precision /= labelCount;
            recall /= labelCount;
            f1Score /= labelCount;
        }

        return new ModelResponse(
            roundToFour(accuracy),
            roundToFour(precision),
            roundToFour(recall),
            roundToFour(f1Score),
            labels,
            toListMatrix(confusion),
            classMetrics,
            n
        );
    }

    private void validateInputs(List<String> actualLabels, List<String> predictedLabels) {
        if (actualLabels == null || predictedLabels == null) {
            throw new ModelBadRequestException("actual and predicted labels must not be null");
        }
        if (actualLabels.isEmpty() || predictedLabels.isEmpty()) {
            throw new ModelBadRequestException("actual and predicted labels must not be empty");
        }
        if (actualLabels.size() != predictedLabels.size()) {
            throw new ModelBadRequestException("actual and predicted labels size must match");
        }
    }

    private Map<String, LabelStats> buildLabelStats(List<String> actual, List<String> predicted) {
        Map<String, LabelStats> stats = new LinkedHashMap<>();
        for (String label : actual) {
            stats.putIfAbsent(label, new LabelStats());
        }
        for (String label : predicted) {
            stats.putIfAbsent(label, new LabelStats());
        }

        for (int i = 0; i < actual.size(); i++) {
            String actualLabel = actual.get(i);
            String predictedLabel = predicted.get(i);
            LabelStats actualStats = stats.get(actualLabel);
            if (actualStats != null) {
                actualStats.support++;
            }

            for (Map.Entry<String, LabelStats> entry : stats.entrySet()) {
                String label = entry.getKey();
                LabelStats labelStats = entry.getValue();

                boolean actualIsLabel = label.equals(actualLabel);
                boolean predictedIsLabel = label.equals(predictedLabel);

                if (actualIsLabel && predictedIsLabel) {
                    labelStats.truePositive++;
                } else if (!actualIsLabel && predictedIsLabel) {
                    labelStats.falsePositive++;
                } else if (actualIsLabel) {
                    labelStats.falseNegative++;
                }
            }
        }
        return stats;
    }

    private Map<String, Integer> buildLabelToIndex(List<String> labels) {
        Map<String, Integer> labelToIndex = new LinkedHashMap<>();
        for (int i = 0; i < labels.size(); i++) {
            labelToIndex.put(labels.get(i), i);
        }
        return labelToIndex;
    }

    private int[][] buildConfusionMatrix(
        List<String> actualLabels,
        List<String> predictedLabels,
        Map<String, Integer> labelToIndex
    ) {
        int size = labelToIndex.size();
        int[][] matrix = new int[size][size];
        for (int i = 0; i < actualLabels.size(); i++) {
            Integer actualIndex = labelToIndex.get(actualLabels.get(i));
            Integer predictedIndex = labelToIndex.get(predictedLabels.get(i));
            if (actualIndex == null || predictedIndex == null) {
                continue;
            }
            matrix[actualIndex][predictedIndex]++;
        }
        return matrix;
    }

    private List<List<Integer>> toListMatrix(int[][] matrix) {
        List<List<Integer>> rows = new ArrayList<>(matrix.length);
        for (int[] matrixRow : matrix) {
            List<Integer> row = new ArrayList<>(matrixRow.length);
            for (int value : matrixRow) {
                row.add(value);
            }
            rows.add(row);
        }
        return rows;
    }

    private double safeDivide(double numerator, double denominator) {
        if (denominator == 0.0) {
            return 0.0;
        }
        return numerator / denominator;
    }

    private double roundToFour(double value) {
        return Math.round(value * 10000.0) / 10000.0;
    }

    private static final class LabelStats {
        private int truePositive;
        private int falsePositive;
        private int falseNegative;
        private int support;
    }
}
