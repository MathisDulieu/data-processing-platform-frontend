import { clsx } from "clsx";
import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
};

export default function Card({ children, className, padding = "md" }: CardProps) {
    return (
        <div
            className={clsx(
                "bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-[var(--color-border-subtle)]",
                paddingStyles[padding],
                className
            )}
        >
            {children}
        </div>
    );
}