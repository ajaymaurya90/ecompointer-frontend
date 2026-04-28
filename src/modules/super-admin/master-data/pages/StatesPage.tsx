"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    createState,
    getCountries,
    getStates,
    updateState,
} from "@/modules/super-admin/master-data/api/masterDataApi";
import MasterDataModal from "@/modules/super-admin/master-data/components/MasterDataModal";
import {
    MasterDataHeader,
    SelectField,
    StatusBadge,
    TextField,
} from "@/modules/super-admin/master-data/components/MasterDataShared";
import type { Country, State } from "@/modules/super-admin/master-data/types/masterData";

const emptyForm = { countryId: "", name: "", code: "", isActive: true };

export default function StatesPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [items, setItems] = useState<State[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [countryFilter, setCountryFilter] = useState(
        searchParams.get("countryId") ?? "",
    );
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState<State | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const countryOptions = countries.map((item) => ({
        id: item.id,
        label: `${item.name} (${item.code})`,
    }));
    const selectedCountry =
        countries.find((item) => item.id === countryFilter) ?? null;

    const filtered = useMemo(() => {
        const value = search.trim().toLowerCase();
        return items.filter((item) => {
            const matchesCountry = !countryFilter || item.countryId === countryFilter;
            const matchesSearch =
                !value ||
                [item.name, item.code, item.country?.name, item.country?.code]
                    .filter(Boolean)
                    .some((field) => String(field).toLowerCase().includes(value));
            return matchesCountry && matchesSearch;
        });
    }, [items, search, countryFilter]);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            const [stateRows, countryRows] = await Promise.all([
                getStates(),
                getCountries(),
            ]);
            setItems(stateRows);
            setCountries(countryRows);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load states.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        const nextCountryId = searchParams.get("countryId") ?? "";
        if (nextCountryId !== countryFilter) {
            setCountryFilter(nextCountryId);
        }
    }, [countryFilter, searchParams]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (countryFilter) {
            params.set("countryId", countryFilter);
        } else {
            params.delete("countryId");
        }

        const nextQuery = params.toString();
        const currentQuery = searchParams.toString();

        if (nextQuery !== currentQuery) {
            router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
                scroll: false,
            });
        }
    }, [countryFilter, pathname, router, searchParams]);

    function openCreate() {
        setEditing(null);
        setForm({ ...emptyForm, countryId: countryFilter || countries[0]?.id || "" });
        setIsModalOpen(true);
    }

    function openEdit(item: State) {
        setEditing(item);
        setForm({
            countryId: item.countryId,
            name: item.name,
            code: item.code || "",
            isActive: item.isActive,
        });
        setIsModalOpen(true);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();
        const payload = {
            countryId: form.countryId,
            name: form.name,
            code: form.code || undefined,
            isActive: form.isActive,
        };
        const saved = editing
            ? await updateState(editing.id, payload)
            : await createState(payload);
        setItems((current) =>
            editing
                ? current.map((item) => (item.id === saved.id ? saved : item))
                : [saved, ...current],
        );
        setIsModalOpen(false);
    }

    async function toggle(item: State) {
        const updated = await updateState(item.id, { isActive: !item.isActive });
        setItems((current) =>
            current.map((row) => (row.id === updated.id ? updated : row)),
        );
    }

    return (
        <div className="space-y-6">
            <MasterDataHeader
                title="States"
                description="Manage states and their country linkage."
                actionLabel="New State"
                onAction={openCreate}
            />
            {selectedCountry ? (
                <HierarchyContext
                    label="Showing states for"
                    value={selectedCountry.name}
                    backHref="/admin/master-data"
                    backLabel="Back to Master Data"
                    clearHref="/admin/master-data/states"
                    clearLabel="View all states"
                />
            ) : null}
            <section className="grid grid-cols-1 gap-4 rounded-2xl border border-borderSoft bg-white p-5 shadow-sm md:grid-cols-2">
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search states" className="rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar" />
                <select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)} className="rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar">
                    <option value="">All countries</option>
                    {countryOptions.map((country) => <option key={country.id} value={country.id}>{country.label}</option>)}
                </select>
            </section>
            <section className="overflow-hidden rounded-2xl border border-borderSoft bg-white shadow-sm">
                {loading ? <div className="p-8 text-sm text-textSecondary">Loading states...</div> : error ? <ErrorBox error={error} onRetry={load} /> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-borderSoft bg-cardMuted text-left text-textSecondary">
                                <tr>
                                    <th className="px-5 py-4 font-medium">State</th>
                                    <th className="px-5 py-4 font-medium">Country</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.id} className="border-b border-borderSoft last:border-b-0">
                                        <td className="px-5 py-4"><Link href={`/admin/master-data/districts?countryId=${item.countryId}&stateId=${item.id}`} className="font-semibold text-textPrimary transition hover:text-sidebar">{item.name}</Link><div className="mt-1 text-xs text-textSecondary">{item.code || "-"}</div></td>
                                        <td className="px-5 py-4 text-textPrimary">{item.country?.name || "-"}</td>
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
                <MasterDataModal title={editing ? "Edit State" : "New State"} onClose={() => setIsModalOpen(false)}>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <SelectField label="Country" value={form.countryId} onChange={(value) => setForm((current) => ({ ...current, countryId: value }))} options={countryOptions} required />
                        <TextField label="State Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
                        <TextField label="Code" value={form.code} onChange={(value) => setForm((current) => ({ ...current, code: value }))} />
                        <ActiveCheckbox value={form.isActive} onChange={(value) => setForm((current) => ({ ...current, isActive: value }))} />
                        <div className="md:col-span-2"><SubmitButton label={editing ? "Save State" : "Create State"} /></div>
                    </form>
                </MasterDataModal>
            ) : null}
        </div>
    );
}

function ErrorBox({ error, onRetry }: { error: string; onRetry: () => void }) { return <div className="space-y-4 p-8"><p className="text-sm font-medium text-red-600">{error}</p><button type="button" onClick={onRetry} className="rounded-2xl bg-sidebar px-4 py-2 text-sm font-medium text-white">Retry</button></div>; }
function Actions({ onEdit, onToggle, isActive }: { onEdit: () => void; onToggle: () => void; isActive: boolean }) { return <div className="flex gap-2"><button type="button" onClick={onEdit} className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textPrimary hover:bg-cardMuted">Edit</button><button type="button" onClick={onToggle} className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textSecondary hover:bg-cardMuted">{isActive ? "Deactivate" : "Activate"}</button></div>; }
function ActiveCheckbox({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center gap-3 text-sm font-medium text-textPrimary"><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />Active</label>; }
function SubmitButton({ label }: { label: string }) { return <button type="submit" className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm">{label}</button>; }
function HierarchyContext({ label, value, backHref, backLabel, clearHref, clearLabel }: { label: string; value: string; backHref: string; backLabel: string; clearHref: string; clearLabel: string }) { return <section className="flex flex-col gap-3 rounded-2xl border border-borderSoft bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"><div><div className="text-sm text-textSecondary">{label}</div><div className="mt-1 text-lg font-semibold text-textPrimary">{value}</div></div><div className="flex flex-wrap gap-2"><Link href={backHref} className="rounded-2xl border border-borderSoft px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-cardMuted">{backLabel}</Link><Link href={clearHref} className="rounded-2xl border border-borderSoft px-4 py-2 text-sm font-medium text-textSecondary transition hover:bg-cardMuted">{clearLabel}</Link></div></section>; }
