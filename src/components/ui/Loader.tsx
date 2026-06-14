import { clsx } from "clsx";

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    centered?: boolean;
    label?: string;
}

const sizeStyles = {
    sm: "w-4 h-4 border-2",
    md: "w-7 h-7 border-2",
    lg: "w-10 h-10 border-[3px]",
};

export default function Loader({ size = "md", centered = false, label }: LoaderProps) {
    const spinner = (
        <div className="flex flex-col items-center gap-3">
      <span
          className={clsx(
              "rounded-full border-[var(--color-border-bold)] border-t-[var(--color-brand-primary)] animate-[spin_0.7s_linear_infinite]",
              sizeStyles[size]
          )}
      />
            {label && (
                <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
            )}
        </div>
    );

    if (centered) {
        return (
            <div className="flex items-center justify-center w-full py-16">{spinner}</div>
        );
    }

    return spinner;
}