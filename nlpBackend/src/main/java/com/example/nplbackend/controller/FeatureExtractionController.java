package com.example.nplbackend.controller;

import com.example.nplbackend.dto.FeatureExtractionRequest;
import com.example.nplbackend.dto.FeatureExtractionResponse;
import com.example.nplbackend.service.FeatureExtractionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feature-extraction")
public class FeatureExtractionController {
    private final FeatureExtractionService featureExtractionService;

    public FeatureExtractionController(FeatureExtractionService featureExtractionService) {
        this.featureExtractionService = featureExtractionService;
    }

    @PostMapping("/preview")
    public ResponseEntity<FeatureExtractionResponse> preview(@RequestBody FeatureExtractionRequest request) {
        FeatureExtractionResponse response = featureExtractionService.preview(request);
        return ResponseEntity.ok(response);
    }
}
