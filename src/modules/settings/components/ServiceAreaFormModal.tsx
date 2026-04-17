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
    CreateBrandOwnerSalesChannelServiceAreaPayload,
    DistrictOption,
    PincodeOption,
    ServiceAreaLevel,
    StateOption,
} from "@/modules/brand-owners/types/brandOwner";

type Props = {
    isOpen: boolean;
    isSubmitting: boolean;
    error: string | null;
    onClose: () => void;
    onSubmit: (payload: CreateBrandOwnerSalesChannelServiceAreaPayload) => Promise<void>;
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

export default function ServiceAreaFormModal({
    isOpen,
    isSubmitting,
    error,
    onClose,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<FormState>(initialForm);
    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [states, setStates] = useState<StateOption[]>([]);
    const [districts, setDistricts] = useState<DistrictOption[]>([]);
    const [pincodes, setPincodes] = useState<PincodeOption[]>([]);
    const [loadingMasters, setLoadingMasters] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const countryOptions = useMemo(
        () => countries.map((country) => ({ value: country.id, label: `${country.name} (${country.code})` })),
        [countries],
    );
    const stateOptions = useMemo(
        () => states.map((state) => ({ value: state.id, label: state.name })),
        [states],
    );
    const districtOptions = useMemo(
        () => districts.map((district) => ({ value: district.id, label: district.name })),
        [districts],
    );
    const pincodeOptions = useMemo(
        () => pincodes.map((pincode) => ({ value: pincode.id, label: pincode.code })),
        [pincodes],
    );

    useEffect(() => {
        if (!isOpen) return;

        async function loadCountries() {
            try {
                setLoadingMasters(true);
                setLocalError(null);
                const rows = await getActiveCountries();
                setCountries(rows);
                setForm({
                    ...initialForm,
                    countryId: rows[0]?.id || "",
                });
            } catch (err) {
                setLocalError(err instanceof Error ? err.message : "Failed to load countries.");
            } finally {
                setLoadingMasters(false);
            }
        }

        void loadCountries();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !form.countryId) {
            setStates([]);
            return;
        }

        async function loadStates() {
            try {
                setLoadingMasters(true);
                const rows = await getActiveStatesByCountry(form.countryId);
                setStates(rows);
            } catch (err) {
                setLocalError(err instanceof Error ? err.message : "Failed to load states.");
            } finally {
                setLoadingMasters(false);
            }
        }

        void loadStates();
    }, [form.countryId, isOpen]);

    useEffect(() => {
        if (!isOpen || !form.stateId) {
            setDistricts([]);
            return;
        }

        async function loadDistricts() {
            try {
                setLoadingMasters(true);
                const rows = await getActiveDistrictsByState(form.stateId);
                setDistricts(rows);
            } catch (err) {
                setLocalError(err instanceof Error ? err.message : "Failed to load districts.");
            } finally {
                setLoadingMasters(false);
            }
        }

        void loadDistricts();
    }, [form.stateId, isOpen]);

    useEffect(() => {
        if (!isOpen || !form.districtId) {
            setPincodes([]);
            return;
        }

        async function loadPincodes() {
            try {
                setLoadingMasters(true);
                const rows = await getActivePincodesByDistrict(form.districtId);
                setPincodes(rows);
            } catch (err) {
                setLocalError(err instanceof Error ? err.message : "Failed to load pincodes.");
            } finally {
                setLoadingMasters(false);
            }
        }

        void loadPincodes();
    }, [form.districtId, isOpen]);

    if (!isOpen) return null;

    function setLevel(level: ServiceAreaLevel) {
        setForm((current) => ({
            ...current,
            level,
            stateId: "",
            districtId: "",
            pincodeId: "",
        }));
        setDistricts([]);
        setPincodes([]);
    }

    function setCountry(countryId: string) {
        setForm((current) => ({
            ...current,
            countryId,
            stateId: "",
            districtId: "",
            pincodeId: "",
        }));
        setDistricts([]);
        setPincodes([]);
    }

    function setState(stateId: string) {
        setForm((current) => ({
            ...current,
            stateId,
            districtId: "",
            pincodeId: "",
        }));
        setPincodes([]);
    }

    function setDistrict(districtId: string) {
        setForm((current) => ({
            ...current,
            districtId,
            pincodeId: "",
        }));
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLocalError(null);

        if (form.level === "COUNTRY") {
            if (!form.countryId) {
                setLocalError("Country is required.");
                return;
            }
            await onSubmit({ level: form.level, countryId: form.countryId, isActive: true });
            return;
        }

        if (form.level === "STATE") {
            if (!form.stateId) {
                setLocalError("State is required.");
                return;
            }
            await onSubmit({ level: form.level, stateId: form.stateId, isActive: true });
            return;
        }

        if (form.level === "DISTRICT") {
            if (!form.districtId) {
                setLocalError("District is required.");
                return;
            }
            await onSubmit({ level: form.level, districtId: form.districtId, isActive: true });
            return;
        }

        if (!form.pincodeId) {
            setLocalError("Pincode is required.");
            return;
        }
        await onSubmit({ level: form.level, pincodeId: form.pincodeId, isActive: true });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Add Service Area</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Select the geography level this sales channel can serve.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-2xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Close
                    </button>
                </div>

                {(error || localError) ? (
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
                        onChange={setCountry}
                        options={countryOptions}
                        disabled={loadingMasters}
                    />
                    {form.level !== "COUNTRY" ? (
                        <SelectField
                            label="State"
                            value={form.stateId}
                            onChange={setState}
                            options={stateOptions}
                            disabled={!form.countryId || loadingMasters}
                        />
                    ) : null}
                    {form.level === "DISTRICT" || form.level === "PINCODE" ? (
                        <SelectField
                            label="District"
                            value={form.districtId}
                            onChange={setDistrict}
                            options={districtOptions}
                            disabled={!form.stateId || loadingMasters}
                        />
                    ) : null}
                    {form.level === "PINCODE" ? (
                        <SelectField
                            label="Pincode"
                            value={form.pincodeId}
                            onChange={(pincodeId) => setForm((current) => ({ ...current, pincodeId }))}
                            options={pincodeOptions}
                            disabled={!form.districtId || loadingMasters}
                        />
                    ) : null}

                    <div className="flex justify-end gap-3 md:col-span-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || loadingMasters}
                            className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Add Service Area"}
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
            <span className="text-sm font-medium text-gray-900">{label}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                required
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
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
