import { X } from "lucide-react";

interface FilterChipProps {
    label: string;
    onRemove: () => void;
}

export default function FilterChip({ label, onRemove }: FilterChipProps) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-infoSoft px-3 py-1.5 text-xs font-medium text-info">
            <span className="truncate">{label}</span>

            <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-info transition hover:bg-dangerSoft hover:text-danger"
                aria-label={`Remove filter ${label}`}
            >
                <X size={12} />
            </button>
        </span>
    );
}