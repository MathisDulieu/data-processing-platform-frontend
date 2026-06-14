import { clsx } from "clsx";

export type BadgeVariant = "success" | "error" | "warning" | "info" | "neutral";

interface BadgeProps {
    variant: BadgeVariant;
    label: string;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)]",
    error: "bg-[var(--color-status-error-bg)] text-[var(--color-status-error-text)]",
    warning: "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-text)]",
    info: "bg-[var(--color-status-info-bg)] text-[var(--color-status-info-text)]",
    neutral: "bg-[var(--color-status-neutral-bg)] text-[var(--color-status-neutral-text)]",
};

export default function Badge({ variant, label, className }: BadgeProps) {
    return (
        <span
            className={clsx(
                "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide",
                variantStyles[variant],
                className
            )}
        >
      {label}
    </span>
    );
}