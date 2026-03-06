

const envBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const BASE_URL = import.meta.env.PROD
    ? "https:
    : envBaseUrl ?? "http:

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
