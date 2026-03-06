

const envBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const BASE_URL = import.meta.env.PROD
    ? "https:
    : envBaseUrl ?? "http:

export interface PreprocessingRequest {
    text: string;
    normalization: "STEMMING" | "LEMMATIZATION" | "NONE";
    removeStopwords: boolean;
    lowercase: boolean;
    removePunctuation: boolean;
    removeNumbers: boolean;
}

export interface PreprocessingResponse {
    originalText: string;
    processedText: string;
    tokens: string[];
    appliedSteps: string[];
}

export async function previewPreprocessing(
    request: PreprocessingRequest
): Promise<PreprocessingResponse> {
    const response = await fetch(`${BASE_URL}/api/preprocessing/preview`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const message = await response.text().catch(() => "Unknown server error");
        throw new Error(`Preprocessing failed (${response.status}): ${message}`);
    }

    return response.json() as Promise<PreprocessingResponse>;
}
