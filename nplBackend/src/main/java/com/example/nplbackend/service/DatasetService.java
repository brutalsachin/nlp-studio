package com.example.nplbackend.service;

import com.example.nplbackend.dto.DatasetUploadResponse;
import com.example.nplbackend.exception.DatasetBadRequestException;
import com.example.nplbackend.exception.DatasetParseException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DatasetService {
    private static final int PREVIEW_LIMIT = 5;

    public DatasetUploadResponse uploadAndAnalyze(MultipartFile file) {
        validateFile(file);

        try (BufferedReader reader = new BufferedReader(
            new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String headerRecord = readNextCsvRecord(reader);
            if (headerRecord == null) {
                throw new DatasetBadRequestException("CSV file is empty");
            }

            List<String> columns = parseCsvRecord(headerRecord);
            if (columns.isEmpty()) {
                throw new DatasetBadRequestException("CSV header row is missing");
            }

            int labelIndex = resolveLabelIndex(columns);
            Map<String, Long> labelDistribution = new LinkedHashMap<>();
            List<Map<String, String>> preview = new ArrayList<>();
            long rowCount = 0L;

            String dataRecord;
            while ((dataRecord = readNextCsvRecord(reader)) != null) {
                if (dataRecord.isBlank()) {
                    continue;
                }

                List<String> values = parseCsvRecord(dataRecord);
                Map<String, String> rowMap = toRowMap(columns, values);
                rowCount++;

                if (preview.size() < PREVIEW_LIMIT) {
                    preview.add(rowMap);
                }

                String label = rowMap.getOrDefault(columns.get(labelIndex), "").trim();
                if (!label.isEmpty()) {
                    labelDistribution.put(label, labelDistribution.getOrDefault(label, 0L) + 1L);
                }
            }

            return new DatasetUploadResponse(columns, rowCount, preview, labelDistribution);
        } catch (IOException e) {
            throw new DatasetParseException("Failed to parse CSV file", e);
        } catch (RuntimeException e) {
            if (e instanceof DatasetBadRequestException || e instanceof DatasetParseException) {
                throw e;
            }
            throw new DatasetParseException("Invalid CSV content", e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new DatasetBadRequestException("File must not be empty");
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase(Locale.ROOT).endsWith(".csv")) {
            throw new DatasetBadRequestException("Only CSV files are supported");
        }
    }

    private Map<String, String> toRowMap(List<String> columns, List<String> values) {
        Map<String, String> rowMap = new LinkedHashMap<>();
        for (int i = 0; i < columns.size(); i++) {
            String value = i < values.size() ? values.get(i).trim() : "";
            rowMap.put(columns.get(i), value);
        }
        return rowMap;
    }

    private int resolveLabelIndex(List<String> columns) {
        for (int i = 0; i < columns.size(); i++) {
            String header = columns.get(i).trim().toLowerCase(Locale.ROOT);
            if (header.equals("label") || header.equals("sentiment") || header.equals("target")
                || header.equals("class") || header.equals("y")) {
                return i;
            }
        }
        return columns.size() - 1;
    }

    private String readNextCsvRecord(BufferedReader reader) throws IOException {
        String firstLine = reader.readLine();
        if (firstLine == null) {
            return null;
        }

        StringBuilder record = new StringBuilder(firstLine);
        while (hasUnclosedQuotes(record.toString())) {
            String nextLine = reader.readLine();
            if (nextLine == null) {
                throw new DatasetParseException("Malformed CSV: unmatched quotes");
            }
            record.append("\n").append(nextLine);
        }
        return record.toString();
    }

    private boolean hasUnclosedQuotes(String line) {
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char ch = line.charAt(i);
            if (ch == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            }
        }
        return inQuotes;
    }

    private List<String> parseCsvRecord(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char ch = line.charAt(i);
            if (ch == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    current.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch == ',' && !inQuotes) {
                fields.add(current.toString().trim());
                current.setLength(0);
            } else {
                current.append(ch);
            }
        }

        if (inQuotes) {
            throw new DatasetParseException("Malformed CSV: unmatched quotes");
        }

        fields.add(current.toString().trim());
        return fields;
    }
}
