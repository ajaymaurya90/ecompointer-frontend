"use client";

import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "@/modules/auth/api/authApi";
import type {
    AuthProfileResponse,
    UpdateProfilePayload,
} from "@/modules/auth/types/auth";

type FormState = {
    firstName: string;
    lastName: string;
    phone: string;
    businessName: string;
};

const initialFormState: FormState = {
    firstName: "",
    lastName: "",
    phone: "",
    businessName: "",
};

export default function ProfileSettingsPage() {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [profile, setProfile] = useState<AuthProfileResponse | null>(null);
    const [form, setForm] = useState<FormState>(initialFormState);

    useEffect(() => {
        void loadProfile();
    }, []);

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
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load profile");
        } finally {
            setIsInitialLoading(false);
        }
    }

    function handleInputChange<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
        setError(null);
        setSuccessMessage(null);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            const payload: UpdateProfilePayload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                phone: form.phone.trim(),
                ...(profile?.role === "BRAND_OWNER"
                    ? { businessName: form.businessName.trim() }
                    : {}),
            };

            const updated = await updateMyProfile(payload);
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
                        Manage your personal details and business identity.
                    </p>
                </div>
            </div>

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
        </div>
    );
}