import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[var(--color-surface-sunken)] flex items-center justify-center p-6">
            <div className="flex flex-col items-center text-center max-w-md animate-[slide-up_0.3s_ease-out]">
                <div className="mb-6 relative">
                    <svg
                        viewBox="0 0 120 80"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-36 h-24"
                    >
                        <rect x="10" y="20" width="30" height="40" rx="4" fill="#DFE1E6" />
                        <rect x="12" y="22" width="26" height="5" rx="2" fill="#B3BAC5" />
                        <rect x="12" y="30" width="20" height="3" rx="1.5" fill="#B3BAC5" opacity="0.6" />
                        <rect x="12" y="35" width="16" height="3" rx="1.5" fill="#B3BAC5" opacity="0.6" />
                        <rect x="12" y="40" width="22" height="3" rx="1.5" fill="#B3BAC5" opacity="0.6" />

                        <rect x="50" y="10" width="30" height="40" rx="4" fill="#DEEBFF" />
                        <rect x="52" y="12" width="26" height="5" rx="2" fill="#0052CC" opacity="0.4" />
                        <rect x="52" y="20" width="20" height="3" rx="1.5" fill="#0052CC" opacity="0.3" />
                        <rect x="52" y="25" width="16" height="3" rx="1.5" fill="#0052CC" opacity="0.3" />
                        <rect x="52" y="30" width="22" height="3" rx="1.5" fill="#0052CC" opacity="0.3" />
                        <text x="59" y="46" fontSize="12" fontWeight="bold" fill="#0052CC" opacity="0.6">?</text>

                        <rect x="88" y="25" width="22" height="30" rx="4" fill="#DFE1E6" />
                        <rect x="90" y="27" width="18" height="4" rx="2" fill="#B3BAC5" />
                        <rect x="90" y="34" width="14" height="2.5" rx="1" fill="#B3BAC5" opacity="0.6" />
                        <rect x="90" y="38" width="10" height="2.5" rx="1" fill="#B3BAC5" opacity="0.6" />
                    </svg>
                </div>

                <div className="mb-2 px-3 py-1 rounded-full bg-[var(--color-status-error-bg)] border border-[var(--color-status-error)]/20 inline-flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[var(--color-status-error-text)]">404</span>
                    <span className="text-xs text-[var(--color-status-error-text)]">Page not found</span>
                </div>

                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mt-3 mb-2">
                    Nothing here
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                    Head back to the dashboard to continue.
                </p>

                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        icon={<ArrowLeft size={15} />}
                        onClick={() => navigate(-1)}
                    >
                        Go back
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        icon={<Home size={15} />}
                        onClick={() => navigate("/")}
                    >
                        Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}