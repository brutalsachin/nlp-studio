package com.example.nplbackend.dto;

import com.example.nplbackend.model.NgramType;
import com.example.nplbackend.model.VectorizationType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class VectorizationRequest {
    private String text;
    private NgramType ngramType = NgramType.UNIGRAM;
    private VectorizationType vectorizationType = VectorizationType.TF_IDF;
    private List<String> selectedFeatures = new ArrayList<>();

    public VectorizationRequest() {
    }

    public VectorizationRequest(
        String text,
        NgramType ngramType,
        VectorizationType vectorizationType,
        List<String> selectedFeatures
    ) {
        this.text = text;
        this.ngramType = ngramType == null ? NgramType.UNIGRAM : ngramType;
        this.vectorizationType = vectorizationType == null ? VectorizationType.TF_IDF : vectorizationType;
        this.selectedFeatures = selectedFeatures == null ? new ArrayList<>() : selectedFeatures;
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

    public VectorizationType getVectorizationType() {
        return vectorizationType;
    }

    public void setVectorizationType(VectorizationType vectorizationType) {
        this.vectorizationType = vectorizationType == null ? VectorizationType.TF_IDF : vectorizationType;
    }

    public List<String> getSelectedFeatures() {
        return selectedFeatures;
    }

    public void setSelectedFeatures(List<String> selectedFeatures) {
        this.selectedFeatures = selectedFeatures == null ? new ArrayList<>() : selectedFeatures;
    }
}
