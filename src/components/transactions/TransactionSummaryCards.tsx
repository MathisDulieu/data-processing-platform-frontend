import { ArrowRightLeft, DollarSign, Layers, TrendingUp } from "lucide-react";
import type { TransactionSummaryResponse } from "@/types/transaction.types";
import StatCard from "@/components/ui/StatCard";

interface TransactionSummaryCardsProps {
    summary: TransactionSummaryResponse | null;
    loading: boolean;
}

function formatAmount(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(amount);
}

export default function TransactionSummaryCards({
                                                    summary,
                                                    loading,
                                                }: TransactionSummaryCardsProps) {
    const totalCategories = summary?.categories.length ?? 0;
    const topCategory = summary?.categories.reduce(
        (top, c) => (c.totalAmount > (top?.totalAmount ?? 0) ? c : top),
        null as typeof summary.categories[0] | null
    );

    if (loading) {
        return (
            <div className="grid grid-cols-1 min-[450px]:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-24 rounded-[var(--radius-lg)] bg-[var(--color-border-subtle)] animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 min-[450px]:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="Total Transactions"
                value={summary?.totalTransactions ?? 0}
                icon={<ArrowRightLeft />}
                accent="blue"
            />
            <StatCard
                label="Total Volume"
                value={summary ? formatAmount(summary.totalAmount) : "—"}
                icon={<DollarSign />}
                accent="green"
            />
            <StatCard
                label="Categories"
                value={totalCategories}
                icon={<Layers />}
                accent="orange"
            />
            <StatCard
                label="Top Category"
                value={topCategory?.category ?? "—"}
                icon={<TrendingUp />}
                accent="blue"
            />
        </div>
    );
}