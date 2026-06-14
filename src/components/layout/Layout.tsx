import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-full bg-[var(--color-surface-sunken)]">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <TopBar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-[fade-in_0.2s_ease-out]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}