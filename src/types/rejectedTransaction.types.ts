export interface RejectedTransactionResponse {
    id: number;
    importLogId: number;
    reference: string;
    field: string;
    reason: string;
    rejectedAt: string;
}