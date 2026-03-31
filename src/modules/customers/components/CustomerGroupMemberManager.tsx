"use client";

import { useEffect, useMemo, useState } from "react";
import {
    addCustomersToGroup,
    getCustomerGroupById,
    getCustomers,
    removeCustomerFromGroup,
} from "@/modules/customers/api/customerApi";
import type { Customer, CustomerGroup } from "@/modules/customers/types/customer";

interface CustomerGroupMemberManagerProps {
    groupId: string;
    onMembersChanged?: (delta: number) => void;
}

function getCustomerName(customer: {
    firstName: string;
    lastName?: string | null;
}) {
    return [customer.firstName, customer.lastName].filter(Boolean).join(" ");
}

export default function CustomerGroupMemberManager({
    groupId,
    onMembersChanged,
}: CustomerGroupMemberManagerProps) {
    const [group, setGroup] = useState<CustomerGroup | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadData(currentSearch = "") {
        setIsLoading(true);
        setError(null);

        try {
            const [groupData, customerData] = await Promise.all([
                getCustomerGroupById(groupId),
                getCustomers({
                    page: 1,
                    limit: 50,
                    search: currentSearch,
                    sortBy: "createdAt",
                    sortOrder: "desc",
                }),
            ]);

            setGroup(groupData);
            setCustomers(customerData.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to load group members");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [groupId]);

    const existingMemberIds = useMemo(
        () => new Set((group?.members || []).map((item) => item.customer.id)),
        [group]
    );

    const availableCustomers = useMemo(() => {
        return customers.filter((customer) => !existingMemberIds.has(customer.id));
    }, [customers, existingMemberIds]);

    function toggleCustomer(customerId: string) {
        setSelectedIds((prev) =>
            prev.includes(customerId)
                ? prev.filter((id) => id !== customerId)
                : [...prev, customerId]
        );
    }

    async function handleAssign() {
        if (!selectedIds.length) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await addCustomersToGroup(groupId, selectedIds);
            setSelectedIds([]);
            await loadData(search);

            if (onMembersChanged) {
                onMembersChanged(selectedIds.length);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to assign customers");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleRemove(customerId: string) {
        const confirmed = window.confirm("Remove this customer from the group?");
        if (!confirmed) return;

        setError(null);

        try {
            await removeCustomerFromGroup(groupId, customerId);
            await loadData(search);

            if (onMembersChanged) {
                onMembersChanged(-1);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to remove customer");
        }
    }

    async function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await loadData(search);
    }

    return (
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div>
                <h4 className="text-sm font-semibold text-gray-900">Manage Members</h4>
                <p className="mt-1 text-xs text-gray-500">
                    Search customers, select multiple records, and assign them to this group.
                </p>
            </div>

            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers by name, email, phone, code"
                    className="h-11 flex-1 rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500"
                />
                <button
                    type="submit"
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Search
                </button>
            </form>

            {isLoading ? (
                <div className="rounded-xl bg-white p-4 text-sm text-gray-500">
                    Loading members...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-gray-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h5 className="text-sm font-semibold text-gray-900">
                                    Available Customers
                                </h5>
                                <span className="text-xs text-gray-500">
                                    {availableCustomers.length} found
                                </span>
                            </div>

                            {!availableCustomers.length ? (
                                <div className="text-sm text-gray-500">
                                    No available customers found.
                                </div>
                            ) : (
                                <div className="max-h-80 space-y-2 overflow-y-auto">
                                    {availableCustomers.map((customer) => (
                                        <label
                                            key={customer.id}
                                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(customer.id)}
                                                onChange={() => toggleCustomer(customer.id)}
                                                className="mt-1 h-4 w-4"
                                            />

                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {getCustomerName(customer)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {customer.customerCode} · {customer.type} · {customer.status}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {customer.email || customer.phone || "-"}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleAssign}
                                    disabled={!selectedIds.length || isSubmitting}
                                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? "Assigning..." : `Assign Selected (${selectedIds.length})`}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h5 className="text-sm font-semibold text-gray-900">
                                    Current Members
                                </h5>
                                <span className="text-xs text-gray-500">
                                    {group?.members?.length || 0} members
                                </span>
                            </div>

                            {!group?.members?.length ? (
                                <div className="text-sm text-gray-500">
                                    No customers assigned yet.
                                </div>
                            ) : (
                                <div className="max-h-80 space-y-2 overflow-y-auto">
                                    {group.members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 p-3"
                                        >
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {getCustomerName(member.customer)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {member.customer.customerCode} · {member.customer.type} · {member.customer.status}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {member.customer.email || member.customer.phone || "-"}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemove(member.customer.id)}
                                                className="rounded-xl border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}