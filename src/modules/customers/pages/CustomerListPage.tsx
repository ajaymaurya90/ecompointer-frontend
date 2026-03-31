"use client";

import { useEffect } from "react";
import Link from "next/link";
import CustomerFilters from "@/modules/customers/components/CustomerFilters";
import CustomerListTable from "@/modules/customers/components/CustomerListTable";
import CustomerSkeleton from "@/modules/customers/components/CustomerSkeleton";
import { useCustomerStore } from "@/modules/customers/store/customerStore";

export default function CustomerListPage() {
    const {
        items,
        meta,
        isLoading,
        error,
        filters,
        setFilters,
        resetFilters,
        fetchCustomers,
    } = useCustomerStore();

    useEffect(() => {
        fetchCustomers();
    }, [
        filters.page,
        filters.limit,
        filters.search,
        filters.type,
        filters.status,
        filters.source,
        filters.sortBy,
        filters.sortOrder,
        fetchCustomers,
    ]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Customers
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage direct and business customers.
                    </p>
                </div>

                <Link
                    href="/dashboard/customers/new"
                    className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                    Add Customer
                </Link>
            </div>

            <CustomerFilters
                search={filters.search || ""}
                type={filters.type || ""}
                status={filters.status || ""}
                source={filters.source || ""}
                onSearchChange={(value) =>
                    setFilters({
                        search: value,
                        page: 1,
                    })
                }
                onTypeChange={(value) =>
                    setFilters({
                        type: value,
                        page: 1,
                    })
                }
                onStatusChange={(value) =>
                    setFilters({
                        status: value,
                        page: 1,
                    })
                }
                onSourceChange={(value) =>
                    setFilters({
                        source: value,
                        page: 1,
                    })
                }
                onReset={() => {
                    resetFilters();
                }}
            />

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {isLoading ? (
                <CustomerSkeleton />
            ) : (
                <CustomerListTable items={items} />
            )}

            {meta ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
                    <div className="text-gray-600">
                        Total:{" "}
                        <span className="font-medium text-gray-900">
                            {meta.total}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={meta.page <= 1}
                            onClick={() =>
                                setFilters({
                                    page: (meta.page || 1) - 1,
                                })
                            }
                            className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-gray-700">
                            Page {meta.page} of {meta.lastPage || 1}
                        </span>

                        <button
                            type="button"
                            disabled={meta.page >= meta.lastPage}
                            onClick={() =>
                                setFilters({
                                    page: (meta.page || 1) + 1,
                                })
                            }
                            className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}