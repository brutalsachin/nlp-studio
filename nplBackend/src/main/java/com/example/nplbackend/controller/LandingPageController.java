package com.example.nplbackend.controller;

import com.example.nplbackend.model.dto.LandingPageResponse;
import com.example.nplbackend.model.dto.SentimentRequest;
import com.example.nplbackend.model.dto.SentimentResponse;
import com.example.nplbackend.service.LandingPageService;
import com.example.nplbackend.service.SentimentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class LandingPageController {
    private final LandingPageService landingPageService;
    private final SentimentService sentimentService;

    @GetMapping("/landing-page")
    public LandingPageResponse getLandingPage() {
        return landingPageService.getLandingPage();
    }

    @PostMapping("/analyze/sentiment")
    public SentimentResponse analyzeSentiment(@Valid @RequestBody SentimentRequest request) {
        return sentimentService.analyze(request.getText());
    }
}
