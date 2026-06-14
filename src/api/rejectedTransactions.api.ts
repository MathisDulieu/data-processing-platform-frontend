import client from "./client";
import type { RejectedTransactionResponse } from "@/types/rejectedTransaction.types";

const rejectedTransactionsApi = {
    findAll: async (): Promise<RejectedTransactionResponse[]> => {
        const response = await client.get<RejectedTransactionResponse[]>(
            "/rejected-transactions"
        );
        return response.data;
    },

    findById: async (id: number): Promise<RejectedTransactionResponse> => {
        const response = await client.get<RejectedTransactionResponse>(
            `/rejected-transactions/${id}`
        );
        return response.data;
    },
};

export default rejectedTransactionsApi;