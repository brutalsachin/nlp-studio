package com.example.nplbackend.service;

import com.example.nplbackend.model.dto.SentimentResponse;
import java.util.Locale;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class SentimentService {
    private static final Set<String> POSITIVE_WORDS = Set.of(
        "love", "great", "excellent", "awesome", "happy", "good", "fantastic", "amazing", "nice", "best"
    );
    private static final Set<String> NEGATIVE_WORDS = Set.of(
        "bad", "poor", "worst", "awful", "hate", "terrible", "sad", "angry", "boring", "problem"
    );

    public SentimentResponse analyze(String text) {
        String normalized = text.toLowerCase(Locale.ROOT);
        int positiveCount = countMatches(normalized, POSITIVE_WORDS);
        int negativeCount = countMatches(normalized, NEGATIVE_WORDS);

        String prediction;
        if (positiveCount > negativeCount) {
            prediction = "Positive";
        } else if (negativeCount > positiveCount) {
            prediction = "Negative";
        } else {
            prediction = "Neutral";
        }

        double confidence = calculateConfidence(positiveCount, negativeCount, prediction);

        return SentimentResponse.builder()
            .prediction(prediction)
            .confidence(confidence)
            .build();
    }

    private int countMatches(String text, Set<String> lexicon) {
        int count = 0;
        for (String word : lexicon) {
            if (text.contains(word)) {
                count++;
            }
        }
        return count;
    }

    private double calculateConfidence(int positiveCount, int negativeCount, String prediction) {
        if ("Neutral".equals(prediction)) {
            return 0.50;
        }
        int max = Math.max(positiveCount, negativeCount);
        int min = Math.min(positiveCount, negativeCount);
        double score = 0.60 + ((double) (max - min) / Math.max(1, max + min)) * 0.35;
        return Math.min(0.99, Math.round(score * 100.0) / 100.0);
    }
}
