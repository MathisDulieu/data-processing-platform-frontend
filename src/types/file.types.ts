export type FileStatus = "PENDING" | "PROCESSED" | "FAILED";

export interface FileUploadResponse {
    id: number;
    filename: string;
    status: FileStatus;
}

export interface FileResponse {
    id: number;
    filename: string;
    status: FileStatus;
    uploadedAt: string;
}

export interface FileDetailsResponse {
    id: number;
    filename: string;
    mimeType: string;
    status: FileStatus;
    uploadedAt: string;
    transactionCount: number;
    rejectedTransactionCount: number;
}