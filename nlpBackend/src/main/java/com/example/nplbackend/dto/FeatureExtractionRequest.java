package com.example.nplbackend.dto;

import com.example.nplbackend.model.NgramType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FeatureExtractionRequest {
    private String text;
    private NgramType ngramType = NgramType.UNIGRAM;
    private Integer maxFeatures = 5000;
    private Integer minDocumentFrequency = 1;

    public FeatureExtractionRequest() {
    }

    public FeatureExtractionRequest(String text, NgramType ngramType, Integer maxFeatures, Integer minDocumentFrequency) {
        this.text = text;
        this.ngramType = ngramType == null ? NgramType.UNIGRAM : ngramType;
        this.maxFeatures = maxFeatures == null ? 5000 : maxFeatures;
        this.minDocumentFrequency = minDocumentFrequency == null ? 1 : minDocumentFrequency;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public NgramType getNgramType() {
        return ngramType;
    }

    public void setNgramType(NgramType ngramType) {
        this.ngramType = ngramType == null ? NgramType.UNIGRAM : ngramType;
    }

    public Integer getMaxFeatures() {
        return maxFeatures;
    }

    public void setMaxFeatures(Integer maxFeatures) {
        this.maxFeatures = maxFeatures == null ? 5000 : maxFeatures;
    }

    public Integer getMinDocumentFrequency() {
        return minDocumentFrequency;
    }

    public void setMinDocumentFrequency(Integer minDocumentFrequency) {
        this.minDocumentFrequency = minDocumentFrequency == null ? 1 : minDocumentFrequency;
    }
}
