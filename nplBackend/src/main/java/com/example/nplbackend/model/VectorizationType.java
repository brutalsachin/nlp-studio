package com.example.nplbackend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Locale;

public enum VectorizationType {
    TF_IDF,
    BAG_OF_WORDS,
    ONE_HOT;

    @JsonCreator
    public static VectorizationType fromValue(String raw) {
        if (raw == null || raw.isBlank()) {
            return TF_IDF;
        }

        String normalized = raw.trim().toUpperCase(Locale.ROOT);
        for (VectorizationType type : values()) {
            if (type.name().equals(normalized)) {
                return type;
            }
        }

        throw new IllegalArgumentException(
            "Invalid vectorizationType. Allowed values: TF_IDF, BAG_OF_WORDS, ONE_HOT"
        );
    }
}
