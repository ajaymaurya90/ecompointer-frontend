"use client";

interface MultiSelectOption {
    value: string;
    label: string;
}

interface MultiSelectBoxProps {
    label: string;
    options: MultiSelectOption[];
    values: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}

export default function MultiSelectBox({
    label,
    options,
    values,
    onChange,
    placeholder = "All",
}: MultiSelectBoxProps) {
    const toggleValue = (value: string) => {
        if (values.includes(value)) {
            onChange(values.filter((item) => item !== value));
            return;
        }

        onChange([...values, value]);
    };

    return (
        <div className="space-y-3 rounded-xl border border-borderColorCustom bg-background p-4">
            <div className="text-sm font-medium text-textPrimary">{label}</div>

            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const active = values.includes(option.value);

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleValue(option.value)}
                            className={`rounded-full border px-3 py-1.5 text-sm transition ${active
                                    ? "border-primary bg-blue-50 text-primary"
                                    : "border-borderColorCustom bg-white text-textSecondary hover:bg-background"
                                }`}
                        >
                            {option.label}
                        </button>
                    );
                })}

                {options.length === 0 ? (
                    <span className="text-sm text-textSecondary">{placeholder}</span>
                ) : null}
            </div>
        </div>
    );
}