package com.example.nplbackend.service;

import com.example.nplbackend.model.dto.LandingPageResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class LandingPageService {

    public LandingPageResponse getLandingPage() {
        LandingPageResponse.HeroSection hero = new LandingPageResponse.HeroSection(
            "Build and Experiment with NLP Pipelines Visually",
            "A configurable NLP laboratory where users select preprocessing techniques, n-gram models, "
                + "vectorization methods, and machine learning algorithms to observe real-time performance changes.",
            "Start Experiment",
            "Explore Demo",
            "Upload Dataset"
        );

        List<LandingPageResponse.WorkflowStep> workflow = List.of(
            new LandingPageResponse.WorkflowStep("Upload Dataset", "Import your dataset"),
            new LandingPageResponse.WorkflowStep("Pre-Processing", "Apply normalization"),
            new LandingPageResponse.WorkflowStep("Select N-grams", "Choose unigram to trigrams"),
            new LandingPageResponse.WorkflowStep("Vectorization", "Convert text features"),
            new LandingPageResponse.WorkflowStep("Train Model", "Run supervised learning"),
            new LandingPageResponse.WorkflowStep("Evaluate", "Compare metrics")
        );

        List<LandingPageResponse.FeatureItem> keyFeatures = List.of(
            new LandingPageResponse.FeatureItem(
                "Configurable NLP Pipeline",
                "Tune every stage from preprocessing to model experiments with ease."
            ),
            new LandingPageResponse.FeatureItem(
                "Real-Time Metrics",
                "Measure F1-score, precision, and recall while changing parameters."
            ),
            new LandingPageResponse.FeatureItem(
                "Explainable AI",
                "Understand model behavior with confidence scores and traceable outputs."
            ),
            new LandingPageResponse.FeatureItem(
                "Modular Architecture",
                "Built as independent components for fast iteration and reuse."
            )
        );

        LandingPageResponse.TryNowSection tryNow = new LandingPageResponse.TryNowSection(
            "Try It Now",
            "Enter text",
            "Predict",
            new LandingPageResponse.SentimentSample("Positive", 0.92)
        );

        LandingPageResponse.CtaSection cta = new LandingPageResponse.CtaSection(
            "Ready to Build Your First NLP Pipeline?",
            "Join learners and data scientists experimenting with state-of-the-art NLP techniques.",
            "Launch Experiment"
        );

        return new LandingPageResponse(
            "NLP Lab",
            List.of("Home", "Pipeline", "Experiments", "Analysis", "About"),
            hero,
            workflow,
            keyFeatures,
            tryNow,
            cta
        );
    }
}
