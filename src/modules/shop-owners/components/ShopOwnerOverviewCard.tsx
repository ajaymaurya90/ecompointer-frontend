"use client";

import type { ShopOwner } from "@/modules/shop-owners/types/shopOwner";

type Props = {
    shopOwner: ShopOwner;
};

export default function ShopOwnerOverviewCard({ shopOwner }: Props) {
    return (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="text-sm font-medium text-gray-500">Shop Owner Profile</div>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900">
                        {shopOwner.shopName}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Managed partner shop connected to your brand account.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${shopOwner.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {shopOwner.isActive ? "Shop Active" : "Shop Inactive"}
                    </span>

                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {shopOwner.language || "en"}
                    </span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-gray-400">Owner</div>
                    <div className="mt-2 text-sm font-semibold text-gray-900">
                        {shopOwner.ownerName}
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-gray-400">Phone</div>
                    <div className="mt-2 text-sm font-semibold text-gray-900">
                        {shopOwner.phone}
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-gray-400">Email</div>
                    <div className="mt-2 text-sm font-semibold text-gray-900">
                        {shopOwner.email || "-"}
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-gray-400">Shop Slug</div>
                    <div className="mt-2 text-sm font-semibold text-gray-900">
                        {shopOwner.shopSlug}
                    </div>
                </div>
            </div>
        </div>
    );
}