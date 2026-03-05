package com.example.nplbackend.dto;

import com.example.nplbackend.model.NgramType;
import com.example.nplbackend.model.NormalizationType;
import com.example.nplbackend.model.VectorizationType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ModelRequest {
    private String modelType;
    private List<List<Double>> features = new ArrayList<>();
    private List<String> labels = new ArrayList<>();
    private Double alpha;
    private Boolean fitPrior;

    private List<String> selectedFeatures = new ArrayList<>();
    private NgramType ngramType = NgramType.UNIGRAM;
    private VectorizationType vectorizationType = VectorizationType.TF_IDF;
    private NormalizationType normalization = NormalizationType.NONE;
    private boolean removeStopwords;
    private boolean lowercase = true;
    private boolean removePunctuation = true;
    private boolean removeNumbers = true;

    public ModelRequest() {
    }

    public String getModelType() {
        return modelType;
    }

    public void setModelType(String modelType) {
        this.modelType = modelType;
    }

    public List<List<Double>> getFeatures() {
        return features;
    }

    public void setFeatures(List<List<Double>> features) {
        this.features = features == null ? new ArrayList<>() : features;
    }

    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels == null ? new ArrayList<>() : labels;
    }

    public Double getAlpha() {
        return alpha;
    }

    public void setAlpha(Double alpha) {
        this.alpha = alpha;
    }

    public Boolean getFitPrior() {
        return fitPrior;
    }

    public void setFitPrior(Boolean fitPrior) {
        this.fitPrior = fitPrior;
    }

    public List<String> getSelectedFeatures() {
        return selectedFeatures;
    }

    public void setSelectedFeatures(List<String> selectedFeatures) {
        this.selectedFeatures = selectedFeatures == null ? new ArrayList<>() : selectedFeatures;
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
