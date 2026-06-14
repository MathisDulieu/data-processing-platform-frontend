import { useEffect, useState } from "react";
import { FileUp, ArrowRightLeft, XOctagon, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBatch } from "@/hooks/useBatch";
import { useFiles } from "@/hooks/useFiles";
import { useTransactions } from "@/hooks/useTransactions";
import { useRejectedTransactions } from "@/hooks/useRejectedTransactions";
import BatchStatusCard from "@/components/batch/BatchStatusCard";
import BatchRunButton from "@/components/batch/BatchRunButton";
import TransactionSummaryCards from "@/components/transactions/TransactionSummaryCards";
import CategoryChart from "@/components/transactions/CategoryChart";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ToastContainer, type ToastMessage } from "@/components/ui/Toast";

export default function DashboardPage() {
    const navigate = useNavigate();
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const { status, loadingStatus, loadingRun, fetchStatus, run } = useBatch();
    const { files, loading: loadingFiles, fetchAll: fetchFiles } = useFiles();
    const { summary, loadingSummary, fetchSummary } = useTransactions();
    const { rejectedTransactions, loading: loadingRejected, fetchAll: fetchRejected } = useRejectedTransactions();

    const addToast = (type: "success" | "error", message: string) => {
        const toast: ToastMessage = { id: crypto.randomUUID(), type, message };
        setToasts((prev) => [...prev, toast]);
    };

    const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

    useEffect(() => {
        fetchStatus();
        fetchFiles();
        fetchSummary();
        fetchRejected();
    }, [fetchStatus, fetchFiles, fetchSummary, fetchRejected]);

    const handleRun = async () => {
        await run();
        await Promise.all([fetchStatus(), fetchFiles(), fetchSummary(), fetchRejected()]);
        addToast("success", "Batch executed successfully.");
    };

    const handleRefresh = async () => {
        await Promise.all([fetchStatus(), fetchFiles(), fetchSummary(), fetchRejected()]);
        addToast("success", "Dashboard refreshed.");
    };

    const pendingFiles = files.filter((f) => f.status === "PENDING").length;
    const processedFiles = files.filter((f) => f.status === "PROCESSED").length;
    const failedFiles = files.filter((f) => f.status === "FAILED").length;

    return (
        <>
            <PageHeader
                title="Dashboard"
                description="Overview of your data processing platform"
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<RefreshCw size={14} />}
                            onClick={handleRefresh}
                        >
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>
                        <BatchRunButton loading={loadingRun} onClick={handleRun} />
                    </div>
                }
            />

            <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Pending Files" value={pendingFiles} icon={<FileUp />} accent="orange" />
                    <StatCard label="Processed Files" value={processedFiles} icon={<ArrowRightLeft />} accent="green" />
                    <StatCard label="Rejected Records" value={rejectedTransactions.length} icon={<XOctagon />} accent="red" />
                </div>

                <TransactionSummaryCards summary={summary} loading={loadingSummary} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2">
                        <Card padding="md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                                    Volume by Category
                                </h3>
                                <button
                                    onClick={() => navigate("/transactions")}
                                    className="text-xs text-[var(--color-brand-primary)] hover:underline cursor-pointer"
                                >
                                    View all →
                                </button>
                            </div>
                            <CategoryChart categories={summary?.categories ?? []} />
                        </Card>
                    </div>
                    <BatchStatusCard status={status} loading={loadingStatus} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Total Files" value={loadingFiles ? "—" : files.length} icon={<FileUp />} accent="blue" />
                    <StatCard label="Failed Files" value={loadingFiles ? "—" : failedFiles} icon={<XOctagon />} accent="red" />
                    <StatCard label="Total Rejected" value={loadingRejected ? "—" : rejectedTransactions.length} icon={<XOctagon />} accent="orange" />
                </div>
            </div>

            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </>
    );
}