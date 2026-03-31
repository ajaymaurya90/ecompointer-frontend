"use client";

import { useEffect, useState } from "react";
import {
    getCustomerGroups,
    createCustomerGroup,
    updateCustomerGroup,
    deleteCustomerGroup,
} from "@/modules/customers/api/customerApi";
import CustomerGroupForm from "@/modules/customers/components/CustomerGroupForm";
import CustomerGroupMemberManager from "@/modules/customers/components/CustomerGroupMemberManager";
import type { CustomerGroup } from "@/modules/customers/types/customer";

export default function CustomerGroupListPage() {
    const [groups, setGroups] = useState<CustomerGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [managingId, setManagingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function fetchGroups() {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getCustomerGroups();
            setGroups(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to load customer groups");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    async function handleCreate(data: { name: string; description?: string }) {
        setIsSubmitting(true);
        setError(null);

        try {
            const created = await createCustomerGroup(data);
            setGroups((prev) => [created, ...prev]);
            setIsAdding(false);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create customer group");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleUpdate(
        id: string,
        data: { name: string; description?: string }
    ) {
        setIsSubmitting(true);
        setError(null);

        try {
            const updated = await updateCustomerGroup(id, data);
            setGroups((prev) => prev.map((g) => (g.id === id ? updated : g)));
            setEditingId(null);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to update customer group");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: string) {
        const confirmed = window.confirm("Delete this group?");
        if (!confirmed) return;

        setError(null);

        try {
            await deleteCustomerGroup(id);
            setGroups((prev) => prev.filter((g) => g.id !== id));
            if (managingId === id) {
                setManagingId(null);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to delete customer group");
        }
    }

    function updateGroupMemberCount(groupId: string, delta: number) {
        setGroups((prev) =>
            prev.map((group) => {
                if (group.id !== groupId) return group;

                const current = group.memberCount ?? 0;

                return {
                    ...group,
                    memberCount: Math.max(0, current + delta),
                };
            })
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Customer Groups
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage customer segments and assign members.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsAdding((prev) => !prev);
                        setEditingId(null);
                        setManagingId(null);
                    }}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                    {isAdding ? "Close" : "Add Group"}
                </button>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {isAdding ? (
                <CustomerGroupForm
                    isSubmitting={isSubmitting}
                    submitLabel="Create Group"
                    onSubmit={handleCreate}
                    onCancel={() => setIsAdding(false)}
                />
            ) : null}

            {isLoading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                    Loading customer groups...
                </div>
            ) : !groups.length ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
                    No groups created yet.
                </div>
            ) : (
                groups.map((group) => {
                    const isEditing = editingId === group.id;
                    const isManaging = managingId === group.id;

                    return (
                        <div
                            key={group.id}
                            className="rounded-2xl border border-gray-200 bg-white p-5"
                        >
                            {isEditing ? (
                                <CustomerGroupForm
                                    initialData={group}
                                    isSubmitting={isSubmitting}
                                    submitLabel="Update Group"
                                    onSubmit={(data) => handleUpdate(group.id, data)}
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <>
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {group.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {group.description || "-"}
                                            </p>
                                            <p className="mt-2 text-xs text-gray-500">
                                                Members: {group.memberCount ?? 0}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => {
                                                    setManagingId(isManaging ? null : group.id);
                                                    setEditingId(null);
                                                }}
                                                className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                {isManaging ? "Close Members" : "Manage Members"}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditingId(group.id);
                                                    setManagingId(null);
                                                }}
                                                className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(group.id)}
                                                className="rounded-xl border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {isManaging ? (
                                        <div className="mt-5">
                                            <CustomerGroupMemberManager
                                                groupId={group.id}
                                                onMembersChanged={(delta) =>
                                                    updateGroupMemberCount(group.id, delta)
                                                }
                                            />
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}