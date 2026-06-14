import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import type { FileDetailsResponse, FileStatus } from "@/types/file.types";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";
import type { BadgeVariant } from "@/components/ui/Badge";
import { clsx } from "clsx";

interface FileDetailsModalProps {
    open: boolean;
    onClose: () => void;
    file: FileDetailsResponse | null;
    loading: boolean;
}

const statusVariant: Record<FileStatus, BadgeVariant> = {
    PENDING: "warning",
    PROCESSED: "success",
    FAILED: "error",
};

const statusIcon: Record<FileStatus, typeof CheckCircle> = {
    PENDING: Clock,
    PROCESSED: CheckCircle,
    FAILED: XCircle,
};

function formatDate(value: string): string {
    return new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

interface DetailRowProps {
    label: string;
    value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-[var(--color-border-subtle)] last:border-0">
            <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
            <span className="text-sm font-medium text-[var(--color-text-primary)] text-right max-w-[60%] truncate">
        {value}
      </span>
        </div>
    );
}

export default function FileDetailsModal({
                                             open,
                                             onClose,
                                             file,
                                             loading,
                                         }: FileDetailsModalProps) {
    const StatusIcon = file?.status ? statusIcon[file.status] : FileText;

    return (
        <Modal open={open} onClose={onClose} title="File Details" size="md">
            {loading ? (
                <Loader centered size="md" label="Loading details..." />
            ) : !file ? (
                <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">
                    No file selected.
                </p>
            ) : (
                <div className="space-y-5">
                    <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-sunken)]">
                        <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-status-info-bg)] shrink-0">
                            <FileText size={20} className="text-[var(--color-brand-primary)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                                {file.filename}
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{file.mimeType}</p>
                        </div>
                        <Badge variant={statusVariant[file.status]} label={file.status} />
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                            Details
                        </h4>
                        <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] overflow-hidden">
                            <div className="px-4">
                                <DetailRow label="File ID" value={`#${file.id}`} />
                                <DetailRow label="Uploaded At" value={formatDate(file.uploadedAt)} />
                                <DetailRow
                                    label="Status"
                                    value={
                                        <span className="flex items-center gap-1.5 justify-end">
                      <StatusIcon
                          size={13}
                          className={clsx(
                              file.status === "PROCESSED" && "text-[var(--color-status-success)]",
                              file.status === "FAILED" && "text-[var(--color-status-error)]",
                              file.status === "PENDING" && "text-[var(--color-status-warning)]"
                          )}
                      />
                                            {file.status}
                    </span>
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                            Processing Summary
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col items-center justify-center p-4 rounded-[var(--radius-md)] bg-[var(--color-status-success-bg)] border border-[var(--color-status-success)]/20">
                                <p className="text-2xl font-bold text-[var(--color-status-success-text)]">
                                    {file.transactionCount}
                                </p>
                                <p className="text-xs font-medium text-[var(--color-status-success-text)] mt-0.5">
                                    Transactions
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 rounded-[var(--radius-md)] bg-[var(--color-status-error-bg)] border border-[var(--color-status-error)]/20">
                                <p className="text-2xl font-bold text-[var(--color-status-error-text)]">
                                    {file.rejectedTransactionCount}
                                </p>
                                <p className="text-xs font-medium text-[var(--color-status-error-text)] mt-0.5">
                                    Rejected
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}