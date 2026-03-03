package com.example.nplbackend.model.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeResponse {
    private String input;
    private String prediction;
    private double confidence;
    private List<String> keyDrivers;
    private PipelineDetails pipeline;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PipelineDetails {
        private List<String> tokens;
        private List<String> ngrams;
        private int vectorSize;
        private String modelUsed;
    }
}
