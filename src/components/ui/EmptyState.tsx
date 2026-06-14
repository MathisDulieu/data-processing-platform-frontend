import type { ReactNode } from "react";

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {icon && (
                <div className="mb-4 text-[var(--color-border-bold)] [&>svg]:w-10 [&>svg]:h-10">
                    {icon}
                </div>
            )}
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mb-5">{description}</p>
            )}
            {action && <div>{action}</div>}
        </div>
    );
}