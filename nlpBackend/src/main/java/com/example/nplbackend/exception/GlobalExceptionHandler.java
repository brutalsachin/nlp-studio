package com.example.nplbackend.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageConversionException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
        MethodArgumentNotValidException ex,
        HttpServletRequest request
    ) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(FieldError::getDefaultMessage)
            .orElse("Invalid request");
        return buildError(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
    }

    @ExceptionHandler({
        ConstraintViolationException.class,
        AnalysisException.class,
        DatasetBadRequestException.class,
        FeatureExtractionBadRequestException.class,
        ModelBadRequestException.class,
        ModelNotTrainedException.class,
        PreprocessingBadRequestException.class,
        VectorizationBadRequestException.class,
        MissingServletRequestParameterException.class,
        MissingServletRequestPartException.class
    })
    public ResponseEntity<ApiErrorResponse> handleBadRequest(Exception ex, HttpServletRequest request) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler({
        HttpMessageNotReadableException.class,
        HttpMessageConversionException.class,
        IllegalArgumentException.class
    })
    public ResponseEntity<ApiErrorResponse> handleSerializationErrors(Exception ex, HttpServletRequest request) {
        String message = "Invalid request payload";
        Throwable cause = ex.getCause();
        if (cause != null && cause.getMessage() != null
            && cause.getMessage().contains("Invalid normalization")) {
            message = cause.getMessage();
        } else if (cause != null && cause.getMessage() != null
            && cause.getMessage().contains("Invalid ngramType")) {
            message = cause.getMessage();
        } else if (cause != null && cause.getMessage() != null
            && cause.getMessage().contains("Invalid vectorizationType")) {
            message = cause.getMessage();
        } else if (cause != null && cause.getMessage() != null
            && cause.getMessage().contains("Invalid modelType")) {
            message = cause.getMessage();
        } else if (ex.getMessage() != null && ex.getMessage().contains("Invalid normalization")) {
            message = ex.getMessage();
        } else if (ex.getMessage() != null && ex.getMessage().contains("Invalid ngramType")) {
            message = ex.getMessage();
        } else if (ex.getMessage() != null && ex.getMessage().contains("Invalid vectorizationType")) {
            message = ex.getMessage();
        } else if (ex.getMessage() != null && ex.getMessage().contains("Invalid modelType")) {
            message = ex.getMessage();
        }
        return buildError(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
    }

    @ExceptionHandler({
        MultipartException.class,
        MaxUploadSizeExceededException.class
    })
    public ResponseEntity<ApiErrorResponse> handleMultipartErrors(Exception ex, HttpServletRequest request) {
        return buildError(HttpStatus.BAD_REQUEST, "Invalid multipart upload request", request.getRequestURI());
    }

    @ExceptionHandler(DatasetParseException.class)
    public ResponseEntity<ApiErrorResponse> handleDatasetParseError(
        DatasetParseException ex,
        HttpServletRequest request
    ) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception at {} {}", request.getMethod(), request.getRequestURI(), ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error", request.getRequestURI());
    }

    private ResponseEntity<ApiErrorResponse> buildError(HttpStatus status, String message, String path) {
        ApiErrorResponse body = new ApiErrorResponse(
            Instant.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            path
        );
        return ResponseEntity.status(status).body(body);
    }
}
