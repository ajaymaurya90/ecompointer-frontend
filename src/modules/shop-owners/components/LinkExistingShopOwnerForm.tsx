"use client";

/**
 * ---------------------------------------------------------
 * LINK EXISTING SHOP OWNER FORM
 * ---------------------------------------------------------
 * Purpose:
 * Renders the form used by a Brand Owner to connect an
 * already existing Shop Owner account using any available
 * identifier such as shop owner id, phone, email, or shop slug.
 *
 * Form Pattern:
 * 1. Keep raw UI values in local state
 * 2. Normalize payload before submit
 * 3. Submit only cleaned values to API layer
 * ---------------------------------------------------------
 */

import { useState } from "react";
import { cleanString } from "@/lib/utils/formHelpers";
import type { LinkExistingShopOwnerFormData } from "@/modules/shop-owners/types/shopOwner";

type Props = {
    isSubmitting?: boolean;
    onSubmit: (data: LinkExistingShopOwnerFormData) => Promise<void> | void;
};

type LinkExistingShopOwnerFormState = {
    shopOwnerId: string;
    phone: string;
    email: string;
    shopSlug: string;
    notes: string;
};

// Build the initial UI state with safe default empty strings.
function getInitialState(): LinkExistingShopOwnerFormState {
    return {
        shopOwnerId: "",
        phone: "",
        email: "",
        shopSlug: "",
        notes: "",
    };
}

export default function LinkExistingShopOwnerForm({
    isSubmitting = false,
    onSubmit,
}: Props) {
    // Store raw input values exactly as entered by the user.
    const [form, setForm] = useState<LinkExistingShopOwnerFormState>(getInitialState());

    // Update a single field in a strongly typed way.
    function handleChange<K extends keyof LinkExistingShopOwnerFormState>(
        key: K,
        value: LinkExistingShopOwnerFormState[K]
    ) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    // Convert raw UI values into a clean API payload.
    function buildPayload(): LinkExistingShopOwnerFormData {
        return {
            shopOwnerId: cleanString(form.shopOwnerId),
            phone: cleanString(form.phone),
            email: cleanString(form.email),
            shopSlug: cleanString(form.shopSlug),
            notes: cleanString(form.notes),
        };
    }

    // Submit the normalized payload to parent handler.
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await onSubmit(buildPayload());
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Find Existing Shop Owner</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Provide any one identifier to connect an existing shop owner with your brand.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Shop Owner ID
                        </label>
                        <input
                            value={form.shopOwnerId}
                            onChange={(e) => handleChange("shopOwnerId", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Shop Slug
                        </label>
                        <input
                            value={form.shopSlug}
                            onChange={(e) => handleChange("shopSlug", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Notes
                        </label>
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