"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getActiveCountries,
    getActiveDistrictsByState,
    getActiveStatesByCountry,
    getMyBrandOwnerLocation,
    updateMyBrandOwnerLocation,
} from "@/modules/brand-owners/api/brandOwnersApi";
import type {
    BrandOwnerLocation,
    CountryOption,
    DistrictOption,
    StateOption,
    UpdateBrandOwnerLocationPayload,
} from "@/modules/brand-owners/types/brandOwner";

type FormState = {
    address: string;
    city: string;
    countryId: string;
    stateId: string;
    districtId: string;
};

const initialFormState: FormState = {
    address: "",
    city: "",
    countryId: "",
    stateId: "",
    districtId: "",
};

export default function LocationSettingsPage() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [profile, setProfile] = useState<BrandOwnerLocation | null>(null);

    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [states, setStates] = useState<StateOption[]>([]);
    const [districts, setDistricts] = useState<DistrictOption[]>([]);

    const [form, setForm] = useState<FormState>(initialFormState);

    const selectedCountry = useMemo(
        () => countries.find((item) => item.id === form.countryId) || null,
        [countries, form.countryId]
    );

    const selectedState = useMemo(
        () => states.find((item) => item.id === form.stateId) || null,
        [states, form.stateId]
    );

    const selectedDistrict = useMemo(
        () => districts.find((item) => item.id === form.districtId) || null,
        [districts, form.districtId]
    );

    useEffect(() => {
        void loadPage();
    }, []);

    async function loadPage() {
        try {
            setIsInitialLoading(true);
            setError(null);

            const [locationData, countriesData] = await Promise.all([
                getMyBrandOwnerLocation(),
                getActiveCountries(),
            ]);

            setProfile(locationData);
            setCountries(countriesData);

            const nextForm: FormState = {
                address: locationData.address || "",
                city: locationData.city || "",
                countryId: locationData.countryId || "",
                stateId: locationData.stateId || "",
                districtId: locationData.districtId || "",
            };

            setForm(nextForm);

            if (locationData.countryId) {
                const statesData = await getActiveStatesByCountry(locationData.countryId);
                setStates(statesData);

                if (locationData.stateId) {
                    const districtsData = await getActiveDistrictsByState(locationData.stateId);
                    setDistricts(districtsData);
                } else {
                    setDistricts([]);
                }
            } else {
                setStates([]);
                setDistricts([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load location settings");
        } finally {
            setIsInitialLoading(false);
        }
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
        setSuccessMessage(null);
        setError(null);

        if (!countryId) {
            return;
        }

        try {
            const statesData = await getActiveStatesByCountry(countryId);
            setStates(statesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load states");
        }
    }

    async function handleStateChange(stateId: string) {
        setForm((prev) => ({
            ...prev,
            stateId,
            districtId: "",
        }));

        setDistricts([]);
        setSuccessMessage(null);
        setError(null);

        if (!stateId) {
            return;
        }

        try {
            const districtsData = await getActiveDistrictsByState(stateId);
            setDistricts(districtsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load districts");
        }
    }

    function handleInputChange<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
        setSuccessMessage(null);
        setError(null);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            const payload: UpdateBrandOwnerLocationPayload = {
                address: form.address.trim(),
                city: form.city.trim(),
                countryId: form.countryId || undefined,
                stateId: form.stateId || undefined,
                districtId: form.districtId || undefined,
            };

            const updated = await updateMyBrandOwnerLocation(payload);
            setProfile(updated);
            setSuccessMessage("Location settings updated successfully.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save location settings");
        } finally {
            setIsSaving(false);
        }
    }

    if (isInitialLoading) {
        return (
            <div className="rounded-3xl border border-borderSoft bg-white p-8">
                <div className="text-lg font-semibold text-slate-900">Location</div>
                <p className="mt-2 text-sm text-slate-500">Loading location settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-borderSoft bg-white p-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">Business Location</h1>
                    <p className="text-sm text-slate-500">
                        Set your primary business location. This location will be used as the
                        default geography for your business and customer flows.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-borderSoft bg-white p-8"
            >
                <div className="mb-6 flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {profile?.businessName || "Brand Owner"}
                    </h2>
                    <p className="text-sm text-slate-500">
                        Choose the country, state, and district where your business primarily
                        operates.
                    </p>
                </div>

                {error ? (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                {successMessage ? (
                    <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {successMessage}
                    </div>
                ) : null}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Business Address
                        </label>
                        <textarea
                            value={form.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Enter business address"
                            rows={4}
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            City
                        </label>
                        <input
                            type="text"
                            value={form.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="Enter city"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Country
                        </label>
                        <select
                            value={form.countryId}
                            onChange={(e) => void handleCountryChange(e.target.value)}
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
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
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            State
                        </label>
                        <select
                            value={form.stateId}
                            onChange={(e) => void handleStateChange(e.target.value)}
                            disabled={!form.countryId}
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
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
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            District
                        </label>
                        <select
                            value={form.districtId}
                            onChange={(e) => handleInputChange("districtId", e.target.value)}
                            disabled={!form.stateId}
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                        >
                            <option value="">Select district</option>
                            {districts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-8 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-800">
                        Current selection preview
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-3">
                        <div>
                            <span className="font-medium text-slate-800">Country:</span>{" "}
                            {selectedCountry?.name || profile?.countryRef?.name || "-"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-800">State:</span>{" "}
                            {selectedState?.name || profile?.stateRef?.name || "-"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-800">District:</span>{" "}
                            {selectedDistrict?.name || profile?.districtRef?.name || "-"}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => void loadPage()}
                        className="rounded-2xl border border-borderSoft px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save Location"}
                    </button>
                </div>
            </form>
        </div>
    );
}