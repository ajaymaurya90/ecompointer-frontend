"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
    getActiveCountries,
    getActiveDistrictsByState,
    getActivePincodesByDistrict,
    getActiveStatesByCountry,
} from "@/modules/brand-owners/api/brandOwnersApi";
import type {
    CountryOption,
    DistrictOption,
    PincodeOption,
    StateOption,
} from "@/modules/brand-owners/types/brandOwner";
import type {
    CodServiceAreaPayload,
    ServiceAreaLevel,
} from "@/modules/settings/types/paymentGateway";

type Props = {
    isSaving: boolean;
    error: string | null;
    onClose: () => void;
    onSubmit: (payload: CodServiceAreaPayload) => Promise<void>;
};

type FormState = {
    level: ServiceAreaLevel;
    countryId: string;
    stateId: string;
    districtId: string;
    pincodeId: string;
};

const initialForm: FormState = {
    level: "COUNTRY",
    countryId: "",
    stateId: "",
    districtId: "",
    pincodeId: "",
};

export default function CodServiceAreaModal({
    isSaving,
    error,
    onClose,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<FormState>(initialForm);
    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [states, setStates] = useState<StateOption[]>([]);
    const [districts, setDistricts] = useState<DistrictOption[]>([]);
    const [pincodes, setPincodes] = useState<PincodeOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const countryOptions = useMemo(
        () =>
            countries.map((country) => ({
                value: country.id,
                label: `${country.name} (${country.code})`,
            })),
        [countries],
    );
    const stateOptions = useMemo(
        () => states.map((state) => ({ value: state.id, label: state.name })),
        [states],
    );
    const districtOptions = useMemo(
        () =>
            districts.map((district) => ({
                value: district.id,
                label: district.name,
            })),
        [districts],
    );
    const pincodeOptions = useMemo(
        () =>
            pincodes.map((pincode) => ({
                value: pincode.id,
                label: pincode.code,
            })),
        [pincodes],
    );

    useEffect(() => {
        async function loadCountries() {
            try {
                setLoading(true);
                const rows = await getActiveCountries();
                setCountries(rows);
                setForm((current) => ({
                    ...current,
                    countryId: rows[0]?.id || "",
                }));
            } catch (err) {
                setLocalError(
                    err instanceof Error ? err.message : "Failed to load countries.",
                );
            } finally {
                setLoading(false);
            }
        }

        void loadCountries();
    }, []);

    useEffect(() => {
        if (!form.countryId) {
            setStates([]);
            return;
        }

        async function loadStates() {
            const rows = await getActiveStatesByCountry(form.countryId);
            setStates(rows);
        }

        void loadStates().catch(() => setLocalError("Failed to load states."));
    }, [form.countryId]);

    useEffect(() => {
        if (!form.stateId) {
            setDistricts([]);
            return;
        }

        async function loadDistricts() {
            const rows = await getActiveDistrictsByState(form.stateId);
            setDistricts(rows);
        }

        void loadDistricts().catch(() => setLocalError("Failed to load districts."));
    }, [form.stateId]);

    useEffect(() => {
        if (!form.districtId) {
            setPincodes([]);
            return;
        }

        async function loadPincodes() {
            const rows = await getActivePincodesByDistrict(form.districtId);
            setPincodes(rows);
        }

        void loadPincodes().catch(() => setLocalError("Failed to load pincodes."));
    }, [form.districtId]);

    function setLevel(level: ServiceAreaLevel) {
        setForm((current) => ({
            ...current,
            level,
            stateId: "",
            districtId: "",
            pincodeId: "",
        }));
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLocalError(null);

        if (form.level === "COUNTRY") {
            if (!form.countryId) return setLocalError("Country is required.");
            await onSubmit({ level: form.level, countryId: form.countryId, isActive: true });
            return;
        }

        if (form.level === "STATE") {
            if (!form.stateId) return setLocalError("State is required.");
            await onSubmit({ level: form.level, stateId: form.stateId, isActive: true });
            return;
        }

        if (form.level === "DISTRICT") {
            if (!form.districtId) return setLocalError("District is required.");
            await onSubmit({ level: form.level, districtId: form.districtId, isActive: true });
            return;
        }

        if (!form.pincodeId) return setLocalError("Pincode is required.");
        await onSubmit({ level: form.level, pincodeId: form.pincodeId, isActive: true });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-2xl rounded-3xl border border-borderSoft bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Add COD Area
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Limit cash on delivery to a country, state, district, or pincode.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-2xl border border-borderSoft px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                        Close
                    </button>
                </div>

                {error || localError ? (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error || localError}
                    </div>
                ) : null}

                <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SelectField
                        label="Level"
                        value={form.level}
                        onChange={(value) => setLevel(value as ServiceAreaLevel)}
                        options={[
                            { value: "COUNTRY", label: "Country" },
                            { value: "STATE", label: "State" },
                            { value: "DISTRICT", label: "District" },
                            { value: "PINCODE", label: "Pincode" },
                        ]}
                    />
                    <SelectField
                        label="Country"
                        value={form.countryId}
                        onChange={(countryId) =>
                            setForm({
                                ...form,
                                countryId,
                                stateId: "",
                                districtId: "",
                                pincodeId: "",
                            })
                        }
                        options={countryOptions}
                        disabled={loading}
                    />
                    {form.level !== "COUNTRY" ? (
                        <SelectField
                            label="State"
                            value={form.stateId}
                            onChange={(stateId) =>
                                setForm({
                                    ...form,
                                    stateId,
                                    districtId: "",
                                    pincodeId: "",
                                })
                            }
                            options={stateOptions}
                            disabled={!form.countryId || loading}
                        />
                    ) : null}
                    {form.level === "DISTRICT" || form.level === "PINCODE" ? (
                        <SelectField
                            label="District"
                            value={form.districtId}
                            onChange={(districtId) =>
                                setForm({ ...form, districtId, pincodeId: "" })
                            }
                            options={districtOptions}
                            disabled={!form.stateId || loading}
                        />
                    ) : null}
                    {form.level === "PINCODE" ? (
                        <SelectField
                            label="Pincode"
                            value={form.pincodeId}
                            onChange={(pincodeId) => setForm({ ...form, pincodeId })}
                            options={pincodeOptions}
                            disabled={!form.districtId || loading}
                        />
                    ) : null}

                    <div className="flex justify-end gap-3 md:col-span-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="rounded-2xl border border-borderSoft px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || loading}
                            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Add Area"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SelectField({
    label,
    value,
    onChange,
    options,
    disabled = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    disabled?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-slate-900">{label}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                required
                className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sidebar disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
