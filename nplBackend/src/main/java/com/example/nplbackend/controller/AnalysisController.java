package com.example.nplbackend.controller;

import com.example.nplbackend.model.dto.AnalyzeRequest;
import com.example.nplbackend.model.dto.AnalyzeResponse;
import com.example.nplbackend.service.AnalyzeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AnalysisController {
    private final AnalyzeService analyzeService;

    @PostMapping("/analyze")
    public ResponseEntity<AnalyzeResponse> analyze(@Valid @RequestBody AnalyzeRequest request) {
        AnalyzeResponse response = analyzeService.analyze(request.getText());
        return ResponseEntity.ok(response);
    }
}
