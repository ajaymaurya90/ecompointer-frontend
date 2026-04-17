"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getBrandOwners } from "@/modules/super-admin/api/superAdminApi";
import type {
    AccountStatus,
    BrandOwnerListItem,
} from "@/modules/super-admin/types/superAdmin";

function formatDate(value: string) {
    if (!value) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function StatusBadge({ status }: { status: AccountStatus }) {
    const className =
        status === "ACTIVE"
            ? "bg-emerald-50 text-emerald-700"
            : status === "PENDING"
              ? "bg-amber-50 text-amber-700"
              : status === "SUSPENDED"
                ? "bg-red-50 text-red-700"
                : "bg-slate-100 text-slate-600";

    return (
        <span className={`rounded-2xl px-3 py-1 text-xs font-semibold ${className}`}>
            {status}
        </span>
    );
}

export default function BrandOwnersPage() {
    const [brandOwners, setBrandOwners] = useState<BrandOwnerListItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filteredBrandOwners = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return brandOwners;
        }

        return brandOwners.filter((item) =>
            [
                item.businessName,
                item.email,
                item.phone,
                item.ownerName,
                item.country?.name,
                item.state?.name,
                item.district?.name,
                item.accountStatus,
            ]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(value)),
        );
    }, [brandOwners, search]);

    const activeCount = brandOwners.filter(
        (item) => item.accountStatus === "ACTIVE",
    ).length;
    const pendingCount = brandOwners.filter(
        (item) => item.accountStatus === "PENDING",
    ).length;

    async function loadBrandOwners() {
        try {
            setLoading(true);
            setError(null);
            const response = await getBrandOwners({ page: 1, limit: 100 });
            setBrandOwners(response.data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Brand Owners could not be loaded.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBrandOwners();
    }, []);

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-textPrimary">
                            Brand Owners
                        </h2>
                        <p className="mt-1 text-sm text-textSecondary">
                            Create tenant accounts, review onboarding, and control lifecycle status.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Total", value: brandOwners.length },
                                { label: "Active", value: activeCount },
                                { label: "Pending", value: pendingCount },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-borderSoft bg-cardMuted px-4 py-3"
                                >
                                    <p className="text-xs font-medium text-textSecondary">
                                        {item.label}
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold text-textPrimary">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/admin/brand-owners/new"
                            className="rounded-2xl bg-sidebar px-5 py-3 text-center text-sm font-medium text-white shadow-sm"
                        >
                            New Brand Owner
                        </Link>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-borderSoft bg-white p-5 shadow-sm">
                <label className="text-sm font-medium text-textPrimary">
                    Search
                </label>
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by business, owner, email, phone, or location"
                    className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                />
            </section>

            <section className="overflow-hidden rounded-2xl border border-borderSoft bg-white shadow-sm">
                {loading ? (
                    <div className="p-8 text-sm text-textSecondary">
                        Loading Brand Owners...
                    </div>
                ) : error ? (
                    <div className="space-y-4 p-8">
                        <p className="text-sm font-medium text-red-600">{error}</p>
                        <button
                            type="button"
                            onClick={loadBrandOwners}
                            className="rounded-2xl bg-sidebar px-4 py-2 text-sm font-medium text-white"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredBrandOwners.length === 0 ? (
                    <div className="p-8 text-sm text-textSecondary">
                        No Brand Owners found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-borderSoft bg-cardMuted text-left text-textSecondary">
                                <tr>
                                    <th className="px-5 py-4 font-medium">
                                        Business Name
                                    </th>
                                    <th className="px-5 py-4 font-medium">Email</th>
                                    <th className="px-5 py-4 font-medium">Phone</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">
                                        Created At
                                    </th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBrandOwners.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-borderSoft last:border-b-0"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-textPrimary">
                                                {item.businessName}
                                            </div>
                                            <div className="mt-1 text-xs text-textSecondary">
                                                {item.ownerName}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-textPrimary">
                                            {item.email}
                                        </td>
                                        <td className="px-5 py-4 text-textPrimary">
                                            {item.phone || "-"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={item.accountStatus} />
                                        </td>
                                        <td className="px-5 py-4 text-textPrimary">
                                            {formatDate(item.createdAt)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/admin/brand-owners/${item.id}`}
                                                className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textPrimary hover:bg-cardMuted"
                                            >
                                                View
                                            </Link>
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
