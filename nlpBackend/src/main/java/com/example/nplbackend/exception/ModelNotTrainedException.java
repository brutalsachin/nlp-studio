package com.example.nplbackend.exception;

public class ModelNotTrainedException extends RuntimeException {
    public ModelNotTrainedException(String message) {
        super(message);
    }
}
