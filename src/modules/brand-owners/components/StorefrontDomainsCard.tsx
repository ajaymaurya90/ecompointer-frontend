"use client";

/**
 * ---------------------------------------------------------
 * STOREFRONT DOMAINS CARD
 * ---------------------------------------------------------
 * Purpose:
 * Allows Brand Owner to list, create, update, and delete
 * storefront domains from the admin storefront settings page.
 * ---------------------------------------------------------
 */

import { useEffect, useState } from "react";
import {
    createMyBrandOwnerStorefrontDomain,
    deleteMyBrandOwnerStorefrontDomain,
    getMyBrandOwnerStorefrontDomains,
    updateMyBrandOwnerStorefrontDomain,
} from "@/modules/brand-owners/api/brandOwnersApi";
import type {
    BrandOwnerStorefrontDomain,
} from "@/modules/brand-owners/types/brandOwner";

export default function StorefrontDomainsCard() {
    const [domains, setDomains] = useState<BrandOwnerStorefrontDomain[]>([]);
    const [hostName, setHostName] = useState("");
    const [isPrimary, setIsPrimary] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Load all storefront domains for the current Brand Owner.
    useEffect(() => {
        void loadDomains();
    }, []);

    async function loadDomains() {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getMyBrandOwnerStorefrontDomains();
            setDomains(data);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load storefront domains"
            );
        } finally {
            setIsLoading(false);
        }
    }

    // Submit one new storefront domain owned by current BO.
    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError(null);
            setSuccessMessage(null);

            await createMyBrandOwnerStorefrontDomain({
                hostName,
                isPrimary,
                isActive,
            });

            setHostName("");
            setIsPrimary(false);
            setIsActive(true);
            setSuccessMessage("Storefront domain created successfully.");

            await loadDomains();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create storefront domain"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    // Toggle a boolean field on one existing domain row.
    async function handleToggle(
        domainId: string,
        field: "isPrimary" | "isActive" | "isVerified",
        value: boolean
    ) {
        try {
            setError(null);
            setSuccessMessage(null);

            await updateMyBrandOwnerStorefrontDomain(domainId, {
                [field]: value,
            });

            setSuccessMessage("Storefront domain updated successfully.");
            await loadDomains();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update storefront domain"
            );
        }
    }

    // Delete one storefront domain row from current BO account.
    async function handleDelete(domainId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this storefront domain?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError(null);
            setSuccessMessage(null);

            await deleteMyBrandOwnerStorefrontDomain(domainId);
            setSuccessMessage("Storefront domain deleted successfully.");
            await loadDomains();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to delete storefront domain"
            );
        }
    }

    return (
        <div className="rounded-3xl border border-borderSoft bg-white p-8">
            <div className="mb-6 flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-slate-900">
                    Storefront Domains
                </h2>
                <p className="text-sm text-slate-500">
                    Manage the hostnames that can resolve your storefront.
                </p>
            </div>

            {error ? (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {Array.isArray(error) ? error.join(", ") : error}
                </div>
            ) : null}

            {successMessage ? (
                <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                </div>
            ) : null}

            <form onSubmit={handleCreate} className="mb-8 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Host Name
                        </label>
                        <input
                            type="text"
                            value={hostName}
                            onChange={(e) => setHostName(e.target.value)}
                            placeholder="ayodoya.local:3002 or ayodoya.com"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                            required
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Adding..." : "Add Domain"}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={isPrimary}
                            onChange={(e) => setIsPrimary(e.target.checked)}
                        />
                        Primary domain
                    </label>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                        Active
                    </label>
                </div>
            </form>

            {isLoading ? (
                <div className="text-sm text-slate-500">Loading domains...</div>
            ) : !domains.length ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                    No storefront domains configured yet.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                            <tr>
                                <th className="px-4 py-3 font-medium">Host</th>
                                <th className="px-4 py-3 font-medium">Primary</th>
                                <th className="px-4 py-3 font-medium">Active</th>
                                <th className="px-4 py-3 font-medium">Verified</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {domains.map((domain) => (
                                <tr key={domain.id} className="border-b border-slate-100">
                                    <td className="px-4 py-4 font-medium text-slate-900">
                                        {domain.hostName}
                                    </td>

                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={domain.isPrimary}
                                            onChange={(e) =>
                                                void handleToggle(
                                                    domain.id,
                                                    "isPrimary",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </td>

                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={domain.isActive}
                                            onChange={(e) =>
                                                void handleToggle(
                                                    domain.id,
                                                    "isActive",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </td>

                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={domain.isVerified}
                                            onChange={(e) =>
                                                void handleToggle(
                                                    domain.id,
                                                    "isVerified",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </td>

                                    <td className="px-4 py-4">
                                        <button
                                            type="button"
                                            onClick={() => void handleDelete(domain.id)}
                                            className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}