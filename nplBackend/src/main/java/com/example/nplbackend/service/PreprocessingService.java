package com.example.nplbackend.service;

import com.example.nplbackend.dto.PreprocessingRequest;
import com.example.nplbackend.dto.PreprocessingResponse;
import com.example.nplbackend.exception.PreprocessingBadRequestException;
import com.example.nplbackend.model.NormalizationType;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class PreprocessingService {
    private static final Set<String> STOP_WORDS = new LinkedHashSet<>(List.of(
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "had", "has", "have",
        "he", "her", "hers", "him", "his", "i", "in", "is", "it", "its", "me", "my", "of", "on",
        "or", "our", "she", "that", "the", "their", "them", "they", "this", "to", "was", "we",
        "were", "with", "you", "your"
    ));

    private static final Map<String, String> LEMMA_MAP = buildLemmaMap();

    public PreprocessingResponse preview(PreprocessingRequest request) {
        if (request == null) {
            throw new PreprocessingBadRequestException("Request body must not be null");
        }

        if (request.getText() == null || request.getText().isBlank()) {
            throw new PreprocessingBadRequestException("text must not be blank");
        }

        String original = request.getText();
        String working = original;
        List<String> appliedSteps = new ArrayList<>();

        if (request.isLowercase()) {
            working = working.toLowerCase(Locale.ROOT);
            appliedSteps.add("LOWERCASE");
        }

        if (request.isRemovePunctuation()) {
            working = safeRegexReplace(working, "[\\p{Punct}]", " ");
            appliedSteps.add("REMOVE_PUNCTUATION");
        }

        if (request.isRemoveNumbers()) {
            working = safeRegexReplace(working, "\\d+", " ");
            appliedSteps.add("REMOVE_NUMBERS");
        }

        List<String> tokens = tokenize(working);

        if (request.isRemoveStopwords()) {
            tokens = removeStopwords(tokens);
            appliedSteps.add("REMOVE_STOPWORDS");
        }

        NormalizationType normalizationType = request.getNormalization() == null
            ? NormalizationType.NONE
            : request.getNormalization();
        if (normalizationType == NormalizationType.STEMMING) {
            tokens = stem(tokens);
            appliedSteps.add("STEMMING");
        } else if (normalizationType == NormalizationType.LEMMATIZATION) {
            tokens = lemmatize(tokens);
            appliedSteps.add("LEMMATIZATION");
        }

        String processedText = String.join(" ", tokens).trim();
        return new PreprocessingResponse(original, processedText, tokens, appliedSteps);
    }

    private List<String> tokenize(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptyList();
        }

        String[] raw = text.trim().split("\\s+");
        if (raw.length == 0) {
            return Collections.emptyList();
        }

        List<String> tokens = new ArrayList<>();
        for (String token : raw) {
            if (token != null && !token.isBlank()) {
                tokens.add(token.trim());
            }
        }
        return tokens;
    }

    private List<String> removeStopwords(List<String> tokens) {
        List<String> cleaned = new ArrayList<>();
        for (String token : tokens) {
            if (token != null && !token.isBlank()
                && !STOP_WORDS.contains(token.toLowerCase(Locale.ROOT))) {
                cleaned.add(token);
            }
        }
        return cleaned;
    }

    private List<String> stem(List<String> tokens) {
        List<String> stemmed = new ArrayList<>();
        for (String token : tokens) {
            if (token == null || token.isBlank()) {
                continue;
            }
            String t = token;
            if (t.length() > 4 && t.endsWith("ing")) {
                t = t.substring(0, t.length() - 3);
            } else if (t.length() > 3 && t.endsWith("ed")) {
                t = t.substring(0, t.length() - 2);
            } else if (t.length() > 3 && t.endsWith("s")) {
                t = t.substring(0, t.length() - 1);
            }
            stemmed.add(t);
        }
        return stemmed;
    }

    private List<String> lemmatize(List<String> tokens) {
        List<String> lemmatized = new ArrayList<>();
        for (String token : tokens) {
            if (token == null || token.isBlank()) {
                continue;
            }
            String normalized = token.toLowerCase(Locale.ROOT);
            lemmatized.add(LEMMA_MAP.getOrDefault(normalized, normalized));
        }
        return lemmatized;
    }

    private String safeRegexReplace(String input, String regex, String replacement) {
        if (input == null) {
            return "";
        }
        try {
            return input.replaceAll(regex, replacement);
        } catch (RuntimeException ex) {
            throw new PreprocessingBadRequestException("Invalid text format for preprocessing");
        }
    }

    private static Map<String, String> buildLemmaMap() {
        Map<String, String> map = new HashMap<>();
        map.put("loved", "love");
        map.put("loving", "love");
        map.put("running", "run");
        map.put("ran", "run");
        map.put("scenes", "scene");
        map.put("movies", "movie");
        map.put("better", "good");
        map.put("best", "good");
        map.put("worse", "bad");
        map.put("worst", "bad");
        return map;
    }
}
