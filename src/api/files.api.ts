import client from "./client";
import type {
    FileUploadResponse,
    FileResponse,
    FileDetailsResponse,
} from "@/types/file.types";

const filesApi = {
    upload: async (file: File): Promise<FileUploadResponse> => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await client.post<FileUploadResponse>(
            "/files/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    },

    findAll: async (): Promise<FileResponse[]> => {
        const response = await client.get<FileResponse[]>("/files");
        return response.data;
    },

    findById: async (id: number): Promise<FileDetailsResponse> => {
        const response = await client.get<FileDetailsResponse>(`/files/${id}`);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await client.delete(`/files/${id}`);
    },
};

export default filesApi;