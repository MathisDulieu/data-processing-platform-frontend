import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export default function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[var(--color-brand-secondary)]/40 backdrop-blur-sm animate-[fade-in_0.15s_ease-out]"
                onClick={onClose}
            />
            <div
                className={clsx(
                    "relative w-full bg-[var(--color-surface-overlay)] rounded-[var(--radius-xl)] shadow-[var(--shadow-overlay)] animate-[slide-up_0.2s_ease-out]",
                    sizeStyles[size]
                )}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)]">
                    <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}