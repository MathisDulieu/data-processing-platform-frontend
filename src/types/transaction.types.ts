export interface CategorySummary {
    category: string;
    count: number;
    totalAmount: number;
}

export interface TransactionResponse {
    id: number;
    reference: string;
    label: string;
    amount: number;
    currency: string;
    date: string;
    category: string;
    uploadedFileId: number;
}

export interface TransactionSummaryResponse {
    totalTransactions: number;
    totalAmount: number;
    currencies: string[];
    categories: CategorySummary[];
}