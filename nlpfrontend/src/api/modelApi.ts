// ─────────────────────────────────────────────────────────────────────────────
// NLP Lab — Model Training API Client
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type ModelType = "naive_bayes" | "logistic";

export interface TrainRequest {
    modelType: ModelType;
    features: string[];
    labels: string[];
    ngramType?: string;
    vectorizationType?: string;
}

export interface TrainResponse {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix?: number[][];
    classificationReport?: {
        className: string;
        precision: number;
        recall: number;
        f1Score: number;
        support: number;
    }[];
}

/**
 * Sends a model training request to the backend.
 * @throws {Error} if the request fails or the server returns a non-OK status.
 */
export async function trainModel(request: TrainRequest): Promise<TrainResponse> {
    const response = await fetch(`${BASE_URL}/api/model/train`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const message = await response.text().catch(() => "Unknown server error");
        throw new Error(`Model training failed (${response.status}): ${message}`);
    }

    return response.json() as Promise<TrainResponse>;
}
