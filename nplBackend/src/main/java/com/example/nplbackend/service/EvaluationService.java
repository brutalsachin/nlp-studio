package com.example.nplbackend.service;

import com.example.nplbackend.dto.ModelResponse;
import com.example.nplbackend.exception.ModelBadRequestException;
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

        int labelCount = stats.size();
        if (labelCount > 0) {
            for (LabelStats labelStats : stats.values()) {
                double p = safeDivide(labelStats.truePositive, labelStats.truePositive + labelStats.falsePositive);
                double r = safeDivide(labelStats.truePositive, labelStats.truePositive + labelStats.falseNegative);
                double f1 = (p + r) == 0.0 ? 0.0 : (2.0 * p * r) / (p + r);

                precision += p;
                recall += r;
                f1Score += f1;
            }
            precision /= labelCount;
            recall /= labelCount;
            f1Score /= labelCount;
        }

        return new ModelResponse(
            roundToFour(accuracy),
            roundToFour(precision),
            roundToFour(recall),
            roundToFour(f1Score)
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
    }
}
