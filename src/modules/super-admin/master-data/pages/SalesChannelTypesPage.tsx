"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
    createSalesChannelType,
    getSalesChannelTypes,
    updateSalesChannelType,
} from "@/modules/super-admin/master-data/api/masterDataApi";
import MasterDataModal from "@/modules/super-admin/master-data/components/MasterDataModal";
import {
    MasterDataHeader,
    StatusBadge,
    TextField,
} from "@/modules/super-admin/master-data/components/MasterDataShared";
import type {
    SalesChannelTypeCode,
    SalesChannelTypeMaster,
} from "@/modules/super-admin/master-data/types/masterData";

type FormState = {
    code: SalesChannelTypeCode | "";
    label: string;
    description: string;
    sortOrder: string;
    isActive: boolean;
};

const emptyForm: FormState = {
    code: "",
    label: "",
    description: "",
    sortOrder: "0",
    isActive: true,
};

const codeOptions: Array<{ value: SalesChannelTypeCode; label: string }> = [
    { value: "DIRECT_WEBSITE", label: "DIRECT_WEBSITE" },
    { value: "SHOP_ORDER", label: "SHOP_ORDER" },
    { value: "MARKETPLACE", label: "MARKETPLACE" },
    { value: "FRANCHISE_SHOP", label: "FRANCHISE_SHOP" },
    { value: "SOCIAL_MEDIA", label: "SOCIAL_MEDIA" },
    { value: "MANUAL", label: "MANUAL" },
];

export default function SalesChannelTypesPage() {
    const [items, setItems] = useState<SalesChannelTypeMaster[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<FormState>(emptyForm);
    const [editing, setEditing] = useState<SalesChannelTypeMaster | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return items;

        return items.filter((item) =>
            [
                item.label,
                item.code,
                item.description || "",
                String(item.sortOrder),
                item.isActive ? "active" : "inactive",
            ].some((field) => field.toLowerCase().includes(value)),
        );
    }, [items, search]);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            setItems(await getSalesChannelTypes());
        } catch (err) {
            setError(getErrorMessage(err, "Could not load sales channel types."));
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

    function openEdit(item: SalesChannelTypeMaster) {
        setEditing(item);
        setForm({
            code: item.code,
            label: item.label,
            description: item.description || "",
            sortOrder: String(item.sortOrder ?? 0),
            isActive: item.isActive,
        });
        setFormError(null);
        setIsModalOpen(true);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

        if (!form.code || !form.label.trim()) {
            setFormError("Code and label are required.");
            return;
        }

        try {
            setSaving(true);
            setFormError(null);

            const payload = {
                code: form.code,
                label: form.label.trim(),
                description: form.description.trim() || null,
                sortOrder: Number(form.sortOrder || 0),
                isActive: form.isActive,
            };

            const saved = editing
                ? await updateSalesChannelType(editing.id, {
                      label: payload.label,
                      description: payload.description,
                      sortOrder: payload.sortOrder,
                      isActive: payload.isActive,
                  })
                : await createSalesChannelType(payload);

            setItems((current) =>
                editing
                    ? current.map((item) => (item.id === saved.id ? saved : item))
                    : [saved, ...current],
            );
            setIsModalOpen(false);
        } catch (err) {
            setFormError(getErrorMessage(err, "Could not save sales channel type."));
        } finally {
            setSaving(false);
        }
    }

    async function toggle(item: SalesChannelTypeMaster) {
        try {
            const updated = await updateSalesChannelType(item.id, {
                isActive: !item.isActive,
            });
            setItems((current) =>
                current.map((row) => (row.id === updated.id ? updated : row)),
            );
        } catch (err) {
            setError(getErrorMessage(err, "Could not update sales channel type."));
        }
    }

    return (
        <div className="space-y-6">
            <MasterDataHeader
                title="Sales Channel Types"
                description="Manage sales channel type options available to Brand Owners."
                actionLabel="New Sales Channel Type"
                onAction={openCreate}
            />

            <ListToolbar search={search} onSearch={setSearch} />

            <TableShell loading={loading} error={error} onRetry={load}>
                {filtered.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-sm text-textSecondary">
                            No sales channel types found.
                        </td>
                    </tr>
                ) : (
                    filtered.map((item) => (
                        <tr key={item.id} className="border-b border-borderSoft last:border-b-0">
                            <td className="px-5 py-4 font-semibold text-textPrimary">{item.label}</td>
                            <td className="px-5 py-4 text-textPrimary">{item.code}</td>
                            <td className="max-w-lg px-5 py-4 text-textSecondary">
                                {item.description || "-"}
                            </td>
                            <td className="px-5 py-4 text-textPrimary">{item.sortOrder}</td>
                            <td className="px-5 py-4"><StatusBadge isActive={item.isActive} /></td>
                            <td className="px-5 py-4">
                                <RowActions
                                    onEdit={() => openEdit(item)}
                                    onToggle={() => void toggle(item)}
                                    isActive={item.isActive}
                                />
                            </td>
                        </tr>
                    ))
                )}
            </TableShell>

            {isModalOpen ? (
                <MasterDataModal
                    title={editing ? "Edit Sales Channel Type" : "New Sales Channel Type"}
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
                                        code: event.target.value as SalesChannelTypeCode,
                                    }))
                                }
                                required
                                disabled={!!editing}
                                className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar disabled:cursor-not-allowed disabled:bg-cardMuted disabled:text-textSecondary"
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
                            label="Label"
                            value={form.label}
                            onChange={(value) =>
                                setForm((current) => ({ ...current, label: value }))
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

                        <ActiveCheckbox
                            value={form.isActive}
                            onChange={(value) =>
                                setForm((current) => ({ ...current, isActive: value }))
                            }
                        />

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : editing
                                    ? "Save Sales Channel Type"
                                    : "Create Sales Channel Type"}
                        </button>
                    </form>
                </MasterDataModal>
            ) : null}
        </div>
    );
}

function ListToolbar({ search, onSearch }: { search: string; onSearch: (value: string) => void }) {
    return (
        <section className="rounded-2xl border border-borderSoft bg-white p-5 shadow-sm">
            <input
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Search sales channel types"
                className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
            />
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
                <div className="p-8 text-sm text-textSecondary">Loading...</div>
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
                                <th className="px-5 py-4 font-medium">Label</th>
                                <th className="px-5 py-4 font-medium">Code</th>
                                <th className="px-5 py-4 font-medium">Description</th>
                                <th className="px-5 py-4 font-medium">Sort Order</th>
                                <th className="px-5 py-4 font-medium">Status</th>
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
    isActive,
}: {
    onEdit: () => void;
    onToggle: () => void;
    isActive: boolean;
}) {
    return (
        <div className="flex gap-2">
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
        </div>
    );
}

function ActiveCheckbox({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
    return (
        <label className="flex items-center gap-3 text-sm font-medium text-textPrimary">
            <input
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
            />
            Active
        </label>
    );
}

function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error) return error.message;
    return fallback;
}
