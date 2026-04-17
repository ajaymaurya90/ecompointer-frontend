"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
    createBrandOwner,
    getActiveCountries,
    getActiveDistrictsByState,
    getActiveSalutations,
    getActiveStatesByCountry,
} from "@/modules/super-admin/api/superAdminApi";
import type {
    CreateBrandOwnerPayload,
    MasterOption,
    SalutationOption,
} from "@/modules/super-admin/types/superAdmin";

const initialForm: CreateBrandOwnerPayload = {
    salutationId: "mr",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    countryId: "",
    stateId: "",
    districtId: "",
    addressLine1: "",
    addressLine2: "",
};

export default function CreateBrandOwnerPage() {
    const router = useRouter();
    const [form, setForm] = useState<CreateBrandOwnerPayload>(initialForm);
    const [salutations, setSalutations] = useState<SalutationOption[]>([]);
    const [countries, setCountries] = useState<MasterOption[]>([]);
    const [states, setStates] = useState<MasterOption[]>([]);
    const [districts, setDistricts] = useState<MasterOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadInitialData() {
            try {
                setLoading(true);
                setError(null);
                const [salutationOptions, countryOptions] = await Promise.all([
                    getActiveSalutations(),
                    getActiveCountries(),
                ]);
                const defaultCountry =
                    countryOptions.find((item) =>
                        ["IN", "IND"].includes((item.code || "").toUpperCase()),
                    ) ||
                    countryOptions.find((item) =>
                        (item.name || "").toLowerCase().includes("india"),
                    ) ||
                    countryOptions[0];

                setSalutations(salutationOptions);
                setCountries(countryOptions);
                setForm((current) => ({
                    ...current,
                    salutationId:
                        salutationOptions.find((item) => item.id === "mr")?.id ||
                        salutationOptions[0]?.id ||
                        "mr",
                    countryId: defaultCountry?.id || "",
                }));
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Onboarding data could not be loaded.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadInitialData();
    }, []);

    useEffect(() => {
        async function loadStates() {
            if (!form.countryId) {
                setStates([]);
                return;
            }

            const stateOptions = await getActiveStatesByCountry(form.countryId);
            setStates(stateOptions);
        }

        loadStates();
    }, [form.countryId]);

    useEffect(() => {
        async function loadDistricts() {
            if (!form.stateId) {
                setDistricts([]);
                return;
            }

            const districtOptions = await getActiveDistrictsByState(form.stateId);
            setDistricts(districtOptions);
        }

        loadDistricts();
    }, [form.stateId]);

    function updateField<K extends keyof CreateBrandOwnerPayload>(
        key: K,
        value: CreateBrandOwnerPayload[K],
    ) {
        setForm((current) => {
            const next = { ...current, [key]: value };

            if (key === "countryId") {
                next.stateId = "";
                next.districtId = "";
            }

            if (key === "stateId") {
                next.districtId = "";
            }

            return next;
        });
    }

    function validateForm() {
        const required: Array<keyof CreateBrandOwnerPayload> = [
            "salutationId",
            "firstName",
            "lastName",
            "phone",
            "email",
            "countryId",
            "stateId",
            "districtId",
            "addressLine1",
        ];

        return required.every((field) => String(form[field] || "").trim());
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validateForm()) {
            setError("Please fill all mandatory fields.");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            const created = await createBrandOwner({
                ...form,
                addressLine2: form.addressLine2?.trim() || undefined,
            });
            router.replace(`/admin/brand-owners/${created.id}`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Brand Owner account could not be created.",
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-textPrimary">
                            New Brand Owner
                        </h2>
                        <p className="mt-1 text-sm text-textSecondary">
                            Create a pending tenant account for verification.
                        </p>
                    </div>
                    <Link
                        href="/admin/brand-owners"
                        className="rounded-2xl border border-borderSoft px-4 py-2 text-sm font-medium text-textPrimary hover:bg-cardMuted"
                    >
                        Back to Brand Owners
                    </Link>
                </div>
            </section>

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm"
            >
                {error ? (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                ) : null}

                {loading ? (
                    <div className="text-sm text-textSecondary">
                        Loading onboarding fields...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <SelectField
                            label="Salutation"
                            value={form.salutationId}
                            onChange={(value) => updateField("salutationId", value)}
                            options={salutations.map((item) => ({
                                id: item.id,
                                label: item.label,
                            }))}
                            required
                        />
                        <InputField
                            label="First Name"
                            value={form.firstName}
                            onChange={(value) => updateField("firstName", value)}
                            required
                        />
                        <InputField
                            label="Last Name"
                            value={form.lastName}
                            onChange={(value) => updateField("lastName", value)}
                            required
                        />
                        <InputField
                            label="Phone"
                            value={form.phone}
                            onChange={(value) => updateField("phone", value)}
                            required
                        />
                        <InputField
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(value) => updateField("email", value)}
                            required
                        />
                        <SelectField
                            label="Country"
                            value={form.countryId}
                            onChange={(value) => updateField("countryId", value)}
                            options={countries.map((item) => ({
                                id: item.id,
                                label: item.name || item.code || item.id,
                            }))}
                            required
                        />
                        <SelectField
                            label="State"
                            value={form.stateId}
                            onChange={(value) => updateField("stateId", value)}
                            options={states.map((item) => ({
                                id: item.id,
                                label: item.name || item.code || item.id,
                            }))}
                            required
                        />
                        <SelectField
                            label="District"
                            value={form.districtId}
                            onChange={(value) => updateField("districtId", value)}
                            options={districts.map((item) => ({
                                id: item.id,
                                label: item.name || item.id,
                            }))}
                            required
                        />
                        <InputField
                            label="Address Line 1"
                            value={form.addressLine1}
                            onChange={(value) => updateField("addressLine1", value)}
                            required
                        />
                        <InputField
                            label="Address Line 2"
                            value={form.addressLine2 || ""}
                            onChange={(value) => updateField("addressLine2", value)}
                        />
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || saving}
                        className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Creating..." : "Create Pending Account"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function InputField({
    label,
    value,
    onChange,
    type = "text",
    required = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-textPrimary">
                {label}
                {required ? " *" : ""}
            </span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                required={required}
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
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ id: string; label: string }>;
    required?: boolean;
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
                className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                required={required}
            >
                <option value="">Select {label}</option>
                {options.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
