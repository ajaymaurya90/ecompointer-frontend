"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";
import {
    createMyBrandOwnerSalesChannel,
    getActiveSalesChannelTypes,
    getMyBrandOwnerLanguage,
    getMyBrandOwnerSalesChannelById,
    getMyBrandOwnerStorefrontSettings,
    updateMyBrandOwnerLanguage,
    updateMyBrandOwnerSalesChannelById,
} from "@/modules/brand-owners/api/brandOwnersApi";
import StorefrontDomainsCard from "@/modules/brand-owners/components/StorefrontDomainsCard";
import type {
    BrandOwnerLanguage,
    BrandOwnerSalesChannel,
    BrandOwnerStorefrontSettings,
    SalesChannelTypeMaster,
    SalesChannelType,
} from "@/modules/brand-owners/types/brandOwner";
import SalesChannelServiceAreaManager from "@/modules/settings/components/SalesChannelServiceAreaManager";

type Mode = "create" | "edit";
type TabKey = "general" | "sales-location" | "products" | "theme" | "dashboard";

const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "general", label: "General" },
    { key: "sales-location", label: "Sales Location" },
    { key: "products", label: "Products" },
    { key: "theme", label: "Theme" },
    { key: "dashboard", label: "Dashboard" },
];

const fallbackChannelLabels: Record<SalesChannelType, string> = {
    DIRECT_WEBSITE: "Website",
    SHOP_ORDER: "Shop Order",
    FRANCHISE_SHOP: "Franchise Shop",
    MARKETPLACE: "Marketplace",
    SOCIAL_MEDIA: "Social Media",
    MANUAL: "Manual",
};

const languageOptions = [
    { value: "en", label: "English" },
    { value: "de", label: "German" },
    { value: "hi", label: "Hindi" },
] as const;

export default function SalesChannelEditorPage({
    mode,
    channelId,
}: {
    mode: Mode;
    channelId?: string;
}) {
    const router = useRouter();
    const [channel, setChannel] = useState<BrandOwnerSalesChannel | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>("general");
    const [displayName, setDisplayName] = useState("");
    const [channelType, setChannelType] = useState<SalesChannelType>("DIRECT_WEBSITE");
    const [salesChannelTypeId, setSalesChannelTypeId] = useState("");
    const [salesChannelTypes, setSalesChannelTypes] = useState<SalesChannelTypeMaster[]>([]);
    const [isActive, setIsActive] = useState(true);
    const [language, setLanguage] = useState<"en" | "de" | "hi">("en");
    const [languageProfile, setLanguageProfile] = useState<BrandOwnerLanguage | null>(null);
    const [storefrontSettings, setStorefrontSettings] =
        useState<BrandOwnerStorefrontSettings | null>(null);
    const [isLoading, setIsLoading] = useState(mode === "edit");
    const [isSavingChannel, setIsSavingChannel] = useState(false);
    const [isSavingLanguage, setIsSavingLanguage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const title = mode === "create" ? "Add Sales Channel" : "Sales Channel";
    const selectedChannelType = channel?.channelType || channelType;
    const canUseAdvancedTabs = mode === "edit" && !!channel;
    const pageTitle =
        mode === "create"
            ? "Add Sales Channel"
            : displayName || getChannelTypeLabel(channel, salesChannelTypes) || "Sales Channel";
    const pageSubtitle =
        mode === "create"
            ? "Create a focused channel setup. Advanced tabs become available after creation."
            : `${getChannelTypeLabel(channel, salesChannelTypes) || selectedChannelType} · ${selectedChannelType}`;
    const isSavingGeneral = isSavingChannel || isSavingLanguage;
    const isGeneralSaveDisabled =
        isSavingGeneral || (mode === "create" && !salesChannelTypeId);

    const visibleTabs = useMemo(() => tabs, []);

    useEffect(() => {
        void load();
    }, [channelId, mode]);

    async function load() {
        try {
            setIsLoading(true);
            setError(null);

            const [languageData, storefrontData, channelTypesData, channelData] = await Promise.all([
                getMyBrandOwnerLanguage(),
                getMyBrandOwnerStorefrontSettings(),
                getActiveSalesChannelTypes(),
                mode === "edit" && channelId
                    ? getMyBrandOwnerSalesChannelById(channelId)
                    : Promise.resolve(null),
            ]);

            setSalesChannelTypes(channelTypesData);
            setLanguageProfile(languageData);
            setLanguage((languageData.language as "en" | "de" | "hi") || "en");
            setStorefrontSettings(storefrontData);

            if (channelData) {
                setChannel(channelData);
                setDisplayName(channelData.displayName || getChannelTypeLabel(channelData, channelTypesData));
                setChannelType(channelData.channelType);
                setSalesChannelTypeId(channelData.salesChannelTypeId || "");
                setIsActive(channelData.isActive);
            } else {
                const defaultType =
                    channelTypesData.find((type) => type.code === "DIRECT_WEBSITE") ||
                    channelTypesData[0];

                if (defaultType) {
                    setSalesChannelTypeId(defaultType.id);
                    setChannelType(defaultType.code);
                }
            }
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load sales channel."));
        } finally {
            setIsLoading(false);
        }
    }

    async function saveGeneral(
        nextIsActive?: boolean,
        options?: { silentSuccess?: boolean },
    ) {
        try {
            setIsSavingChannel(true);
            setError(null);
            setSuccessMessage(null);

            if (mode === "create") {
                const created = await createMyBrandOwnerSalesChannel({
                    salesChannelTypeId,
                    displayName: displayName.trim() || null,
                    isActive,
                });

                setSuccessMessage("Sales channel created successfully.");
                router.replace(`/dashboard/settings/sales-channels/${created.id}`);
                return;
            }

            if (!channel) return;

            const updated = await updateMyBrandOwnerSalesChannelById(channel.id, {
                displayName: displayName.trim() || null,
                isActive: nextIsActive ?? isActive,
            });

            setChannel(updated);
            setDisplayName(updated.displayName || getChannelTypeLabel(updated, salesChannelTypes));
            setIsActive(updated.isActive);
            if (!options?.silentSuccess) {
                setSuccessMessage("Sales channel updated successfully.");
            }
        } catch (err) {
            setError(getErrorMessage(err, "Failed to save sales channel."));
            throw err;
        } finally {
            setIsSavingChannel(false);
        }
    }

    async function saveLanguage(options?: { silentSuccess?: boolean }) {
        try {
            setIsSavingLanguage(true);
            setError(null);
            setSuccessMessage(null);

            const updated = await updateMyBrandOwnerLanguage({ language });
            setLanguageProfile(updated);
            setLanguage((updated.language as "en" | "de" | "hi") || "en");
            if (!options?.silentSuccess) {
                setSuccessMessage("Language updated successfully.");
            }
        } catch (err) {
            setError(getErrorMessage(err, "Failed to save language."));
            throw err;
        } finally {
            setIsSavingLanguage(false);
        }
    }

    async function saveGeneralTab() {
        try {
            setError(null);
            setSuccessMessage(null);

            if (mode === "create") {
                await saveGeneral();
                return;
            }

            await saveGeneral(undefined, { silentSuccess: true });
            await saveLanguage({ silentSuccess: true });
            setSuccessMessage("Sales channel settings updated successfully.");
        } catch {
            // Individual save helpers already surface the API error message.
        }
    }

    if (isLoading) {
        return (
            <div className="rounded-3xl border border-borderSoft bg-white p-8">
                <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
                <p className="mt-2 text-sm text-slate-500">Loading channel settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-borderSoft bg-white p-6 shadow-sm">
                <Link
                    href="/dashboard/settings/sales-channels"
                    className="text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                    Back to Sales Channels
                </Link>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{pageTitle}</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {pageSubtitle}
                        </p>
                    </div>
                    {activeTab === "general" ? (
                        <div className="flex flex-wrap items-center gap-3">
                            {mode === "edit" && channel ? (
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isActive
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-600"
                                    }`}>
                                    {isActive ? "Active" : "Inactive"}
                                </span>
                            ) : null}
                            <button
                                type="button"
                                onClick={() => void saveGeneralTab()}
                                disabled={isGeneralSaveDisabled}
                                className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSavingGeneral
                                    ? "Saving..."
                                    : mode === "create"
                                        ? "Create Sales Channel"
                                        : "Save General"}
                            </button>
                        </div>
                    ) : null}
                </div>
            </section>

            {error ? <Message tone="error">{error}</Message> : null}
            {successMessage ? <Message tone="success">{successMessage}</Message> : null}

            <section className="rounded-3xl border border-borderSoft bg-white p-2 shadow-sm">
                <div className="flex flex-wrap gap-2">
                    {visibleTabs.map((tab) => {
                        const isDisabled = mode === "create" && tab.key !== "general";

                        return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => {
                                if (!isDisabled) setActiveTab(tab.key);
                            }}
                            disabled={isDisabled}
                            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:text-slate-300 ${activeTab === tab.key
                                ? "bg-slate-900 text-white disabled:bg-slate-200"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:hover:bg-transparent"
                                }`}
                        >
                            {tab.label}
                        </button>
                        );
                    })}
                </div>
            </section>

            {activeTab === "general" ? (
                <div className="space-y-5">
                    <GeneralTab
                        mode={mode}
                        channel={channel}
                        displayName={displayName}
                        channelType={channelType}
                        salesChannelTypeId={salesChannelTypeId}
                        salesChannelTypes={salesChannelTypes}
                        isActive={isActive}
                        onDisplayNameChange={setDisplayName}
                        onSalesChannelTypeChange={(nextId) => {
                            const nextType = salesChannelTypes.find((type) => type.id === nextId);
                            setSalesChannelTypeId(nextId);
                            if (nextType) setChannelType(nextType.code);
                        }}
                        onActiveChange={setIsActive}
                    />

                    {canUseAdvancedTabs ? (
                        <>
                            <StorefrontDomainsCard />
                            <LanguageCurrencyTab
                                language={language}
                                languageProfile={languageProfile}
                                storefrontSettings={storefrontSettings}
                                onLanguageChange={setLanguage}
                            />
                            {channel ? (
                                <StatusTab
                                    isActive={isActive}
                                    onActiveChange={setIsActive}
                                />
                            ) : null}
                        </>
                    ) : (
                        <>
                            <PlaceholderCard
                                title="Storefront Domain"
                                message="Domain settings become available after the sales channel is created."
                            />
                            <PlaceholderCard
                                title="Language & Currency"
                                message="Language and currency settings become available after the sales channel is created."
                            />
                            <PlaceholderCard
                                title="Status"
                                message="Use the Active setting above for the initial channel status. More status controls become available after creation."
                            />
                        </>
                    )}
                </div>
            ) : null}

            {activeTab === "sales-location" && canUseAdvancedTabs ? (
                <SalesChannelServiceAreaManager
                    selectedChannelType={selectedChannelType}
                    showHeader={false}
                    showChannelSelector={false}
                />
            ) : null}

            {activeTab === "products" && canUseAdvancedTabs ? (
                <PlaceholderCard
                    title="Products"
                    message="Channel-specific product assignment will be available in a future phase."
                />
            ) : null}

            {activeTab === "theme" && canUseAdvancedTabs ? (
                <PlaceholderCard
                    title="Theme"
                    message="Channel theme controls will be available in a future phase."
                />
            ) : null}

            {activeTab === "dashboard" && canUseAdvancedTabs ? (
                <PlaceholderCard
                    title="Dashboard"
                    message="Channel performance insights will be available in a future phase."
                />
            ) : null}
        </div>
    );
}

function GeneralTab({
    mode,
    channel,
    displayName,
    channelType,
    salesChannelTypeId,
    salesChannelTypes,
    isActive,
    onDisplayNameChange,
    onSalesChannelTypeChange,
    onActiveChange,
}: {
    mode: Mode;
    channel: BrandOwnerSalesChannel | null;
    displayName: string;
    channelType: SalesChannelType;
    salesChannelTypeId: string;
    salesChannelTypes: SalesChannelTypeMaster[];
    isActive: boolean;
    onDisplayNameChange: (value: string) => void;
    onSalesChannelTypeChange: (value: string) => void;
    onActiveChange: (value: boolean) => void;
}) {
    return (
        <section className="rounded-3xl border border-borderSoft bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">General Information</h2>
            <p className="mt-1 text-sm text-slate-500">
                Configure the core identity for this sales channel.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block">
                    <span className="text-sm font-medium text-slate-700">Display Name</span>
                    <input
                        value={displayName}
                        onChange={(event) => onDisplayNameChange(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    />
                </label>
                {mode === "create" ? (
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Channel Type</span>
                        <select
                            value={salesChannelTypeId}
                            onChange={(event) => onSalesChannelTypeChange(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                            required
                        >
                            <option value="" disabled>Select channel type</option>
                            {salesChannelTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.label} ({type.code})</option>
                            ))}
                        </select>
                    </label>
                ) : (
                    <InfoField
                        label="Channel Type"
                        value={getChannelTypeLabel(channel, salesChannelTypes) || channelType}
                    />
                )}
                <InfoField label="Primary Channel" value={channelType === "DIRECT_WEBSITE" ? "Yes, default website channel" : "No"} />
                <label className="flex items-center gap-3 rounded-2xl border border-borderSoft bg-slate-50 p-4 text-sm font-medium text-slate-800">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(event) => onActiveChange(event.target.checked)}
                    />
                    Active
                </label>
            </div>
        </section>
    );
}

function LanguageCurrencyTab({
    language,
    languageProfile,
    storefrontSettings,
    onLanguageChange,
}: {
    language: "en" | "de" | "hi";
    languageProfile: BrandOwnerLanguage | null;
    storefrontSettings: BrandOwnerStorefrontSettings | null;
    onLanguageChange: (value: "en" | "de" | "hi") => void;
}) {
    return (
        <section className="rounded-3xl border border-borderSoft bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Language & Currency</h2>
            <p className="mt-1 text-sm text-slate-500">
                Language uses your current Brand Owner language setting. Currency is read from storefront settings for now.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block">
                    <span className="text-sm font-medium text-slate-700">Default Language</span>
                    <select
                        value={language}
                        onChange={(event) => onLanguageChange(event.target.value as "en" | "de" | "hi")}
                        className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                    >
                        {languageOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
                <InfoField label="Default Currency" value={storefrontSettings?.currencyCode || "INR"} />
                <InfoField label="Business" value={languageProfile?.businessName || "-"} />
                <InfoField label="Currency Editing" value="Managed by storefront settings/backend defaults" />
            </div>
        </section>
    );
}

function StatusTab({
    isActive,
    onActiveChange,
}: {
    isActive: boolean;
    onActiveChange: (value: boolean) => void;
}) {
    return (
        <section className="rounded-3xl border border-borderSoft bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Status</h2>
            <p className="mt-1 text-sm text-slate-500">Control whether this channel is available for operations.</p>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-borderSoft bg-slate-50 p-5">
                    <div className="text-sm font-medium text-slate-500">Current Status</div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">{isActive ? "Active" : "Inactive"}</div>
                    <label className="mt-5 flex items-center gap-3 text-sm font-medium text-slate-800">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(event) => onActiveChange(event.target.checked)}
                        />
                        Channel is active
                    </label>
                </div>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                    <div className="text-sm font-semibold text-slate-900">Maintenance Mode</div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Maintenance mode is planned, but backend support is not available yet.
                    </p>
                    <button type="button" disabled className="mt-5 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-400">
                        Coming Soon
                    </button>
                </div>
            </div>
        </section>
    );
}

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-borderSoft bg-slate-50 p-4">
            <div className="text-sm font-medium text-slate-500">{label}</div>
            <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
        </div>
    );
}

function PlaceholderCard({ title, message }: { title: string; message: string }) {
    return (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
        </section>
    );
}

function Message({ tone, children }: { tone: "error" | "success"; children: string }) {
    return (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${tone === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}>
            {children}
        </div>
    );
}

function getErrorMessage(error: unknown, fallback: string) {
    const axiosError = error as AxiosError<{ message?: string | string[] }>;
    const message = axiosError.response?.data?.message;

    if (Array.isArray(message)) return message.join(", ");
    if (message) return message;
    if (error instanceof Error) return error.message;
    return fallback;
}

function getChannelTypeLabel(
    channel: BrandOwnerSalesChannel | null,
    types: SalesChannelTypeMaster[],
) {
    if (!channel) return "";
    return (
        channel.salesChannelType?.label ||
        types.find((type) => type.id === channel.salesChannelTypeId)?.label ||
        types.find((type) => type.code === channel.channelType)?.label ||
        fallbackChannelLabels[channel.channelType] ||
        channel.channelType
    );
}
