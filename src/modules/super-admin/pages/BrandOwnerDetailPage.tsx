"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
    getBrandOwnerDetail,
    updateBrandOwnerStatus,
} from "@/modules/super-admin/api/superAdminApi";
import type {
    AccountStatus,
    BrandOwnerDetail,
} from "@/modules/super-admin/types/superAdmin";

const statusActions: Array<{ label: string; status: AccountStatus }> = [
    { label: "Approve", status: "ACTIVE" },
    { label: "Activate", status: "ACTIVE" },
    { label: "Deactivate", status: "INACTIVE" },
    { label: "Suspend", status: "SUSPENDED" },
];

function formatDate(value?: string | null) {
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

export default function BrandOwnerDetailPage({ id }: { id: string }) {
    const [brandOwner, setBrandOwner] = useState<BrandOwnerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [savingStatus, setSavingStatus] = useState<AccountStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function loadDetail() {
        try {
            setLoading(true);
            setError(null);
            const data = await getBrandOwnerDetail(id);
            setBrandOwner(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Brand Owner detail could not be loaded.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDetail();
    }, [id]);

    async function handleStatus(status: AccountStatus) {
        if (!brandOwner) {
            return;
        }

        try {
            setSavingStatus(status);
            setError(null);
            const updated = await updateBrandOwnerStatus(brandOwner.id, {
                accountStatus: status,
                isVerified: status === "ACTIVE",
            });
            setBrandOwner(updated);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Brand Owner status could not be updated.",
            );
        } finally {
            setSavingStatus(null);
        }
    }

    if (loading) {
        return (
            <div className="rounded-2xl border border-borderSoft bg-white p-8 text-sm text-textSecondary shadow-sm">
                Loading Brand Owner detail...
            </div>
        );
    }

    if (error && !brandOwner) {
        return (
            <div className="space-y-4 rounded-2xl border border-borderSoft bg-white p-8 shadow-sm">
                <p className="text-sm font-medium text-red-600">{error}</p>
                <button
                    type="button"
                    onClick={loadDetail}
                    className="rounded-2xl bg-sidebar px-4 py-2 text-sm font-medium text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!brandOwner) {
        return null;
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <Link
                            href="/admin/brand-owners"
                            className="text-sm font-medium text-textSecondary hover:text-textPrimary"
                        >
                            Back to Brand Owners
                        </Link>
                        <h2 className="mt-3 text-2xl font-semibold text-textPrimary">
                            {brandOwner.businessName}
                        </h2>
                        <p className="mt-1 text-sm text-textSecondary">
                            Read-only profile. Super Admin controls lifecycle only.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={brandOwner.accountStatus} />
                        {statusActions.map((action) => (
                            <button
                                key={action.label}
                                type="button"
                                disabled={
                                    savingStatus !== null ||
                                    brandOwner.accountStatus === action.status
                                }
                                onClick={() => handleStatus(action.status)}
                                className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-semibold text-textPrimary hover:bg-cardMuted disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {savingStatus === action.status
                                    ? "Saving..."
                                    : action.label}
                            </button>
                        ))}
                    </div>
                </div>
                {error ? (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                ) : null}
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <InfoCard title="Personal Info">
                    <InfoItem label="Salutation" value={brandOwner.salutationId || "-"} />
                    <InfoItem label="First Name" value={brandOwner.firstName} />
                    <InfoItem label="Last Name" value={brandOwner.lastName} />
                    <InfoItem label="Owner Name" value={brandOwner.ownerName} />
                </InfoCard>
                <InfoCard title="Contact Info">
                    <InfoItem label="Email" value={brandOwner.email} />
                    <InfoItem label="Phone" value={brandOwner.phone || "-"} />
                    <InfoItem
                        label="Created"
                        value={formatDate(brandOwner.createdAt)}
                    />
                    <InfoItem
                        label="Verified"
                        value={brandOwner.isVerified ? "Yes" : "No"}
                    />
                </InfoCard>
                <InfoCard title="Location">
                    <InfoItem
                        label="Country"
                        value={brandOwner.country?.name || brandOwner.countryId || "-"}
                    />
                    <InfoItem
                        label="State"
                        value={brandOwner.state?.name || brandOwner.stateId || "-"}
                    />
                    <InfoItem
                        label="District"
                        value={brandOwner.district?.name || brandOwner.districtId || "-"}
                    />
                    <InfoItem
                        label="Address Line 1"
                        value={brandOwner.addressLine1 || "-"}
                    />
                    <InfoItem
                        label="Address Line 2"
                        value={brandOwner.addressLine2 || "-"}
                    />
                </InfoCard>
            </section>
        </div>
    );
}

function InfoCard({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-textPrimary">{title}</h3>
            <div className="mt-5 space-y-4">{children}</div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-textSecondary">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-textPrimary">{value}</p>
        </div>
    );
}
