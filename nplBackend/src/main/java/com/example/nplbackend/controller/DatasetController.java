package com.example.nplbackend.controller;

import com.example.nplbackend.dto.DatasetUploadResponse;
import com.example.nplbackend.service.DatasetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/dataset")
@RequiredArgsConstructor
public class DatasetController {
    private final DatasetService datasetService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DatasetUploadResponse> uploadDataset(@RequestParam("file") MultipartFile file) {
        DatasetUploadResponse response = datasetService.uploadAndAnalyze(file);
        return ResponseEntity.ok(response);
    }
}
