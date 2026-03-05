package com.example.nplbackend.dto;

import com.example.nplbackend.model.NormalizationType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PreprocessingRequest {
    private String text;
    private NormalizationType normalization = NormalizationType.NONE;
    private boolean removeStopwords;
    private boolean lowercase;
    private boolean removePunctuation;
    private boolean removeNumbers;

    public PreprocessingRequest() {
    }

    public PreprocessingRequest(
        String text,
        NormalizationType normalization,
        boolean removeStopwords,
        boolean lowercase,
        boolean removePunctuation,
        boolean removeNumbers
    ) {
        this.text = text;
        this.normalization = normalization == null ? NormalizationType.NONE : normalization;
        this.removeStopwords = removeStopwords;
        this.lowercase = lowercase;
        this.removePunctuation = removePunctuation;
        this.removeNumbers = removeNumbers;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public NormalizationType getNormalization() {
        return normalization;
    }

    public void setNormalization(NormalizationType normalization) {
        this.normalization = normalization == null ? NormalizationType.NONE : normalization;
    }

    public boolean isRemoveStopwords() {
        return removeStopwords;
    }

    public void setRemoveStopwords(boolean removeStopwords) {
        this.removeStopwords = removeStopwords;
    }

    public boolean isLowercase() {
        return lowercase;
    }

    public void setLowercase(boolean lowercase) {
        this.lowercase = lowercase;
    }

    public boolean isRemovePunctuation() {
        return removePunctuation;
    }

    public void setRemovePunctuation(boolean removePunctuation) {
        this.removePunctuation = removePunctuation;
    }

    public boolean isRemoveNumbers() {
        return removeNumbers;
    }

    public void setRemoveNumbers(boolean removeNumbers) {
        this.removeNumbers = removeNumbers;
    }
}
