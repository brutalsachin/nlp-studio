package com.example.nplbackend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Locale;

public enum NgramType {
    UNIGRAM,
    BIGRAM,
    TRIGRAM;

    @JsonCreator
    public static NgramType fromValue(String raw) {
        if (raw == null || raw.isBlank()) {
            return UNIGRAM;
        }

        String normalized = raw.trim().toUpperCase(Locale.ROOT);
        for (NgramType type : values()) {
            if (type.name().equals(normalized)) {
                return type;
            }
        }

        throw new IllegalArgumentException(
            "Invalid ngramType. Allowed values: UNIGRAM, BIGRAM, TRIGRAM"
        );
    }
}
