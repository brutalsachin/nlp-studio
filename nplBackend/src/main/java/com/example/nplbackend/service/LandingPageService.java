package com.example.nplbackend.service;

import com.example.nplbackend.model.dto.LandingPageResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class LandingPageService {

    public LandingPageResponse getLandingPage() {
        return LandingPageResponse.builder()
            .brand("NLP Lab")
            .navigation(List.of("Home", "Pipeline", "Experiments", "Analysis", "About"))
            .hero(
                LandingPageResponse.HeroSection.builder()
                    .title("Build and Experiment with NLP Pipelines Visually")
                    .subtitle(
                        "A configurable NLP laboratory where users select preprocessing techniques, n-gram models, "
                            + "vectorization methods, and machine learning algorithms to observe real-time performance changes."
                    )
                    .primaryAction("Start Experiment")
                    .secondaryAction("Explore Demo")
                    .uploadAction("Upload Dataset")
                    .build()
            )
            .workflow(List.of(
                LandingPageResponse.WorkflowStep.builder()
                    .title("Upload Dataset")
                    .description("Import your dataset")
                    .build(),
                LandingPageResponse.WorkflowStep.builder()
                    .title("Pre-Processing")
                    .description("Apply normalization")
                    .build(),
                LandingPageResponse.WorkflowStep.builder()
                    .title("Select N-grams")
                    .description("Choose unigram to trigrams")
                    .build(),
                LandingPageResponse.WorkflowStep.builder()
                    .title("Vectorization")
                    .description("Convert text features")
                    .build(),
                LandingPageResponse.WorkflowStep.builder()
                    .title("Train Model")
                    .description("Run supervised learning")
                    .build(),
                LandingPageResponse.WorkflowStep.builder()
                    .title("Evaluate")
                    .description("Compare metrics")
                    .build()
            ))
            .keyFeatures(List.of(
                LandingPageResponse.FeatureItem.builder()
                    .title("Configurable NLP Pipeline")
                    .description("Tune every stage from preprocessing to model experiments with ease.")
                    .build(),
                LandingPageResponse.FeatureItem.builder()
                    .title("Real-Time Metrics")
                    .description("Measure F1-score, precision, and recall while changing parameters.")
                    .build(),
                LandingPageResponse.FeatureItem.builder()
                    .title("Explainable AI")
                    .description("Understand model behavior with confidence scores and traceable outputs.")
                    .build(),
                LandingPageResponse.FeatureItem.builder()
                    .title("Modular Architecture")
                    .description("Built as independent components for fast iteration and reuse.")
                    .build()
            ))
            .tryNow(
                LandingPageResponse.TryNowSection.builder()
                    .heading("Try It Now")
                    .inputPlaceholder("Enter text")
                    .actionLabel("Predict")
                    .sample(
                        LandingPageResponse.SentimentSample.builder()
                            .prediction("Positive")
                            .confidence(0.92)
                            .build()
                    )
                    .build()
            )
            .callToAction(
                LandingPageResponse.CtaSection.builder()
                    .heading("Ready to Build Your First NLP Pipeline?")
                    .description("Join learners and data scientists experimenting with state-of-the-art NLP techniques.")
                    .actionLabel("Launch Experiment")
                    .build()
            )
            .build();
    }
}
