package com.example.nplbackend.dto;

import java.util.ArrayList;
import java.util.List;

public class PreprocessingResponse {
    private String originalText;
    private String processedText;
    private List<String> tokens = new ArrayList<>();
    private List<String> appliedSteps = new ArrayList<>();

    public PreprocessingResponse() {
    }

    public PreprocessingResponse(String originalText, String processedText, List<String> tokens, List<String> appliedSteps) {
        this.originalText = originalText;
        this.processedText = processedText;
        this.tokens = tokens == null ? new ArrayList<>() : tokens;
        this.appliedSteps = appliedSteps == null ? new ArrayList<>() : appliedSteps;
    }

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public String getProcessedText() {
        return processedText;
    }

    public void setProcessedText(String processedText) {
        this.processedText = processedText;
    }

    public List<String> getTokens() {
        return tokens;
    }

    public void setTokens(List<String> tokens) {
        this.tokens = tokens == null ? new ArrayList<>() : tokens;
    }

    public List<String> getAppliedSteps() {
        return appliedSteps;
    }

    public void setAppliedSteps(List<String> appliedSteps) {
        this.appliedSteps = appliedSteps == null ? new ArrayList<>() : appliedSteps;
    }
}
