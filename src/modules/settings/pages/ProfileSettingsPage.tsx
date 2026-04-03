"use client";

/**
 * ---------------------------------------------------------
 * PROFILE SETTINGS PAGE
 * ---------------------------------------------------------
 * Purpose:
 * Handles authenticated user profile settings and, for
 * Brand Owners only, also manages shop-order rules used
 * in wholesale/shop-owner ordering flows.
 *
 * Page Pattern:
 * 1. Load profile and optional BO rules
 * 2. Keep profile form and rules form in separate UI states
 * 3. Normalize payloads before save
 * 4. Save each section independently
 * ---------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "@/modules/auth/api/authApi";
import {
    getMyBrandOwnerShopOrderRules,
    updateMyBrandOwnerShopOrderRules,
} from "@/modules/brand-owners/api/brandOwnersApi";
import { cleanString, requiredString } from "@/lib/utils/formHelpers";
import type {
    AuthProfileResponse,
    UpdateProfilePayload,
} from "@/modules/auth/types/auth";
import type { BrandOwnerShopOrderRules } from "@/modules/brand-owners/types/brandOwner";

type ProfileFormState = {
    firstName: string;
    lastName: string;
    phone: string;
    businessName: string;
};

type ShopOrderRulesFormState = {
    minShopOrderLineQty: number;
    minShopOrderCartQty: number;
    allowBelowMinLineQtyAfterCartMin: boolean;
};

const initialProfileFormState: ProfileFormState = {
    firstName: "",
    lastName: "",
    phone: "",
    businessName: "",
};

const initialRulesState: ShopOrderRulesFormState = {
    minShopOrderLineQty: 3,
    minShopOrderCartQty: 10,
    allowBelowMinLineQtyAfterCartMin: true,
};

export default function ProfileSettingsPage() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSavingRules, setIsSavingRules] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [profile, setProfile] = useState<AuthProfileResponse | null>(null);
    const [shopOrderRules, setShopOrderRules] = useState<BrandOwnerShopOrderRules | null>(null);

    // Store account profile fields in their own UI state.
    const [form, setForm] = useState<ProfileFormState>(initialProfileFormState);

    // Store BO shop-order rules separately to keep concerns clean.
    const [rulesForm, setRulesForm] = useState<ShopOrderRulesFormState>(initialRulesState);

    useEffect(() => {
        void loadProfile();
    }, []);

    // Load profile and BO-specific rule data when page opens.
    async function loadProfile() {
        try {
            setIsInitialLoading(true);
            setError(null);

            const data = await getMyProfile();
            setProfile(data);

            setForm({
                firstName: data.firstName || "",
                lastName: data.lastName || "",
                phone: data.phone || "",
                businessName: data.business?.businessName || "",
            });

            // Load BO-only order rules when current user is a Brand Owner.
            if (data.role === "BRAND_OWNER") {
                const rules = await getMyBrandOwnerShopOrderRules();
                setShopOrderRules(rules);

                setRulesForm({
                    minShopOrderLineQty: rules.minShopOrderLineQty,
                    minShopOrderCartQty: rules.minShopOrderCartQty,
                    allowBelowMinLineQtyAfterCartMin:
                        rules.allowBelowMinLineQtyAfterCartMin,
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load profile");
        } finally {
            setIsInitialLoading(false);
        }
    }

    // Update one profile form field.
    function handleInputChange<K extends keyof ProfileFormState>(
        key: K,
        value: ProfileFormState[K]
    ) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
        setError(null);
        setSuccessMessage(null);
    }

    // Update one BO shop-order rule field.
    function handleRulesChange<K extends keyof ShopOrderRulesFormState>(
        key: K,
        value: ShopOrderRulesFormState[K]
    ) {
        setRulesForm((prev) => ({
            ...prev,
            [key]: value,
        }));
        setError(null);
        setSuccessMessage(null);
    }

    // Build normalized profile payload before save.
    function buildProfilePayload(): UpdateProfilePayload {
        return {
            firstName: requiredString(form.firstName),
            lastName: requiredString(form.lastName),
            phone: requiredString(form.phone),
            ...(profile?.role === "BRAND_OWNER"
                ? { businessName: cleanString(form.businessName) ?? "" }
                : {}),
        };
    }

    // Build normalized BO shop-order rules payload before save.
    function buildRulesPayload() {
        return {
            minShopOrderLineQty: Number(rulesForm.minShopOrderLineQty),
            minShopOrderCartQty: Number(rulesForm.minShopOrderCartQty),
            allowBelowMinLineQtyAfterCartMin:
                rulesForm.allowBelowMinLineQtyAfterCartMin,
        };
    }

    // Save account profile section.
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            const updated = await updateMyProfile(buildProfilePayload());
            setProfile(updated);

            setForm({
                firstName: updated.firstName || "",
                lastName: updated.lastName || "",
                phone: updated.phone || "",
                businessName: updated.business?.businessName || form.businessName,
            });

            setSuccessMessage("Profile updated successfully.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    }

    // Save BO shop-order rule section.
    async function handleRulesSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSavingRules(true);
            setError(null);
            setSuccessMessage(null);

            const updatedRules = await updateMyBrandOwnerShopOrderRules(
                buildRulesPayload()
            );

            setShopOrderRules(updatedRules);
            setRulesForm({
                minShopOrderLineQty: updatedRules.minShopOrderLineQty,
                minShopOrderCartQty: updatedRules.minShopOrderCartQty,
                allowBelowMinLineQtyAfterCartMin:
                    updatedRules.allowBelowMinLineQtyAfterCartMin,
            });

            setSuccessMessage("Shop order rules updated successfully.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update shop order rules");
        } finally {
            setIsSavingRules(false);
        }
    }

    if (isInitialLoading) {
        return (
            <div className="rounded-3xl border border-borderSoft bg-white p-8">
                <div className="text-lg font-semibold text-slate-900">Profile</div>
                <p className="mt-2 text-sm text-slate-500">Loading profile settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-borderSoft bg-white p-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
                    <p className="text-sm text-slate-500">
                        Manage your personal details, business identity, and shop order rules.
                    </p>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {successMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                </div>
            ) : null}

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-borderSoft bg-white p-8"
            >
                <div className="mb-6 flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {profile?.firstName} {profile?.lastName || ""}
                    </h2>
                    <p className="text-sm text-slate-500">
                        Update your account details used across your workspace.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            placeholder="Enter first name"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            placeholder="Enter last name"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Phone
                        </label>
                        <input
                            type="text"
                            value={form.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="Enter phone number"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            className="w-full cursor-not-allowed rounded-2xl border border-borderSoft bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                        />
                    </div>

                    {profile?.role === "BRAND_OWNER" ? (
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Business Name
                            </label>
                            <input
                                type="text"
                                value={form.businessName}
                                onChange={(e) => handleInputChange("businessName", e.target.value)}
                                placeholder="Enter business name"
                                className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                            />
                        </div>
                    ) : null}
                </div>

                <div className="mt-8 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-800">
                        Account summary
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-3">
                        <div>
                            <span className="font-medium text-slate-800">Role:</span>{" "}
                            {profile?.role || "-"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-800">Email:</span>{" "}
                            {profile?.email || "-"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-800">Business:</span>{" "}
                            {profile?.business?.businessName || "-"}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        // Reload full profile state back from server.
                        onClick={() => void loadProfile()}
                        className="rounded-2xl border border-borderSoft px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save Profile"}
                    </button>
                </div>
            </form>

            {profile?.role === "BRAND_OWNER" ? (
                <form
                    onSubmit={handleRulesSubmit}
                    className="rounded-3xl border border-borderSoft bg-white p-8"
                >
                    <div className="mb-6 flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Shop Order Rules
                        </h2>
                        <p className="text-sm text-slate-500">
                            Define minimum quantity rules for shop-owner orders placed against your catalog.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Minimum Line Quantity
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={rulesForm.minShopOrderLineQty}
                                onChange={(e) =>
                                    handleRulesChange(
                                        "minShopOrderLineQty",
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Minimum quantity required per line item.
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Minimum Cart Quantity
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={rulesForm.minShopOrderCartQty}
                                onChange={(e) =>
                                    handleRulesChange(
                                        "minShopOrderCartQty",
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Minimum total quantity required in the full cart.
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-start gap-3 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                                <input
                                    type="checkbox"
                                    checked={rulesForm.allowBelowMinLineQtyAfterCartMin}
                                    onChange={(e) =>
                                        handleRulesChange(
                                            "allowBelowMinLineQtyAfterCartMin",
                                            e.target.checked
                                        )
                                    }
                                    className="mt-1 h-4 w-4 rounded border-slate-300"
                                />
                                <div>
                                    <div className="text-sm font-medium text-slate-800">
                                        Allow below line minimum after cart minimum is reached
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        When enabled, smaller line quantities are allowed once the
                                        full cart quantity reaches the minimum cart threshold.
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                        <div className="mb-2 text-sm font-semibold text-slate-800">
                            Rule preview
                        </div>

                        <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-3">
                            <div>
                                <span className="font-medium text-slate-800">Line Min:</span>{" "}
                                {rulesForm.minShopOrderLineQty}
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Cart Min:</span>{" "}
                                {rulesForm.minShopOrderCartQty}
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Override:</span>{" "}
                                {rulesForm.allowBelowMinLineQtyAfterCartMin ? "Allowed" : "Strict"}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            // Reset rule form back to last saved BO rule values.
                            onClick={() => {
                                if (shopOrderRules) {
                                    setRulesForm({
                                        minShopOrderLineQty:
                                            shopOrderRules.minShopOrderLineQty,
                                        minShopOrderCartQty:
                                            shopOrderRules.minShopOrderCartQty,
                                        allowBelowMinLineQtyAfterCartMin:
                                            shopOrderRules.allowBelowMinLineQtyAfterCartMin,
                                    });
                                }
                            }}
                            className="rounded-2xl border border-borderSoft px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Reset Rules
                        </button>

                        <button
                            type="submit"
                            disabled={isSavingRules}
                            className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSavingRules ? "Saving..." : "Save Shop Order Rules"}
                        </button>
                    </div>
                </form>
            ) : null}
        </div>
    );
}