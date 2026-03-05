package com.example.nplbackend.model.dto;

import java.util.ArrayList;
import java.util.List;

public class LandingPageResponse {
    private String brand;
    private List<String> navigation = new ArrayList<>();
    private HeroSection hero;
    private List<WorkflowStep> workflow = new ArrayList<>();
    private List<FeatureItem> keyFeatures = new ArrayList<>();
    private TryNowSection tryNow;
    private CtaSection callToAction;

    public LandingPageResponse() {
    }

    public LandingPageResponse(
        String brand,
        List<String> navigation,
        HeroSection hero,
        List<WorkflowStep> workflow,
        List<FeatureItem> keyFeatures,
        TryNowSection tryNow,
        CtaSection callToAction
    ) {
        this.brand = brand;
        this.navigation = navigation == null ? new ArrayList<>() : navigation;
        this.hero = hero;
        this.workflow = workflow == null ? new ArrayList<>() : workflow;
        this.keyFeatures = keyFeatures == null ? new ArrayList<>() : keyFeatures;
        this.tryNow = tryNow;
        this.callToAction = callToAction;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public List<String> getNavigation() {
        return navigation;
    }

    public void setNavigation(List<String> navigation) {
        this.navigation = navigation == null ? new ArrayList<>() : navigation;
    }

    public HeroSection getHero() {
        return hero;
    }

    public void setHero(HeroSection hero) {
        this.hero = hero;
    }

    public List<WorkflowStep> getWorkflow() {
        return workflow;
    }

    public void setWorkflow(List<WorkflowStep> workflow) {
        this.workflow = workflow == null ? new ArrayList<>() : workflow;
    }

    public List<FeatureItem> getKeyFeatures() {
        return keyFeatures;
    }

    public void setKeyFeatures(List<FeatureItem> keyFeatures) {
        this.keyFeatures = keyFeatures == null ? new ArrayList<>() : keyFeatures;
    }

    public TryNowSection getTryNow() {
        return tryNow;
    }

    public void setTryNow(TryNowSection tryNow) {
        this.tryNow = tryNow;
    }

    public CtaSection getCallToAction() {
        return callToAction;
    }

    public void setCallToAction(CtaSection callToAction) {
        this.callToAction = callToAction;
    }

    public static class HeroSection {
        private String title;
        private String subtitle;
        private String primaryAction;
        private String secondaryAction;
        private String uploadAction;

        public HeroSection() {
        }

        public HeroSection(String title, String subtitle, String primaryAction, String secondaryAction, String uploadAction) {
            this.title = title;
            this.subtitle = subtitle;
            this.primaryAction = primaryAction;
            this.secondaryAction = secondaryAction;
            this.uploadAction = uploadAction;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getSubtitle() {
            return subtitle;
        }

        public void setSubtitle(String subtitle) {
            this.subtitle = subtitle;
        }

        public String getPrimaryAction() {
            return primaryAction;
        }

        public void setPrimaryAction(String primaryAction) {
            this.primaryAction = primaryAction;
        }

        public String getSecondaryAction() {
            return secondaryAction;
        }

        public void setSecondaryAction(String secondaryAction) {
            this.secondaryAction = secondaryAction;
        }

        public String getUploadAction() {
            return uploadAction;
        }

        public void setUploadAction(String uploadAction) {
            this.uploadAction = uploadAction;
        }
    }

    public static class WorkflowStep {
        private String title;
        private String description;

        public WorkflowStep() {
        }

        public WorkflowStep(String title, String description) {
            this.title = title;
            this.description = description;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class FeatureItem {
        private String title;
        private String description;

        public FeatureItem() {
        }

        public FeatureItem(String title, String description) {
            this.title = title;
            this.description = description;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class TryNowSection {
        private String heading;
        private String inputPlaceholder;
        private String actionLabel;
        private SentimentSample sample;

        public TryNowSection() {
        }

        public TryNowSection(String heading, String inputPlaceholder, String actionLabel, SentimentSample sample) {
            this.heading = heading;
            this.inputPlaceholder = inputPlaceholder;
            this.actionLabel = actionLabel;
            this.sample = sample;
        }

        public String getHeading() {
            return heading;
        }

        public void setHeading(String heading) {
            this.heading = heading;
        }

        public String getInputPlaceholder() {
            return inputPlaceholder;
        }

        public void setInputPlaceholder(String inputPlaceholder) {
            this.inputPlaceholder = inputPlaceholder;
        }

        public String getActionLabel() {
            return actionLabel;
        }

        public void setActionLabel(String actionLabel) {
            this.actionLabel = actionLabel;
        }

        public SentimentSample getSample() {
            return sample;
        }

        public void setSample(SentimentSample sample) {
            this.sample = sample;
        }
    }

    public static class SentimentSample {
        private String prediction;
        private double confidence;

        public SentimentSample() {
        }

        public SentimentSample(String prediction, double confidence) {
            this.prediction = prediction;
            this.confidence = confidence;
        }

        public String getPrediction() {
            return prediction;
        }

        public void setPrediction(String prediction) {
            this.prediction = prediction;
        }

        public double getConfidence() {
            return confidence;
        }

        public void setConfidence(double confidence) {
            this.confidence = confidence;
        }
    }

    public static class CtaSection {
        private String heading;
        private String description;
        private String actionLabel;

        public CtaSection() {
        }

        public CtaSection(String heading, String description, String actionLabel) {
            this.heading = heading;
            this.description = description;
            this.actionLabel = actionLabel;
        }

        public String getHeading() {
            return heading;
        }

        public void setHeading(String heading) {
            this.heading = heading;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getActionLabel() {
            return actionLabel;
        }

        public void setActionLabel(String actionLabel) {
            this.actionLabel = actionLabel;
        }
    }
}
