import { useRef, useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { clsx } from "clsx";
import Button from "@/components/ui/Button";

interface FileUploadZoneProps {
    onUpload: (file: File) => void;
    loading: boolean;
}

const ACCEPTED = [".csv", ".json"];
const ACCEPTED_MIME = ["text/csv", "application/json", "text/plain"];

export default function FileUploadZone({ onUpload, loading }: FileUploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validate = (file: File): boolean => {
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        if (!ACCEPTED.includes(ext) && !ACCEPTED_MIME.includes(file.type)) {
            setError("Only CSV and JSON files are accepted.");
            return false;
        }
        setError(null);
        return true;
    };

    const handleFile = useCallback(
        (file: File) => {
            if (!validate(file)) return;
            setSelectedFile(file);
        },
        []
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = "";
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onUpload(selectedFile);
            setSelectedFile(null);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setError(null);
    };

    return (
        <div className="space-y-3">
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !selectedFile && inputRef.current?.click()}
                className={clsx(
                    "relative flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-10 transition-all duration-200",
                    dragging
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-status-info-bg)] scale-[1.01]"
                        : selectedFile
                            ? "border-[var(--color-status-success)] bg-[var(--color-status-success-bg)]"
                            : "border-[var(--color-border-default)] bg-[var(--color-surface-sunken)] hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-status-info-bg)] cursor-pointer"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED.join(",")}
                    onChange={handleChange}
                    className="hidden"
                />

                {selectedFile ? (
                    <>
                        <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-status-success-bg)]">
                            <FileText size={24} className="text-[var(--color-status-success-text)]" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                                {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className={clsx(
                                "flex items-center justify-center w-12 h-12 rounded-[var(--radius-lg)] transition-colors duration-200",
                                dragging
                                    ? "bg-[var(--color-status-info-bg)] text-[var(--color-brand-primary)]"
                                    : "bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]"
                            )}
                        >
                            <Upload size={22} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                Drop your file here or{" "}
                                <span className="text-[var(--color-brand-primary)] hover:underline">browse</span>
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                Supports CSV and JSON files
                            </p>
                        </div>
                    </>
                )}
            </div>

            {error && (
                <p className="text-xs text-[var(--color-status-error-text)] px-1">{error}</p>
            )}

            {selectedFile && (
                <div className="flex items-center gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        loading={loading}
                        icon={<Upload size={14} />}
                        onClick={handleSubmit}
                    >
                        {loading ? "Uploading..." : "Upload File"}
                    </Button>
                </div>
            )}
        </div>
    );
}