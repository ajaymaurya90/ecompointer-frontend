"use client";

/**
 * ---------------------------------------------------------
 * CUSTOMER EDIT PAGE
 * ---------------------------------------------------------
 * Purpose:
 * Provides the page wrapper for editing an existing Customer.
 * It loads the customer record, maps it into the shared form,
 * handles update submission, and redirects to detail page on success.
 * ---------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomerForm from "@/modules/customers/components/CustomerForm";
import {
    getCustomerById,
    updateCustomer,
} from "@/modules/customers/api/customerApi";
import type {
    Customer,
    CustomerFormData,
} from "@/modules/customers/types/customer";

interface CustomerEditPageProps {
    customerId: string;
}

export default function CustomerEditPage({
    customerId,
}: CustomerEditPageProps) {
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        // Load customer details when page opens or customer id changes.
        async function fetchCustomer() {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getCustomerById(customerId);

                if (isMounted) {
                    setCustomer(data);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err?.response?.data?.message || "Failed to load customer");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void fetchCustomer();

        // Prevent state update after component unmount.
        return () => {
            isMounted = false;
        };
    }, [customerId]);

    // Submit updated customer data and redirect to detail page on success.
    async function handleSubmit(data: CustomerFormData) {
        try {
            setIsSubmitting(true);
            setError(null);

            await updateCustomer(customerId, data);
            router.push(`/dashboard/customers/${customerId}`);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to update customer");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Build a stable initial-data shape for the shared form component.
    function buildInitialData(customer: Customer): Partial<CustomerFormData> {
        return {
            type: customer.type,
            status: customer.status,
            source: customer.source,
            firstName: customer.firstName,
            lastName: customer.lastName || "",
            email: customer.email || "",
            phone: customer.phone || "",
            alternatePhone: customer.alternatePhone || "",
            dateOfBirth: customer.dateOfBirth || "",
            notes: customer.notes || "",
        };
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h1 className="text-xl font-semibold text-gray-900">
                    Edit Customer
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Update customer profile information.
                </p>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {Array.isArray(error) ? error.join(", ") : error}
                </div>
            ) : null}

            {isLoading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 w-48 rounded bg-gray-200" />
                        <div className="h-12 rounded bg-gray-100" />
                        <div className="h-12 rounded bg-gray-100" />
                        <div className="h-12 rounded bg-gray-100" />
                        <div className="h-12 rounded bg-gray-100" />
                    </div>
                </div>
            ) : customer ? (
                <CustomerForm
                    initialData={buildInitialData(customer)}
                    isSubmitting={isSubmitting}
                    submitLabel="Update Customer"
                    onSubmit={handleSubmit}
                />
            ) : null}
        </div>
    );
}