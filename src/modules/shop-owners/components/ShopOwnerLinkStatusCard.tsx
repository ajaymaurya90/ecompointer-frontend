"use client";

import { useState } from "react";
import type { ShopOwner } from "@/modules/shop-owners/types/shopOwner";

type Props = {
    shopOwner: ShopOwner;
    isUpdating: boolean;
    onToggle: (isActive: boolean, notes?: string) => Promise<void> | void;
};

export default function ShopOwnerLinkStatusCard({
    shopOwner,
    isUpdating,
    onToggle,
}: Props) {
    const activeLink = shopOwner.brandLinks?.find((link) => link.isActive);
    const latestLink =
        activeLink ||
        [...(shopOwner.brandLinks || [])].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];

    const [notes, setNotes] = useState(latestLink?.notes || "");

    const isActive = latestLink?.isActive ?? false;

    return (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
            <p className="mt-1 text-sm text-gray-500">
                Manage the relationship between your brand and this shop owner.
            </p>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">
                            Current Status
                        </div>
                        <div className="mt-2">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {isActive ? "Active Link" : "Inactive Link"}
                            </span>
                        </div>
                    </div>

                    <div className="text-right text-xs text-gray-500">
                        <div>Created: {latestLink?.createdAt ? new Date(latestLink.createdAt).toLocaleString() : "-"}</div>
                        <div className="mt-1">
                            Updated: {latestLink?.updatedAt ? new Date(latestLink.updatedAt).toLocaleString() : "-"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes
                </label>
                <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes for this relationship"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                {isActive ? (
                    <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onToggle(false, notes)}
                        className="rounded-2xl border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isUpdating ? "Updating..." : "Deactivate Link"}
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onToggle(true, notes)}
                        className="rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isUpdating ? "Updating..." : "Activate Link"}
                    </button>
                )}
            </div>
        </div>
    );
}