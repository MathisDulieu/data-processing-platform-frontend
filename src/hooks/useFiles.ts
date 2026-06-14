import { useState, useCallback } from "react";
import filesApi from "@/api/files.api";
import type {
    FileResponse,
    FileDetailsResponse,
    FileUploadResponse,
} from "@/types/file.types";

interface UseFilesReturn {
    files: FileResponse[];
    selectedFile: FileDetailsResponse | null;
    uploadResult: FileUploadResponse | null;
    loading: boolean;
    loadingDetails: boolean;
    loadingUpload: boolean;
    loadingDelete: boolean;
    error: string | null;
    fetchAll: () => Promise<void>;
    fetchById: (id: number) => Promise<void>;
    upload: (file: File) => Promise<void>;
    remove: (id: number) => Promise<void>;
    clearSelectedFile: () => void;
    clearError: () => void;
}

export function useFiles(): UseFilesReturn {
    const [files, setFiles] = useState<FileResponse[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileDetailsResponse | null>(null);
    const [uploadResult, setUploadResult] = useState<FileUploadResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await filesApi.findAll();
            setFiles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch files");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchById = useCallback(async (id: number) => {
        setLoadingDetails(true);
        setError(null);
        try {
            const data = await filesApi.findById(id);
            setSelectedFile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch file details");
        } finally {
            setLoadingDetails(false);
        }
    }, []);

    const upload = useCallback(async (file: File) => {
        setLoadingUpload(true);
        setError(null);
        try {
            const data = await filesApi.upload(file);
            setUploadResult(data);
            const updated = await filesApi.findAll();
            setFiles(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload file");
        } finally {
            setLoadingUpload(false);
        }
    }, []);

    const remove = useCallback(async (id: number) => {
        setLoadingDelete(true);
        setError(null);
        try {
            await filesApi.delete(id);
            setFiles((prev) => prev.filter((f) => f.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete file");
        } finally {
            setLoadingDelete(false);
        }
    }, []);

    const clearSelectedFile = useCallback(() => setSelectedFile(null), []);
    const clearError = useCallback(() => setError(null), []);

    return {
        files,
        selectedFile,
        uploadResult,
        loading,
        loadingDetails,
        loadingUpload,
        loadingDelete,
        error,
        fetchAll,
        fetchById,
        upload,
        remove,
        clearSelectedFile,
        clearError,
    };
}