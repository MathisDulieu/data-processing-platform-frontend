import { useState, useCallback } from "react";
import batchApi from "@/api/batch.api";
import type { BatchRunResponse, BatchStatusResponse } from "@/types/batch.types";

interface UseBatchReturn {
    status: BatchStatusResponse | null;
    runResult: BatchRunResponse | null;
    loadingStatus: boolean;
    loadingRun: boolean;
    error: string | null;
    fetchStatus: () => Promise<void>;
    run: () => Promise<void>;
}

export function useBatch(): UseBatchReturn {
    const [status, setStatus] = useState<BatchStatusResponse | null>(null);
    const [runResult, setRunResult] = useState<BatchRunResponse | null>(null);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loadingRun, setLoadingRun] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        setLoadingStatus(true);
        setError(null);
        try {
            const data = await batchApi.status();
            setStatus(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch batch status");
        } finally {
            setLoadingStatus(false);
        }
    }, []);

    const run = useCallback(async () => {
        setLoadingRun(true);
        setError(null);
        try {
            const data = await batchApi.run();
            setRunResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to run batch");
        } finally {
            setLoadingRun(false);
        }
    }, []);

    return { status, runResult, loadingStatus, loadingRun, error, fetchStatus, run };
}