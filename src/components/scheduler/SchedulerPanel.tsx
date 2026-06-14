import { useState, useEffect } from "react";
import { Clock, Zap, PowerOff, Save } from "lucide-react";
import type { BatchScheduleStatusResponse, BatchScheduleRequest, ScheduleType } from "@/types/scheduler.types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { clsx } from "clsx";

interface SchedulerPanelProps {
    scheduleStatus: BatchScheduleStatusResponse | null;
    loading: boolean;
    loadingUpdate: boolean;
    loadingDisable: boolean;
    onUpdate: (request: BatchScheduleRequest) => void;
    onDisable: () => void;
}

const SCHEDULE_TYPES: { value: ScheduleType; label: string; description: string; icon: typeof Clock }[] = [
    {
        value: "CRON",
        label: "Cron Expression",
        description: "Schedule using a standard cron expression",
        icon: Clock,
    },
    {
        value: "FIXED_DELAY",
        label: "Fixed Delay",
        description: "Run at a fixed interval in milliseconds",
        icon: Zap,
    },
];

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

function formatDelay(ms: number | null): string {
    if (!ms) return "—";
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(0)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
}

export default function SchedulerPanel({
                                           scheduleStatus,
                                           loading,
                                           loadingUpdate,
                                           loadingDisable,
                                           onUpdate,
                                           onDisable,
                                       }: SchedulerPanelProps) {
    const [scheduleType, setScheduleType] = useState<ScheduleType>("CRON");
    const [cronExpression, setCronExpression] = useState("0 */5 * * * *");
    const [fixedDelayMs, setFixedDelayMs] = useState("60000");
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (scheduleStatus?.scheduleType) {
            setScheduleType(scheduleStatus.scheduleType);
        }
        if (scheduleStatus?.cronExpression) {
            setCronExpression(scheduleStatus.cronExpression);
        }
        if (scheduleStatus?.fixedDelayMs) {
            setFixedDelayMs(String(scheduleStatus.fixedDelayMs));
        }
    }, [scheduleStatus]);

    const handleSubmit = () => {
        setFormError(null);

        if (scheduleType === "CRON" && !cronExpression.trim()) {
            setFormError("Cron expression is required.");
            return;
        }

        if (scheduleType === "FIXED_DELAY") {
            const delay = Number(fixedDelayMs);
            if (!fixedDelayMs || isNaN(delay) || delay <= 0) {
                setFormError("Fixed delay must be a positive number.");
                return;
            }
        }

        const request: BatchScheduleRequest = {
            enabled: true,
            scheduleType,
            cronExpression: scheduleType === "CRON" ? cronExpression.trim() : undefined,
            fixedDelayMs: scheduleType === "FIXED_DELAY" ? Number(fixedDelayMs) : undefined,
        };

        onUpdate(request);
    };

    const isEnabled = scheduleStatus?.enabled ?? false;

    return (
        <div className="space-y-5">
            <Card padding="none" className="overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[var(--color-brand-primary)]" />
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                            Current Schedule
                        </h3>
                    </div>
                    <Badge
                        variant={isEnabled ? "success" : "neutral"}
                        label={isEnabled ? "Active" : "Disabled"}
                    />
                </div>

                <div className="px-5 py-1">
                    {loading ? (
                        <div className="py-6 flex items-center justify-center">
                            <span className="w-5 h-5 border-2 border-[var(--color-border-bold)] border-t-[var(--color-brand-primary)] rounded-full animate-[spin_0.7s_linear_infinite]" />
                        </div>
                    ) : !scheduleStatus ? (
                        <p className="text-sm text-[var(--color-text-secondary)] py-5 text-center">
                            No scheduler configuration found.
                        </p>
                    ) : (
                        <div>
                            {[
                                {
                                    label: "Type",
                                    value: scheduleStatus.scheduleType ?? "—",
                                },
                                {
                                    label: "Cron Expression",
                                    value: scheduleStatus.cronExpression ? (
                                        <code className="text-xs font-mono bg-[var(--color-surface-sunken)] px-2 py-0.5 rounded">
                                            {scheduleStatus.cronExpression}
                                        </code>
                                    ) : "—",
                                },
                                {
                                    label: "Fixed Delay",
                                    value: formatDelay(scheduleStatus.fixedDelayMs),
                                },
                                {
                                    label: "Last Execution",
                                    value: formatDateTime(scheduleStatus.lastExecutionAt),
                                },
                                {
                                    label: "Next Execution",
                                    value: formatDateTime(scheduleStatus.nextExecutionAt),
                                },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between py-2.5 border-b border-[var(--color-border-subtle)] last:border-0"
                                >
                                    <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
                                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {value}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            <Card padding="md">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
                    Configure Schedule
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    {SCHEDULE_TYPES.map(({ value, label, description, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => setScheduleType(value)}
                            className={clsx(
                                "flex flex-col items-start gap-1.5 p-3.5 rounded-[var(--radius-md)] border-2 text-left transition-all duration-150 cursor-pointer",
                                scheduleType === value
                                    ? "border-[var(--color-brand-primary)] bg-[var(--color-status-info-bg)]"
                                    : "border-[var(--color-border-default)] hover:border-[var(--color-border-bold)] bg-white"
                            )}
                        >
                            <Icon
                                size={16}
                                className={
                                    scheduleType === value
                                        ? "text-[var(--color-brand-primary)]"
                                        : "text-[var(--color-text-secondary)]"
                                }
                            />
                            <span
                                className={clsx(
                                    "text-sm font-semibold",
                                    scheduleType === value
                                        ? "text-[var(--color-brand-primary)]"
                                        : "text-[var(--color-text-primary)]"
                                )}
                            >
                {label}
              </span>
                            <span className="text-xs text-[var(--color-text-secondary)]">{description}</span>
                        </button>
                    ))}
                </div>

                {scheduleType === "CRON" && (
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
                            Cron Expression
                        </label>
                        <input
                            type="text"
                            value={cronExpression}
                            onChange={(e) => setCronExpression(e.target.value)}
                            placeholder="0 */5 * * * *"
                            className="w-full px-3 py-2 text-sm font-mono rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 transition-all duration-150"
                        />
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                            Format: second minute hour day month weekday
                        </p>
                    </div>
                )}

                {scheduleType === "FIXED_DELAY" && (
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
                            Fixed Delay (ms)
                        </label>
                        <input
                            type="number"
                            value={fixedDelayMs}
                            onChange={(e) => setFixedDelayMs(e.target.value)}
                            min="1000"
                            placeholder="60000"
                            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 transition-all duration-150"
                        />
                        {fixedDelayMs && Number(fixedDelayMs) > 0 && (
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                Equivalent to {formatDelay(Number(fixedDelayMs))}
                            </p>
                        )}
                    </div>
                )}

                {formError && (
                    <p className="text-xs text-[var(--color-status-error-text)] mb-3 px-1">{formError}</p>
                )}

                <div className="flex items-center gap-2 justify-end">
                    {isEnabled && (
                        <Button
                            variant="secondary"
                            size="sm"
                            loading={loadingDisable}
                            icon={<PowerOff size={14} />}
                            onClick={onDisable}
                        >
                            Disable
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size="sm"
                        loading={loadingUpdate}
                        icon={<Save size={14} />}
                        onClick={handleSubmit}
                    >
                        Save Schedule
                    </Button>
                </div>
            </Card>
        </div>
    );
}