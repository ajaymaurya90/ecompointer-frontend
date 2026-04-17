"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { getMyBrandOwnerSalesChannels } from "@/modules/brand-owners/api/brandOwnersApi";
import type { BrandOwnerSalesChannel, SalesChannelType } from "@/modules/brand-owners/types/brandOwner";

const fallbackChannelLabels: Record<SalesChannelType, string> = {
    DIRECT_WEBSITE: "Website",
    SHOP_ORDER: "Shop Order",
    FRANCHISE_SHOP: "Franchise Shop",
    MARKETPLACE: "Marketplace",
    SOCIAL_MEDIA: "Social Media",
    MANUAL: "Manual",
};

export default function SalesChannelSettingsPage() {
    const [channels, setChannels] = useState<BrandOwnerSalesChannel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        void loadChannels();
    }, []);

    async function loadChannels() {
        try {
            setIsLoading(true);
            setError(null);
            const rows = await getMyBrandOwnerSalesChannels();
            setChannels(rows);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load sales channels."));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-borderSoft bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Sales Channels
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                            Manage website, shop-order, marketplace, and future sales channels from a focused index.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/settings/sales-channels/new"
                        className="rounded-2xl bg-black px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                    >
                        Add Sales Channel
                    </Link>
                </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-borderSoft bg-white shadow-sm">
                {isLoading ? (
                    <div className="p-8 text-sm text-slate-500">Loading sales channels...</div>
                ) : error ? (
                    <div className="space-y-4 p-8">
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                        <button
                            type="button"
                            onClick={() => void loadChannels()}
                            className="rounded-2xl border border-borderSoft px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Retry
                        </button>
                    </div>
                ) : channels.length === 0 ? (
                    <div className="p-10 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">No sales channels yet</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Create your first sales channel to configure storefront delivery and status.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-borderSoft bg-slate-50 text-left text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Sales Channel Name</th>
                                    <th className="px-5 py-4 font-medium">Type</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Primary</th>
                                    <th className="px-5 py-4 font-medium">Created At</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {channels.map((channel) => (
                                    <tr key={channel.id} className="border-b border-borderSoft last:border-b-0">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-900">
                                                {channel.displayName || getChannelTypeLabel(channel)}
                                            </div>
                                            {channel.channelType === "DIRECT_WEBSITE" ? (
                                                <div className="mt-1 text-xs text-slate-500">
                                                    Default website channel
                                                </div>
                                            ) : null}
                                        </td>
                                        <td className="px-5 py-4 text-slate-700">
                                            <div>{getChannelTypeLabel(channel)}</div>
                                            <div className="mt-1 text-xs text-slate-400">{channel.channelType}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge isActive={channel.isActive} />
                                        </td>
                                        <td className="px-5 py-4 text-slate-700">
                                            {channel.isPrimary || channel.channelType === "DIRECT_WEBSITE" ? "Yes" : "No"}
                                        </td>
                                        <td className="px-5 py-4 text-slate-700">
                                            {channel.createdAt ? new Date(channel.createdAt).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/dashboard/settings/sales-channels/${channel.id}`}
                                                    className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-slate-400"
                                                >
                                                    Delete later
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

function getChannelTypeLabel(channel: BrandOwnerSalesChannel) {
    return (
        channel.salesChannelType?.label ||
        fallbackChannelLabels[channel.channelType] ||
        channel.channelType
    );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isActive
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-600"
            }`}>
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}

function getErrorMessage(error: unknown, fallback: string) {
    const axiosError = error as AxiosError<{ message?: string | string[] }>;
    const message = axiosError.response?.data?.message;

    if (Array.isArray(message)) return message.join(", ");
    if (message) return message;
    if (error instanceof Error) return error.message;
    return fallback;
}
