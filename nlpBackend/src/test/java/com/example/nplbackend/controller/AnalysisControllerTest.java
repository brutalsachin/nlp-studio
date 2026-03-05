package com.example.nplbackend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AnalysisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldAnalyzeTextForFrontendContract() throws Exception {
        String requestBody = """
            {
              "text": "I love this great product"
            }
            """;

        mockMvc.perform(post("/api/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.input").value("I love this great product"))
            .andExpect(jsonPath("$.prediction").value("Positive"))
            .andExpect(jsonPath("$.confidence").isNumber())
            .andExpect(jsonPath("$.keyDrivers").isArray())
            .andExpect(jsonPath("$.pipeline.tokens").isArray())
            .andExpect(jsonPath("$.pipeline.ngrams").isArray())
            .andExpect(jsonPath("$.pipeline.vectorSize").isNumber())
            .andExpect(jsonPath("$.pipeline.modelUsed").value("Naive Bayes"));
    }

    @Test
    void shouldReturnBadRequestWhenTextMissing() throws Exception {
        String requestBody = """
            {
              "text": ""
            }
            """;

        mockMvc.perform(post("/api/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.path").value("/api/analyze"));
    }
}
