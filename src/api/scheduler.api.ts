import client from "./client";
import type {
    BatchScheduleRequest,
    BatchScheduleResponse,
    BatchScheduleStatusResponse,
} from "@/types/scheduler.types";

const schedulerApi = {
    findCurrent: async (): Promise<BatchScheduleStatusResponse> => {
        const response =
            await client.get<BatchScheduleStatusResponse>("/batch/schedule");
        return response.data;
    },

    update: async (
        request: BatchScheduleRequest
    ): Promise<BatchScheduleResponse> => {
        const response = await client.put<BatchScheduleResponse>(
            "/batch/schedule",
            request
        );
        return response.data;
    },

    disable: async (): Promise<BatchScheduleResponse> => {
        const response =
            await client.delete<BatchScheduleResponse>("/batch/schedule");
        return response.data;
    },
};

export default schedulerApi;