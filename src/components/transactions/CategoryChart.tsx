import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import type { CategorySummary } from "@/types/transaction.types";
import EmptyState from "@/components/ui/EmptyState";
import { BarChart2 } from "lucide-react";

interface CategoryChartProps {
    categories: CategorySummary[];
}

const PALETTE = [
    "#0052CC",
    "#00B8D9",
    "#36B37E",
    "#FF991F",
    "#DE350B",
    "#6554C0",
    "#172B4D",
    "#42526E",
];

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: CategorySummary }>;
    label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
        <div className="bg-[var(--color-surface-overlay)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-[var(--shadow-raised)] px-3 py-2.5 text-sm">
            <p className="font-semibold text-[var(--color-text-primary)] mb-1">{label}</p>
            <p className="text-[var(--color-text-secondary)]">
                Volume:{" "}
                <span className="font-semibold text-[var(--color-brand-primary)]">
          {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
          }).format(item.value)}
        </span>
            </p>
            <p className="text-[var(--color-text-secondary)]">
                Count:{" "}
                <span className="font-semibold text-[var(--color-text-primary)]">
          {item.payload.count}
        </span>
            </p>
        </div>
    );
}

export default function CategoryChart({ categories }: CategoryChartProps) {
    if (!categories.length) {
        return (
            <EmptyState
                icon={<BarChart2 />}
                title="No category data"
                description="Process transactions to see category breakdown."
            />
        );
    }

    const data = [...categories].sort((a, b) => b.totalAmount - a.totalAmount);

    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }} barSize={28}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--color-border-subtle)"
                />
                <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: "var(--color-text-secondary)", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) =>
                        new Intl.NumberFormat("en-US", {
                            notation: "compact",
                            maximumFractionDigits: 1,
                        }).format(v)
                    }
                    width={52}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-surface-sunken)" }} />
                <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]}>
                    {data.map((_, index) => (
                        <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}