import { Trash2, Eye } from "lucide-react";
import type { FileResponse, FileStatus } from "@/types/file.types";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import type { BadgeVariant } from "@/components/ui/Badge";

interface FileTableProps {
    files: FileResponse[];
    loading: boolean;
    onView: (id: number) => void;
    onDelete: (id: number) => void;
    deletingId?: number | null;
}

const statusVariant: Record<FileStatus, BadgeVariant> = {
    PENDING: "warning",
    PROCESSED: "success",
    FAILED: "error",
};

function formatDate(value: string): string {
    return new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function FileTable({
                                      files,
                                      loading,
                                      onView,
                                      onDelete,
                                      deletingId,
                                  }: FileTableProps) {
    const columns: Column<FileResponse>[] = [
        {
            key: "id",
            header: "#",
            width: "60px",
            render: (row) => (
                <span className="text-[var(--color-text-secondary)] text-xs tabular-nums">{row.id}</span>
            ),
        },
        {
            key: "filename",
            header: "Filename",
            render: (row) => (
                <span className="font-medium text-[var(--color-text-primary)]">{row.filename}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            width: "120px",
            render: (row) => (
                <Badge variant={statusVariant[row.status]} label={row.status} />
            ),
        },
        {
            key: "uploadedAt",
            header: "Uploaded At",
            width: "180px",
            render: (row) => (
                <span className="text-sm text-[var(--color-text-secondary)] tabular-nums">
          {formatDate(row.uploadedAt)}
        </span>
            ),
        },
        {
            key: "actions",
            header: "",
            width: "90px",
            render: (row) => (
                <div className="flex items-center gap-1 justify-end">
                    <button
                        onClick={(e) => { e.stopPropagation(); onView(row.id); }}
                        className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-status-info-bg)] transition-all duration-150 cursor-pointer"
                        title="View details"
                    >
                        <Eye size={14} />
                    </button>
                    {(row.status === "PENDING" || row.status === "FAILED") && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(row.id); }}
                            disabled={deletingId === row.id}
                            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-status-error)] hover:bg-[var(--color-status-error-bg)] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Delete file"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={files}
            loading={loading}
            rowKey={(row) => row.id}
            emptyTitle="No files uploaded yet"
            emptyDescription="Upload a CSV or JSON file to get started."
        />
    );
}