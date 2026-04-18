"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
    getMyResolvedMailTemplate,
    upsertMyMailTemplateConfig,
} from "@/modules/settings/mail-templates/api/mailTemplatesApi";
import type { BrandOwnerResolvedMailTemplate } from "@/modules/settings/mail-templates/types/mailTemplates";

type FormState = {
    subjectOverride: string;
    htmlOverride: string;
    textOverride: string;
    isActive: boolean;
};

export default function MailTemplateConfigPage({
    templateKey,
}: {
    templateKey: string;
}) {
    const [data, setData] = useState<BrandOwnerResolvedMailTemplate | null>(null);
    const [form, setForm] = useState<FormState>({
        subjectOverride: "",
        htmlOverride: "",
        textOverride: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            const result = await getMyResolvedMailTemplate(templateKey);
            setData(result);
            setForm({
                subjectOverride: result.config?.subjectOverride || "",
                htmlOverride: result.config?.htmlOverride || "",
                textOverride: result.config?.textOverride || "",
                isActive: result.config?.isActive ?? true,
            });
        } catch (err) {
            setError(getErrorMessage(err, "Could not load mail template."));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateKey]);

    async function submit(event: FormEvent) {
        event.preventDefault();

        if (
            form.isActive &&
            !form.subjectOverride.trim() &&
            !form.htmlOverride.trim() &&
            !form.textOverride.trim()
        ) {
            setError("Add at least one override field or deactivate the override.");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setMessage(null);
            await upsertMyMailTemplateConfig(templateKey, {
                subjectOverride: form.subjectOverride || null,
                htmlOverride: form.htmlOverride || null,
                textOverride: form.textOverride || null,
                isActive: form.isActive,
            });
            setMessage("Mail template override saved.");
            await load();
        } catch (err) {
            setError(getErrorMessage(err, "Could not save mail template override."));
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="rounded-3xl border border-borderSoft bg-white p-8 text-center text-sm text-slate-500">
                Loading mail template...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error || "Mail template could not be loaded."}
            </div>
        );
    }

    const source = data.config?.isActive ? "Brand Override" : "Platform Default";

    return (
        <form onSubmit={(event) => void submit(event)} className="space-y-6">
            <section className="rounded-3xl border border-borderSoft bg-white p-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <Link
                            href="/dashboard/settings/mail-templates"
                            className="text-sm font-medium text-slate-500 hover:text-slate-900"
                        >
                            Mail Templates
                        </Link>
                        <h2 className="mt-3 text-2xl font-bold text-slate-900">
                            {data.template.name}
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm text-slate-500">
                            Configure your Brand Owner override. If the override is
                            inactive or empty, EcomPointer uses the platform default.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-borderSoft bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Currently resolving to{" "}
                        <span className="font-semibold text-slate-900">{source}</span>
                    </div>
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

            <section className="rounded-3xl border border-borderSoft bg-white p-6">
                <div className="mb-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Platform Default
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Read-only reference from the platform template.
                    </p>
                </div>

                <div className="grid gap-4">
                    <ReadonlyBlock
                        label="Subject"
                        value={data.template.subjectTemplate}
                    />
                    <ReadonlyBlock
                        label="HTML"
                        value={data.template.htmlTemplate}
                        monospace
                    />
                    <ReadonlyBlock
                        label="Text"
                        value={data.template.textTemplate || ""}
                        monospace
                    />
                </div>
            </section>

            <section className="rounded-3xl border border-borderSoft bg-white p-6">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Brand Owner Override
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Leave a field blank to inherit that part from the platform
                            default.
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save Override"}
                    </button>
                </div>

                <div className="grid gap-5">
                    <label className="flex items-center gap-3 rounded-2xl border border-borderSoft bg-slate-50 px-4 py-3">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    isActive: event.target.checked,
                                }))
                            }
                            className="h-4 w-4 rounded border-borderSoft"
                        />
                        <span className="text-sm font-medium text-slate-900">
                            Brand override is active
                        </span>
                    </label>

                    <TextareaField
                        label="Subject Override"
                        value={form.subjectOverride}
                        onChange={(value) =>
                            setForm((current) => ({
                                ...current,
                                subjectOverride: value,
                            }))
                        }
                        rows={2}
                    />
                    <TextareaField
                        label="HTML Override"
                        value={form.htmlOverride}
                        onChange={(value) =>
                            setForm((current) => ({
                                ...current,
                                htmlOverride: value,
                            }))
                        }
                        rows={12}
                        monospace
                    />
                    <TextareaField
                        label="Text Override"
                        value={form.textOverride}
                        onChange={(value) =>
                            setForm((current) => ({
                                ...current,
                                textOverride: value,
                            }))
                        }
                        rows={8}
                        monospace
                    />
                </div>
            </section>
        </form>
    );
}

function ReadonlyBlock({
    label,
    value,
    monospace = false,
}: {
    label: string;
    value: string;
    monospace?: boolean;
}) {
    return (
        <div>
            <div className="text-sm font-medium text-slate-900">{label}</div>
            <pre
                className={`mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl border border-borderSoft bg-slate-50 p-4 text-sm text-slate-700 ${
                    monospace ? "font-mono" : "font-sans"
                }`}
            >
                {value || "No content"}
            </pre>
        </div>
    );
}

function TextareaField({
    label,
    value,
    onChange,
    rows,
    monospace = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows: number;
    monospace?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-slate-900">{label}</span>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={rows}
                className={`mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sidebar ${
                    monospace ? "font-mono" : ""
                }`}
            />
        </label>
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

