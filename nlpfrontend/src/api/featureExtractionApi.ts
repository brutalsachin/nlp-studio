// ─────────────────────────────────────────────────────────────────────────────
// NLP Lab — Feature Extraction API Client
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://nlp-studio-egoj.onrender.com";

export interface FeatureExtractionRequest {
    text: string;
    ngramType: "UNIGRAM" | "BIGRAM" | "TRIGRAM";
    maxFeatures: number;
    minDocumentFrequency: number;
}

export interface FeatureExtractionResponse {
    ngramType: string;
    vocabularySize: number;
    selectedFeatures: string[];
    filteredOutCount: number;
}

/**
 * Sends a feature extraction configuration to the backend for a live preview.
 * @throws {Error} if the request fails or the server returns a non-OK status.
 */
export async function previewFeatureExtraction(
    request: FeatureExtractionRequest
): Promise<FeatureExtractionResponse> {
    const response = await fetch(`${BASE_URL}/api/feature-extraction/preview`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const message = await response.text().catch(() => "Unknown server error");
        throw new Error(`Feature extraction failed (${response.status}): ${message}`);
    }

    return response.json() as Promise<FeatureExtractionResponse>;
}
