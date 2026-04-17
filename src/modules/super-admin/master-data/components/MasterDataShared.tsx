import Link from "next/link";

export function StatusBadge({ isActive }: { isActive: boolean }) {
    return (
        <span
            className={`rounded-2xl px-3 py-1 text-xs font-semibold ${
                isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
            }`}
        >
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}

export function MasterDataHeader({
    title,
    description,
    actionLabel,
    onAction,
}: {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        href="/admin/master-data"
                        className="text-sm font-medium text-textSecondary hover:text-textPrimary"
                    >
                        Master Data
                    </Link>
                    <h2 className="mt-3 text-2xl font-semibold text-textPrimary">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm text-textSecondary">{description}</p>
                </div>
                {actionLabel && onAction ? (
                    <button
                        type="button"
                        onClick={onAction}
                        className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm"
                    >
                        {actionLabel}
                    </button>
                ) : null}
            </div>
        </section>
    );
}

export function TextField({
    label,
    value,
    onChange,
    required = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-textPrimary">
                {label}
                {required ? " *" : ""}
            </span>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                required={required}
                className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
            />
        </label>
    );
}

export function SelectField({
    label,
    value,
    onChange,
    options,
    required = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ id: string; label: string }>;
    required?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-textPrimary">
                {label}
                {required ? " *" : ""}
            </span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                required={required}
                className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
