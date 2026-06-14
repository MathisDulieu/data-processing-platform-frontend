import { useState, useCallback } from "react";
import rejectedTransactionsApi from "@/api/rejectedTransactions.api";
import type { RejectedTransactionResponse } from "@/types/rejectedTransaction.types";

interface UseRejectedTransactionsReturn {
    rejectedTransactions: RejectedTransactionResponse[];
    selectedRejected: RejectedTransactionResponse | null;
    loading: boolean;
    loadingDetails: boolean;
    error: string | null;
    fetchAll: () => Promise<void>;
    fetchById: (id: number) => Promise<void>;
    clearSelected: () => void;
}

export function useRejectedTransactions(): UseRejectedTransactionsReturn {
    const [rejectedTransactions, setRejectedTransactions] = useState<RejectedTransactionResponse[]>([]);
    const [selectedRejected, setSelectedRejected] = useState<RejectedTransactionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await rejectedTransactionsApi.findAll();
            setRejectedTransactions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch rejected transactions");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchById = useCallback(async (id: number) => {
        setLoadingDetails(true);
        setError(null);
        try {
            const data = await rejectedTransactionsApi.findById(id);
            setSelectedRejected(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch rejected transaction");
        } finally {
            setLoadingDetails(false);
        }
    }, []);

    const clearSelected = useCallback(() => setSelectedRejected(null), []);

    return {
        rejectedTransactions,
        selectedRejected,
        loading,
        loadingDetails,
        error,
        fetchAll,
        fetchById,
        clearSelected,
    };
}