import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    FileUp,
    ArrowRightLeft,
    XOctagon,
    Clock,
    X,
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/files", label: "Files", icon: FileUp, end: false },
    { to: "/transactions", label: "Transactions", icon: ArrowRightLeft, end: false },
    { to: "/rejected", label: "Rejected", icon: XOctagon, end: false },
    { to: "/scheduler", label: "Scheduler", icon: Clock, end: false },
];

interface SidebarProps {
    open?: boolean;
    onClose?: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
        onClose?.();
    };

    return (
        <aside className="w-56 bg-[var(--color-brand-secondary)] flex flex-col h-full">
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                <button
                    onClick={handleLogoClick}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                >
                    <div className="w-8 h-8 shrink-0 transition-transform duration-150 group-hover:scale-105">
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <rect width="32" height="32" rx="6" fill="#0052CC" />
                            <rect x="7" y="8" width="6" height="6" rx="1" fill="white" opacity="0.95" />
                            <rect x="15" y="8" width="10" height="6" rx="1" fill="white" opacity="0.5" />
                            <rect x="7" y="18" width="10" height="6" rx="1" fill="white" opacity="0.5" />
                            <rect x="19" y="18" width="6" height="6" rx="1" fill="white" opacity="0.95" />
                        </svg>
                    </div>
                    <div className="min-w-0 text-left">
                        <p className="text-white text-xs font-bold tracking-wide leading-none">DATA PLATFORM</p>
                        <p className="text-white/50 text-[10px] mt-0.5 truncate">Processing Dashboard</p>
                    </div>
                </button>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="shrink-0 p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer md:hidden"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">
                    Navigation
                </p>
                <ul className="flex flex-col gap-0.5">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                end={end}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    clsx(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 group select-none",
                                        isActive
                                            ? "bg-white/15 text-white"
                                            : "text-white/60 hover:bg-white/8 hover:text-white"
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            size={16}
                                            className={clsx(
                                                "shrink-0 transition-transform duration-150",
                                                isActive
                                                    ? "text-white"
                                                    : "text-white/50 group-hover:text-white group-hover:scale-110"
                                            )}
                                        />
                                        {label}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="px-5 py-4 border-t border-white/10">
                <p className="text-white/25 text-[10px]">v1.0.0</p>
            </div>
        </aside>
    );
}

export default function Sidebar({ open = false, onClose }: SidebarProps) {
    return (
        <>
            <div className="hidden md:flex h-full shrink-0">
                <SidebarContent />
            </div>

            {open && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fade-in_0.15s_ease-out]"
                        onClick={onClose}
                    />
                    <div className="relative animate-[slide-in-left_0.2s_ease-out]">
                        <SidebarContent onClose={onClose} />
                    </div>
                </div>
            )}
        </>
    );
}