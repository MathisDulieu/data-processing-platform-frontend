import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import DashboardPage from "@/pages/DashboardPage";
import FilesPage from "@/pages/FilesPage";
import TransactionsPage from "@/pages/TransactionsPage";
import RejectedTransactionsPage from "@/pages/RejectedTransactionsPage";
import SchedulerPage from "@/pages/SchedulerPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="files" element={<FilesPage />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="rejected" element={<RejectedTransactionsPage />} />
                    <Route path="scheduler" element={<SchedulerPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}