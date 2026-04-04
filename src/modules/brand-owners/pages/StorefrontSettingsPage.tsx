"use client";

/**
 * ---------------------------------------------------------
 * STOREFRONT SETTINGS PAGE
 * ---------------------------------------------------------
 * Purpose:
 * Allows Brand Owner to manage storefront branding,
 * customer-facing content, support details, and theme
 * activation from admin.
 * ---------------------------------------------------------
 */

import { useEffect, useState } from "react";
import {
    getMyBrandOwnerStorefrontSettings,
    updateMyBrandOwnerStorefrontSettings,
} from "@/modules/brand-owners/api/brandOwnersApi";
import type {
    BrandOwnerStorefrontSettings,
    UpdateBrandOwnerStorefrontSettingsPayload,
} from "@/modules/brand-owners/types/brandOwner";
import StorefrontDomainsCard from "@/modules/brand-owners/components/StorefrontDomainsCard";

type FormState = {
    storefrontName: string;
    storefrontLogoUrl: string;
    storefrontTagline: string;
    storefrontShortDescription: string;
    storefrontAboutDescription: string;
    storefrontSupportEmail: string;
    storefrontSupportPhone: string;
    isStorefrontEnabled: boolean;
    isGuestCheckoutEnabled: boolean;
    isCustomerRegistrationEnabled: boolean;
    activeStorefrontThemeCode: string;
    isStorefrontThemeActive: boolean;
};

const initialFormState: FormState = {
    storefrontName: "",
    storefrontLogoUrl: "",
    storefrontTagline: "",
    storefrontShortDescription: "",
    storefrontAboutDescription: "",
    storefrontSupportEmail: "",
    storefrontSupportPhone: "",
    isStorefrontEnabled: false,
    isGuestCheckoutEnabled: true,
    isCustomerRegistrationEnabled: true,
    activeStorefrontThemeCode: "default",
    isStorefrontThemeActive: true,
};

export default function StorefrontSettingsPage() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [settings, setSettings] = useState<BrandOwnerStorefrontSettings | null>(null);
    const [form, setForm] = useState<FormState>(initialFormState);

    // Load BO storefront settings on initial page mount.
    useEffect(() => {
        void loadSettings();
    }, []);

    // Fetch current backend settings and hydrate local form state.
    async function loadSettings() {
        try {
            setIsInitialLoading(true);
            setError(null);

            const data = await getMyBrandOwnerStorefrontSettings();
            setSettings(data);

            setForm({
                storefrontName: data.storefrontName || "",
                storefrontLogoUrl: data.storefrontLogoUrl || "",
                storefrontTagline: data.storefrontTagline || "",
                storefrontShortDescription: data.storefrontShortDescription || "",
                storefrontAboutDescription: data.storefrontAboutDescription || "",
                storefrontSupportEmail: data.storefrontSupportEmail || "",
                storefrontSupportPhone: data.storefrontSupportPhone || "",
                isStorefrontEnabled: data.isStorefrontEnabled,
                isGuestCheckoutEnabled: data.isGuestCheckoutEnabled,
                isCustomerRegistrationEnabled: data.isCustomerRegistrationEnabled,
                activeStorefrontThemeCode: data.activeStorefrontThemeCode || "default",
                isStorefrontThemeActive: data.isStorefrontThemeActive,
            });
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load storefront settings"
            );
        } finally {
            setIsInitialLoading(false);
        }
    }

    // Update one field in the local controlled form state.
    function handleInputChange<K extends keyof FormState>(
        key: K,
        value: FormState[K]
    ) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
        setError(null);
        setSuccessMessage(null);
    }

    // Persist BO storefront settings to backend using flattened admin payload.
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            const payload: UpdateBrandOwnerStorefrontSettingsPayload = {
                storefrontName: form.storefrontName.trim(),
                storefrontLogoUrl: form.storefrontLogoUrl.trim(),
                storefrontTagline: form.storefrontTagline.trim(),
                storefrontShortDescription: form.storefrontShortDescription.trim(),
                storefrontAboutDescription: form.storefrontAboutDescription.trim(),
                storefrontSupportEmail: form.storefrontSupportEmail.trim(),
                storefrontSupportPhone: form.storefrontSupportPhone.trim(),
                isStorefrontEnabled: form.isStorefrontEnabled,
                isGuestCheckoutEnabled: form.isGuestCheckoutEnabled,
                isCustomerRegistrationEnabled: form.isCustomerRegistrationEnabled,
                activeStorefrontThemeCode: form.activeStorefrontThemeCode.trim(),
                isStorefrontThemeActive: form.isStorefrontThemeActive,
            };

            const updated = await updateMyBrandOwnerStorefrontSettings(payload);
            setSettings(updated);

            setForm({
                storefrontName: updated.storefrontName || "",
                storefrontLogoUrl: updated.storefrontLogoUrl || "",
                storefrontTagline: updated.storefrontTagline || "",
                storefrontShortDescription: updated.storefrontShortDescription || "",
                storefrontAboutDescription: updated.storefrontAboutDescription || "",
                storefrontSupportEmail: updated.storefrontSupportEmail || "",
                storefrontSupportPhone: updated.storefrontSupportPhone || "",
                isStorefrontEnabled: updated.isStorefrontEnabled,
                isGuestCheckoutEnabled: updated.isGuestCheckoutEnabled,
                isCustomerRegistrationEnabled: updated.isCustomerRegistrationEnabled,
                activeStorefrontThemeCode: updated.activeStorefrontThemeCode || "default",
                isStorefrontThemeActive: updated.isStorefrontThemeActive,
            });

            setSuccessMessage("Storefront settings updated successfully.");
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update storefront settings"
            );
        } finally {
            setIsSaving(false);
        }
    }

    if (isInitialLoading) {
        return (
            <div className="rounded-3xl border border-borderSoft bg-white p-8">
                <div className="text-lg font-semibold text-slate-900">
                    Storefront Settings
                </div>
                <p className="mt-2 text-sm text-slate-500">
                    Loading storefront settings...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-borderSoft bg-white p-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Storefront Settings
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage storefront branding, content, support contact, and theme activation.
                    </p>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {Array.isArray(error) ? error.join(", ") : error}
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
                        Branding & Content
                    </h2>
                    <p className="text-sm text-slate-500">
                        These values will be shown on your customer storefront.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Storefront Name
                        </label>
                        <input
                            type="text"
                            value={form.storefrontName}
                            onChange={(e) =>
                                handleInputChange("storefrontName", e.target.value)
                            }
                            placeholder="Enter storefront name"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Storefront Logo URL
                        </label>
                        <input
                            type="text"
                            value={form.storefrontLogoUrl}
                            onChange={(e) =>
                                handleInputChange("storefrontLogoUrl", e.target.value)
                            }
                            placeholder="Enter logo image URL"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Tagline
                        </label>
                        <input
                            type="text"
                            value={form.storefrontTagline}
                            onChange={(e) =>
                                handleInputChange("storefrontTagline", e.target.value)
                            }
                            placeholder="Enter storefront tagline"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Short Description
                        </label>
                        <textarea
                            rows={3}
                            value={form.storefrontShortDescription}
                            onChange={(e) =>
                                handleInputChange(
                                    "storefrontShortDescription",
                                    e.target.value
                                )
                            }
                            placeholder="Enter short storefront description"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            About Description
                        </label>
                        <textarea
                            rows={6}
                            value={form.storefrontAboutDescription}
                            onChange={(e) =>
                                handleInputChange(
                                    "storefrontAboutDescription",
                                    e.target.value
                                )
                            }
                            placeholder="Enter detailed storefront about content"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>
                </div>

                <div className="mb-6 mt-10 flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Support & Theme
                    </h2>
                    <p className="text-sm text-slate-500">
                        Configure customer support and active storefront theme.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Support Email
                        </label>
                        <input
                            type="email"
                            value={form.storefrontSupportEmail}
                            onChange={(e) =>
                                handleInputChange(
                                    "storefrontSupportEmail",
                                    e.target.value
                                )
                            }
                            placeholder="Enter support email"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Support Phone
                        </label>
                        <input
                            type="text"
                            value={form.storefrontSupportPhone}
                            onChange={(e) =>
                                handleInputChange(
                                    "storefrontSupportPhone",
                                    e.target.value
                                )
                            }
                            placeholder="Enter support phone"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Active Theme Code
                        </label>
                        <input
                            type="text"
                            value={form.activeStorefrontThemeCode}
                            onChange={(e) =>
                                handleInputChange(
                                    "activeStorefrontThemeCode",
                                    e.target.value
                                )
                            }
                            placeholder="default"
                            className="w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="flex items-start gap-3 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                        <input
                            type="checkbox"
                            checked={form.isStorefrontEnabled}
                            onChange={(e) =>
                                handleInputChange(
                                    "isStorefrontEnabled",
                                    e.target.checked
                                )
                            }
                            className="mt-1 h-4 w-4 rounded border-slate-300"
                        />
                        <div>
                            <div className="text-sm font-medium text-slate-800">
                                Storefront Enabled
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                                Customers can access your storefront when enabled.
                            </div>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                        <input
                            type="checkbox"
                            checked={form.isGuestCheckoutEnabled}
                            onChange={(e) =>
                                handleInputChange(
                                    "isGuestCheckoutEnabled",
                                    e.target.checked
                                )
                            }
                            className="mt-1 h-4 w-4 rounded border-slate-300"
                        />
                        <div>
                            <div className="text-sm font-medium text-slate-800">
                                Guest Checkout Enabled
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                                Allow customers to place orders without login.
                            </div>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                        <input
                            type="checkbox"
                            checked={form.isCustomerRegistrationEnabled}
                            onChange={(e) =>
                                handleInputChange(
                                    "isCustomerRegistrationEnabled",
                                    e.target.checked
                                )
                            }
                            className="mt-1 h-4 w-4 rounded border-slate-300"
                        />
                        <div>
                            <div className="text-sm font-medium text-slate-800">
                                Customer Registration Enabled
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                                Allow new customers to register storefront accounts.
                            </div>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                        <input
                            type="checkbox"
                            checked={form.isStorefrontThemeActive}
                            onChange={(e) =>
                                handleInputChange(
                                    "isStorefrontThemeActive",
                                    e.target.checked
                                )
                            }
                            className="mt-1 h-4 w-4 rounded border-slate-300"
                        />
                        <div>
                            <div className="text-sm font-medium text-slate-800">
                                Theme Active
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                                Apply the selected storefront theme when enabled.
                            </div>
                        </div>
                    </label>
                </div>

                <div className="mt-10 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-800">
                        Current storefront summary
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-3">
                        <div>
                            <span className="font-medium text-slate-800">Business:</span>{" "}
                            {settings?.businessName || "-"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-800">Theme:</span>{" "}
                            {form.activeStorefrontThemeCode || "default"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-800">Storefront:</span>{" "}
                            {form.isStorefrontEnabled ? "Enabled" : "Disabled"}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => void loadSettings()}
                        className="rounded-2xl border border-borderSoft px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save Storefront Settings"}
                    </button>
                </div>
            </form>

            <StorefrontDomainsCard />
        </div>
    );
}