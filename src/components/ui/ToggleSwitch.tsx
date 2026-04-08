"use client";

interface ToggleSwitchProps {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    description?: string;
    size?: "sm" | "md";
}

export default function ToggleSwitch({
    checked,
    onChange,
    disabled = false,
    label,
    description,
    size = "md",
}: ToggleSwitchProps) {
    const width = size === "sm" ? "w-9" : "w-11";
    const height = size === "sm" ? "h-5" : "h-6";
    const knob = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    const translate = checked
        ? size === "sm"
            ? "translate-x-4"
            : "translate-x-5"
        : "translate-x-0";

    return (
        <label
            className={`flex items-start gap-3 ${disabled ? "cursor-default" : "cursor-pointer"
                }`}
        >
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange?.(!checked)}
                className={`relative inline-flex shrink-0 items-center rounded-full transition ${width} ${height} ${checked ? "bg-blue-600" : "bg-slate-300"
                    } ${disabled ? "opacity-70" : ""}`}
            >
                <span
                    className={`inline-block rounded-full bg-white shadow transition-transform ${knob} ${translate}`}
                />
            </button>

            {(label || description) && (
                <div className="min-w-0">
                    {label ? (
                        <div className="text-sm font-medium text-textPrimary">{label}</div>
                    ) : null}
                    {description ? (
                        <div className="mt-1 text-sm text-textSecondary">{description}</div>
                    ) : null}
                </div>
            )}
        </label>
    );
}