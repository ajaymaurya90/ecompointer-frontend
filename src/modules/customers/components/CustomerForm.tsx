"use client";

import { useMemo, useState } from "react";
import type {
    CustomerFormData,
    CustomerSource,
    CustomerStatus,
    CustomerType,
} from "@/modules/customers/types/customer";

interface CustomerFormProps {
    initialData?: Partial<CustomerFormData>;
    isSubmitting?: boolean;
    submitLabel?: string;
    onSubmit: (data: CustomerFormData) => Promise<void> | void;
}

function normalizeDate(value?: string) {
    if (!value) return "";
    return value.includes("T") ? value.split("T")[0] : value;
}

export default function CustomerForm({
    initialData,
    isSubmitting = false,
    submitLabel = "Save Customer",
    onSubmit,
}: CustomerFormProps) {
    const initialForm = useMemo<CustomerFormData>(
        () => ({
            type: initialData?.type || "INDIVIDUAL",
            status: initialData?.status || "ACTIVE",
            source: initialData?.source || "MANUAL",
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            email: initialData?.email || "",
            phone: initialData?.phone || "",
            alternatePhone: initialData?.alternatePhone || "",
            dateOfBirth: normalizeDate(initialData?.dateOfBirth),
            notes: initialData?.notes || "",
        }),
        [initialData]
    );

    const [form, setForm] = useState<CustomerFormData>(initialForm);

    function updateField<K extends keyof CustomerFormData>(
        field: K,
        value: CustomerFormData[K]
    ) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await onSubmit(form);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6"
        >
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Customer Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Create or update direct and business customer information.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        required
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={form.lastName || ""}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        value={form.email || ""}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        type="text"
                        value={form.phone || ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Alternate Phone
                    </label>
                    <input
                        type="text"
                        value={form.alternatePhone || ""}
                        onChange={(e) => updateField("alternatePhone", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        value={form.dateOfBirth || ""}
                        onChange={(e) => updateField("dateOfBirth", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Type
                    </label>
                    <select
                        value={form.type || "INDIVIDUAL"}
                        onChange={(e) =>
                            updateField("type", e.target.value as CustomerType)
                        }
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="BUSINESS">Business</option>
                        <option value="BOTH">Both</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        value={form.status || "ACTIVE"}
                        onChange={(e) =>
                            updateField("status", e.target.value as CustomerStatus)
                        }
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="LEAD">Lead</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="BLOCKED">Blocked</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Source
                    </label>
                    <select
                        value={form.source || "MANUAL"}
                        onChange={(e) =>
                            updateField("source", e.target.value as CustomerSource)
                        }
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="WEBSITE">Website</option>
                        <option value="MOBILE_APP">Mobile App</option>
                        <option value="MANUAL">Manual</option>
                        <option value="SHOP_REFERRAL">Shop Referral</option>
                        <option value="IMPORT">Import</option>
                        <option value="MARKETPLACE">Marketplace</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Notes
                </label>
                <textarea
                    value={form.notes || ""}
                    onChange={(e) => updateField("notes", e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-500"
                />
            </div>

            <div className="flex items-center justify-end gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}