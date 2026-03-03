package com.example.nplbackend.dto;

import java.util.ArrayList;
import java.util.List;

public class VectorizationResponse {
    private String vectorizationType;
    private List<Double> vector = new ArrayList<>();
    private int featureCount;
    private double featureDensity;
    private double matrixSparsity;
    private double vocabCoverage;

    public VectorizationResponse() {
    }

    public VectorizationResponse(
        String vectorizationType,
        List<Double> vector,
        int featureCount,
        double featureDensity,
        double matrixSparsity,
        double vocabCoverage
    ) {
        this.vectorizationType = vectorizationType;
        this.vector = vector == null ? new ArrayList<>() : vector;
        this.featureCount = featureCount;
        this.featureDensity = featureDensity;
        this.matrixSparsity = matrixSparsity;
        this.vocabCoverage = vocabCoverage;
    }

    public String getVectorizationType() {
        return vectorizationType;
    }

    public void setVectorizationType(String vectorizationType) {
        this.vectorizationType = vectorizationType;
    }

    public List<Double> getVector() {
        return vector;
    }

    public void setVector(List<Double> vector) {
        this.vector = vector == null ? new ArrayList<>() : vector;
    }

    public int getFeatureCount() {
        return featureCount;
    }

    public void setFeatureCount(int featureCount) {
        this.featureCount = featureCount;
    }

    public double getFeatureDensity() {
        return featureDensity;
    }

    public void setFeatureDensity(double featureDensity) {
        this.featureDensity = featureDensity;
    }

    public double getMatrixSparsity() {
        return matrixSparsity;
    }

    public void setMatrixSparsity(double matrixSparsity) {
        this.matrixSparsity = matrixSparsity;
    }

    public double getVocabCoverage() {
        return vocabCoverage;
    }

    public void setVocabCoverage(double vocabCoverage) {
        this.vocabCoverage = vocabCoverage;
    }
}
