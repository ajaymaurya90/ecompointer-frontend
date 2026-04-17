"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
    createCountry,
    getCountries,
    updateCountry,
} from "@/modules/super-admin/master-data/api/masterDataApi";
import MasterDataModal from "@/modules/super-admin/master-data/components/MasterDataModal";
import {
    MasterDataHeader,
    StatusBadge,
    TextField,
} from "@/modules/super-admin/master-data/components/MasterDataShared";
import type { Country } from "@/modules/super-admin/master-data/types/masterData";

const emptyForm = {
    code: "",
    name: "",
    phoneCode: "",
    currencyCode: "",
    isActive: true,
};

export default function CountriesPage() {
    const [items, setItems] = useState<Country[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState<Country | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return items;
        return items.filter((item) =>
            [item.code, item.name, item.phoneCode, item.currencyCode]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(value)),
        );
    }, [items, search]);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            setItems(await getCountries());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load countries.");
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

    function openEdit(item: Country) {
        setEditing(item);
        setForm({
            code: item.code,
            name: item.name,
            phoneCode: item.phoneCode || "",
            currencyCode: item.currencyCode || "",
            isActive: item.isActive,
        });
        setIsModalOpen(true);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();
        const payload = {
            code: form.code,
            name: form.name,
            phoneCode: form.phoneCode || undefined,
            currencyCode: form.currencyCode || undefined,
            isActive: form.isActive,
        };
        const saved = editing
            ? await updateCountry(editing.id, payload)
            : await createCountry(payload);
        setItems((current) =>
            editing
                ? current.map((item) => (item.id === saved.id ? saved : item))
                : [saved, ...current],
        );
        setIsModalOpen(false);
    }

    async function toggle(item: Country) {
        const updated = await updateCountry(item.id, { isActive: !item.isActive });
        setItems((current) =>
            current.map((row) => (row.id === updated.id ? updated : row)),
        );
    }

    return (
        <div className="space-y-6">
            <MasterDataHeader
                title="Countries"
                description="Manage countries available to platform onboarding and location forms."
                actionLabel="New Country"
                onAction={openCreate}
            />
            <SearchBox value={search} onChange={setSearch} />
            <section className="overflow-hidden rounded-2xl border border-borderSoft bg-white shadow-sm">
                {loading ? <EmptyText text="Loading countries..." /> : error ? <ErrorBox error={error} onRetry={load} /> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-borderSoft bg-cardMuted text-left text-textSecondary">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Country</th>
                                    <th className="px-5 py-4 font-medium">Phone Code</th>
                                    <th className="px-5 py-4 font-medium">Currency</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.id} className="border-b border-borderSoft last:border-b-0">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-textPrimary">{item.name}</div>
                                            <div className="mt-1 text-xs text-textSecondary">{item.code}</div>
                                        </td>
                                        <td className="px-5 py-4 text-textPrimary">{item.phoneCode || "-"}</td>
                                        <td className="px-5 py-4 text-textPrimary">{item.currencyCode || "-"}</td>
                                        <td className="px-5 py-4"><StatusBadge isActive={item.isActive} /></td>
                                        <td className="px-5 py-4"><Actions onEdit={() => openEdit(item)} onToggle={() => toggle(item)} isActive={item.isActive} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
            {isModalOpen ? (
                <MasterDataModal title={editing ? "Edit Country" : "New Country"} onClose={() => setIsModalOpen(false)}>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <TextField label="Code" value={form.code} onChange={(value) => setForm((current) => ({ ...current, code: value }))} required />
                        <TextField label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
                        <TextField label="Phone Code" value={form.phoneCode} onChange={(value) => setForm((current) => ({ ...current, phoneCode: value }))} />
                        <TextField label="Currency Code" value={form.currencyCode} onChange={(value) => setForm((current) => ({ ...current, currencyCode: value }))} />
                        <ActiveCheckbox value={form.isActive} onChange={(value) => setForm((current) => ({ ...current, isActive: value }))} />
                        <div className="md:col-span-2"><SubmitButton label={editing ? "Save Country" : "Create Country"} /></div>
                    </form>
                </MasterDataModal>
            ) : null}
        </div>
    );
}

function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return <section className="rounded-2xl border border-borderSoft bg-white p-5 shadow-sm"><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search countries" className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar" /></section>;
}
function EmptyText({ text }: { text: string }) { return <div className="p-8 text-sm text-textSecondary">{text}</div>; }
function ErrorBox({ error, onRetry }: { error: string; onRetry: () => void }) { return <div className="space-y-4 p-8"><p className="text-sm font-medium text-red-600">{error}</p><button type="button" onClick={onRetry} className="rounded-2xl bg-sidebar px-4 py-2 text-sm font-medium text-white">Retry</button></div>; }
function Actions({ onEdit, onToggle, isActive }: { onEdit: () => void; onToggle: () => void; isActive: boolean }) { return <div className="flex gap-2"><button type="button" onClick={onEdit} className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textPrimary hover:bg-cardMuted">Edit</button><button type="button" onClick={onToggle} className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textSecondary hover:bg-cardMuted">{isActive ? "Deactivate" : "Activate"}</button></div>; }
function ActiveCheckbox({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center gap-3 text-sm font-medium text-textPrimary"><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />Active</label>; }
function SubmitButton({ label }: { label: string }) { return <button type="submit" className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm">{label}</button>; }
