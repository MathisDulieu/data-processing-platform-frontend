import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { clsx } from "clsx";

export type ToastType = "success" | "error";

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastProps {
    toast: ToastMessage;
    onDismiss: (id: string) => void;
}

const typeStyles: Record<ToastType, string> = {
    success: "border-l-[var(--color-status-success)] bg-[var(--color-status-success-bg)]",
    error: "border-l-[var(--color-status-error)] bg-[var(--color-status-error-bg)]",
};

const typeIcon: Record<ToastType, typeof CheckCircle> = {
    success: CheckCircle,
    error: XCircle,
};

const typeIconColor: Record<ToastType, string> = {
    success: "text-[var(--color-status-success-text)]",
    error: "text-[var(--color-status-error-text)]",
};

function Toast({ toast, onDismiss }: ToastProps) {
    const Icon = typeIcon[toast.type];

    useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), 4000);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <div
            className={clsx(
                "flex items-start gap-3 px-4 py-3 rounded-[var(--radius-lg)] border-l-4 shadow-[var(--shadow-raised)] animate-[slide-up_0.2s_ease-out] min-w-72 max-w-sm",
                typeStyles[toast.type]
            )}
        >
            <Icon size={16} className={clsx("shrink-0 mt-0.5", typeIconColor[toast.type])} />
            <p className="text-sm text-[var(--color-text-primary)] flex-1">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
                <X size={14} />
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: ToastMessage[];
    onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    if (toasts.length === 0) return null;
    return (
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
            {toasts.map((t) => (
                <Toast key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

export function useToast() {
    const toasts: ToastMessage[] = [];

    const add = (type: ToastType, message: string): ToastMessage => ({
        id: crypto.randomUUID(),
        type,
        message,
    });

    return { toasts, add };
}