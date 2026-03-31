"use client";

import { useMemo, useState } from "react";
import type {
    AddressType,
    CustomerAddress,
    CustomerAddressFormData,
} from "@/modules/customers/types/customer";

interface CustomerAddressFormProps {
    initialData?: Partial<CustomerAddress> | Partial<CustomerAddressFormData>;
    isSubmitting?: boolean;
    submitLabel?: string;
    onSubmit: (data: CustomerAddressFormData) => Promise<void> | void;
    onCancel?: () => void;
}

export default function CustomerAddressForm({
    initialData,
    isSubmitting = false,
    submitLabel = "Save Address",
    onSubmit,
    onCancel,
}: CustomerAddressFormProps) {
    const initialForm = useMemo<CustomerAddressFormData>(
        () => ({
            type: initialData?.type || "SHIPPING",
            fullName: initialData?.fullName || "",
            phone: initialData?.phone || "",
            addressLine1: initialData?.addressLine1 || "",
            addressLine2: initialData?.addressLine2 || "",
            landmark: initialData?.landmark || "",
            city: initialData?.city || "",
            district: initialData?.district || "",
            state: initialData?.state || "",
            country: initialData?.country || "",
            postalCode: initialData?.postalCode || "",
            countryId: initialData?.countryId || "",
            stateId: initialData?.stateId || "",
            districtId: initialData?.districtId || "",
            isDefault: initialData?.isDefault || false,
        }),
        [initialData]
    );

    const [form, setForm] = useState<CustomerAddressFormData>(initialForm);

    function updateField<K extends keyof CustomerAddressFormData>(
        field: K,
        value: CustomerAddressFormData[K]
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
            countryId: form.countryId || undefined,
            stateId: form.stateId || undefined,
            districtId: form.districtId || undefined,
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
                        Address Type
                    </label>
                    <select
                        value={form.type || "SHIPPING"}
                        onChange={(e) => updateField("type", e.target.value as AddressType)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="SHIPPING">Shipping</option>
                        <option value="BILLING">Billing</option>
                        <option value="BOTH">Both</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={form.fullName || ""}
                        onChange={(e) => updateField("fullName", e.target.value)}
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

                <div className="md:col-span-2 xl:col-span-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Address Line 1
                    </label>
                    <input
                        type="text"
                        required
                        value={form.addressLine1}
                        onChange={(e) => updateField("addressLine1", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div className="md:col-span-2 xl:col-span-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Address Line 2
                    </label>
                    <input
                        type="text"
                        value={form.addressLine2 || ""}
                        onChange={(e) => updateField("addressLine2", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Landmark
                    </label>
                    <input
                        type="text"
                        value={form.landmark || ""}
                        onChange={(e) => updateField("landmark", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        City
                    </label>
                    <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Postal Code
                    </label>
                    <input
                        type="text"
                        value={form.postalCode || ""}
                        onChange={(e) => updateField("postalCode", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        District
                    </label>
                    <input
                        type="text"
                        value={form.district || ""}
                        onChange={(e) => updateField("district", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        State
                    </label>
                    <input
                        type="text"
                        value={form.state || ""}
                        onChange={(e) => updateField("state", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Country
                    </label>
                    <input
                        type="text"
                        value={form.country || ""}
                        onChange={(e) => updateField("country", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div className="flex items-center gap-2 pt-8">
                    <input
                        id="isDefaultAddress"
                        type="checkbox"
                        checked={!!form.isDefault}
                        onChange={(e) => updateField("isDefault", e.target.checked)}
                        className="h-4 w-4"
                    />
                    <label
                        htmlFor="isDefaultAddress"
                        className="text-sm font-medium text-gray-700"
                    >
                        Set as default address
                    </label>
                </div>
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