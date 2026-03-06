

const envBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const BASE_URL = import.meta.env.PROD
    ? "https:
    : envBaseUrl ?? "http:

export type ModelType = "NAIVE_BAYES" | "LOGISTIC_REGRESSION";

export interface TrainRequest {
    modelType: ModelType;
    features: number[][];
    labels: string[];
    selectedFeatures?: string[];
    ngramType?: string;
    vectorizationType?: string;
    normalization?: string;
    removeStopwords?: boolean;
    lowercase?: boolean;
    removePunctuation?: boolean;
    removeNumbers?: boolean;
}

export interface TrainResponse {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    labels?: string[];
    confusionMatrix?: number[][];
    classificationReport?: {
        className: string;
        precision: number;
        recall: number;
        f1Score: number;
        support: number;
    }[];
    totalSamples?: number;
}

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
