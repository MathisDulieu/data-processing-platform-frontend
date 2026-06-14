import type { ReactNode } from "react";
import Loader from "./Loader";
import EmptyState from "./EmptyState";
import { FileX } from "lucide-react";

export interface Column<T> {
    key: string;
    header: string;
    render: (row: T) => ReactNode;
    width?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    rowKey: (row: T) => string | number;
    onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
                                         columns,
                                         data,
                                         loading,
                                         emptyTitle = "No data found",
                                         emptyDescription,
                                         rowKey,
                                         onRowClick,
                                     }: DataTableProps<T>) {
    if (loading) {
        return <Loader centered size="md" label="Loading..." />;
    }

    if (data.length === 0) {
        return (
            <EmptyState
                icon={<FileX />}
                title={emptyTitle}
                description={emptyDescription}
            />
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-[var(--color-border-subtle)]">
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            style={{ width: col.width }}
                            className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider"
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr
                        key={rowKey(row)}
                        onClick={() => onRowClick?.(row)}
                        className="border-b border-[var(--color-border-subtle)] last:border-0 transition-colors duration-100 hover:bg-[var(--color-surface-sunken)] group"
                        style={{ cursor: onRowClick ? "pointer" : "default" }}
                    >
                        {columns.map((col) => (
                            <td
                                key={col.key}
                                className="px-4 py-3 text-[var(--color-text-primary)]"
                            >
                                {col.render(row)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}