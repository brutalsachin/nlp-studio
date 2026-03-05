package com.example.nplbackend.model.dto;

import java.util.ArrayList;
import java.util.List;

public class AnalyzeResponse {
    private String input;
    private String prediction;
    private double confidence;
    private List<String> keyDrivers = new ArrayList<>();
    private PipelineDetails pipeline;

    public AnalyzeResponse() {
    }

    public AnalyzeResponse(String input, String prediction, double confidence, List<String> keyDrivers, PipelineDetails pipeline) {
        this.input = input;
        this.prediction = prediction;
        this.confidence = confidence;
        this.keyDrivers = keyDrivers == null ? new ArrayList<>() : keyDrivers;
        this.pipeline = pipeline;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
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

    public List<String> getKeyDrivers() {
        return keyDrivers;
    }

    public void setKeyDrivers(List<String> keyDrivers) {
        this.keyDrivers = keyDrivers == null ? new ArrayList<>() : keyDrivers;
    }

    public PipelineDetails getPipeline() {
        return pipeline;
    }

    public void setPipeline(PipelineDetails pipeline) {
        this.pipeline = pipeline;
    }

    public static class PipelineDetails {
        private List<String> tokens = new ArrayList<>();
        private List<String> ngrams = new ArrayList<>();
        private int vectorSize;
        private String modelUsed;

        public PipelineDetails() {
        }

        public PipelineDetails(List<String> tokens, List<String> ngrams, int vectorSize, String modelUsed) {
            this.tokens = tokens == null ? new ArrayList<>() : tokens;
            this.ngrams = ngrams == null ? new ArrayList<>() : ngrams;
            this.vectorSize = vectorSize;
            this.modelUsed = modelUsed;
        }

        public List<String> getTokens() {
            return tokens;
        }

        public void setTokens(List<String> tokens) {
            this.tokens = tokens == null ? new ArrayList<>() : tokens;
        }

        public List<String> getNgrams() {
            return ngrams;
        }

        public void setNgrams(List<String> ngrams) {
            this.ngrams = ngrams == null ? new ArrayList<>() : ngrams;
        }

        public int getVectorSize() {
            return vectorSize;
        }

        public void setVectorSize(int vectorSize) {
            this.vectorSize = vectorSize;
        }

        public String getModelUsed() {
            return modelUsed;
        }

        public void setModelUsed(String modelUsed) {
            this.modelUsed = modelUsed;
        }
    }
}
