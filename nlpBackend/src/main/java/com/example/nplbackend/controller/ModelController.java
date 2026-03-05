package com.example.nplbackend.controller;

import com.example.nplbackend.dto.ModelPredictionRequest;
import com.example.nplbackend.dto.ModelPredictionResponse;
import com.example.nplbackend.dto.ModelRequest;
import com.example.nplbackend.dto.ModelResponse;
import com.example.nplbackend.service.ModelTrainingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/model")
public class ModelController {
    private final ModelTrainingService modelTrainingService;

    public ModelController(ModelTrainingService modelTrainingService) {
        this.modelTrainingService = modelTrainingService;
    }

    @PostMapping("/train")
    public ResponseEntity<ModelResponse> train(@RequestBody ModelRequest request) {
        ModelResponse response = modelTrainingService.train(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/evaluate")
    public ResponseEntity<ModelResponse> evaluate(@RequestBody ModelRequest request) {
        ModelResponse response = modelTrainingService.evaluate(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/predict")
    public ResponseEntity<ModelPredictionResponse> predict(@RequestBody ModelPredictionRequest request) {
        ModelPredictionResponse response = modelTrainingService.predict(request);
        return ResponseEntity.ok(response);
    }
}
