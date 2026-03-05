package com.example.nplbackend.controller;

import com.example.nplbackend.dto.DatasetUploadResponse;
import com.example.nplbackend.service.DatasetService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/dataset")
public class DatasetController {
    private final DatasetService datasetService;

    public DatasetController(DatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DatasetUploadResponse> uploadDataset(@RequestParam("file") MultipartFile file) {
        DatasetUploadResponse response = datasetService.uploadAndAnalyze(file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sample/{sampleId}")
    public ResponseEntity<DatasetUploadResponse> loadSampleDataset(@PathVariable String sampleId) {
        DatasetUploadResponse response = datasetService.loadRemoteSample(sampleId);
        return ResponseEntity.ok(response);
    }
}
