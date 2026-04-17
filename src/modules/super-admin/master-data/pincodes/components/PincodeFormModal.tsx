"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import MasterDataModal from "@/modules/super-admin/master-data/components/MasterDataModal";
import type {
    Country,
    District,
    Pincode,
    State,
} from "@/modules/super-admin/master-data/types/masterData";

type PincodeForm = {
    countryId: string;
    stateId: string;
    districtId: string;
    code: string;
    isActive: boolean;
};

type Props = {
    pincode: Pincode | null;
    countries: Country[];
    states: State[];
    districts: District[];
    isSubmitting: boolean;
    error: string | null;
    onClose: () => void;
    onSubmit: (form: PincodeForm) => Promise<void>;
};

const emptyForm: PincodeForm = {
    countryId: "",
    stateId: "",
    districtId: "",
    code: "",
    isActive: true,
};

export default function PincodeFormModal({
    pincode,
    countries,
    states,
    districts,
    isSubmitting,
    error,
    onClose,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<PincodeForm>(emptyForm);
    const countryOptions = useMemo(
        () => countries.map((country) => ({ id: country.id, label: `${country.name} (${country.code})` })),
        [countries],
    );
    const stateOptions = useMemo(
        () =>
            states
                .filter((state) => !form.countryId || state.countryId === form.countryId)
                .map((state) => ({ id: state.id, label: state.name })),
        [states, form.countryId],
    );
    const districtOptions = useMemo(
        () =>
            districts
                .filter((district) => !form.stateId || district.stateId === form.stateId)
                .map((district) => ({ id: district.id, label: district.name })),
        [districts, form.stateId],
    );

    useEffect(() => {
        if (pincode) {
            const state = pincode.district?.state;
            setForm({
                countryId: state?.countryId || state?.country?.id || "",
                stateId: pincode.district?.stateId || state?.id || "",
                districtId: pincode.districtId,
                code: pincode.code,
                isActive: pincode.isActive,
            });
            return;
        }

        const firstCountry = countries[0];
        const firstState = states.find((state) => state.countryId === firstCountry?.id);
        const firstDistrict = districts.find((district) => district.stateId === firstState?.id);
        setForm({
            ...emptyForm,
            countryId: firstCountry?.id || "",
            stateId: firstState?.id || "",
            districtId: firstDistrict?.id || "",
        });
    }, [countries, districts, pincode, states]);

    function setCountry(countryId: string) {
        setForm((current) => ({
            ...current,
            countryId,
            stateId: "",
            districtId: "",
        }));
    }

    function setState(stateId: string) {
        setForm((current) => ({
            ...current,
            stateId,
            districtId: "",
        }));
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await onSubmit({
            ...form,
            code: form.code.trim(),
        });
    }

    return (
        <MasterDataModal title={pincode ? "Edit Pincode" : "New Pincode"} onClose={onClose}>
            <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:col-span-2">
                        {error}
                    </div>
                ) : null}

                <SelectField
                    label="Country"
                    value={form.countryId}
                    onChange={setCountry}
                    options={countryOptions}
                    required
                />
                <SelectField
                    label="State"
                    value={form.stateId}
                    onChange={setState}
                    options={stateOptions}
                    required
                    disabled={!form.countryId}
                />
                <SelectField
                    label="District"
                    value={form.districtId}
                    onChange={(districtId) => setForm((current) => ({ ...current, districtId }))}
                    options={districtOptions}
                    required
                    disabled={!form.stateId}
                />
                <TextField
                    label="Pincode Code"
                    value={form.code}
                    onChange={(code) => setForm((current) => ({ ...current, code }))}
                    required
                />
                <label className="flex items-center gap-3 text-sm font-medium text-textPrimary">
                    <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                isActive: event.target.checked,
                            }))
                        }
                    />
                    Active
                </label>

                <div className="flex justify-end gap-3 md:col-span-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-2xl border border-borderSoft px-5 py-3 text-sm font-medium text-textPrimary hover:bg-cardMuted disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Saving..." : pincode ? "Save Pincode" : "Create Pincode"}
                    </button>
                </div>
            </form>
        </MasterDataModal>
    );
}

function TextField({
    label,
    value,
    onChange,
    required = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-textPrimary">
                {label}
                {required ? " *" : ""}
            </span>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                required={required}
                className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
            />
        </label>
    );
}

function SelectField({
    label,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ id: string; label: string }>;
    required?: boolean;
    disabled?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-textPrimary">
                {label}
                {required ? " *" : ""}
            </span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                required={required}
                disabled={disabled}
                className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar disabled:cursor-not-allowed disabled:bg-cardMuted disabled:text-textSecondary"
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
