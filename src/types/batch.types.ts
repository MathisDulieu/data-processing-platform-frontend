export interface BatchRunResponse {
    status: string;
    processedFiles: number;
}

export interface BatchStatusResponse {
    status: string | null;
    totalRecords: number | null;
    validRecords: number | null;
    rejectedRecords: number | null;
    startedAt: string | null;
    finishedAt: string | null;
    message: string | null;
}