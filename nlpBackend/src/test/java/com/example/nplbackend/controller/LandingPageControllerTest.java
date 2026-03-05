package com.example.nplbackend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
class LandingPageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnLandingPagePayload() throws Exception {
        mockMvc.perform(get("/api/v1/landing-page"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.brand").value("NLP Lab"))
            .andExpect(jsonPath("$.hero.primaryAction").value("Start Experiment"))
            .andExpect(jsonPath("$.workflow.length()").value(6));
    }

    @Test
    void shouldAnalyzeSentiment() throws Exception {
        String requestBody = """
            {
              "text": "I absolutely love this product"
            }
            """;

        mockMvc.perform(post("/api/v1/analyze/sentiment")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.prediction").value("Positive"))
            .andExpect(jsonPath("$.confidence").isNumber());
    }
}
