"use client";

import { useEffect, useMemo, useState } from "react";
import type {
    AddressType,
    CustomerAddress,
    CustomerAddressFormData,
} from "@/modules/customers/types/customer";
import {
    getActiveCountries,
    getActiveDistrictsByState,
    getActiveStatesByCountry,
    getMyBrandOwnerLocation,
} from "@/modules/brand-owners/api/brandOwnersApi";
import type {
    CountryOption,
    DistrictOption,
    StateOption,
} from "@/modules/brand-owners/types/brandOwner";

interface CustomerAddressFormProps {
    initialData?: Partial<CustomerAddress> | Partial<CustomerAddressFormData>;
    isSubmitting?: boolean;
    submitLabel?: string;
    onSubmit: (data: CustomerAddressFormData) => Promise<void> | void;
    onCancel?: () => void;
}

export default function CustomerAddressForm({
    initialData,
    isSubmitting = false,
    submitLabel = "Save Address",
    onSubmit,
    onCancel,
}: CustomerAddressFormProps) {
    const initialForm = useMemo<CustomerAddressFormData>(
        () => ({
            type: initialData?.type || "SHIPPING",
            fullName: initialData?.fullName || "",
            phone: initialData?.phone || "",
            addressLine1: initialData?.addressLine1 || "",
            addressLine2: initialData?.addressLine2 || "",
            landmark: initialData?.landmark || "",
            city: initialData?.city || "",
            postalCode: initialData?.postalCode || "",
            countryId: initialData?.countryId || "",
            stateId: initialData?.stateId || "",
            districtId: initialData?.districtId || "",
            isDefault: initialData?.isDefault || false,
        }),
        [initialData]
    );

    const [form, setForm] = useState<CustomerAddressFormData>(initialForm);

    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [states, setStates] = useState<StateOption[]>([]);
    const [districts, setDistricts] = useState<DistrictOption[]>([]);

    const [isLocationLoading, setIsLocationLoading] = useState(true);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        void loadLocationDefaults();
    }, []);

    async function loadLocationDefaults() {
        try {
            setIsLocationLoading(true);
            setLocationError(null);

            const [countriesData, ownerLocation] = await Promise.all([
                getActiveCountries(),
                getMyBrandOwnerLocation(),
            ]);

            setCountries(countriesData);

            const hasExistingGeoIds = Boolean(
                initialData?.countryId || initialData?.stateId || initialData?.districtId
            );

            const nextCountryId = hasExistingGeoIds
                ? initialData?.countryId || ""
                : ownerLocation?.countryId || "";

            const nextStateId = hasExistingGeoIds
                ? initialData?.stateId || ""
                : ownerLocation?.stateId || "";

            const nextDistrictId = hasExistingGeoIds
                ? initialData?.districtId || ""
                : ownerLocation?.districtId || "";

            if (nextCountryId) {
                const statesData = await getActiveStatesByCountry(nextCountryId);
                setStates(statesData);

                if (nextStateId) {
                    const districtsData = await getActiveDistrictsByState(nextStateId);
                    setDistricts(districtsData);
                } else {
                    setDistricts([]);
                }
            } else {
                setStates([]);
                setDistricts([]);
            }

            setForm((prev) => ({
                ...prev,
                countryId: prev.countryId || nextCountryId,
                stateId: prev.stateId || nextStateId,
                districtId: prev.districtId || nextDistrictId,
                city: prev.city || ownerLocation?.city || "",
            }));
        } catch (err) {
            setLocationError(
                err instanceof Error
                    ? err.message
                    : "Failed to load location options"
            );
        } finally {
            setIsLocationLoading(false);
        }
    }

    function updateField<K extends keyof CustomerAddressFormData>(
        field: K,
        value: CustomerAddressFormData[K]
    ) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    async function handleCountryChange(countryId: string) {
        setForm((prev) => ({
            ...prev,
            countryId,
            stateId: "",
            districtId: "",
        }));

        setStates([]);
        setDistricts([]);
        setLocationError(null);

        if (!countryId) {
            return;
        }

        try {
            const statesData = await getActiveStatesByCountry(countryId);
            setStates(statesData);
        } catch (err) {
            setLocationError(
                err instanceof Error ? err.message : "Failed to load states"
            );
        }
    }

    async function handleStateChange(stateId: string) {
        setForm((prev) => ({
            ...prev,
            stateId,
            districtId: "",
        }));

        setDistricts([]);
        setLocationError(null);

        if (!stateId) {
            return;
        }

        try {
            const districtsData = await getActiveDistrictsByState(stateId);
            setDistricts(districtsData);
        } catch (err) {
            setLocationError(
                err instanceof Error ? err.message : "Failed to load districts"
            );
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await onSubmit({
            ...form,
            countryId: form.countryId || undefined,
            stateId: form.stateId || undefined,
            districtId: form.districtId || undefined,
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5"
        >
            {locationError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {locationError}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Address Type
                    </label>
                    <select
                        value={form.type || "SHIPPING"}
                        onChange={(e) => updateField("type", e.target.value as AddressType)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="SHIPPING">Shipping</option>
                        <option value="BILLING">Billing</option>
                        <option value="BOTH">Both</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={form.fullName || ""}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        type="text"
                        value={form.phone || ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div className="md:col-span-2 xl:col-span-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Address Line 1
                    </label>
                    <input
                        type="text"
                        required
                        value={form.addressLine1}
                        onChange={(e) => updateField("addressLine1", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div className="md:col-span-2 xl:col-span-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Address Line 2
                    </label>
                    <input
                        type="text"
                        value={form.addressLine2 || ""}
                        onChange={(e) => updateField("addressLine2", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Landmark
                    </label>
                    <input
                        type="text"
                        value={form.landmark || ""}
                        onChange={(e) => updateField("landmark", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        City
                    </label>
                    <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Postal Code
                    </label>
                    <input
                        type="text"
                        value={form.postalCode || ""}
                        onChange={(e) => updateField("postalCode", e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Country
                    </label>
                    <select
                        value={form.countryId || ""}
                        onChange={(e) => void handleCountryChange(e.target.value)}
                        disabled={isLocationLoading}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name} ({country.code})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        State
                    </label>
                    <select
                        value={form.stateId || ""}
                        onChange={(e) => void handleStateChange(e.target.value)}
                        disabled={isLocationLoading || !form.countryId}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                        <option value="">Select state</option>
                        {states.map((state) => (
                            <option key={state.id} value={state.id}>
                                {state.name}
                                {state.code ? ` (${state.code})` : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        District
                    </label>
                    <select
                        value={form.districtId || ""}
                        onChange={(e) => updateField("districtId", e.target.value)}
                        disabled={isLocationLoading || !form.stateId}
                        className="h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                        <option value="">Select district</option>
                        {districts.map((district) => (
                            <option key={district.id} value={district.id}>
                                {district.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2 pt-8">
                    <input
                        id="isDefaultAddress"
                        type="checkbox"
                        checked={!!form.isDefault}
                        onChange={(e) => updateField("isDefault", e.target.checked)}
                        className="h-4 w-4"
                    />
                    <label
                        htmlFor="isDefaultAddress"
                        className="text-sm font-medium text-gray-700"
                    >
                        Set as default address
                    </label>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3">
                {onCancel ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                ) : null}

                <button
                    type="submit"
                    disabled={isSubmitting || isLocationLoading}
                    className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}