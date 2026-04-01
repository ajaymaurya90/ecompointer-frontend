"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getMyBrandOwnerServiceArea,
    getMyBrandOwnerServiceAreaDistricts,
    updateMyBrandOwnerServiceAreaDistrict,
    updateMyBrandOwnerServiceAreaState,
} from "@/modules/brand-owners/api/brandOwnersApi";
import type {
    BrandOwnerServiceArea,
    BrandOwnerServiceAreaDistrictResponse,
    BrandOwnerServiceAreaState,
} from "@/modules/brand-owners/types/brandOwner";

export default function ServiceAreaSettingsPage() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isDistrictLoading, setIsDistrictLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [serviceArea, setServiceArea] = useState<BrandOwnerServiceArea | null>(null);
    const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
    const [districtResponse, setDistrictResponse] =
        useState<BrandOwnerServiceAreaDistrictResponse | null>(null);

    const [updatingStateId, setUpdatingStateId] = useState<string | null>(null);
    const [updatingDistrictId, setUpdatingDistrictId] = useState<string | null>(null);

    useEffect(() => {
        void loadServiceArea();
    }, []);

    const selectedState = useMemo(() => {
        if (!serviceArea || !selectedStateId) return null;
        return serviceArea.states.find((item) => item.id === selectedStateId) || null;
    }, [serviceArea, selectedStateId]);

    async function loadServiceArea(preferredStateId?: string) {
        try {
            setIsInitialLoading(true);
            setError(null);

            const data = await getMyBrandOwnerServiceArea();
            setServiceArea(data);

            const nextStateId =
                preferredStateId ||
                selectedStateId ||
                data.states[0]?.id ||
                null;

            setSelectedStateId(nextStateId);

            if (nextStateId) {
                await loadDistricts(nextStateId);
            } else {
                setDistrictResponse(null);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load service area"
            );
        } finally {
            setIsInitialLoading(false);
        }
    }

    async function loadDistricts(stateId: string) {
        try {
            setIsDistrictLoading(true);
            setError(null);

            const data = await getMyBrandOwnerServiceAreaDistricts(stateId);
            setDistrictResponse(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load districts"
            );
        } finally {
            setIsDistrictLoading(false);
        }
    }

    async function handleStateToggle(state: BrandOwnerServiceAreaState) {
        try {
            setUpdatingStateId(state.id);
            setError(null);
            setSuccessMessage(null);

            await updateMyBrandOwnerServiceAreaState(state.id, {
                isActive: !state.isActive,
            });

            await loadServiceArea(state.id);
            setSuccessMessage("State updated successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update state"
            );
        } finally {
            setUpdatingStateId(null);
        }
    }

    async function handleDistrictToggle(
        districtId: string,
        nextIsActive: boolean
    ) {
        try {
            setUpdatingDistrictId(districtId);
            setError(null);
            setSuccessMessage(null);

            await updateMyBrandOwnerServiceAreaDistrict(districtId, {
                isActive: nextIsActive,
            });

            if (selectedStateId) {
                await Promise.all([
                    loadDistricts(selectedStateId),
                    loadServiceArea(selectedStateId),
                ]);
            }

            setSuccessMessage("District updated successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update district"
            );
        } finally {
            setUpdatingDistrictId(null);
        }
    }

    if (isInitialLoading) {
        return (
            <div className="rounded-3xl border border-gray-200 bg-white p-8">
                <h1 className="text-xl font-semibold text-gray-900">
                    Service Area
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Loading service area...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Service Area
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Manage where you accept orders. By default all regions are active.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                    {successMessage}
                </div>
            )}

            {serviceArea && (
                <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Card title="Country" value={serviceArea.country.name} sub={serviceArea.country.code} />
                        <Card title="Total States" value={serviceArea.summary.totalStates} />
                        <Card title="Active States" value={serviceArea.summary.activeStates} highlight="green" />
                        <Card title="Inactive States" value={serviceArea.summary.inactiveStates} highlight="red" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="rounded-3xl border bg-white p-6">
                            <h2 className="mb-4 text-lg font-semibold">States</h2>

                            <div className="space-y-3">
                                {serviceArea.states.map((state) => {
                                    const isSelected = selectedStateId === state.id;
                                    const isUpdating = updatingStateId === state.id;

                                    return (
                                        <div
                                            key={state.id}
                                            className={`rounded-xl border p-4 ${isSelected ? "border-black bg-gray-50" : ""
                                                }`}
                                        >
                                            <div className="flex justify-between gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedStateId(state.id);
                                                        void loadDistricts(state.id);
                                                    }}
                                                    className="flex-1 text-left"
                                                >
                                                    <div className="font-semibold">
                                                        {state.name}
                                                    </div>
                                                    <div className="mt-1 text-sm text-gray-500">
                                                        {state.activeDistrictCount} / {state.districtCount} districts active
                                                    </div>
                                                    <div className="mt-2 flex gap-2">
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${state.isActive
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {state.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                            {state.source === "default" ? "Default" : "Override"}
                                                        </span>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={isUpdating}
                                                    onClick={() => void handleStateToggle(state)}
                                                    className={`px-3 py-1 rounded border text-sm ${state.isActive
                                                        ? "border-red-300 text-red-600"
                                                        : "border-green-300 text-green-600"
                                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                                >
                                                    {isUpdating
                                                        ? "Updating..."
                                                        : state.isActive
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-3xl border bg-white p-6">
                            <h2 className="mb-4 text-lg font-semibold">
                                Districts {selectedState ? `(${selectedState.name})` : ""}
                            </h2>

                            {isDistrictLoading ? (
                                <p className="text-sm text-gray-500">Loading...</p>
                            ) : districtResponse ? (
                                <div className="space-y-4">
                                    {!districtResponse.state.isActive ? (
                                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                                            Activate{" "}
                                            <span className="font-semibold">
                                                {districtResponse.state.name}
                                            </span>{" "}
                                            first to manage its districts.
                                        </div>
                                    ) : null}

                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="text-base font-semibold text-gray-900">
                                                {districtResponse.state.name}
                                            </div>

                                            {districtResponse.state.code ? (
                                                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-600">
                                                    {districtResponse.state.code}
                                                </span>
                                            ) : null}

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${districtResponse.state.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {districtResponse.state.isActive
                                                    ? "State Active"
                                                    : "State Inactive"}
                                            </span>

                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                {districtResponse.state.source === "default"
                                                    ? "Default"
                                                    : "Override"}
                                            </span>
                                        </div>

                                        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <div className="text-gray-500">Total</div>
                                                <div className="font-semibold text-gray-900">
                                                    {districtResponse.summary.totalDistricts}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Active</div>
                                                <div className="font-semibold text-green-600">
                                                    {districtResponse.summary.activeDistricts}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Inactive</div>
                                                <div className="font-semibold text-red-600">
                                                    {districtResponse.summary.inactiveDistricts}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {districtResponse.districts.map((district) => {
                                            const isUpdating = updatingDistrictId === district.id;

                                            return (
                                                <div
                                                    key={district.id}
                                                    className={`flex justify-between items-center border p-3 rounded-xl ${!districtResponse.state.isActive ? "opacity-60" : ""
                                                        }`}
                                                >
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {district.name}
                                                        </div>
                                                        <div className="mt-1 flex gap-2">
                                                            <span
                                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${district.isActive
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                                    }`}
                                                            >
                                                                {district.isActive ? "Active" : "Inactive"}
                                                            </span>
                                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                                {district.source === "default"
                                                                    ? "Default"
                                                                    : "Override"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isUpdating ||
                                                            !districtResponse.state.isActive
                                                        }
                                                        onClick={() =>
                                                            void handleDistrictToggle(
                                                                district.id,
                                                                !district.isActive
                                                            )
                                                        }
                                                        className={`px-3 py-1 rounded border text-sm ${district.isActive
                                                            ? "border-red-300 text-red-600"
                                                            : "border-green-300 text-green-600"
                                                            } disabled:cursor-not-allowed disabled:opacity-50`}
                                                    >
                                                        {isUpdating
                                                            ? "Updating..."
                                                            : !districtResponse.state.isActive
                                                                ? "State Inactive"
                                                                : district.isActive
                                                                    ? "Deactivate"
                                                                    : "Activate"}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Select a state to view districts
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function Card({
    title,
    value,
    sub,
    highlight,
}: {
    title: string;
    value: string | number;
    sub?: string;
    highlight?: "green" | "red";
}) {
    return (
        <div className="rounded-xl border bg-white p-4">
            <div className="text-xs text-gray-500">{title}</div>
            <div
                className={`text-xl font-bold ${highlight === "green"
                    ? "text-green-600"
                    : highlight === "red"
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
            >
                {value}
            </div>
            {sub && <div className="text-sm text-gray-500">{sub}</div>}
        </div>
    );
}