"use client";

/**
 * ---------------------------------------------------------
 * SHOP OWNER CREATE PAGE
 * ---------------------------------------------------------
 * Purpose:
 * Provides the page wrapper for creating a new Shop Owner.
 * It handles API submission, loading state, error display,
 * and redirects back to the Shop Owner list on success.
 * ---------------------------------------------------------
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createShopOwner } from "@/modules/shop-owners/api/shopOwnerApi";
import ShopOwnerForm from "@/modules/shop-owners/components/ShopOwnerForm";
import type { ShopOwnerFormData } from "@/modules/shop-owners/types/shopOwner";

export default function ShopOwnerCreatePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Normalize and render error values coming from API responses.
    function getErrorMessage(err: any) {
        return err?.response?.data?.message || err?.message || "Failed to create shop owner";
    }

    // Submit the new shop owner payload and redirect on success.
    async function handleSubmit(data: ShopOwnerFormData) {
        try {
            setIsSubmitting(true);
            setError(null);

            await createShopOwner(data);
            router.push("/dashboard/shop-owners");
        } catch (err: any) {
            setError(getErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h1 className="text-xl font-semibold text-gray-900">New Shop Owner</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Add a new shop owner and connect them with your brand account.
                </p>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {Array.isArray(error) ? error.join(", ") : error}
                </div>
            ) : null}

            <ShopOwnerForm
                isSubmitting={isSubmitting}
                submitLabel="Create Shop Owner"
                onSubmit={handleSubmit}
            />
        </div>
    );
}