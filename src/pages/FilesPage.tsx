import { useEffect, useState } from "react";
import { useFiles } from "@/hooks/useFiles";
import FileTable from "@/components/files/FileTable";
import FileUploadZone from "@/components/files/FileUploadZone";
import FileDetailsModal from "@/components/files/FileDetailsModal";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { ToastContainer, type ToastMessage } from "@/components/ui/Toast";
import { FileUp, CheckCircle, XCircle, Clock } from "lucide-react";

export default function FilesPage() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const {
        files, selectedFile, loading, loadingDetails, loadingUpload, error,
        fetchAll, fetchById, upload, remove, clearSelectedFile, clearError,
    } = useFiles();

    const addToast = (type: "success" | "error", message: string) => {
        const toast: ToastMessage = { id: crypto.randomUUID(), type, message };
        setToasts((prev) => [...prev, toast]);
    };

    const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

    useEffect(() => { fetchAll(); }, [fetchAll]);

    useEffect(() => {
        if (error) { addToast("error", error); clearError(); }
    }, [error, clearError]);

    const handleUpload = async (file: File) => {
        await upload(file);
        addToast("success", `"${file.name}" uploaded successfully.`);
    };

    const handleView = async (id: number) => {
        setModalOpen(true);
        await fetchById(id);
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        await remove(id);
        setDeletingId(null);
        addToast("success", "File deleted successfully.");
    };

    const handleCloseModal = () => { setModalOpen(false); clearSelectedFile(); };

    const pending = files.filter((f) => f.status === "PENDING").length;
    const processed = files.filter((f) => f.status === "PROCESSED").length;
    const failed = files.filter((f) => f.status === "FAILED").length;

    return (
        <>
            <PageHeader title="Files" description="Upload and manage your CSV and JSON data files" />

            <div className="space-y-5">
                <div className="grid grid-cols-1 min-[450px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard label="Total" value={files.length} icon={<FileUp />} accent="blue" />
                    <StatCard label="Pending" value={pending} icon={<Clock />} accent="orange" />
                    <StatCard label="Processed" value={processed} icon={<CheckCircle />} accent="green" />
                    <StatCard label="Failed" value={failed} icon={<XCircle />} accent="red" />
                </div>

                <Card padding="md">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Upload a File</h3>
                    <FileUploadZone onUpload={handleUpload} loading={loadingUpload} />
                </Card>

                <Card padding="none">
                    <div className="px-4 sm:px-5 py-4 border-b border-[var(--color-border-subtle)]">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Uploaded Files</h3>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                            {files.length} file{files.length !== 1 ? "s" : ""} total
                        </p>
                    </div>
                    <FileTable files={files} loading={loading} onView={handleView} onDelete={handleDelete} deletingId={deletingId} />
                </Card>
            </div>

            <FileDetailsModal open={modalOpen} onClose={handleCloseModal} file={selectedFile} loading={loadingDetails} />
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </>
    );
}