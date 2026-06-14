import type { ReactNode } from "react";
import Card from "./Card";
import { clsx } from "clsx";

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: string;
        positive: boolean;
    };
    accent?: "blue" | "green" | "red" | "orange";
    className?: string;
}

const accentBar: Record<string, string> = {
    blue: "bg-[var(--color-brand-primary)]",
    green: "bg-[var(--color-status-success)]",
    red: "bg-[var(--color-status-error)]",
    orange: "bg-[var(--color-status-warning)]",
};

const accentIcon: Record<string, string> = {
    blue: "bg-[var(--color-status-info-bg)] text-[var(--color-brand-primary)]",
    green: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)]",
    red: "bg-[var(--color-status-error-bg)] text-[var(--color-status-error-text)]",
    orange: "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-text)]",
};

export default function StatCard({
                                     label,
                                     value,
                                     icon,
                                     trend,
                                     accent = "blue",
                                     className,
                                 }: StatCardProps) {
    return (
        <Card className={clsx("relative overflow-hidden", className)} padding="md">
            <div
                className={clsx(
                    "absolute left-0 top-0 bottom-0 w-1 rounded-l-[var(--radius-lg)]",
                    accentBar[accent]
                )}
            />
            <div className="pl-2 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)] leading-none">
                        {value}
                    </p>
                    {trend && (
                        <p
                            className={clsx(
                                "text-xs font-medium mt-2",
                                trend.positive
                                    ? "text-[var(--color-status-success-text)]"
                                    : "text-[var(--color-status-error-text)]"
                            )}
                        >
                            {trend.positive ? "↑" : "↓"} {trend.value}
                        </p>
                    )}
                </div>
                {icon && (
                    <div
                        className={clsx(
                            "flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] shrink-0 [&>svg]:w-5 [&>svg]:h-5",
                            accentIcon[accent]
                        )}
                    >
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}