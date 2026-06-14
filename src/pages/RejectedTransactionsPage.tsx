import { useEffect, useState } from "react";
import { RefreshCw, XOctagon, AlertTriangle } from "lucide-react";
import { useRejectedTransactions } from "@/hooks/useRejectedTransactions";
import RejectedTransactionTable from "@/components/rejected/RejectedTransactionTable";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { ToastContainer, type ToastMessage } from "@/components/ui/Toast";
import type { RejectedTransactionResponse } from "@/types/rejectedTransaction.types";

function formatDate(value: string): string {
    return new Date(value).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between py-2.5 border-b border-[var(--color-border-subtle)] last:border-0 gap-4">
            <span className="text-sm text-[var(--color-text-secondary)] shrink-0">{label}</span>
            <span className="text-sm font-medium text-[var(--color-text-primary)] text-right break-all">{value}</span>
        </div>
    );
}

export default function RejectedTransactionsPage() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [selectedRow, setSelectedRow] = useState<RejectedTransactionResponse | null>(null);

    const { rejectedTransactions, loading, error, fetchAll } = useRejectedTransactions();

    const addToast = (type: "success" | "error", message: string) => {
        const toast: ToastMessage = { id: crypto.randomUUID(), type, message };
        setToasts((prev) => [...prev, toast]);
    };

    const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

    useEffect(() => { fetchAll(); }, [fetchAll]);
    useEffect(() => { if (error) addToast("error", error); }, [error]);

    const handleRefresh = async () => {
        await fetchAll();
        addToast("success", "Rejected transactions refreshed.");
    };

    const uniqueFields = [...new Set(rejectedTransactions.map((r) => r.field).filter(Boolean))];
    const uniqueImportLogs = [...new Set(rejectedTransactions.map((r) => r.importLogId))];

    return (
        <>
            <PageHeader
                title="Rejected Transactions"
                description="Inspect records that failed validation"
                actions={
                    <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={handleRefresh}>
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                }
            />

            <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Total Rejected" value={rejectedTransactions.length} icon={<XOctagon />} accent="red" />
                    <StatCard label="Affected Fields" value={uniqueFields.length} icon={<AlertTriangle />} accent="orange" />
                    <StatCard label="Import Logs" value={uniqueImportLogs.length} icon={<XOctagon />} accent="blue" />
                </div>

                {uniqueFields.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-[var(--color-text-secondary)]">Affected fields:</span>
                        {uniqueFields.map((field) => (
                            <span key={field} className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-text)]">
                {field}
              </span>
                        ))}
                    </div>
                )}

                <Card padding="none">
                    <div className="px-4 sm:px-5 py-4 border-b border-[var(--color-border-subtle)]">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Rejected Records</h3>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                            {rejectedTransactions.length} record{rejectedTransactions.length !== 1 ? "s" : ""} rejected
                        </p>
                    </div>
                    <RejectedTransactionTable data={rejectedTransactions} loading={loading} onView={setSelectedRow} />
                </Card>
            </div>

            <Modal open={!!selectedRow} onClose={() => setSelectedRow(null)} title="Rejected Transaction Details" size="md">
                {selectedRow && (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)] bg-[var(--color-status-error-bg)] border border-[var(--color-status-error)]/20">
                            <AlertTriangle size={16} className="text-[var(--color-status-error-text)] shrink-0 mt-0.5" />
                            <p className="text-sm text-[var(--color-status-error-text)] font-medium">{selectedRow.reason}</p>
                        </div>
                        <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] overflow-hidden">
                            <div className="px-4">
                                <DetailRow label="ID" value={`#${selectedRow.id}`} />
                                <DetailRow label="Reference" value={
                                    <code className="text-xs font-mono bg-[var(--color-surface-sunken)] px-2 py-0.5 rounded">{selectedRow.reference ?? "—"}</code>
                                } />
                                <DetailRow label="Field" value={selectedRow.field ?? "—"} />
                                <DetailRow label="Import Log" value={`#${selectedRow.importLogId}`} />
                                <DetailRow label="Rejected At" value={formatDate(selectedRow.rejectedAt)} />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </>
    );
}