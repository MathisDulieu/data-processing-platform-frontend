import { Play } from "lucide-react";
import Button from "@/components/ui/Button";

interface BatchRunButtonProps {
    loading: boolean;
    onClick: () => void;
}

export default function BatchRunButton({ loading, onClick }: BatchRunButtonProps) {
    return (
        <Button
            variant="primary"
            size="md"
            loading={loading}
            icon={<Play />}
            onClick={onClick}
        >
            {loading ? "Running..." : "Run Batch"}
        </Button>
    );
}