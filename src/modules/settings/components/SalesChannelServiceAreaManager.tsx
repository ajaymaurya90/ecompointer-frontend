"use client";

import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { getMyProfile } from "@/modules/auth/api/authApi";
import {
    checkStorefrontServiceability,
    createMyBrandOwnerSalesChannelServiceArea,
    deleteMyBrandOwnerSalesChannelServiceArea,
    getMyBrandOwnerSalesChannels,
    getMyBrandOwnerSalesChannelServiceAreas,
} from "@/modules/brand-owners/api/brandOwnersApi";
import type {
    BrandOwnerSalesChannel,
    BrandOwnerSalesChannelServiceArea,
    SalesChannelType,
    ServiceabilityCheckResult,
} from "@/modules/brand-owners/types/brandOwner";
import ServiceAreaFormModal from "@/modules/settings/components/ServiceAreaFormModal";

const fallbackChannelLabels: Record<SalesChannelType, string> = {
    DIRECT_WEBSITE: "Website",
    SHOP_ORDER: "Shop Order",
    FRANCHISE_SHOP: "Franchise Shop",
    MARKETPLACE: "Marketplace",
    SOCIAL_MEDIA: "Social Media",
    MANUAL: "Manual",
};

type Props = {
    selectedChannelType?: SalesChannelType;
    showHeader?: boolean;
    showChannelSelector?: boolean;
};

export default function SalesChannelServiceAreaManager({
    selectedChannelType: controlledChannelType,
    showHeader = true,
    showChannelSelector = true,
}: Props) {
    const [channels, setChannels] = useState<BrandOwnerSalesChannel[]>([]);
    const [selectedChannelType, setSelectedChannelType] =
        useState<SalesChannelType>(controlledChannelType || "DIRECT_WEBSITE");
    const [serviceAreas, setServiceAreas] = useState<BrandOwnerSalesChannelServiceArea[]>([]);
    const [brandOwnerId, setBrandOwnerId] = useState<string | null>(null);
    const [testPincode, setTestPincode] = useState("");
    const [testResult, setTestResult] = useState<ServiceabilityCheckResult | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isServiceAreaLoading, setIsServiceAreaLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddingArea, setIsAddingArea] = useState(false);
    const [deletingAreaId, setDeletingAreaId] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const selectedChannel = useMemo(
        () => channels.find((channel) => channel.channelType === selectedChannelType) || null,
        [channels, selectedChannelType],
    );

    useEffect(() => {
        void loadInitialData();
    }, []);

    useEffect(() => {
        if (controlledChannelType) {
            setSelectedChannelType(controlledChannelType);
        }
    }, [controlledChannelType]);

    useEffect(() => {
        if (!selectedChannelType) return;
        void loadServiceAreas(selectedChannelType);
    }, [selectedChannelType]);

    async function loadInitialData() {
        try {
            setIsInitialLoading(true);
            setError(null);

            const [profile, channelRows] = await Promise.all([
                getMyProfile(),
                getMyBrandOwnerSalesChannels(),
            ]);

            setBrandOwnerId(profile.business?.id || null);
            setChannels(channelRows);
            setSelectedChannelType(controlledChannelType || channelRows[0]?.channelType || "DIRECT_WEBSITE");
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load service area settings."));
        } finally {
            setIsInitialLoading(false);
        }
    }

    async function loadServiceAreas(channelType: SalesChannelType) {
        try {
            setIsServiceAreaLoading(true);
            setError(null);
            const rows = await getMyBrandOwnerSalesChannelServiceAreas(channelType);
            setServiceAreas(rows);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load service areas."));
        } finally {
            setIsServiceAreaLoading(false);
        }
    }

    async function addServiceArea(payload: Parameters<typeof createMyBrandOwnerSalesChannelServiceArea>[1]) {
        try {
            setIsAddingArea(true);
            setModalError(null);
            setSuccessMessage(null);

            await createMyBrandOwnerSalesChannelServiceArea(selectedChannelType, payload);
            setIsModalOpen(false);
            await loadServiceAreas(selectedChannelType);
            setSuccessMessage("Service area added successfully.");
        } catch (err) {
            setModalError(getErrorMessage(err, "Failed to add service area."));
        } finally {
            setIsAddingArea(false);
        }
    }

    async function deleteServiceArea(item: BrandOwnerSalesChannelServiceArea) {
        try {
            setDeletingAreaId(item.id);
            setError(null);
            setSuccessMessage(null);

            await deleteMyBrandOwnerSalesChannelServiceArea(selectedChannelType, item.id);
            setServiceAreas((current) => current.filter((row) => row.id !== item.id));
            setSuccessMessage("Service area removed successfully.");
        } catch (err) {
            setError(getErrorMessage(err, "Failed to remove service area."));
        } finally {
            setDeletingAreaId(null);
        }
    }

    async function checkPincode() {
        if (!testPincode.trim()) {
            setError("Enter a pincode to test.");
            return;
        }

        try {
            setIsChecking(true);
            setError(null);
            setTestResult(null);

            const result = await checkStorefrontServiceability({
                pincode: testPincode.trim(),
                channelType: selectedChannelType,
                brandOwnerId: brandOwnerId || undefined,
            });

            setTestResult(result);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to check delivery availability."));
        } finally {
            setIsChecking(false);
        }
    }

    if (isInitialLoading) {
        return (
            <div className="rounded-3xl border border-gray-200 bg-white p-8">
                <h1 className="text-xl font-semibold text-gray-900">Service Area</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Loading service area settings...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {showHeader ? (
                <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Service Area</h1>
                            <p className="mt-2 max-w-2xl text-sm text-gray-500">
                                Configure delivery availability per sales channel. Serviceability checks use the most specific active match first.
                            </p>
                        </div>
                        <AddButton onClick={() => { setModalError(null); setIsModalOpen(true); }} />
                    </div>
                </section>
            ) : null}

            {error ? <Message tone="error">{error}</Message> : null}
            {successMessage ? <Message tone="success">{successMessage}</Message> : null}

            {showChannelSelector ? (
                <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Sales Channel</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Select the channel whose delivery coverage you want to manage.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {channels.map((channel) => (
                                <button
                                    key={channel.id}
                                    type="button"
                                    onClick={() => setSelectedChannelType(channel.channelType)}
                                    className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${selectedChannelType === channel.channelType
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {channel.displayName || getChannelTypeLabel(channel)}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Service Areas</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Active rows define where {selectedChannel?.displayName || (selectedChannel ? getChannelTypeLabel(selectedChannel) : fallbackChannelLabels[selectedChannelType])} can deliver.
                        </p>
                    </div>
                    {!showHeader ? (
                        <AddButton onClick={() => { setModalError(null); setIsModalOpen(true); }} />
                    ) : null}
                </div>

                {isServiceAreaLoading ? (
                    <div className="p-8 text-sm text-gray-500">Loading service areas...</div>
                ) : serviceAreas.length === 0 ? (
                    <div className="p-8 text-sm text-gray-500">
                        No service areas added for this channel yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-500">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Level</th>
                                    <th className="px-5 py-4 font-medium">Location Name</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceAreas.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                {formatLevel(item.level)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-900">
                                                {getServiceAreaLocationName(item)}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {getServiceAreaLocationSubtext(item)}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-gray-100 text-gray-600"
                                                }`}>
                                                {item.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() => void deleteServiceArea(item)}
                                                disabled={deletingAreaId === item.id}
                                                className="rounded-2xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {deletingAreaId === item.id ? "Deleting..." : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Test Delivery Availability</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Check a customer pincode against the selected sales channel.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <input
                        value={testPincode}
                        onChange={(event) => {
                            setTestPincode(event.target.value);
                            setTestResult(null);
                        }}
                        placeholder="Enter pincode"
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 sm:max-w-xs"
                    />
                    <button
                        type="button"
                        onClick={() => void checkPincode()}
                        disabled={isChecking}
                        className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isChecking ? "Checking..." : "Check"}
                    </button>
                </div>
                {testResult ? (
                    <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${testResult.serviceable
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                        }`}>
                        {testResult.serviceable
                            ? `Delivery available (${testResult.matchedLevel})`
                            : "Not serviceable"}
                    </div>
                ) : null}
            </section>

            <ServiceAreaFormModal
                isOpen={isModalOpen}
                isSubmitting={isAddingArea}
                error={modalError}
                onClose={() => {
                    if (!isAddingArea) {
                        setIsModalOpen(false);
                    }
                }}
                onSubmit={addServiceArea}
            />
        </div>
    );
}

function AddButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm"
        >
            Add Service Area
        </button>
    );
}

function Message({ tone, children }: { tone: "error" | "success"; children: string }) {
    return (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${tone === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}>
            {children}
        </div>
    );
}

function formatLevel(level: string) {
    return level.charAt(0) + level.slice(1).toLowerCase();
}

function getServiceAreaLocationName(item: BrandOwnerSalesChannelServiceArea) {
    if (item.level === "COUNTRY") return item.country?.name || "-";
    if (item.level === "STATE") return item.state?.name || "-";
    if (item.level === "DISTRICT") return item.district?.name || "-";
    return item.pincode?.code || "-";
}

function getServiceAreaLocationSubtext(item: BrandOwnerSalesChannelServiceArea) {
    if (item.level === "COUNTRY") return item.country?.code || "";
    if (item.level === "STATE") return item.state?.country?.name || "";
    if (item.level === "DISTRICT") return item.district?.state?.name || "";
    return item.pincode?.district?.name || "";
}

function getChannelTypeLabel(channel: BrandOwnerSalesChannel) {
    return (
        channel.salesChannelType?.label ||
        fallbackChannelLabels[channel.channelType] ||
        channel.channelType
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
