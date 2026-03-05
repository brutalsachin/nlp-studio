package com.example.nplbackend.controller;

import com.example.nplbackend.dto.VectorizationRequest;
import com.example.nplbackend.dto.VectorizationResponse;
import com.example.nplbackend.service.VectorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vectorization")
public class VectorizationController {
    private final VectorizationService vectorizationService;

    public VectorizationController(VectorizationService vectorizationService) {
        this.vectorizationService = vectorizationService;
    }

    @PostMapping("/preview")
    public ResponseEntity<VectorizationResponse> preview(@RequestBody VectorizationRequest request) {
        VectorizationResponse response = vectorizationService.preview(request);
        return ResponseEntity.ok(response);
    }
}
