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
class PreprocessingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldPreviewPreprocessingResult() throws Exception {
        String requestBody = """
            {
              "text": "I absolutely loved the running scenes in the movie!",
              "normalization": "LEMMATIZATION",
              "removeStopwords": true,
              "lowercase": true,
              "removePunctuation": true,
              "removeNumbers": false
            }
            """;

        mockMvc.perform(post("/api/preprocessing/preview")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.originalText").value("I absolutely loved the running scenes in the movie!"))
            .andExpect(jsonPath("$.processedText").value("absolutely love run scene movie"))
            .andExpect(jsonPath("$.tokens[0]").value("absolutely"))
            .andExpect(jsonPath("$.appliedSteps").isArray());
    }

    @Test
    void shouldReturnBadRequestWhenTextBlank() throws Exception {
        String requestBody = """
            {
              "text": "",
              "normalization": "NONE",
              "removeStopwords": false,
              "lowercase": true,
              "removePunctuation": true,
              "removeNumbers": false
            }
            """;

        mockMvc.perform(post("/api/preprocessing/preview")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400));
    }
}
