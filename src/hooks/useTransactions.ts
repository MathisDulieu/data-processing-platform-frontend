import { useState, useCallback } from "react";
import transactionsApi from "@/api/transactions.api";
import type {
    TransactionResponse,
    TransactionSummaryResponse,
} from "@/types/transaction.types";

interface UseTransactionsReturn {
    transactions: TransactionResponse[];
    selectedTransaction: TransactionResponse | null;
    summary: TransactionSummaryResponse | null;
    loading: boolean;
    loadingDetails: boolean;
    loadingSummary: boolean;
    error: string | null;
    fetchAll: () => Promise<void>;
    fetchById: (id: number) => Promise<void>;
    fetchSummary: () => Promise<void>;
    clearSelected: () => void;
}

export function useTransactions(): UseTransactionsReturn {
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
    const [summary, setSummary] = useState<TransactionSummaryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transactionsApi.findAll();
            setTransactions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchById = useCallback(async (id: number) => {
        setLoadingDetails(true);
        setError(null);
        try {
            const data = await transactionsApi.findById(id);
            setSelectedTransaction(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch transaction");
        } finally {
            setLoadingDetails(false);
        }
    }, []);

    const fetchSummary = useCallback(async () => {
        setLoadingSummary(true);
        setError(null);
        try {
            const data = await transactionsApi.summary();
            setSummary(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch transaction summary");
        } finally {
            setLoadingSummary(false);
        }
    }, []);

    const clearSelected = useCallback(() => setSelectedTransaction(null), []);

    return {
        transactions,
        selectedTransaction,
        summary,
        loading,
        loadingDetails,
        loadingSummary,
        error,
        fetchAll,
        fetchById,
        fetchSummary,
        clearSelected,
    };
}