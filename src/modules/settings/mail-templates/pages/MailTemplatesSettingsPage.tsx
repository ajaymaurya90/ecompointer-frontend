"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getMyMailTemplates } from "@/modules/settings/mail-templates/api/mailTemplatesApi";
import type { BrandOwnerMailTemplateListItem } from "@/modules/settings/mail-templates/types/mailTemplates";

export default function MailTemplatesSettingsPage() {
    const [templates, setTemplates] = useState<BrandOwnerMailTemplateListItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return templates;

        return templates.filter((template) =>
            [template.name, template.templateKey, template.description || ""]
                .join(" ")
                .toLowerCase()
                .includes(value),
        );
    }, [templates, search]);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            setTemplates(await getMyMailTemplates());
        } catch (err) {
            setError(getErrorMessage(err, "Could not load mail templates."));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, []);

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-borderSoft bg-white p-7">
                <h2 className="text-2xl font-bold text-slate-900">Mail Templates</h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-500">
                    Configure Brand Owner-specific email overrides. Platform defaults
                    remain available whenever your override is inactive or missing.
                </p>
            </section>

            <section className="rounded-3xl border border-borderSoft bg-white p-5">
                <label className="block">
                    <span className="text-sm font-medium text-slate-900">Search</span>
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name, template key, or description"
                        className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sidebar"
                    />
                </label>
            </section>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <section className="overflow-hidden rounded-3xl border border-borderSoft bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-5 py-4">Name</th>
                            <th className="px-5 py-4">Template Key</th>
                            <th className="px-5 py-4">Source</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                                    Loading mail templates...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                                    No mail templates found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((template) => {
                                const hasActiveOverride = Boolean(
                                    template.config?.isActive,
                                );
                                const hasOverride = Boolean(template.config);

                                return (
                                    <tr
                                        key={template.id}
                                        className="border-b border-borderSoft last:border-b-0"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-900">
                                                {template.name}
                                            </div>
                                            <div className="mt-1 max-w-md text-xs text-slate-500">
                                                {template.description || "No description"}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <code className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-800">
                                                {template.templateKey}
                                            </code>
                                        </td>
                                        <td className="px-5 py-4">
                                            <SourceBadge isBrandOverride={hasActiveOverride} />
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">
                                            {hasActiveOverride
                                                ? "Brand override active"
                                                : hasOverride
                                                  ? "Override inactive, using platform default"
                                                  : "Using platform default"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/dashboard/settings/mail-templates/${template.templateKey}`}
                                                className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-50"
                                            >
                                                Configure / Edit
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

function SourceBadge({ isBrandOverride }: { isBrandOverride: boolean }) {
    return (
        <span
            className={`rounded-2xl px-3 py-1 text-xs font-semibold ${
                isBrandOverride
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
            }`}
        >
            {isBrandOverride ? "Brand Override" : "Platform Default"}
        </span>
    );
}

function getErrorMessage(error: unknown, fallback: string) {
    if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
    ) {
        const data = error.response.data as { message?: string | string[] };
        if (Array.isArray(data.message)) return data.message.join(", ");
        if (data.message) return data.message;
    }

    return fallback;
}

