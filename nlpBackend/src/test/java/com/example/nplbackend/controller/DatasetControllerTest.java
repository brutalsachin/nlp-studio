package com.example.nplbackend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class DatasetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldUploadCsvAndReturnDatasetSummary() throws Exception {
        String csv = """
            review_text,sentiment
            I love this,positive
            I hate this,negative
            great product,positive
            """;

        MockMultipartFile file = new MockMultipartFile(
            "file",
            "reviews.csv",
            "text/csv",
            csv.getBytes()
        );

        mockMvc.perform(multipart("/api/dataset/upload").file(file))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.columns[0]").value("review_text"))
            .andExpect(jsonPath("$.columns[1]").value("sentiment"))
            .andExpect(jsonPath("$.rowCount").value(3))
            .andExpect(jsonPath("$.preview.length()").value(3))
            .andExpect(jsonPath("$.labelDistribution.positive").value(2))
            .andExpect(jsonPath("$.labelDistribution.negative").value(1));
    }

    @Test
    void shouldReturnBadRequestWhenFileIsEmpty() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "reviews.csv",
            "text/csv",
            new byte[0]
        );

        mockMvc.perform(multipart("/api/dataset/upload").file(file))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400));
    }
}
