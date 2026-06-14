import client from "./client";
import type {
    TransactionResponse,
    TransactionSummaryResponse,
} from "@/types/transaction.types";

const transactionsApi = {
    findAll: async (): Promise<TransactionResponse[]> => {
        const response = await client.get<TransactionResponse[]>("/transactions");
        return response.data;
    },

    findById: async (id: number): Promise<TransactionResponse> => {
        const response = await client.get<TransactionResponse>(
            `/transactions/${id}`
        );
        return response.data;
    },

    summary: async (): Promise<TransactionSummaryResponse> => {
        const response =
            await client.get<TransactionSummaryResponse>("/transactions/summary");
        return response.data;
    },
};

export default transactionsApi;