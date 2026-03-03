// ─────────────────────────────────────────────────────────────────────────────
// NLP Lab — Vectorization API Client
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type NgramType = "UNIGRAM" | "BIGRAM" | "TRIGRAM";
export type VectorizationType = "TF_IDF" | "BAG_OF_WORDS" | "ONE_HOT";

export interface VectorizationRequest {
    text: string;
    ngramType: NgramType;
    vectorizationType: VectorizationType;
    selectedFeatures: string[];
}

export interface VectorizationResponse {
    vectorizationType: string;
    vector: number[];
    featureCount: number;
    featureDensity: number;
    matrixSparsity: number;
    vocabCoverage: number;
}

/**
 * Sends a vectorization configuration to the backend and returns the vector representation.
 * @throws {Error} if the request fails or the server returns a non-OK status.
 */
export async function previewVectorization(
    request: VectorizationRequest
): Promise<VectorizationResponse> {
    const response = await fetch(`${BASE_URL}/api/vectorization/preview`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const message = await response.text().catch(() => "Unknown server error");
        throw new Error(`Vectorization failed (${response.status}): ${message}`);
    }

    return response.json() as Promise<VectorizationResponse>;
}
