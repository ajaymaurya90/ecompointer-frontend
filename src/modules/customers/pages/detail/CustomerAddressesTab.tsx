"use client";

import { useState } from "react";
import {
    createCustomerAddress,
    deleteCustomerAddress,
    updateCustomerAddress,
} from "@/modules/customers/api/customerApi";
import CustomerAddressForm from "@/modules/customers/components/CustomerAddressForm";
import type {
    Customer,
    CustomerAddress,
    CustomerAddressFormData,
} from "@/modules/customers/types/customer";

interface CustomerAddressesTabProps {
    customer: Customer;
}

function getAddressLine(address: CustomerAddress) {
    return [
        address.addressLine1,
        address.addressLine2,
        address.landmark,
        address.city,
        address.districtRef?.name || address.district,
        address.stateRef?.name || address.state,
        address.countryRef?.name || address.country,
        address.postalCode,
    ]
        .filter(Boolean)
        .join(", ");
}

export default function CustomerAddressesTab({
    customer,
}: CustomerAddressesTabProps) {
    const [items, setItems] = useState<CustomerAddress[]>(customer.addresses || []);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleCreate(data: CustomerAddressFormData) {
        setIsSubmitting(true);
        setError(null);

        try {
            const created = await createCustomerAddress(customer.id, data);
            setItems((prev) => sortAddresses([...prev, created]));
            setIsAdding(false);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create address");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleUpdate(addressId: string, data: CustomerAddressFormData) {
        setIsSubmitting(true);
        setError(null);

        try {
            const updated = await updateCustomerAddress(customer.id, addressId, data);
            setItems((prev) =>
                sortAddresses(prev.map((item) => (item.id === addressId ? updated : item)))
            );
            setEditingId(null);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to update address");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(addressId: string) {
        const confirmed = window.confirm("Are you sure you want to remove this address?");
        if (!confirmed) return;

        setError(null);

        try {
            await deleteCustomerAddress(customer.id, addressId);
            setItems((prev) => prev.filter((item) => item.id !== addressId));
            if (editingId === addressId) {
                setEditingId(null);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to remove address");
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Addresses</h2>
                    <p className="text-sm text-gray-500">
                        Manage billing and shipping addresses.
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
                    {isAdding ? "Close Form" : "Add Address"}
                </button>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {isAdding ? (
                <CustomerAddressForm
                    isSubmitting={isSubmitting}
                    submitLabel="Create Address"
                    onSubmit={handleCreate}
                    onCancel={() => setIsAdding(false)}
                />
            ) : null}

            {!items.length && !isAdding ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
                    No address records found.
                </div>
            ) : null}

            {items.map((address) => {
                const isEditing = editingId === address.id;

                return (
                    <div
                        key={address.id}
                        className="rounded-2xl border border-gray-200 bg-white p-5"
                    >
                        {isEditing ? (
                            <CustomerAddressForm
                                initialData={address}
                                isSubmitting={isSubmitting}
                                submitLabel="Update Address"
                                onSubmit={(data) => handleUpdate(address.id, data)}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <>
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">
                                            {address.type} Address
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {address.fullName || "No recipient name"}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {address.isDefault ? (
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                                Default
                                            </span>
                                        ) : null}

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${address.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {address.isActive ? "Active" : "Inactive"}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingId(address.id);
                                                setIsAdding(false);
                                                setError(null);
                                            }}
                                            className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(address.id)}
                                            className="rounded-xl border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    <div>
                                        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Phone
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {address.phone || "-"}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 xl:col-span-2">
                                        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Address
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {getAddressLine(address)}
                                        </div>
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

function sortAddresses(items: CustomerAddress[]) {
    return [...items].sort((a, b) => {
        if (a.isDefault === b.isDefault) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return a.isDefault ? -1 : 1;
    });
}