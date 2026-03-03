package com.example.nplbackend.service;

import com.example.nplbackend.dto.FeatureExtractionRequest;
import com.example.nplbackend.dto.FeatureExtractionResponse;
import com.example.nplbackend.exception.FeatureExtractionBadRequestException;
import com.example.nplbackend.model.NgramType;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class FeatureExtractionService {

    public FeatureExtractionResponse preview(FeatureExtractionRequest request) {
        validateRequest(request);

        String text = request.getText() == null ? "" : request.getText().trim();
        NgramType ngramType = request.getNgramType() == null ? NgramType.UNIGRAM : request.getNgramType();
        int minDocumentFrequency = request.getMinDocumentFrequency() == null ? 1 : request.getMinDocumentFrequency();
        int maxFeatures = request.getMaxFeatures() == null ? 5000 : request.getMaxFeatures();

        List<String> tokens = tokenize(text);
        List<String> ngrams = generateNgrams(tokens, ngramType);
        Map<String, Integer> frequencies = countFrequencies(ngrams);
        int vocabularySize = frequencies.size();

        List<Map.Entry<String, Integer>> filtered = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : frequencies.entrySet()) {
            Integer value = entry.getValue();
            if (value != null && value >= minDocumentFrequency) {
                filtered.add(entry);
            }
        }
        filtered.sort(MapEntryComparator.INSTANCE);

        int finalSize = Math.min(maxFeatures, filtered.size());
        List<String> selectedFeatures = new ArrayList<>(finalSize);
        for (int i = 0; i < finalSize; i++) {
            String key = filtered.get(i).getKey();
            if (key != null && !key.isBlank()) {
                selectedFeatures.add(key);
            }
        }

        int filteredOutCount = vocabularySize - selectedFeatures.size();
        return new FeatureExtractionResponse(
            ngramType.name(),
            vocabularySize,
            selectedFeatures,
            Math.max(filteredOutCount, 0)
        );
    }

    private void validateRequest(FeatureExtractionRequest request) {
        if (request == null) {
            throw new FeatureExtractionBadRequestException("Request body must not be null");
        }
        if (request.getText() == null || request.getText().isBlank()) {
            throw new FeatureExtractionBadRequestException("text must not be blank");
        }
        if (request.getMaxFeatures() != null && request.getMaxFeatures() <= 0) {
            throw new FeatureExtractionBadRequestException("maxFeatures must be greater than 0");
        }
        if (request.getMinDocumentFrequency() != null && request.getMinDocumentFrequency() <= 0) {
            throw new FeatureExtractionBadRequestException("minDocumentFrequency must be greater than 0");
        }
    }

    private List<String> tokenize(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptyList();
        }
        String[] raw = text.toLowerCase(Locale.ROOT).trim().split("\\s+");
        List<String> tokens = new ArrayList<>();
        for (String token : raw) {
            if (token != null && !token.isBlank()) {
                tokens.add(token);
            }
        }
        return tokens;
    }

    private List<String> generateNgrams(List<String> tokens, NgramType type) {
        if (tokens == null || tokens.isEmpty()) {
            return Collections.emptyList();
        }
        List<String> result = new ArrayList<>();
        if (type == NgramType.UNIGRAM) {
            for (String token : tokens) {
                if (token != null && !token.isBlank()) {
                    result.add(token);
                }
            }
            return result;
        }

        if (type == NgramType.BIGRAM) {
            if (tokens.size() < 2) {
                return Collections.emptyList();
            }
            for (int i = 0; i < tokens.size() - 1; i++) {
                String a = safeToken(tokens, i);
                String b = safeToken(tokens, i + 1);
                if (a != null && b != null) {
                    result.add(a + " " + b);
                }
            }
            return result;
        }

        if (tokens.size() < 3) {
            return Collections.emptyList();
        }
        for (int i = 0; i < tokens.size() - 2; i++) {
            String a = safeToken(tokens, i);
            String b = safeToken(tokens, i + 1);
            String c = safeToken(tokens, i + 2);
            if (a != null && b != null && c != null) {
                result.add(a + " " + b + " " + c);
            }
        }
        return result;
    }

    private Map<String, Integer> countFrequencies(List<String> ngrams) {
        Map<String, Integer> frequencies = new LinkedHashMap<>();
        for (String ngram : ngrams) {
            if (ngram != null && !ngram.isBlank()) {
                frequencies.put(ngram, frequencies.getOrDefault(ngram, 0) + 1);
            }
        }
        return frequencies;
    }

    private String safeToken(List<String> tokens, int index) {
        if (tokens == null || index < 0 || index >= tokens.size()) {
            return null;
        }
        String token = tokens.get(index);
        if (token == null || token.isBlank()) {
            return null;
        }
        return token;
    }

    private static final class MapEntryComparator implements Comparator<Map.Entry<String, Integer>> {
        private static final MapEntryComparator INSTANCE = new MapEntryComparator();

        @Override
        public int compare(Map.Entry<String, Integer> a, Map.Entry<String, Integer> b) {
            String keyA = a == null || a.getKey() == null ? "" : a.getKey();
            String keyB = b == null || b.getKey() == null ? "" : b.getKey();
            Integer valueA = a == null || a.getValue() == null ? 0 : a.getValue();
            Integer valueB = b == null || b.getValue() == null ? 0 : b.getValue();

            int byFrequencyDesc = Integer.compare(valueB, valueA);
            if (byFrequencyDesc != 0) {
                return byFrequencyDesc;
            }
            return keyA.compareTo(keyB);
        }
    }
}
