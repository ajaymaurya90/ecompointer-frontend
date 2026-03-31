"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCustomerById } from "@/modules/customers/api/customerApi";
import type { Customer } from "@/modules/customers/types/customer";
import CustomerOverviewTab from "@/modules/customers/pages/detail/CustomerOverviewTab";
import CustomerBusinessesTab from "@/modules/customers/pages/detail/CustomerBusinessesTab";
import CustomerAddressesTab from "@/modules/customers/pages/detail/CustomerAddressesTab";
import CustomerGroupsTab from "@/modules/customers/pages/detail/CustomerGroupsTab";

type DetailTabKey = "overview" | "businesses" | "addresses" | "groups";

interface CustomerDetailPageProps {
    customerId: string;
}

function getCustomerName(customer: Customer | null) {
    if (!customer) return "";
    return [customer.firstName, customer.lastName].filter(Boolean).join(" ");
}

export default function CustomerDetailPage({
    customerId,
}: CustomerDetailPageProps) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [activeTab, setActiveTab] = useState<DetailTabKey>("overview");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchCustomer() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getCustomerById(customerId);

                if (isMounted) {
                    setCustomer(data);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err?.response?.data?.message || "Failed to fetch customer");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchCustomer();

        return () => {
            isMounted = false;
        };
    }, [customerId]);

    const tabItems = useMemo(
        () => [
            { key: "overview" as const, label: "Overview" },
            { key: "businesses" as const, label: "Businesses" },
            { key: "addresses" as const, label: "Addresses" },
            { key: "groups" as const, label: "Groups" },
        ],
        []
    );

    function renderActiveTab() {
        if (!customer) return null;

        switch (activeTab) {
            case "businesses":
                return <CustomerBusinessesTab customer={customer} />;
            case "addresses":
                return <CustomerAddressesTab customer={customer} />;
            case "groups":
                return <CustomerGroupsTab customer={customer} />;
            case "overview":
            default:
                return <CustomerOverviewTab customer={customer} />;
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="mb-1">
                        <Link
                            href="/dashboard/customers"
                            className="text-sm text-gray-500 hover:text-gray-900"
                        >
                            ← Back to Customers
                        </Link>
                    </div>

                    <h1 className="text-xl font-semibold text-gray-900">
                        {isLoading ? "Loading customer..." : getCustomerName(customer)}
                    </h1>

                    {!isLoading && customer ? (
                        <p className="mt-1 text-sm text-gray-500">
                            {customer.customerCode} · {customer.type} · {customer.status}
                        </p>
                    ) : null}
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={`/dashboard/customers/${customerId}/edit`}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Edit Customer
                    </Link>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {isLoading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 w-48 rounded bg-gray-200" />
                        <div className="h-12 rounded bg-gray-100" />
                        <div className="h-12 rounded bg-gray-100" />
                        <div className="h-12 rounded bg-gray-100" />
                    </div>
                </div>
            ) : customer ? (
                <>
                    <div className="rounded-2xl border border-gray-200 bg-white p-2">
                        <div className="flex flex-wrap gap-2">
                            {tabItems.map((tab) => {
                                const isActive = activeTab === tab.key;

                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${isActive
                                            ? "bg-black text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {renderActiveTab()}
                </>
            ) : null}
        </div>
    );
}