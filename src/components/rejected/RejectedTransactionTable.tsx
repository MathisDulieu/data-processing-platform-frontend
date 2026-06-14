import { Eye } from "lucide-react";
import type { RejectedTransactionResponse } from "@/types/rejectedTransaction.types";
import DataTable, { type Column } from "@/components/ui/DataTable";

interface RejectedTransactionTableProps {
    data: RejectedTransactionResponse[];
    loading: boolean;
    onView?: (row: RejectedTransactionResponse) => void;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function RejectedTransactionTable({
                                                     data,
                                                     loading,
                                                     onView,
                                                 }: RejectedTransactionTableProps) {
    const columns: Column<RejectedTransactionResponse>[] = [
        {
            key: "id",
            header: "#",
            width: "60px",
            render: (row) => (
                <span className="text-[var(--color-text-secondary)] text-xs tabular-nums">{row.id}</span>
            ),
        },
        {
            key: "reference",
            header: "Reference",
            width: "160px",
            render: (row) => (
                <span className="font-mono text-xs text-[var(--color-text-primary)] bg-[var(--color-surface-sunken)] px-2 py-0.5 rounded">
          {row.reference ?? "—"}
        </span>
            ),
        },
        {
            key: "field",
            header: "Field",
            width: "140px",
            render: (row) => (
                <span className="text-sm font-medium text-[var(--color-status-warning-text)]">
          {row.field ?? "—"}
        </span>
            ),
        },
        {
            key: "reason",
            header: "Reason",
            render: (row) => (
                <span className="text-sm text-[var(--color-text-secondary)] line-clamp-1">
          {row.reason}
        </span>
            ),
        },
        {
            key: "importLogId",
            header: "Import Log",
            width: "110px",
            render: (row) => (
                <span className="text-xs text-[var(--color-text-secondary)] tabular-nums">
          #{row.importLogId}
        </span>
            ),
        },
        {
            key: "rejectedAt",
            header: "Rejected At",
            width: "170px",
            render: (row) => (
                <span className="text-sm text-[var(--color-text-secondary)] tabular-nums">
          {formatDate(row.rejectedAt)}
        </span>
            ),
        },
        {
            key: "actions",
            header: "",
            width: "52px",
            render: (row) => (
                <div className="flex justify-end">
                    {onView && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(row);
                            }}
                            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-status-info-bg)] transition-all duration-150 cursor-pointer"
                            title="View details"
                        >
                            <Eye size={14} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            rowKey={(row) => row.id}
            onRowClick={onView}
            emptyTitle="No rejected transactions"
            emptyDescription="All records passed validation successfully."
        />
    );
}