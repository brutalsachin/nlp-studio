package com.example.nplbackend.model.dto;

public class SentimentResponse {
    private String prediction;
    private double confidence;

    public SentimentResponse() {
    }

    public SentimentResponse(String prediction, double confidence) {
        this.prediction = prediction;
        this.confidence = confidence;
    }

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }
}
