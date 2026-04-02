"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createShopOwner } from "@/modules/shop-owners/api/shopOwnerApi";
import ShopOwnerForm from "@/modules/shop-owners/components/ShopOwnerForm";
import type { ShopOwnerFormData } from "@/modules/shop-owners/types/shopOwner";

export default function ShopOwnerCreatePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(data: ShopOwnerFormData) {
        setIsSubmitting(true);
        setError(null);

        try {
            await createShopOwner(data);
            router.push("/dashboard/shop-owners");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create shop owner");
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