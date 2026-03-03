package com.example.nplbackend.exception;

public class DatasetBadRequestException extends RuntimeException {
    public DatasetBadRequestException(String message) {
        super(message);
    }
}
