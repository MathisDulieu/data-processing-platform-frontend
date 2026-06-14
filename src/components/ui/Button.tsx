import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-hover)] active:bg-[var(--color-brand-primary-dark)] shadow-sm",
    secondary:
        "bg-white text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-sunken)] hover:border-[var(--color-border-bold)] shadow-sm",
    danger:
        "bg-[var(--color-status-error)] text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    ghost:
        "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-primary)]",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-sm gap-2",
};

export default function Button({
                                   variant = "primary",
                                   size = "md",
                                   loading = false,
                                   icon,
                                   children,
                                   disabled,
                                   className,
                                   ...props
                               }: ButtonProps) {
    return (
        <button
            disabled={disabled ?? loading}
            className={clsx(
                "inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] transition-all duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[var(--color-brand-primary)] focus-visible:outline-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-[spin_0.7s_linear_infinite] shrink-0" />
            ) : (
                icon && <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
            )}
            {children}
        </button>
    );
}