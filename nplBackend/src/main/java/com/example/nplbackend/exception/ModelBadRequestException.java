package com.example.nplbackend.exception;

public class ModelBadRequestException extends RuntimeException {
    public ModelBadRequestException(String message) {
        super(message);
    }
}
