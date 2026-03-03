package com.example.nplbackend.dto;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatasetUploadResponse {
    private List<String> columns;
    private long rowCount;
    private List<Map<String, String>> preview;
    private Map<String, Long> labelDistribution;
}
