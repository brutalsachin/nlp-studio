package com.example.nplbackend.model.dto;

import jakarta.validation.constraints.NotBlank;

public class SentimentRequest {
    @NotBlank(message = "text is required")
    private String text;

    public SentimentRequest() {
    }

    public SentimentRequest(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
