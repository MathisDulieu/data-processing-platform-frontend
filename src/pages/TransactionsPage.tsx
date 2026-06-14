import {useEffect, useState} from "react";
import {RefreshCw, ArrowRightLeft} from "lucide-react";
import {useTransactions} from "@/hooks/useTransactions";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionSummaryCards from "@/components/transactions/TransactionSummaryCards";
import CategoryChart from "@/components/transactions/CategoryChart";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import {ToastContainer, type ToastMessage} from "@/components/ui/Toast";
import type {TransactionResponse} from "@/types/transaction.types";
import {clsx} from "clsx";

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

function DetailRow({label, value}: { label: string; value: React.ReactNode }) {
    return (
        <div
            className="flex items-start justify-between py-2.5 border-b border-[var(--color-border-subtle)] last:border-0 gap-4">
            <span className="text-sm text-[var(--color-text-secondary)] shrink-0">{label}</span>
            <span className="text-sm font-medium text-[var(--color-text-primary)] text-right break-all">{value}</span>
        </div>
    );
}

export default function TransactionsPage() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    const {
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
    } = useTransactions();

    const addToast = (type: "success" | "error", message: string) => {
        const toast: ToastMessage = {id: crypto.randomUUID(), type, message};
        setToasts((prev) => [...prev, toast]);
    };

    const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

    useEffect(() => {
        fetchAll();
        fetchSummary();
    }, [fetchAll, fetchSummary]);

    useEffect(() => {
        if (error) addToast("error", error);
    }, [error]);

    const handleRefresh = async () => {
        await Promise.all([fetchAll(), fetchSummary()]);
        addToast("success", "Transactions refreshed.");
    };

    const handleView = async (row: TransactionResponse) => {
        setModalOpen(true);
        await fetchById(row.id);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        clearSelected();
    };

    const currencies = summary?.currencies ?? [];

    return (
        <>
            <PageHeader
                title="Transactions"
                description="Browse all processed transactions"
                actions={
                    <Button variant="secondary" size="sm" icon={<RefreshCw size={14}/>} onClick={handleRefresh}>
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                }
            />

            <div className="space-y-5">
                <TransactionSummaryCards summary={summary} loading={loadingSummary}/>

                {currencies.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-[var(--color-text-secondary)]">Currencies:</span>
                        {currencies.map((c) => (
                            <span key={c} className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--color-status-info-bg)] text-[var(--color-status-info-text)]">
                                {c}
                            </span>
                        ))}
                    </div>
                )}

                <Card padding="md">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Volume by Category</h3>
                    <CategoryChart categories={summary?.categories ?? []}/>
                </Card>

                <Card padding="none">
                    <div className="px-4 sm:px-5 py-4 border-b border-[var(--color-border-subtle)]">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">All Transactions</h3>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                    <TransactionTable data={transactions} loading={loading} onView={handleView}/>
                </Card>
            </div>

            <Modal open={modalOpen} onClose={handleCloseModal} title="Transaction Details" size="md">
                {loadingDetails ? (
                    <Loader centered size="md" label="Loading transaction..."/>
                ) : !selectedTransaction ? (
                    <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">No transaction
                        selected.</p>
                ) : (
                    <div className="space-y-5">
                        <div
                            className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-sunken)]">
                            <div
                                className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-status-info-bg)] shrink-0">
                                <ArrowRightLeft size={18} className="text-[var(--color-brand-primary)]"/>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                                    {selectedTransaction.label}
                                </p>
                                <code className="text-xs font-mono text-[var(--color-text-secondary)]">
                                    {selectedTransaction.reference}
                                </code>
                            </div>
                            <span
                                className={clsx(
                                    "text-base font-bold tabular-nums shrink-0",
                                    selectedTransaction.amount >= 0
                                        ? "text-[var(--color-status-success-text)]"
                                        : "text-[var(--color-status-error-text)]"
                                )}
                            >
                                {selectedTransaction.amount >= 0 ? "+" : ""}
                                {formatAmount(selectedTransaction.amount, selectedTransaction.currency)}
                            </span>
                        </div>

                        <div
                            className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] overflow-hidden">
                            <div className="px-4">
                                <DetailRow label="ID" value={`#${selectedTransaction.id}`}/>
                                <DetailRow label="Reference" value={
                                    <code
                                        className="text-xs font-mono bg-[var(--color-surface-sunken)] px-2 py-0.5 rounded">
                                        {selectedTransaction.reference}
                                    </code>
                                }/>
                                <DetailRow label="Label" value={selectedTransaction.label}/>
                                <DetailRow label="Category" value={selectedTransaction.category}/>
                                <DetailRow label="Amount"
                                           value={formatAmount(selectedTransaction.amount, selectedTransaction.currency)}/>
                                <DetailRow label="Currency" value={selectedTransaction.currency}/>
                                <DetailRow label="Date" value={formatDate(selectedTransaction.date)}/>
                                <DetailRow label="File" value={`#${selectedTransaction.uploadedFileId}`}/>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <ToastContainer toasts={toasts} onDismiss={dismissToast}/>
        </>
    );
}