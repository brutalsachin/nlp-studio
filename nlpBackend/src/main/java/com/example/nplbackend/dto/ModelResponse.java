package com.example.nplbackend.dto;

import java.util.ArrayList;
import java.util.List;

public class ModelResponse {
    private double accuracy;
    private double precision;
    private double recall;
    private double f1Score;
    private List<String> labels = new ArrayList<>();
    private List<List<Integer>> confusionMatrix = new ArrayList<>();
    private List<ClassMetric> classificationReport = new ArrayList<>();
    private int totalSamples;

    public ModelResponse() {
    }

    public ModelResponse(double accuracy, double precision, double recall, double f1Score) {
        this.accuracy = accuracy;
        this.precision = precision;
        this.recall = recall;
        this.f1Score = f1Score;
    }

    public ModelResponse(
        double accuracy,
        double precision,
        double recall,
        double f1Score,
        List<String> labels,
        List<List<Integer>> confusionMatrix,
        List<ClassMetric> classificationReport,
        int totalSamples
    ) {
        this.accuracy = accuracy;
        this.precision = precision;
        this.recall = recall;
        this.f1Score = f1Score;
        this.labels = labels == null ? new ArrayList<>() : labels;
        this.confusionMatrix = confusionMatrix == null ? new ArrayList<>() : confusionMatrix;
        this.classificationReport = classificationReport == null ? new ArrayList<>() : classificationReport;
        this.totalSamples = totalSamples;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public double getPrecision() {
        return precision;
    }

    public void setPrecision(double precision) {
        this.precision = precision;
    }

    public double getRecall() {
        return recall;
    }

    public void setRecall(double recall) {
        this.recall = recall;
    }

    public double getF1Score() {
        return f1Score;
    }

    public void setF1Score(double f1Score) {
        this.f1Score = f1Score;
    }

    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels == null ? new ArrayList<>() : labels;
    }

    public List<List<Integer>> getConfusionMatrix() {
        return confusionMatrix;
    }

    public void setConfusionMatrix(List<List<Integer>> confusionMatrix) {
        this.confusionMatrix = confusionMatrix == null ? new ArrayList<>() : confusionMatrix;
    }

    public List<ClassMetric> getClassificationReport() {
        return classificationReport;
    }

    public void setClassificationReport(List<ClassMetric> classificationReport) {
        this.classificationReport = classificationReport == null ? new ArrayList<>() : classificationReport;
    }

    public int getTotalSamples() {
        return totalSamples;
    }

    public void setTotalSamples(int totalSamples) {
        this.totalSamples = totalSamples;
    }

    public static class ClassMetric {
        private String className;
        private double precision;
        private double recall;
        private double f1Score;
        private int support;

        public ClassMetric() {
        }

        public ClassMetric(String className, double precision, double recall, double f1Score, int support) {
            this.className = className;
            this.precision = precision;
            this.recall = recall;
            this.f1Score = f1Score;
            this.support = support;
        }

        public String getClassName() {
            return className;
        }

        public void setClassName(String className) {
            this.className = className;
        }

        public double getPrecision() {
            return precision;
        }

        public void setPrecision(double precision) {
            this.precision = precision;
        }

        public double getRecall() {
            return recall;
        }

        public void setRecall(double recall) {
            this.recall = recall;
        }

        public double getF1Score() {
            return f1Score;
        }

        public void setF1Score(double f1Score) {
            this.f1Score = f1Score;
        }

        public int getSupport() {
            return support;
        }

        public void setSupport(int support) {
            this.support = support;
        }
    }
}
