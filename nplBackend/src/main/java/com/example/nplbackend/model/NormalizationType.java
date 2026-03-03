package com.example.nplbackend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Locale;

public enum NormalizationType {
    STEMMING,
    LEMMATIZATION,
    NONE;

    @JsonCreator
    public static NormalizationType fromValue(String raw) {
        if (raw == null || raw.isBlank()) {
            return NONE;
        }

        String normalized = raw.trim().toUpperCase(Locale.ROOT);
        for (NormalizationType type : values()) {
            if (type.name().equals(normalized)) {
                return type;
            }
        }

        throw new IllegalArgumentException(
            "Invalid normalization. Allowed values: STEMMING, LEMMATIZATION, NONE"
        );
    }
}
