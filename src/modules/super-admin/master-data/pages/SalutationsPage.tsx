"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
    createSalutation,
    getSalutations,
    updateSalutation,
} from "@/modules/super-admin/master-data/api/masterDataApi";
import MasterDataModal from "@/modules/super-admin/master-data/components/MasterDataModal";
import {
    MasterDataHeader,
    StatusBadge,
    TextField,
} from "@/modules/super-admin/master-data/components/MasterDataShared";
import type { Salutation } from "@/modules/super-admin/master-data/types/masterData";

const emptyForm = { id: "", label: "", isActive: true };

export default function SalutationsPage() {
    const [items, setItems] = useState<Salutation[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState<Salutation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return items;
        return items.filter((item) =>
            [item.id, item.label, item.isActive ? "active" : "inactive"].some((field) =>
                field.toLowerCase().includes(value),
            ),
        );
    }, [items, search]);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            setItems(await getSalutations());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load salutations.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setIsModalOpen(true);
    }

    function openEdit(item: Salutation) {
        setEditing(item);
        setForm({ id: item.id, label: item.label, isActive: item.isActive });
        setIsModalOpen(true);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();
        const saved = editing
            ? await updateSalutation(editing.id, {
                  label: form.label,
                  isActive: form.isActive,
              })
            : await createSalutation(form);
        setItems((current) =>
            editing
                ? current.map((item) => (item.id === saved.id ? saved : item))
                : [saved, ...current],
        );
        setIsModalOpen(false);
    }

    async function toggle(item: Salutation) {
        const updated = await updateSalutation(item.id, { isActive: !item.isActive });
        setItems((current) =>
            current.map((row) => (row.id === updated.id ? updated : row)),
        );
    }

    return (
        <div className="space-y-6">
            <MasterDataHeader
                title="Salutations"
                description="Manage prefixes used in Brand Owner onboarding."
                actionLabel="New Salutation"
                onAction={openCreate}
            />
            <ListToolbar search={search} onSearch={setSearch} />
            <TableShell loading={loading} error={error} onRetry={load}>
                {filtered.map((item) => (
                    <tr key={item.id} className="border-b border-borderSoft last:border-b-0">
                        <td className="px-5 py-4 font-semibold text-textPrimary">{item.id}</td>
                        <td className="px-5 py-4 text-textPrimary">{item.label}</td>
                        <td className="px-5 py-4"><StatusBadge isActive={item.isActive} /></td>
                        <td className="px-5 py-4">
                            <RowActions onEdit={() => openEdit(item)} onToggle={() => toggle(item)} isActive={item.isActive} />
                        </td>
                    </tr>
                ))}
            </TableShell>
            {isModalOpen ? (
                <MasterDataModal
                    title={editing ? "Edit Salutation" : "New Salutation"}
                    onClose={() => setIsModalOpen(false)}
                >
                    <form onSubmit={submit} className="space-y-4">
                        <TextField
                            label="ID"
                            value={form.id}
                            onChange={(value) => setForm((current) => ({ ...current, id: value }))}
                            required
                        />
                        <TextField
                            label="Label"
                            value={form.label}
                            onChange={(value) => setForm((current) => ({ ...current, label: value }))}
                            required
                        />
                        <ActiveCheckbox value={form.isActive} onChange={(value) => setForm((current) => ({ ...current, isActive: value }))} />
                        <SubmitButton label={editing ? "Save Salutation" : "Create Salutation"} />
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
                placeholder="Search records"
                className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
            />
        </section>
    );
}

function TableShell({ loading, error, onRetry, children }: { loading: boolean; error: string | null; onRetry: () => void; children: ReactNode }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-borderSoft bg-white shadow-sm">
            {loading ? <div className="p-8 text-sm text-textSecondary">Loading...</div> : error ? (
                <div className="space-y-4 p-8">
                    <p className="text-sm font-medium text-red-600">{error}</p>
                    <button type="button" onClick={onRetry} className="rounded-2xl bg-sidebar px-4 py-2 text-sm font-medium text-white">Retry</button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-borderSoft bg-cardMuted text-left text-textSecondary">
                            <tr>
                                <th className="px-5 py-4 font-medium">ID</th>
                                <th className="px-5 py-4 font-medium">Label</th>
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

function RowActions({ onEdit, onToggle, isActive }: { onEdit: () => void; onToggle: () => void; isActive: boolean }) {
    return (
        <div className="flex gap-2">
            <button type="button" onClick={onEdit} className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textPrimary hover:bg-cardMuted">Edit</button>
            <button type="button" onClick={onToggle} className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textSecondary hover:bg-cardMuted">{isActive ? "Deactivate" : "Activate"}</button>
        </div>
    );
}

function ActiveCheckbox({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
    return (
        <label className="flex items-center gap-3 text-sm font-medium text-textPrimary">
            <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
            Active
        </label>
    );
}

function SubmitButton({ label }: { label: string }) {
    return <button type="submit" className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm">{label}</button>;
}
