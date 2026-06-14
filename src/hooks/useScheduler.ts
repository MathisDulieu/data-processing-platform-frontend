import { useState, useCallback } from "react";
import schedulerApi from "@/api/scheduler.api";
import type {
    BatchScheduleRequest,
    BatchScheduleResponse,
    BatchScheduleStatusResponse,
} from "@/types/scheduler.types";

interface UseSchedulerReturn {
    scheduleStatus: BatchScheduleStatusResponse | null;
    scheduleResult: BatchScheduleResponse | null;
    loading: boolean;
    loadingUpdate: boolean;
    loadingDisable: boolean;
    error: string | null;
    fetchCurrent: () => Promise<void>;
    update: (request: BatchScheduleRequest) => Promise<void>;
    disable: () => Promise<void>;
    clearError: () => void;
}

export function useScheduler(): UseSchedulerReturn {
    const [scheduleStatus, setScheduleStatus] = useState<BatchScheduleStatusResponse | null>(null);
    const [scheduleResult, setScheduleResult] = useState<BatchScheduleResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingDisable, setLoadingDisable] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrent = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await schedulerApi.findCurrent();
            setScheduleStatus(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch scheduler configuration");
        } finally {
            setLoading(false);
        }
    }, []);

    const update = useCallback(async (request: BatchScheduleRequest) => {
        setLoadingUpdate(true);
        setError(null);
        try {
            const data = await schedulerApi.update(request);
            setScheduleResult(data);
            const updated = await schedulerApi.findCurrent();
            setScheduleStatus(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update scheduler configuration");
        } finally {
            setLoadingUpdate(false);
        }
    }, []);

    const disable = useCallback(async () => {
        setLoadingDisable(true);
        setError(null);
        try {
            const data = await schedulerApi.disable();
            setScheduleResult(data);
            const updated = await schedulerApi.findCurrent();
            setScheduleStatus(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to disable scheduler");
        } finally {
            setLoadingDisable(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {
        scheduleStatus,
        scheduleResult,
        loading,
        loadingUpdate,
        loadingDisable,
        error,
        fetchCurrent,
        update,
        disable,
        clearError,
    };
}