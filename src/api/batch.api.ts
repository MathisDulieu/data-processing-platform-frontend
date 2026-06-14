import client from "./client";
import type { BatchRunResponse, BatchStatusResponse } from "@/types/batch.types";

const batchApi = {
    run: async (): Promise<BatchRunResponse> => {
        const response = await client.post<BatchRunResponse>("/batch/run");
        return response.data;
    },

    status: async (): Promise<BatchStatusResponse> => {
        const response = await client.get<BatchStatusResponse>("/batch/status");
        return response.data;
    },
};

export default batchApi;