"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    getPlatformMailTemplates,
    updatePlatformMailTemplate,
} from "@/modules/super-admin/mail-templates/api/mailTemplatesApi";
import type { MailTemplate } from "@/modules/super-admin/mail-templates/types/mailTemplates";

type StatusFilter = "all" | "active" | "inactive";

export default function MailTemplatesPage() {
    const [templates, setTemplates] = useState<MailTemplate[]>([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const value = search.trim().toLowerCase();

        return templates.filter((template) => {
            const matchesStatus =
                status === "all" ||
                (status === "active" && template.isActive) ||
                (status === "inactive" && !template.isActive);
            const matchesSearch =
                !value ||
                [template.templateKey, template.name, template.description || ""]
                    .join(" ")
                    .toLowerCase()
                    .includes(value);

            return matchesStatus && matchesSearch;
        });
    }, [templates, search, status]);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            setTemplates(await getPlatformMailTemplates());
        } catch (err) {
            setError(getErrorMessage(err, "Could not load mail templates."));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
    }, []);

    async function toggleStatus(template: MailTemplate) {
        try {
            setUpdatingId(template.id);
            setMessage(null);
            setError(null);
            const updated = await updatePlatformMailTemplate(template.id, {
                isActive: !template.isActive,
            });
            setTemplates((current) =>
                current.map((item) => (item.id === updated.id ? updated : item)),
            );
            setMessage(
                `${updated.name} is now ${updated.isActive ? "active" : "inactive"}.`,
            );
        } catch (err) {
            setError(getErrorMessage(err, "Could not update template status."));
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-textPrimary">
                            Mail Templates
                        </h1>
                        <p className="mt-1 max-w-3xl text-sm text-textSecondary">
                            Manage platform default transactional email templates. Brand
                            Owners can override these defaults from their own configuration
                            later.
                        </p>
                    </div>
                    <Link
                        href="/admin/mail-templates/new"
                        className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm"
                    >
                        New Template
                    </Link>
                </div>
            </section>

            <section className="rounded-2xl border border-borderSoft bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                    <label className="block">
                        <span className="text-sm font-medium text-textPrimary">
                            Search
                        </span>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by template key or name"
                            className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-textPrimary">
                            Status
                        </span>
                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value as StatusFilter)
                            }
                            className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </label>
                </div>
            </section>

            {message ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                </div>
            ) : null}

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <section className="overflow-hidden rounded-2xl border border-borderSoft bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-cardMuted text-xs uppercase tracking-wide text-textSecondary">
                        <tr>
                            <th className="px-5 py-4">Name</th>
                            <th className="px-5 py-4">Template Key</th>
                            <th className="px-5 py-4">Description</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Updated At</th>
                            <th className="px-5 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-textSecondary">
                                    Loading mail templates...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-8 text-center text-textSecondary">
                                    No mail templates found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((template) => (
                                <tr
                                    key={template.id}
                                    className="border-b border-borderSoft last:border-b-0"
                                >
                                    <td className="px-5 py-4 font-semibold text-textPrimary">
                                        {template.name}
                                    </td>
                                    <td className="px-5 py-4">
                                        <code className="rounded-lg bg-cardMuted px-2 py-1 text-xs text-textPrimary">
                                            {template.templateKey}
                                        </code>
                                    </td>
                                    <td className="max-w-md px-5 py-4 text-textSecondary">
                                        {template.description || "-"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge isActive={template.isActive} />
                                    </td>
                                    <td className="px-5 py-4 text-textSecondary">
                                        {formatDate(template.updatedAt)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                href={`/admin/mail-templates/${template.id}`}
                                                className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-medium text-textPrimary hover:bg-cardMuted"
                                            >
                                                View / Edit
                                            </Link>
                                            <button
                                                type="button"
                                                disabled={updatingId === template.id}
                                                onClick={() => void toggleStatus(template)}
                                                className="rounded-2xl border border-borderSoft px-3 py-2 text-xs font-medium text-textPrimary hover:bg-cardMuted disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {template.isActive
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
    return (
        <span
            className={`rounded-2xl px-3 py-1 text-xs font-semibold ${
                isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
            }`}
        >
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
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

