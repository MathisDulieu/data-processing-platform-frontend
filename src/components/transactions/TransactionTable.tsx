import { Eye } from "lucide-react";
import type { TransactionResponse } from "@/types/transaction.types";
import DataTable, { type Column } from "@/components/ui/DataTable";
import { clsx } from "clsx";

interface TransactionTableProps {
    data: TransactionResponse[];
    loading: boolean;
    onView?: (row: TransactionResponse) => void;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

const categoryColors: Record<string, string> = {
    SALARY: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)]",
    FOOD: "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-text)]",
    TRANSPORT: "bg-[var(--color-status-info-bg)] text-[var(--color-status-info-text)]",
    ENTERTAINMENT: "bg-purple-50 text-purple-700",
    HEALTH: "bg-teal-50 text-teal-700",
    UTILITIES: "bg-[var(--color-status-neutral-bg)] text-[var(--color-status-neutral-text)]",
};

function CategoryTag({ category }: { category: string }) {
    const style = categoryColors[category.toUpperCase()] ?? categoryColors["UTILITIES"];
    return (
        <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", style)}>
      {category}
    </span>
    );
}

export default function TransactionTable({ data, loading, onView }: TransactionTableProps) {
    const columns: Column<TransactionResponse>[] = [
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
          {row.reference}
        </span>
            ),
        },
        {
            key: "label",
            header: "Label",
            render: (row) => (
                <span className="text-sm text-[var(--color-text-primary)] font-medium">{row.label}</span>
            ),
        },
        {
            key: "category",
            header: "Category",
            width: "140px",
            render: (row) => <CategoryTag category={row.category} />,
        },
        {
            key: "amount",
            header: "Amount",
            width: "140px",
            render: (row) => (
                <span
                    className={clsx(
                        "text-sm font-semibold tabular-nums",
                        row.amount >= 0
                            ? "text-[var(--color-status-success-text)]"
                            : "text-[var(--color-status-error-text)]"
                    )}
                >
          {row.amount >= 0 ? "+" : ""}
                    {formatAmount(row.amount, row.currency)}
        </span>
            ),
        },
        {
            key: "date",
            header: "Date",
            width: "130px",
            render: (row) => (
                <span className="text-sm text-[var(--color-text-secondary)] tabular-nums">
          {formatDate(row.date)}
        </span>
            ),
        },
        {
            key: "fileId",
            header: "File",
            width: "80px",
            render: (row) => (
                <span className="text-xs text-[var(--color-text-secondary)] tabular-nums">
          #{row.uploadedFileId}
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
            emptyTitle="No transactions found"
            emptyDescription="Run the batch processor to import transactions from uploaded files."
        />
    );
}