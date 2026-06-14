import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import type { BatchStatusResponse } from "@/types/batch.types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";
import { clsx } from "clsx";

interface BatchStatusCardProps {
    status: BatchStatusResponse | null;
    loading: boolean;
}

function formatDateTime(value: string | null): string {
    if (!value) return "—";
    return new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function formatDuration(start: string | null, end: string | null): string {
    if (!start || !end) return "—";
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

const statusConfig: Record<
    string,
    { variant: "success" | "error" | "info" | "neutral"; icon: typeof CheckCircle }
> = {
    SUCCESS: { variant: "success", icon: CheckCircle },
    FAILED: { variant: "error", icon: XCircle },
    RUNNING: { variant: "info", icon: Clock },
};

interface MetricRowProps {
    label: string;
    value: string | number;
    highlight?: boolean;
}

function MetricRow({ label, value, highlight }: MetricRowProps) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-[var(--color-border-subtle)] last:border-0">
            <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
            <span
                className={clsx(
                    "text-sm font-semibold tabular-nums",
                    highlight ? "text-[var(--color-brand-primary)]" : "text-[var(--color-text-primary)]"
                )}
            >
        {value}
      </span>
        </div>
    );
}

export default function BatchStatusCard({ status, loading }: BatchStatusCardProps) {
    const config = status?.status ? statusConfig[status.status] : null;
    const StatusIcon = config?.icon ?? AlertCircle;

    return (
        <Card padding="none" className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                    <StatusIcon
                        size={16}
                        className={clsx(
                            !config && "text-[var(--color-border-bold)]",
                            config?.variant === "success" && "text-[var(--color-status-success)]",
                            config?.variant === "error" && "text-[var(--color-status-error)]",
                            config?.variant === "info" && "text-[var(--color-brand-primary)]"
                        )}
                    />
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Last Batch Run</h3>
                </div>
                {status?.status && (
                    <Badge
                        variant={config?.variant ?? "neutral"}
                        label={status.status}
                    />
                )}
            </div>

            <div className="px-5 py-1">
                {loading ? (
                    <div className="py-6">
                        <Loader centered size="sm" />
                    </div>
                ) : !status || !status.status ? (
                    <p className="text-sm text-[var(--color-text-secondary)] py-5 text-center">
                        No batch has been executed yet.
                    </p>
                ) : (
                    <>
                        <MetricRow label="Total Records" value={status.totalRecords ?? "—"} />
                        <MetricRow
                            label="Valid Records"
                            value={status.validRecords ?? "—"}
                            highlight
                        />
                        <MetricRow label="Rejected Records" value={status.rejectedRecords ?? "—"} />
                        <MetricRow label="Started At" value={formatDateTime(status.startedAt)} />
                        <MetricRow label="Finished At" value={formatDateTime(status.finishedAt)} />
                        <MetricRow
                            label="Duration"
                            value={formatDuration(status.startedAt, status.finishedAt)}
                        />
                        {status.message && (
                            <div className="mt-3 mb-2 px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-surface-sunken)] text-xs text-[var(--color-text-secondary)]">
                                {status.message}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
}