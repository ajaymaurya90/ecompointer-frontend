"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
    createPaymentGateway,
    deletePaymentGateway,
    getPaymentGateways,
    updatePaymentGateway,
} from "@/modules/super-admin/master-data/api/masterDataApi";
import MasterDataModal from "@/modules/super-admin/master-data/components/MasterDataModal";
import {
    MasterDataHeader,
    StatusBadge,
    TextField,
} from "@/modules/super-admin/master-data/components/MasterDataShared";
import type {
    MasterStatusFilter,
    PaymentGatewayMaster,
    PaymentGatewayProvider,
} from "@/modules/super-admin/master-data/types/masterData";

type FormState = {
    code: PaymentGatewayProvider | "";
    name: string;
    displayName: string;
    description: string;
    sortOrder: string;
    isActive: boolean;
    supportsTestMode: boolean;
    supportsLiveMode: boolean;
};

const emptyForm: FormState = {
    code: "",
    name: "",
    displayName: "",
    description: "",
    sortOrder: "0",
    isActive: true,
    supportsTestMode: true,
    supportsLiveMode: true,
};

const codeOptions: Array<{ value: PaymentGatewayProvider; label: string }> = [
    { value: "RAZORPAY", label: "RAZORPAY" },
    { value: "MOCK", label: "MOCK" },
    { value: "STRIPE", label: "STRIPE" },
    { value: "CASHFREE", label: "CASHFREE" },
    { value: "PAYPAL", label: "PAYPAL" },
    { value: "OTHER", label: "OTHER" },
];

export default function PaymentGatewaysPage() {
    const [items, setItems] = useState<PaymentGatewayMaster[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<MasterStatusFilter>("all");
    const [form, setForm] = useState<FormState>(emptyForm);
    const [editing, setEditing] = useState<PaymentGatewayMaster | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const value = search.trim().toLowerCase();
        const statusMatched = items.filter((item) => {
            if (statusFilter === "active") return item.isActive;
            if (statusFilter === "inactive") return !item.isActive;
            return true;
        });

        if (!value) return statusMatched;

        return statusMatched.filter((item) =>
            [
                item.code,
                item.name,
                item.displayName,
                item.description || "",
                String(item.sortOrder),
                item.isActive ? "active" : "inactive",
                item.supportsTestMode ? "test" : "",
                item.supportsLiveMode ? "live" : "",
            ].some((field) => field.toLowerCase().includes(value)),
        );
    }, [items, search, statusFilter]);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            const response = await getPaymentGateways({ limit: 100 });
            setItems(response.data ?? []);
        } catch (err) {
            setError(getErrorMessage(err, "Could not load payment gateways."));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, []);

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setFormError(null);
        setIsModalOpen(true);
    }

    function openEdit(item: PaymentGatewayMaster) {
        setEditing(item);
        setForm({
            code: item.code,
            name: item.name,
            displayName: item.displayName,
            description: item.description || "",
            sortOrder: String(item.sortOrder ?? 0),
            isActive: item.isActive,
            supportsTestMode: item.supportsTestMode,
            supportsLiveMode: item.supportsLiveMode,
        });
        setFormError(null);
        setIsModalOpen(true);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

        if (!form.code || !form.name.trim() || !form.displayName.trim()) {
            setFormError("Code, name, and display name are required.");
            return;
        }

        try {
            setSaving(true);
            setFormError(null);

            const payload = {
                code: form.code,
                name: form.name.trim(),
                displayName: form.displayName.trim(),
                description: form.description.trim() || null,
                sortOrder: Number(form.sortOrder || 0),
                isActive: form.isActive,
                supportsTestMode: form.supportsTestMode,
                supportsLiveMode: form.supportsLiveMode,
            };

            const saved = editing
                ? await updatePaymentGateway(editing.id, payload)
                : await createPaymentGateway(payload);

            setItems((current) =>
                editing
                    ? current.map((item) => (item.id === saved.id ? saved : item))
                    : [saved, ...current],
            );
            setIsModalOpen(false);
        } catch (err) {
            setFormError(getErrorMessage(err, "Could not save payment gateway."));
        } finally {
            setSaving(false);
        }
    }

    async function toggle(item: PaymentGatewayMaster) {
        try {
            const updated = await updatePaymentGateway(item.id, {
                isActive: !item.isActive,
            });
            setItems((current) =>
                current.map((row) => (row.id === updated.id ? updated : row)),
            );
        } catch (err) {
            setError(getErrorMessage(err, "Could not update payment gateway."));
        }
    }

    async function remove(item: PaymentGatewayMaster) {
        const confirmed = window.confirm(
            "Delete this gateway? If it is already used, the backend will deactivate it instead.",
        );

        if (!confirmed) return;

        try {
            await deletePaymentGateway(item.id);
            await load();
        } catch (err) {
            setError(getErrorMessage(err, "Could not delete payment gateway."));
        }
    }

    return (
        <div className="space-y-6">
            <MasterDataHeader
                title="Payment Gateways"
                description="Manage global payment gateway options available to tenants."
                actionLabel="New Payment Gateway"
                onAction={openCreate}
            />

            <ListToolbar
                search={search}
                onSearch={setSearch}
                statusFilter={statusFilter}
                onStatusFilter={setStatusFilter}
            />

            <TableShell loading={loading} error={error} onRetry={load}>
                {filtered.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="px-5 py-8 text-center text-sm text-textSecondary">
                            No payment gateways found.
                        </td>
                    </tr>
                ) : (
                    filtered.map((item) => (
                        <tr key={item.id} className="border-b border-borderSoft last:border-b-0">
                            <td className="px-5 py-4 font-semibold text-textPrimary">{item.displayName}</td>
                            <td className="px-5 py-4 text-textPrimary">{item.code}</td>
                            <td className="px-5 py-4 text-textPrimary">{item.name}</td>
                            <td className="px-5 py-4">
                                <SupportBadges test={item.supportsTestMode} live={item.supportsLiveMode} />
                            </td>
                            <td className="px-5 py-4 text-textPrimary">{item.sortOrder}</td>
                            <td className="px-5 py-4"><StatusBadge isActive={item.isActive} /></td>
                            <td className="max-w-sm px-5 py-4 text-textSecondary">
                                {item.description || "-"}
                            </td>
                            <td className="px-5 py-4">
                                <RowActions
                                    isActive={item.isActive}
                                    onEdit={() => openEdit(item)}
                                    onToggle={() => void toggle(item)}
                                    onDelete={() => void remove(item)}
                                />
                            </td>
                        </tr>
                    ))
                )}
            </TableShell>

            {isModalOpen ? (
                <MasterDataModal
                    title={editing ? "Edit Payment Gateway" : "New Payment Gateway"}
                    onClose={() => setIsModalOpen(false)}
                >
                    <form onSubmit={(event) => void submit(event)} className="space-y-4">
                        {formError ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {formError}
                            </div>
                        ) : null}

                        <label className="block">
                            <span className="text-sm font-medium text-textPrimary">Code *</span>
                            <select
                                value={form.code}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        code: event.target.value as PaymentGatewayProvider,
                                    }))
                                }
                                required
                                className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                            >
                                <option value="">Select code</option>
                                {codeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <TextField
                            label="Name"
                            value={form.name}
                            onChange={(value) =>
                                setForm((current) => ({ ...current, name: value }))
                            }
                            required
                        />

                        <TextField
                            label="Display Name"
                            value={form.displayName}
                            onChange={(value) =>
                                setForm((current) => ({ ...current, displayName: value }))
                            }
                            required
                        />

                        <label className="block">
                            <span className="text-sm font-medium text-textPrimary">Description</span>
                            <textarea
                                value={form.description}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        description: event.target.value,
                                    }))
                                }
                                rows={3}
                                className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-textPrimary">Sort Order</span>
                            <input
                                type="number"
                                min={0}
                                value={form.sortOrder}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        sortOrder: event.target.value,
                                    }))
                                }
                                className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                            />
                        </label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <CheckboxField
                                label="Active"
                                value={form.isActive}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, isActive: value }))
                                }
                            />
                            <CheckboxField
                                label="Test mode"
                                value={form.supportsTestMode}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, supportsTestMode: value }))
                                }
                            />
                            <CheckboxField
                                label="Live mode"
                                value={form.supportsLiveMode}
                                onChange={(value) =>
                                    setForm((current) => ({ ...current, supportsLiveMode: value }))
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : editing
                                    ? "Save Payment Gateway"
                                    : "Create Payment Gateway"}
                        </button>
                    </form>
                </MasterDataModal>
            ) : null}
        </div>
    );
}

function ListToolbar({
    search,
    onSearch,
    statusFilter,
    onStatusFilter,
}: {
    search: string;
    onSearch: (value: string) => void;
    statusFilter: MasterStatusFilter;
    onStatusFilter: (value: MasterStatusFilter) => void;
}) {
    return (
        <section className="grid grid-cols-1 gap-4 rounded-2xl border border-borderSoft bg-white p-5 shadow-sm md:grid-cols-[1fr_220px]">
            <input
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Search payment gateways"
                className="rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
            />
            <select
                value={statusFilter}
                onChange={(event) => onStatusFilter(event.target.value as MasterStatusFilter)}
                className="rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
            >
                <option value="all">All statuses</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
            </select>
        </section>
    );
}

function TableShell({
    loading,
    error,
    onRetry,
    children,
}: {
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    children: ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-borderSoft bg-white shadow-sm">
            {loading ? (
                <div className="p-8 text-sm text-textSecondary">Loading payment gateways...</div>
            ) : error ? (
                <div className="space-y-4 p-8">
                    <p className="text-sm font-medium text-red-600">{error}</p>
                    <button
                        type="button"
                        onClick={onRetry}
                        className="rounded-2xl bg-sidebar px-4 py-2 text-sm font-medium text-white"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-borderSoft bg-cardMuted text-left text-textSecondary">
                            <tr>
                                <th className="px-5 py-4 font-medium">Display Name</th>
                                <th className="px-5 py-4 font-medium">Code</th>
                                <th className="px-5 py-4 font-medium">Name</th>
                                <th className="px-5 py-4 font-medium">Modes</th>
                                <th className="px-5 py-4 font-medium">Sort</th>
                                <th className="px-5 py-4 font-medium">Status</th>
                                <th className="px-5 py-4 font-medium">Description</th>
                                <th className="px-5 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>{children}</tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

function RowActions({
    onEdit,
    onToggle,
    onDelete,
    isActive,
}: {
    onEdit: () => void;
    onToggle: () => void;
    onDelete: () => void;
    isActive: boolean;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={onEdit}
                className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textPrimary hover:bg-cardMuted"
            >
                Edit
            </button>
            <button
                type="button"
                onClick={onToggle}
                className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textSecondary hover:bg-cardMuted"
            >
                {isActive ? "Deactivate" : "Activate"}
            </button>
            <button
                type="button"
                onClick={onDelete}
                className="rounded-2xl border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
                Delete / Deactivate
            </button>
        </div>
    );
}

function CheckboxField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <label className="flex items-center gap-3 rounded-2xl border border-borderSoft px-4 py-3 text-sm font-medium text-textPrimary">
            <input
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
            />
            {label}
        </label>
    );
}

function SupportBadges({ test, live }: { test: boolean; live: boolean }) {
    return (
        <div className="flex flex-wrap gap-2">
            <span
                className={`rounded-2xl px-3 py-1 text-xs font-semibold ${
                    test ? "bg-sky-50 text-sky-700" : "bg-slate-100 text-slate-500"
                }`}
            >
                Test
            </span>
            <span
                className={`rounded-2xl px-3 py-1 text-xs font-semibold ${
                    live ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-500"
                }`}
            >
                Live
            </span>
        </div>
    );
}

function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error) return error.message;
    return fallback;
}
