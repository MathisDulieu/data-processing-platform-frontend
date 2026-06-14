import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import client from "@/api/client";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/": { title: "Dashboard", subtitle: "Overview of your data processing platform" },
    "/files": { title: "Files", subtitle: "Manage and upload your data files" },
    "/transactions": { title: "Transactions", subtitle: "Browse all processed transactions" },
    "/rejected": { title: "Rejected Transactions", subtitle: "Inspect records that failed validation" },
    "/scheduler": { title: "Scheduler", subtitle: "Configure automatic batch execution" },
};

type ApiStatus = "checking" | "connected" | "disconnected";

interface TopBarProps {
    onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
    const { pathname } = useLocation();
    const page = pageTitles[pathname] ?? { title: "Data Platform", subtitle: "" };
    const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");

    const checkApi = useCallback(async () => {
        try {
            await client.get("/actuator/health", { timeout: 4000 });
            setApiStatus("connected");
        } catch {
            try {
                await client.get("/batch/status", { timeout: 4000 });
                setApiStatus("connected");
            } catch {
                setApiStatus("disconnected");
            }
        }
    }, []);

    useEffect(() => {
        checkApi();
        const interval = setInterval(checkApi, 30000);
        return () => clearInterval(interval);
    }, [checkApi]);

    const statusConfig = {
        checking: {
            dot: "bg-[var(--color-status-warning)] animate-pulse",
            bg: "bg-[var(--color-status-warning-bg)]",
            text: "text-[var(--color-status-warning-text)]",
            label: "Checking...",
        },
        connected: {
            dot: "bg-[var(--color-status-success)] animate-pulse",
            bg: "bg-[var(--color-status-success-bg)]",
            text: "text-[var(--color-status-success-text)]",
            label: "API Connected",
        },
        disconnected: {
            dot: "bg-[var(--color-status-error)]",
            bg: "bg-[var(--color-status-error-bg)]",
            text: "text-[var(--color-status-error-text)]",
            label: "API Unreachable",
        },
    };

    const config = statusConfig[apiStatus];

    return (
        <header className="h-14 shrink-0 bg-[var(--color-surface-raised)] border-b border-[var(--color-border-subtle)] flex items-center px-4 md:px-6 gap-3">
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text-primary)] transition-colors duration-150 cursor-pointer"
            >
                <Menu size={18} />
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                        {page.title}
                    </h2>
                    {page.subtitle && (
                        <>
                            <span className="text-[var(--color-border-bold)] hidden sm:block">/</span>
                            <span className="text-sm text-[var(--color-text-secondary)] truncate hidden sm:block">
                {page.subtitle}
              </span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <div
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-md)] transition-colors duration-300 ${config.bg}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
                    <span className={`text-xs font-medium hidden sm:block ${config.text}`}>
            {config.label}
          </span>
                </div>
            </div>
        </header>
    );
}