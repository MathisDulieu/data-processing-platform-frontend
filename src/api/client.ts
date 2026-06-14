import axios from "axios";
import env from "@/config/env";

const client = axios.create({
    baseURL: env.apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "An unexpected error occurred";
            return Promise.reject(new Error(message));
        }
        return Promise.reject(error);
    }
);

export default client;