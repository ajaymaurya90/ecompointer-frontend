"use client";

import { useEffect, useState } from "react";
import {
    getMyBrandOwnerLanguage,
    updateMyBrandOwnerLanguage,
} from "@/modules/brand-owners/api/brandOwnersApi";
import type {
    BrandOwnerLanguage,
    UpdateBrandOwnerLanguagePayload,
} from "@/modules/brand-owners/types/brandOwner";

const languageOptions: Array<{
    value: "en" | "de" | "hi";
    label: string;
    description: string;
}> = [
        {
            value: "en",
            label: "English",
            description: "Use English as your default workspace language.",
        },
        {
            value: "de",
            label: "German",
            description: "Use German for your workspace and future business flows.",
        },
        {
            value: "hi",
            label: "Hindi",
            description: "Use Hindi as your preferred language.",
        },
    ];

export default function LanguageSettingsPage() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [profile, setProfile] = useState<BrandOwnerLanguage | null>(null);
    const [language, setLanguage] = useState<"en" | "de" | "hi">("en");

    useEffect(() => {
        void loadLanguage();
    }, []);

    async function loadLanguage() {
        try {
            setIsInitialLoading(true);
            setError(null);

            const data = await getMyBrandOwnerLanguage();
            setProfile(data);
            setLanguage((data.language as "en" | "de" | "hi") || "en");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load language settings");
        } finally {
            setIsInitialLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            const payload: UpdateBrandOwnerLanguagePayload = {
                language,
            };

            const updated = await updateMyBrandOwnerLanguage(payload);
            setProfile(updated);
            setLanguage((updated.language as "en" | "de" | "hi") || "en");
            setSuccessMessage("Language settings updated successfully.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update language settings");
        } finally {
            setIsSaving(false);
        }
    }

    if (isInitialLoading) {
        return (
            <div className="rounded-3xl border border-borderSoft bg-white p-8">
                <div className="text-lg font-semibold text-slate-900">Language</div>
                <p className="mt-2 text-sm text-slate-500">Loading language settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-borderSoft bg-white p-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">Language</h1>
                    <p className="text-sm text-slate-500">
                        Choose your default language preference for the workspace.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-borderSoft bg-white p-8"
            >
                <div className="mb-6 flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {profile?.businessName || "Brand Owner"}
                    </h2>
                    <p className="text-sm text-slate-500">
                        Select the preferred default language for your business account.
                    </p>
                </div>

                {error ? (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                {successMessage ? (
                    <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {successMessage}
                    </div>
                ) : null}

                <div className="space-y-4">
                    {languageOptions.map((option) => {
                        const isSelected = language === option.value;

                        return (
                            <label
                                key={option.value}
                                className={`block cursor-pointer rounded-2xl border p-4 transition ${isSelected
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-borderSoft bg-white text-slate-800 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <input
                                        type="radio"
                                        name="language"
                                        value={option.value}
                                        checked={isSelected}
                                        onChange={() => {
                                            setLanguage(option.value);
                                            setError(null);
                                            setSuccessMessage(null);
                                        }}
                                        className="mt-1 h-4 w-4"
                                    />

                                    <div>
                                        <div className="text-sm font-semibold">
                                            {option.label}
                                        </div>
                                        <div
                                            className={`mt-1 text-sm ${isSelected ? "text-slate-200" : "text-slate-500"
                                                }`}
                                        >
                                            {option.description}
                                        </div>
                                    </div>
                                </div>
                            </label>
                        );
                    })}
                </div>

                <div className="mt-8 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-800">
                        Current selection
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-3">
                        <div>
                            <span className="font-medium text-slate-800">Language:</span>{" "}
                            {languageOptions.find((item) => item.value === language)?.label || "-"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-800">Business:</span>{" "}
                            {profile?.businessName || "-"}
                        </div>
                        <div>
                            <span className="font-medium text-slate-800">User:</span>{" "}
                            {profile?.user?.firstName || "-"} {profile?.user?.lastName || ""}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => void loadLanguage()}
                        className="rounded-2xl border border-borderSoft px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Save Language"}
                    </button>
                </div>
            </form>
        </div>
    );
}