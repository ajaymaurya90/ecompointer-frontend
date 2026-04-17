"use client";

import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import {
    createPincode,
    getCountries,
    getDistricts,
    getPincodes,
    getStates,
    updatePincode,
} from "@/modules/super-admin/master-data/api/masterDataApi";
import {
    MasterDataHeader,
    StatusBadge,
} from "@/modules/super-admin/master-data/components/MasterDataShared";
import PincodeFormModal from "@/modules/super-admin/master-data/pincodes/components/PincodeFormModal";
import type {
    Country,
    District,
    MasterStatusFilter,
    Pincode,
    State,
} from "@/modules/super-admin/master-data/types/masterData";

const pageSize = 10;

export default function PincodesPage() {
    const [items, setItems] = useState<Pincode[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [countryFilter, setCountryFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [districtFilter, setDistrictFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<MasterStatusFilter>("all");
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState<Pincode | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const countryOptions = useMemo(
        () => countries.map((country) => ({ id: country.id, label: `${country.name} (${country.code})` })),
        [countries],
    );
    const stateOptions = useMemo(
        () =>
            states
                .filter((state) => !countryFilter || state.countryId === countryFilter)
                .map((state) => ({ id: state.id, label: state.name })),
        [states, countryFilter],
    );
    const districtOptions = useMemo(
        () =>
            districts
                .filter((district) => !stateFilter || district.stateId === stateFilter)
                .map((district) => ({ id: district.id, label: district.name })),
        [districts, stateFilter],
    );

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

    async function loadMasters() {
        const [countryRows, stateRows, districtRows] = await Promise.all([
            getCountries(),
            getStates(),
            getDistricts(),
        ]);
        setCountries(countryRows);
        setStates(stateRows);
        setDistricts(districtRows);
    }

    async function loadPincodes() {
        try {
            setLoading(true);
            setError(null);
            const rows = await getPincodes({
                search: search.trim() || undefined,
                countryId: countryFilter || undefined,
                stateId: stateFilter || undefined,
                districtId: districtFilter || undefined,
                isActive:
                    statusFilter === "all" ? undefined : statusFilter === "active",
            });
            setItems(rows);
            setPage(1);
        } catch (err) {
            setError(getErrorMessage(err, "Could not load pincodes."));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function init() {
            try {
                setLoading(true);
                setError(null);
                await Promise.all([loadMasters(), loadPincodes()]);
            } catch (err) {
                setError(getErrorMessage(err, "Could not load pincode data."));
                setLoading(false);
            }
        }

        void init();
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadPincodes();
        }, 250);

        return () => window.clearTimeout(timer);
    }, [countryFilter, districtFilter, search, stateFilter, statusFilter]);

    function openCreate() {
        setEditing(null);
        setFormError(null);
        setIsModalOpen(true);
    }

    function openEdit(item: Pincode) {
        setEditing(item);
        setFormError(null);
        setIsModalOpen(true);
    }

    function setCountry(value: string) {
        setCountryFilter(value);
        setStateFilter("");
        setDistrictFilter("");
    }

    function setState(value: string) {
        setStateFilter(value);
        setDistrictFilter("");
    }

    async function submit(form: {
        code: string;
        districtId: string;
        isActive: boolean;
    }) {
        if (!form.code.trim()) {
            setFormError("Pincode code is required.");
            return;
        }

        if (!form.districtId) {
            setFormError("District is required.");
            return;
        }

        try {
            setSubmitting(true);
            setFormError(null);
            setSuccessMessage(null);

            if (editing) {
                await updatePincode(editing.id, {
                    code: form.code,
                    districtId: form.districtId,
                    isActive: form.isActive,
                });
                setSuccessMessage("Pincode updated successfully.");
            } else {
                await createPincode({
                    code: form.code,
                    districtId: form.districtId,
                    isActive: form.isActive,
                });
                setSuccessMessage("Pincode created successfully.");
            }

            setIsModalOpen(false);
            await loadPincodes();
        } catch (err) {
            setFormError(getErrorMessage(err, "Failed to save pincode."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <MasterDataHeader
                title="Pincodes"
                description="Manage platform pincode masters linked to district, state, and country."
                actionLabel="New Pincode"
                onAction={openCreate}
            />

            {successMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {successMessage}
                </div>
            ) : null}

            <section className="grid grid-cols-1 gap-4 rounded-2xl border border-borderSoft bg-white p-5 shadow-sm xl:grid-cols-5">
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by pincode code"
                    className="rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                />
                <select
                    value={countryFilter}
                    onChange={(event) => setCountry(event.target.value)}
                    className="rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                >
                    <option value="">All countries</option>
                    {countryOptions.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.label}
                        </option>
                    ))}
                </select>
                <select
                    value={stateFilter}
                    onChange={(event) => setState(event.target.value)}
                    disabled={!countryFilter}
                    className="rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar disabled:cursor-not-allowed disabled:bg-cardMuted disabled:text-textSecondary"
                >
                    <option value="">All states</option>
                    {stateOptions.map((state) => (
                        <option key={state.id} value={state.id}>
                            {state.label}
                        </option>
                    ))}
                </select>
                <select
                    value={districtFilter}
                    onChange={(event) => setDistrictFilter(event.target.value)}
                    disabled={!stateFilter}
                    className="rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar disabled:cursor-not-allowed disabled:bg-cardMuted disabled:text-textSecondary"
                >
                    <option value="">All districts</option>
                    {districtOptions.map((district) => (
                        <option key={district.id} value={district.id}>
                            {district.label}
                        </option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as MasterStatusFilter)}
                    className="rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </section>

            <section className="overflow-hidden rounded-2xl border border-borderSoft bg-white shadow-sm">
                {loading ? (
                    <div className="p-8 text-sm text-textSecondary">Loading pincodes...</div>
                ) : error ? (
                    <ErrorBox error={error} onRetry={loadPincodes} />
                ) : items.length === 0 ? (
                    <div className="p-8 text-sm text-textSecondary">
                        No pincodes found for the selected filters.
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="border-b border-borderSoft bg-cardMuted text-left text-textSecondary">
                                    <tr>
                                        <th className="px-5 py-4 font-medium">Pincode Code</th>
                                        <th className="px-5 py-4 font-medium">District</th>
                                        <th className="px-5 py-4 font-medium">State</th>
                                        <th className="px-5 py-4 font-medium">Country</th>
                                        <th className="px-5 py-4 font-medium">Status</th>
                                        <th className="px-5 py-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedItems.map((item) => (
                                        <tr key={item.id} className="border-b border-borderSoft last:border-b-0">
                                            <td className="px-5 py-4 font-semibold text-textPrimary">
                                                {item.code}
                                            </td>
                                            <td className="px-5 py-4 text-textPrimary">
                                                {item.district?.name || "-"}
                                            </td>
                                            <td className="px-5 py-4 text-textPrimary">
                                                {item.district?.state?.name || "-"}
                                            </td>
                                            <td className="px-5 py-4 text-textPrimary">
                                                {item.district?.state?.country?.name || "-"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <StatusBadge isActive={item.isActive} />
                                            </td>
                                            <td className="px-5 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(item)}
                                                    className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textPrimary hover:bg-cardMuted"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col gap-3 border-t border-borderSoft px-5 py-4 text-sm text-textSecondary sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {(page - 1) * pageSize + 1}-
                                {Math.min(page * pageSize, items.length)} of {items.length}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                                    disabled={page <= 1}
                                    className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textPrimary hover:bg-cardMuted disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <span className="px-2 text-xs font-semibold text-textPrimary">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                                    disabled={page >= totalPages}
                                    className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textPrimary hover:bg-cardMuted disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {isModalOpen ? (
                <PincodeFormModal
                    pincode={editing}
                    countries={countries}
                    states={states}
                    districts={districts}
                    isSubmitting={submitting}
                    error={formError}
                    onClose={() => {
                        if (!submitting) {
                            setIsModalOpen(false);
                        }
                    }}
                    onSubmit={submit}
                />
            ) : null}
        </div>
    );
}

function ErrorBox({ error, onRetry }: { error: string; onRetry: () => void }) {
    return (
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
    );
}

function getErrorMessage(error: unknown, fallback: string) {
    const axiosError = error as AxiosError<{ message?: string | string[] }>;
    const message = axiosError.response?.data?.message;

    if (Array.isArray(message)) {
        return message.join(", ");
    }

    if (message) {
        return message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}
