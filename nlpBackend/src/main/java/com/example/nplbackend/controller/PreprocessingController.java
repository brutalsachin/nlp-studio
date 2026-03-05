package com.example.nplbackend.controller;

import com.example.nplbackend.dto.PreprocessingRequest;
import com.example.nplbackend.dto.PreprocessingResponse;
import com.example.nplbackend.service.PreprocessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/preprocessing")
public class PreprocessingController {
    private final PreprocessingService preprocessingService;

    public PreprocessingController(PreprocessingService preprocessingService) {
        this.preprocessingService = preprocessingService;
    }

    @PostMapping("/preview")
    public ResponseEntity<PreprocessingResponse> preview(@RequestBody PreprocessingRequest request) {
        PreprocessingResponse response = preprocessingService.preview(request);
        return ResponseEntity.ok(response);
    }
}
