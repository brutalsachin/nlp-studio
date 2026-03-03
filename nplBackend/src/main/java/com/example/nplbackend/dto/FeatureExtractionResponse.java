package com.example.nplbackend.dto;

import java.util.ArrayList;
import java.util.List;

public class FeatureExtractionResponse {
    private String ngramType;
    private int vocabularySize;
    private List<String> selectedFeatures = new ArrayList<>();
    private int filteredOutCount;

    public FeatureExtractionResponse() {
    }

    public FeatureExtractionResponse(String ngramType, int vocabularySize, List<String> selectedFeatures, int filteredOutCount) {
        this.ngramType = ngramType;
        this.vocabularySize = vocabularySize;
        this.selectedFeatures = selectedFeatures == null ? new ArrayList<>() : selectedFeatures;
        this.filteredOutCount = filteredOutCount;
    }

    public String getNgramType() {
        return ngramType;
    }

    public void setNgramType(String ngramType) {
        this.ngramType = ngramType;
    }

    public int getVocabularySize() {
        return vocabularySize;
    }

    public void setVocabularySize(int vocabularySize) {
        this.vocabularySize = vocabularySize;
    }

    public List<String> getSelectedFeatures() {
        return selectedFeatures;
    }

    public void setSelectedFeatures(List<String> selectedFeatures) {
        this.selectedFeatures = selectedFeatures == null ? new ArrayList<>() : selectedFeatures;
    }

    public int getFilteredOutCount() {
        return filteredOutCount;
    }

    public void setFilteredOutCount(int filteredOutCount) {
        this.filteredOutCount = filteredOutCount;
    }
}
