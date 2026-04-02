"use client";

import { useState } from "react";
import type { LinkExistingShopOwnerFormData } from "@/modules/shop-owners/types/shopOwner";

type Props = {
    isSubmitting?: boolean;
    onSubmit: (data: LinkExistingShopOwnerFormData) => Promise<void> | void;
};

export default function LinkExistingShopOwnerForm({
    isSubmitting = false,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<LinkExistingShopOwnerFormData>({
        shopOwnerId: "",
        phone: "",
        email: "",
        shopSlug: "",
        notes: "",
    });

    const handleChange = (key: keyof LinkExistingShopOwnerFormData, value: string) => {
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
                <h2 className="text-lg font-semibold text-gray-900">Find Existing Shop Owner</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Provide any one identifier to connect an existing shop owner with your brand.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Shop Owner ID</label>
                        <input
                            value={form.shopOwnerId}
                            onChange={(e) => handleChange("shopOwnerId", e.target.value)}
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

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Shop Slug</label>
                        <input
                            value={form.shopSlug}
                            onChange={(e) => handleChange("shopSlug", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                            rows={4}
                            value={form.notes}
                            onChange={(e) => handleChange("notes", e.target.value)}
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
                    {isSubmitting ? "Linking..." : "Link Shop Owner"}
                </button>
            </div>
        </form>
    );
}