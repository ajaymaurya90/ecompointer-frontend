"use client";

import { useMemo, useState } from "react";
import type { CustomerGroup } from "@/modules/customers/types/customer";

interface CustomerGroupFormProps {
    initialData?: Partial<CustomerGroup>;
    isSubmitting?: boolean;
    submitLabel?: string;
    onSubmit: (data: { name: string; description?: string }) => Promise<void>;
    onCancel?: () => void;
}

export default function CustomerGroupForm({
    initialData,
    isSubmitting = false,
    submitLabel = "Save Group",
    onSubmit,
    onCancel,
}: CustomerGroupFormProps) {
    const initialForm = useMemo(
        () => ({
            name: initialData?.name || "",
            description: initialData?.description || "",
        }),
        [initialData]
    );

    const [form, setForm] = useState(initialForm);

    function updateField(field: keyof typeof form, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit(form);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5"
        >
            <div>
                <label className="text-sm font-medium text-gray-700">
                    Group Name
                </label>
                <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-gray-300 px-3 text-sm"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    value={form.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                />
            </div>

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border px-4 py-2 text-sm"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-black px-4 py-2 text-sm text-white"
                >
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}