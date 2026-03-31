"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomerForm from "@/modules/customers/components/CustomerForm";
import { createCustomer } from "@/modules/customers/api/customerApi";
import type { CustomerFormData } from "@/modules/customers/types/customer";

export default function CustomerCreatePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(data: CustomerFormData) {
        setIsSubmitting(true);
        setError(null);

        try {
            const created = await createCustomer(data);
            router.push("/dashboard/customers");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create customer");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h1 className="text-xl font-semibold text-gray-900">
                    New Customer
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Create a new customer profile for direct or business sales.
                </p>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <CustomerForm
                isSubmitting={isSubmitting}
                submitLabel="Create Customer"
                onSubmit={handleSubmit}
            />
        </div>
    );
}