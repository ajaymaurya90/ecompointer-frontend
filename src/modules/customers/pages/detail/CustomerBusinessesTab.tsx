"use client";

import { useState } from "react";
import {
    createCustomerBusiness,
    deleteCustomerBusiness,
    updateCustomerBusiness,
} from "@/modules/customers/api/customerApi";
import CustomerBusinessForm from "@/modules/customers/components/CustomerBusinessForm";
import type {
    Customer,
    CustomerBusiness,
    CustomerBusinessFormData,
} from "@/modules/customers/types/customer";

interface CustomerBusinessesTabProps {
    customer: Customer;
}

export default function CustomerBusinessesTab({
    customer,
}: CustomerBusinessesTabProps) {
    const [items, setItems] = useState<CustomerBusiness[]>(customer.businesses || []);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleCreate(data: CustomerBusinessFormData) {
        setIsSubmitting(true);
        setError(null);

        try {
            const created = await createCustomerBusiness(customer.id, data);
            setItems((prev) => {
                const next = [...prev, created];
                return sortBusinesses(next);
            });
            setIsAdding(false);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create business");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleUpdate(businessId: string, data: CustomerBusinessFormData) {
        setIsSubmitting(true);
        setError(null);

        try {
            const updated = await updateCustomerBusiness(customer.id, businessId, data);
            setItems((prev) =>
                sortBusinesses(prev.map((item) => (item.id === businessId ? updated : item)))
            );
            setEditingId(null);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to update business");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(businessId: string) {
        const confirmed = window.confirm("Are you sure you want to remove this business?");
        if (!confirmed) return;

        setError(null);

        try {
            await deleteCustomerBusiness(customer.id, businessId);
            setItems((prev) => prev.filter((item) => item.id !== businessId));
            if (editingId === businessId) {
                setEditingId(null);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to remove business");
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Businesses</h2>
                    <p className="text-sm text-gray-500">
                        Manage customer business records and B2B details.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setIsAdding((prev) => !prev);
                        setEditingId(null);
                        setError(null);
                    }}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                    {isAdding ? "Close Form" : "Add Business"}
                </button>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {isAdding ? (
                <CustomerBusinessForm
                    isSubmitting={isSubmitting}
                    submitLabel="Create Business"
                    onSubmit={handleCreate}
                    onCancel={() => setIsAdding(false)}
                />
            ) : null}

            {!items.length && !isAdding ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
                    No business records found.
                </div>
            ) : null}

            {items.map((business) => {
                const isEditing = editingId === business.id;

                return (
                    <div
                        key={business.id}
                        className="rounded-2xl border border-gray-200 bg-white p-5"
                    >
                        {isEditing ? (
                            <CustomerBusinessForm
                                initialData={business}
                                isSubmitting={isSubmitting}
                                submitLabel="Update Business"
                                onSubmit={(data) => handleUpdate(business.id, data)}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <>
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">
                                            {business.businessName}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {business.legalBusinessName || "No legal business name"}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {business.isPrimary ? (
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                                Primary
                                            </span>
                                        ) : null}

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${business.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {business.isActive ? "Active" : "Inactive"}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingId(business.id);
                                                setIsAdding(false);
                                                setError(null);
                                            }}
                                            className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(business.id)}
                                            className="rounded-xl border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    <div>
                                        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Business Type
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {business.businessType}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Contact Person
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {business.contactPersonName || "-"}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Contact Phone
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {business.contactPersonPhone || "-"}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Contact Email
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {business.contactPersonEmail || "-"}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            GST Number
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {business.gstNumber || "-"}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Website
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900 break-all">
                                            {business.website || "-"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Notes
                                    </div>
                                    <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                                        {business.notes || "No notes available."}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function sortBusinesses(items: CustomerBusiness[]) {
    return [...items].sort((a, b) => {
        if (a.isPrimary === b.isPrimary) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return a.isPrimary ? -1 : 1;
    });
}