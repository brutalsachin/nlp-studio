// ─────────────────────────────────────────────────────────────────────────────
// NLP Lab — API Client
// Handles communication with the Spring Boot backend at VITE_API_BASE_URL
// ─────────────────────────────────────────────────────────────────────────────

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

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

/**
 * Sends text to the NLP analysis endpoint and returns the structured response.
 * @throws {Error} if the HTTP request fails or the server returns a non-OK status
 */
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

// ─────────────────────────────────────────────────────────────────────────────
// Dataset Upload
// ─────────────────────────────────────────────────────────────────────────────

export interface DatasetUploadResponse {
    columns: string[];
    rowCount: number;
    preview: Record<string, string>[];
    labelDistribution: Record<string, number>;
}

/**
 * Uploads a CSV file to the dataset endpoint using multipart/form-data.
 * NOTE: Do NOT set Content-Type manually — the browser adds the boundary.
 * @throws {Error} if the upload fails or the server returns a non-OK status
 */
export async function uploadDataset(file: File): Promise<DatasetUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/api/dataset/upload`, {
        method: "POST",
        // No Content-Type header — browser sets it with the correct multipart boundary
        body: formData,
    });

    if (!response.ok) {
        const message = await response.text().catch(() => "Unknown server error");
        throw new Error(`Upload failed (${response.status}): ${message}`);
    }

    return response.json() as Promise<DatasetUploadResponse>;
}
