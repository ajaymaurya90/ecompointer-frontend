"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useShopOwnerStore } from "@/modules/shop-owners/store/shopOwnerStore";
import ShopOwnerFilters from "@/modules/shop-owners/components/ShopOwnerFilters";
import ShopOwnerListTable from "@/modules/shop-owners/components/ShopOwnerListTable";
import ShopOwnerSkeleton from "@/modules/shop-owners/components/ShopOwnerSkeleton";

export default function ShopOwnerListPage() {
    const {
        items,
        pagination,
        filters,
        isLoading,
        error,
        setFilters,
        resetFilters,
        fetchShopOwners,
    } = useShopOwnerStore();

    useEffect(() => {
        fetchShopOwners();
    }, [filters.page, filters.limit, filters.search, filters.isActive, fetchShopOwners]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="text-sm font-medium text-gray-500">Channel Partners</div>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900">Shop Owners</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            View connected shop owners, add new ones, or connect with existing shops.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/dashboard/shop-owners/link-existing"
                            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Link Existing Shop Owner
                        </Link>

                        <Link
                            href="/dashboard/shop-owners/new"
                            className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                        >
                            Add Shop Owner
                        </Link>
                    </div>
                </div>
            </div>

            <ShopOwnerFilters
                search={filters.search}
                isActive={filters.isActive}
                onSearchChange={(value) => setFilters({ search: value, page: 1 })}
                onStatusChange={(value) => setFilters({ isActive: value, page: 1 })}
                onReset={() => resetFilters()}
            />

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {isLoading ? (
                <ShopOwnerSkeleton />
            ) : (
                <ShopOwnerListTable items={items} />
            )}

            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
                <div className="text-gray-600">
                    Total:{" "}
                    <span className="font-medium text-gray-900">
                        {pagination.total}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={pagination.page <= 1}
                        onClick={() => setFilters({ page: pagination.page - 1 })}
                        className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-gray-700">
                        Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
                    </span>

                    <button
                        type="button"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => setFilters({ page: pagination.page + 1 })}
                        className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}