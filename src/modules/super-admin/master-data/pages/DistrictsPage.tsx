"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    createDistrict,
    getCountries,
    getDistricts,
    getStates,
    updateDistrict,
} from "@/modules/super-admin/master-data/api/masterDataApi";
import MasterDataModal from "@/modules/super-admin/master-data/components/MasterDataModal";
import {
    MasterDataHeader,
    SelectField,
    StatusBadge,
    TextField,
} from "@/modules/super-admin/master-data/components/MasterDataShared";
import type { Country, District, State } from "@/modules/super-admin/master-data/types/masterData";

const emptyForm = { countryId: "", stateId: "", name: "", isActive: true };

export default function DistrictsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [items, setItems] = useState<District[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [countryFilter, setCountryFilter] = useState(
        searchParams.get("countryId") ?? "",
    );
    const [stateFilter, setStateFilter] = useState(searchParams.get("stateId") ?? "");
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(emptyForm);
    const [editing, setEditing] = useState<District | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const countryOptions = countries.map((item) => ({ id: item.id, label: `${item.name} (${item.code})` }));
    const visibleStates = states.filter((state) => !countryFilter || state.countryId === countryFilter);
    const modalStates = states.filter((state) => !form.countryId || state.countryId === form.countryId);
    const stateOptions = visibleStates.map((item) => ({ id: item.id, label: item.name }));
    const modalStateOptions = modalStates.map((item) => ({ id: item.id, label: item.name }));
    const selectedState = states.find((item) => item.id === stateFilter) ?? null;
    const selectedCountry =
        countries.find((item) => item.id === (selectedState?.countryId || countryFilter)) ??
        null;

    const filtered = useMemo(() => {
        const value = search.trim().toLowerCase();
        return items.filter((item) => {
            const matchesCountry = !countryFilter || item.state?.country?.id === countryFilter;
            const matchesState = !stateFilter || item.stateId === stateFilter;
            const matchesSearch =
                !value ||
                [item.name, item.state?.name, item.state?.country?.name]
                    .filter(Boolean)
                    .some((field) => String(field).toLowerCase().includes(value));
            return matchesCountry && matchesState && matchesSearch;
        });
    }, [items, search, countryFilter, stateFilter]);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            const [districtRows, countryRows, stateRows] = await Promise.all([
                getDistricts(),
                getCountries(),
                getStates(),
            ]);
            setItems(districtRows);
            setCountries(countryRows);
            setStates(stateRows);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load districts.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        const nextStateId = searchParams.get("stateId") ?? "";
        const nextCountryId = searchParams.get("countryId") ?? "";

        if (nextStateId !== stateFilter) {
            setStateFilter(nextStateId);
        }

        if (nextCountryId !== countryFilter) {
            setCountryFilter(nextCountryId);
        }
    }, [countryFilter, searchParams, stateFilter]);

    useEffect(() => {
        if (!stateFilter) {
            return;
        }

        const state = states.find((item) => item.id === stateFilter);
        if (state && state.countryId !== countryFilter) {
            setCountryFilter(state.countryId);
        }
    }, [countryFilter, stateFilter, states]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (countryFilter) {
            params.set("countryId", countryFilter);
        } else {
            params.delete("countryId");
        }

        if (stateFilter) {
            params.set("stateId", stateFilter);
        } else {
            params.delete("stateId");
        }

        const nextQuery = params.toString();
        const currentQuery = searchParams.toString();

        if (nextQuery !== currentQuery) {
            router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
                scroll: false,
            });
        }
    }, [countryFilter, pathname, router, searchParams, stateFilter]);

    function openCreate() {
        setEditing(null);
        const firstState = states.find((state) => !countryFilter || state.countryId === countryFilter);
        setForm({
            ...emptyForm,
            countryId: countryFilter || firstState?.countryId || countries[0]?.id || "",
            stateId: stateFilter || firstState?.id || "",
        });
        setIsModalOpen(true);
    }

    function openEdit(item: District) {
        setEditing(item);
        setForm({
            countryId: item.state?.country?.id || item.state?.countryId || "",
            stateId: item.stateId,
            name: item.name,
            isActive: item.isActive,
        });
        setIsModalOpen(true);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();
        const payload = {
            stateId: form.stateId,
            name: form.name,
            isActive: form.isActive,
        };
        const saved = editing
            ? await updateDistrict(editing.id, payload)
            : await createDistrict(payload);
        setItems((current) =>
            editing
                ? current.map((item) => (item.id === saved.id ? saved : item))
                : [saved, ...current],
        );
        setIsModalOpen(false);
    }

    async function toggle(item: District) {
        const updated = await updateDistrict(item.id, { isActive: !item.isActive });
        setItems((current) =>
            current.map((row) => (row.id === updated.id ? updated : row)),
        );
    }

    function setModalCountry(countryId: string) {
        const firstState = states.find((state) => state.countryId === countryId);
        setForm((current) => ({
            ...current,
            countryId,
            stateId: firstState?.id || "",
        }));
    }

    return (
        <div className="space-y-6">
            <MasterDataHeader
                title="Districts"
                description="Manage districts and their state linkage."
                actionLabel="New District"
                onAction={openCreate}
            />
            {selectedState ? (
                <HierarchyContext
                    label="Showing districts for"
                    value={selectedState.name}
                    helper={selectedCountry ? `Country: ${selectedCountry.name}` : undefined}
                    backHref={
                        selectedCountry
                            ? `/admin/master-data/states?countryId=${selectedCountry.id}`
                            : "/admin/master-data/states"
                    }
                    backLabel="Back to States"
                    clearHref="/admin/master-data/districts"
                    clearLabel="View all districts"
                />
            ) : null}
            <section className="grid grid-cols-1 gap-4 rounded-2xl border border-borderSoft bg-white p-5 shadow-sm lg:grid-cols-3">
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search districts" className="rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar" />
                <select value={countryFilter} onChange={(event) => { setCountryFilter(event.target.value); setStateFilter(""); }} className="rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar">
                    <option value="">All countries</option>
                    {countryOptions.map((country) => <option key={country.id} value={country.id}>{country.label}</option>)}
                </select>
                <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} className="rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar">
                    <option value="">All states</option>
                    {stateOptions.map((state) => <option key={state.id} value={state.id}>{state.label}</option>)}
                </select>
            </section>
            <section className="overflow-hidden rounded-2xl border border-borderSoft bg-white shadow-sm">
                {loading ? <div className="p-8 text-sm text-textSecondary">Loading districts...</div> : error ? <ErrorBox error={error} onRetry={load} /> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-borderSoft bg-cardMuted text-left text-textSecondary">
                                <tr>
                                    <th className="px-5 py-4 font-medium">District</th>
                                    <th className="px-5 py-4 font-medium">State</th>
                                    <th className="px-5 py-4 font-medium">Country</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.id} className="border-b border-borderSoft last:border-b-0">
                                        <td className="px-5 py-4"><Link href={`/admin/master-data/pincodes?countryId=${item.state?.country?.id || item.state?.countryId || countryFilter}&stateId=${item.stateId}&districtId=${item.id}`} className="font-semibold text-textPrimary transition hover:text-sidebar">{item.name}</Link></td>
                                        <td className="px-5 py-4 text-textPrimary">{item.state?.name || "-"}</td>
                                        <td className="px-5 py-4 text-textPrimary">{item.state?.country?.name || "-"}</td>
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
                <MasterDataModal title={editing ? "Edit District" : "New District"} onClose={() => setIsModalOpen(false)}>
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <SelectField label="Country" value={form.countryId} onChange={setModalCountry} options={countryOptions} required />
                        <SelectField label="State" value={form.stateId} onChange={(value) => setForm((current) => ({ ...current, stateId: value }))} options={modalStateOptions} required />
                        <TextField label="District Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
                        <ActiveCheckbox value={form.isActive} onChange={(value) => setForm((current) => ({ ...current, isActive: value }))} />
                        <div className="md:col-span-2"><SubmitButton label={editing ? "Save District" : "Create District"} /></div>
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
function HierarchyContext({ label, value, helper, backHref, backLabel, clearHref, clearLabel }: { label: string; value: string; helper?: string; backHref: string; backLabel: string; clearHref: string; clearLabel: string }) { return <section className="flex flex-col gap-3 rounded-2xl border border-borderSoft bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"><div><div className="text-sm text-textSecondary">{label}</div><div className="mt-1 text-lg font-semibold text-textPrimary">{value}</div>{helper ? <div className="mt-1 text-sm text-textSecondary">{helper}</div> : null}</div><div className="flex flex-wrap gap-2"><Link href={backHref} className="rounded-2xl border border-borderSoft px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-cardMuted">{backLabel}</Link><Link href={clearHref} className="rounded-2xl border border-borderSoft px-4 py-2 text-sm font-medium text-textSecondary transition hover:bg-cardMuted">{clearLabel}</Link></div></section>; }
