export default function FilterChip({
    label,
    onRemove,
}: {
    label: string;
    onRemove: () => void;
}) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {label}
            <button
                type="button"
                onClick={onRemove}
                className="text-blue-700 hover:text-red-600"
            >
                ✕
            </button>
        </span>
    );
}