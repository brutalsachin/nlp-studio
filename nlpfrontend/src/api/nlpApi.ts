

export interface AnalyzeRequest {
    text: string;
}

export interface AnalyzeResponse {
    input: string;
    prediction: "Positive" | "Negative" | "Mixed";
    confidence: number;
    keyDrivers: string[];
    pipeline: {
        tokens: string[];
        ngrams: string[];
        vectorSize: number;
        modelUsed: string;
    };
}

const envBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const BASE_URL = import.meta.env.PROD
  ? "https:
  : envBaseUrl ?? "http:

export async function analyzeText(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await fetch(`${BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await response.text().catch(() => "Unknown server error");
        throw new Error(`Server responded with ${response.status}: ${message}`);
    }

    return response.json() as Promise<AnalyzeResponse>;
}

export interface DatasetUploadResponse {
    columns: string[];
    rowCount: number;
    preview: Record<string, string>[];
    labelDistribution: Record<string, number>;
}

export async function uploadDataset(file: File): Promise<DatasetUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/api/dataset/upload`, {
        method: "POST",

        body: formData,
    });

    if (!response.ok) {
        const message = await response.text().catch(() => "Unknown server error");
        throw new Error(`Upload failed (${response.status}): ${message}`);
    }

    return response.json() as Promise<DatasetUploadResponse>;
}

export async function fetchSampleDataset(sampleId: "movie" | "twitter"): Promise<DatasetUploadResponse> {
    const response = await fetch(`${BASE_URL}/api/dataset/sample/${sampleId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const message = await response.text().catch(() => "Unknown server error");
        throw new Error(`Sample load failed (${response.status}): ${message}`);
    }

    return response.json() as Promise<DatasetUploadResponse>;
}
