"use client";

import { useMemo, useState } from "react";
import type {
    CustomerBusiness,
    CustomerBusinessFormData,
} from "@/modules/customers/types/customer";

interface CustomerBusinessFormProps {
    initialData?: Partial<CustomerBusiness> | Partial<CustomerBusinessFormData>;
    isSubmitting?: boolean;
    submitLabel?: string;
    onSubmit: (data: CustomerBusinessFormData) => Promise<void> | void;
    onCancel?: () => void;
}

export default function CustomerBusinessForm({
    initialData,
    isSubmitting = false,
    submitLabel = "Save Business",
    onSubmit,
    onCancel,
}: CustomerBusinessFormProps) {
    const initialForm = useMemo<CustomerBusinessFormData>(
        () => ({
            businessName: initialData?.businessName || "",
            legalBusinessName: initialData?.legalBusinessName || "",
            businessType: initialData?.businessType || "OTHER",
            shopOwnerId: initialData?.shopOwnerId || "",
            contactPersonName: initialData?.contactPersonName || "",
            contactPersonPhone: initialData?.contactPersonPhone || "",
            contactPersonEmail: initialData?.contactPersonEmail || "",
            gstNumber: initialData?.gstNumber || "",
            taxId: initialData?.taxId || "",
            registrationNumber: initialData?.registrationNumber || "",
            website: initialData?.website || "",
            isPrimary: initialData?.isPrimary || false,
            notes: initialData?.notes || "",
        }),
        [initialData]
    );

    const [form, setForm] = useState<CustomerBusinessFormData>(initialForm);

    function updateField<K extends keyof CustomerBusinessFormData>(
        field: K,
        value: CustomerBusinessFormData[K]
    ) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await onSubmit({
            ...form,
            shopOwnerId: form.shopOwnerId || undefined,
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5"
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Business Name
                    </label>
                    <input
                        type="text"
                        required
                        value={form.businessName}
                        onChange={(e) => updateField("businessName", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Legal Business Name
                    </label>
                    <input
                        type="text"
                        value={form.legalBusinessName || ""}
                        onChange={(e) => updateField("legalBusinessName", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Business Type
                    </label>
                    <select
                        value={form.businessType || "OTHER"}
                        onChange={(e) => updateField("businessType", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="SHOP_OWNER">Shop Owner</option>
                        <option value="DISTRIBUTOR">Distributor</option>
                        <option value="WHOLESALER">Wholesaler</option>
                        <option value="RESELLER">Reseller</option>
                        <option value="COMPANY">Company</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Contact Person
                    </label>
                    <input
                        type="text"
                        value={form.contactPersonName || ""}
                        onChange={(e) => updateField("contactPersonName", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Contact Phone
                    </label>
                    <input
                        type="text"
                        value={form.contactPersonPhone || ""}
                        onChange={(e) => updateField("contactPersonPhone", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Contact Email
                    </label>
                    <input
                        type="email"
                        value={form.contactPersonEmail || ""}
                        onChange={(e) => updateField("contactPersonEmail", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        GST Number
                    </label>
                    <input
                        type="text"
                        value={form.gstNumber || ""}
                        onChange={(e) => updateField("gstNumber", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Tax ID
                    </label>
                    <input
                        type="text"
                        value={form.taxId || ""}
                        onChange={(e) => updateField("taxId", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Registration Number
                    </label>
                    <input
                        type="text"
                        value={form.registrationNumber || ""}
                        onChange={(e) => updateField("registrationNumber", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div className="md:col-span-2 xl:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Website
                    </label>
                    <input
                        type="text"
                        value={form.website || ""}
                        onChange={(e) => updateField("website", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div className="flex items-center gap-2 pt-8">
                    <input
                        id="isPrimaryBusiness"
                        type="checkbox"
                        checked={!!form.isPrimary}
                        onChange={(e) => updateField("isPrimary", e.target.checked)}
                        className="h-4 w-4"
                    />
                    <label
                        htmlFor="isPrimaryBusiness"
                        className="text-sm font-medium text-gray-700"
                    >
                        Set as primary business
                    </label>
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
                {onCancel ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                ) : null}

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