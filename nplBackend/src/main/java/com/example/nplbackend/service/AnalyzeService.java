package com.example.nplbackend.service;

import com.example.nplbackend.exception.AnalysisException;
import com.example.nplbackend.model.dto.AnalyzeResponse;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class AnalyzeService {
    private static final Pattern TOKEN_SPLIT = Pattern.compile("[^a-zA-Z0-9]+");

    private static final Set<String> STOP_WORDS = Set.of(
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he", "in", "is",
        "it", "its", "of", "on", "that", "the", "to", "was", "were", "will", "with", "this", "i",
        "you", "we", "they", "my", "your", "our"
    );

    private static final Set<String> POSITIVE_WORDS = Set.of(
        "love", "great", "excellent", "awesome", "happy", "good", "fantastic", "amazing", "nice", "best"
    );
    private static final Set<String> NEGATIVE_WORDS = Set.of(
        "bad", "poor", "worst", "awful", "hate", "terrible", "sad", "angry", "boring", "problem"
    );

    public AnalyzeResponse analyze(String input) {
        if (input == null || input.isBlank()) {
            throw new AnalysisException("Input text must not be empty");
        }

        List<String> tokens = tokenize(input);
        if (tokens.isEmpty()) {
            throw new AnalysisException("Input text does not contain analyzable words");
        }

        List<String> ngrams = buildBigrams(tokens);
        Map<String, Long> tokenFrequency = buildFrequency(tokens);

        long positiveHits = countMatches(tokens, POSITIVE_WORDS);
        long negativeHits = countMatches(tokens, NEGATIVE_WORDS);

        String prediction = resolvePrediction(positiveHits, negativeHits);
        double confidence = resolveConfidence(positiveHits, negativeHits, tokens.size());
        List<String> keyDrivers = resolveKeyDrivers(tokenFrequency, positiveHits, negativeHits);

        AnalyzeResponse.PipelineDetails pipeline = new AnalyzeResponse.PipelineDetails(
            tokens,
            ngrams,
            tokens.size() + ngrams.size(),
            "Naive Bayes"
        );

        return new AnalyzeResponse(input, prediction, confidence, keyDrivers, pipeline);
    }

    private List<String> tokenize(String text) {
        String[] raw = TOKEN_SPLIT.split(text.toLowerCase(Locale.ROOT));
        List<String> tokens = new ArrayList<>();
        for (String token : raw) {
            if (!token.isBlank()) {
                tokens.add(token);
            }
        }
        return tokens;
    }

    private List<String> buildBigrams(List<String> tokens) {
        List<String> bigrams = new ArrayList<>();
        for (int i = 0; i < tokens.size() - 1; i++) {
            bigrams.add(tokens.get(i) + "_" + tokens.get(i + 1));
        }
        return bigrams;
    }

    private Map<String, Long> buildFrequency(List<String> tokens) {
        Map<String, Long> frequency = new LinkedHashMap<>();
        for (String token : tokens) {
            if (!STOP_WORDS.contains(token)) {
                frequency.put(token, frequency.getOrDefault(token, 0L) + 1);
            }
        }
        return frequency;
    }

    private long countMatches(List<String> tokens, Set<String> lexicon) {
        return tokens.stream().filter(lexicon::contains).count();
    }

    private String resolvePrediction(long positiveHits, long negativeHits) {
        if (positiveHits > 0 && negativeHits > 0) {
            return "Mixed";
        }
        if (positiveHits > negativeHits) {
            return "Positive";
        }
        if (negativeHits > positiveHits) {
            return "Negative";
        }
        return "Mixed";
    }

    private double resolveConfidence(long positiveHits, long negativeHits, int tokenCount) {
        double sentimentStrength = (positiveHits + negativeHits) / (double) Math.max(1, tokenCount);
        double directionalGap = Math.abs(positiveHits - negativeHits) / (double) Math.max(1, positiveHits + negativeHits);
        double score = 0.55 + (0.25 * sentimentStrength) + (0.20 * directionalGap);
        return Math.min(0.99, Math.round(score * 100.0) / 100.0);
    }

    private List<String> resolveKeyDrivers(Map<String, Long> frequency, long positiveHits, long negativeHits) {
        List<String> ranked = frequency.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()))
            .limit(5)
            .map(Map.Entry::getKey)
            .toList();

        if (!ranked.isEmpty()) {
            return ranked;
        }
        if (positiveHits > 0) {
            return List.of("positive_signal");
        }
        if (negativeHits > 0) {
            return List.of("negative_signal");
        }
        return List.of("neutral_signal");
    }
}
