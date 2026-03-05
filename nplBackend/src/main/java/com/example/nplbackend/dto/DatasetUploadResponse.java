package com.example.nplbackend.dto;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class DatasetUploadResponse {
    private List<String> columns = new ArrayList<>();
    private long rowCount;
    private List<Map<String, String>> preview = new ArrayList<>();
    private Map<String, Long> labelDistribution = new LinkedHashMap<>();

    public DatasetUploadResponse() {
    }

    public DatasetUploadResponse(
        List<String> columns,
        long rowCount,
        List<Map<String, String>> preview,
        Map<String, Long> labelDistribution
    ) {
        this.columns = columns == null ? new ArrayList<>() : columns;
        this.rowCount = rowCount;
        this.preview = preview == null ? new ArrayList<>() : preview;
        this.labelDistribution = labelDistribution == null ? new LinkedHashMap<>() : labelDistribution;
    }

    public List<String> getColumns() {
        return columns;
    }

    public void setColumns(List<String> columns) {
        this.columns = columns == null ? new ArrayList<>() : columns;
    }

    public long getRowCount() {
        return rowCount;
    }

    public void setRowCount(long rowCount) {
        this.rowCount = rowCount;
    }

    public List<Map<String, String>> getPreview() {
        return preview;
    }

    public void setPreview(List<Map<String, String>> preview) {
        this.preview = preview == null ? new ArrayList<>() : preview;
    }

    public Map<String, Long> getLabelDistribution() {
        return labelDistribution;
    }

    public void setLabelDistribution(Map<String, Long> labelDistribution) {
        this.labelDistribution = labelDistribution == null ? new LinkedHashMap<>() : labelDistribution;
    }
}
