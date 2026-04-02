"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { linkExistingShopOwner } from "@/modules/shop-owners/api/shopOwnerApi";
import LinkExistingShopOwnerForm from "@/modules/shop-owners/components/LinkExistingShopOwnerForm";
import type { LinkExistingShopOwnerFormData } from "@/modules/shop-owners/types/shopOwner";

export default function LinkExistingShopOwnerPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(data: LinkExistingShopOwnerFormData) {
        setIsSubmitting(true);
        setError(null);

        try {
            await linkExistingShopOwner(data);
            router.push("/dashboard/shop-owners");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to link existing shop owner");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h1 className="text-xl font-semibold text-gray-900">Link Existing Shop Owner</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Connect an already registered shop owner to your brand account.
                </p>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {Array.isArray(error) ? error.join(", ") : error}
                </div>
            ) : null}

            <LinkExistingShopOwnerForm
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />
        </div>
    );
}