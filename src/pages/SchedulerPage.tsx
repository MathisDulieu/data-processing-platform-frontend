import { useEffect, useState } from "react";
import { useScheduler } from "@/hooks/useScheduler";
import SchedulerPanel from "@/components/scheduler/SchedulerPanel";
import PageHeader from "@/components/ui/PageHeader";
import { ToastContainer, type ToastMessage } from "@/components/ui/Toast";
import type { BatchScheduleRequest } from "@/types/scheduler.types";

export default function SchedulerPage() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const { scheduleStatus, loading, loadingUpdate, loadingDisable, error, fetchCurrent, update, disable, clearError } = useScheduler();

    const addToast = (type: "success" | "error", message: string) => {
        const toast: ToastMessage = { id: crypto.randomUUID(), type, message };
        setToasts((prev) => [...prev, toast]);
    };

    const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

    useEffect(() => { fetchCurrent(); }, [fetchCurrent]);

    useEffect(() => {
        if (error) { addToast("error", error); clearError(); }
    }, [error, clearError]);

    const handleUpdate = async (request: BatchScheduleRequest) => {
        await update(request);
        addToast("success", "Scheduler configuration saved.");
    };

    const handleDisable = async () => {
        await disable();
        addToast("success", "Scheduler disabled successfully.");
    };

    return (
        <>
            <PageHeader title="Scheduler" description="Configure automatic batch execution" />

            <div className="w-full max-w-2xl">
                <SchedulerPanel
                    scheduleStatus={scheduleStatus}
                    loading={loading}
                    loadingUpdate={loadingUpdate}
                    loadingDisable={loadingDisable}
                    onUpdate={handleUpdate}
                    onDisable={handleDisable}
                />
            </div>

            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </>
    );
}