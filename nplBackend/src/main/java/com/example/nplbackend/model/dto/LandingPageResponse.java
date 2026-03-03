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
public class LandingPageResponse {
    private String brand;
    private List<String> navigation;
    private HeroSection hero;
    private List<WorkflowStep> workflow;
    private List<FeatureItem> keyFeatures;
    private TryNowSection tryNow;
    private CtaSection callToAction;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeroSection {
        private String title;
        private String subtitle;
        private String primaryAction;
        private String secondaryAction;
        private String uploadAction;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkflowStep {
        private String title;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeatureItem {
        private String title;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TryNowSection {
        private String heading;
        private String inputPlaceholder;
        private String actionLabel;
        private SentimentSample sample;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SentimentSample {
        private String prediction;
        private double confidence;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CtaSection {
        private String heading;
        private String description;
        private String actionLabel;
    }
}
