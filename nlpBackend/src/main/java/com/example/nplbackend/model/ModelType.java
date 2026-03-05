package com.example.nplbackend.model;

import com.example.nplbackend.exception.ModelBadRequestException;
import java.util.Locale;

public enum ModelType {
    NAIVE_BAYES,
    LOGISTIC_REGRESSION;

    public static ModelType fromValue(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new ModelBadRequestException("modelType must not be blank");
        }

        String normalized = raw.trim().toUpperCase(Locale.ROOT).replace('-', '_');
        for (ModelType type : values()) {
            if (type.name().equals(normalized)) {
                return type;
            }
        }

        throw new ModelBadRequestException(
            "Invalid modelType. Allowed values: naive_bayes, logistic_regression"
        );
    }
}
