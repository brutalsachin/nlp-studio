package com.example.nplbackend.exception;

public class DatasetParseException extends RuntimeException {
    public DatasetParseException(String message, Throwable cause) {
        super(message, cause);
    }

    public DatasetParseException(String message) {
        super(message);
    }
}
