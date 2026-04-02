"use client";

import { useState } from "react";
import type { ShopOwnerFormData } from "@/modules/shop-owners/types/shopOwner";

type Props = {
    isSubmitting?: boolean;
    submitLabel?: string;
    initialValues?: Partial<ShopOwnerFormData>;
    onSubmit: (data: ShopOwnerFormData) => Promise<void> | void;
};

export default function ShopOwnerForm({
    isSubmitting = false,
    submitLabel = "Save Shop Owner",
    initialValues,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<ShopOwnerFormData>({
        shopName: initialValues?.shopName || "",
        ownerName: initialValues?.ownerName || "",
        phone: initialValues?.phone || "",
        email: initialValues?.email || "",
        address: initialValues?.address || "",
        city: initialValues?.city || "",
        state: initialValues?.state || "",
        country: initialValues?.country || "",
        postalCode: initialValues?.postalCode || "",
        shopSlug: initialValues?.shopSlug || "",
        qrCodeUrl: initialValues?.qrCodeUrl || "",
        language: initialValues?.language || "en",
        businessName: initialValues?.businessName || "",
        legalEntityName: initialValues?.legalEntityName || "",
        gstNumber: initialValues?.gstNumber || "",
    });

    const handleChange = (key: keyof ShopOwnerFormData, value: string) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Basic Details</h2>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Shop Name</label>
                        <input
                            value={form.shopName}
                            onChange={(e) => handleChange("shopName", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Owner Name</label>
                        <input
                            value={form.ownerName}
                            onChange={(e) => handleChange("ownerName", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Business & Location</h2>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Business Name</label>
                        <input
                            value={form.businessName}
                            onChange={(e) => handleChange("businessName", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Legal Entity Name</label>
                        <input
                            value={form.legalEntityName}
                            onChange={(e) => handleChange("legalEntityName", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">GST Number</label>
                        <input
                            value={form.gstNumber}
                            onChange={(e) => handleChange("gstNumber", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Shop Slug</label>
                        <input
                            value={form.shopSlug}
                            onChange={(e) => handleChange("shopSlug", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                        <input
                            value={form.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
                        <input
                            value={form.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
                        <input
                            value={form.state}
                            onChange={(e) => handleChange("state", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
                        <input
                            value={form.country}
                            onChange={(e) => handleChange("country", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Postal Code</label>
                        <input
                            value={form.postalCode}
                            onChange={(e) => handleChange("postalCode", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}