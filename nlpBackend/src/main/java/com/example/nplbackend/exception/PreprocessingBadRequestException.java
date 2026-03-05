package com.example.nplbackend.exception;

public class PreprocessingBadRequestException extends RuntimeException {
    public PreprocessingBadRequestException(String message) {
        super(message);
    }
}
