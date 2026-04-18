"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    createPlatformMailTemplate,
    getPlatformMailTemplate,
    updatePlatformMailTemplate,
} from "@/modules/super-admin/mail-templates/api/mailTemplatesApi";

type FormState = {
    templateKey: string;
    name: string;
    description: string;
    subjectTemplate: string;
    htmlTemplate: string;
    textTemplate: string;
    isActive: boolean;
};

const emptyForm: FormState = {
    templateKey: "",
    name: "",
    description: "",
    subjectTemplate: "",
    htmlTemplate: "",
    textTemplate: "",
    isActive: true,
};

export default function MailTemplateFormPage({ templateId }: { templateId?: string }) {
    const router = useRouter();
    const isEdit = Boolean(templateId);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!templateId) return;
        const id = templateId;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const template = await getPlatformMailTemplate(id);
                setForm({
                    templateKey: template.templateKey,
                    name: template.name,
                    description: template.description || "",
                    subjectTemplate: template.subjectTemplate,
                    htmlTemplate: template.htmlTemplate,
                    textTemplate: template.textTemplate || "",
                    isActive: template.isActive,
                });
            } catch (err) {
                setError(getErrorMessage(err, "Could not load mail template."));
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [templateId]);

    async function submit(event: FormEvent) {
        event.preventDefault();

        if (!form.name.trim() || !form.subjectTemplate.trim() || !form.htmlTemplate.trim()) {
            setError("Name, subject template, and HTML template are required.");
            return;
        }

        if (!isEdit && !form.templateKey.trim()) {
            setError("Template key is required.");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setMessage(null);

            const payload = {
                name: form.name.trim(),
                description: form.description.trim() || null,
                subjectTemplate: form.subjectTemplate,
                htmlTemplate: form.htmlTemplate,
                textTemplate: form.textTemplate || null,
                isActive: form.isActive,
            };

            if (templateId) {
                await updatePlatformMailTemplate(templateId, payload);
                setMessage("Mail template saved.");
            } else {
                const created = await createPlatformMailTemplate({
                    templateKey: form.templateKey.trim(),
                    ...payload,
                });
                router.replace(`/admin/mail-templates/${created.id}`);
            }
        } catch (err) {
            setError(getErrorMessage(err, "Could not save mail template."));
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="rounded-2xl border border-borderSoft bg-white p-8 text-center text-sm text-textSecondary">
                Loading mail template...
            </div>
        );
    }

    return (
        <form onSubmit={(event) => void submit(event)} className="space-y-6">
            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Link
                            href="/admin/mail-templates"
                            className="text-sm font-medium text-textSecondary hover:text-textPrimary"
                        >
                            Mail Templates
                        </Link>
                        <h1 className="mt-3 text-2xl font-semibold text-textPrimary">
                            {isEdit ? form.name || "Edit Mail Template" : "New Mail Template"}
                        </h1>
                        <p className="mt-1 max-w-3xl text-sm text-textSecondary">
                            Edit platform default email content. Brand Owner overrides
                            will continue to take precedence at send time.
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-2xl bg-sidebar px-5 py-3 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save Template"}
                    </button>
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

            <section className="grid gap-5 rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <TextInput
                        label="Template Key"
                        value={form.templateKey}
                        onChange={(value) =>
                            setForm((current) => ({ ...current, templateKey: value }))
                        }
                        required
                        disabled={isEdit}
                        helper="Stable key used by backend workflows. Read-only after creation."
                    />
                    <TextInput
                        label="Name"
                        value={form.name}
                        onChange={(value) =>
                            setForm((current) => ({ ...current, name: value }))
                        }
                        required
                    />
                </div>

                <label className="block">
                    <span className="text-sm font-medium text-textPrimary">
                        Description
                    </span>
                    <textarea
                        value={form.description}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                description: event.target.value,
                            }))
                        }
                        rows={3}
                        className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar"
                    />
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-borderSoft bg-cardMuted px-4 py-3">
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
                    <span className="text-sm font-medium text-textPrimary">
                        Template is active
                    </span>
                </label>
            </section>

            <section className="grid gap-5 rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <TextareaField
                    label="Subject Template"
                    value={form.subjectTemplate}
                    onChange={(value) =>
                        setForm((current) => ({
                            ...current,
                            subjectTemplate: value,
                        }))
                    }
                    rows={2}
                    required
                />
                <TextareaField
                    label="HTML Template"
                    value={form.htmlTemplate}
                    onChange={(value) =>
                        setForm((current) => ({ ...current, htmlTemplate: value }))
                    }
                    rows={14}
                    required
                    monospace
                />
                <TextareaField
                    label="Text Template"
                    value={form.textTemplate}
                    onChange={(value) =>
                        setForm((current) => ({ ...current, textTemplate: value }))
                    }
                    rows={8}
                    monospace
                />
            </section>
        </form>
    );
}

function TextInput({
    label,
    value,
    onChange,
    required = false,
    disabled = false,
    helper,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    helper?: string;
}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-textPrimary">
                {label}
                {required ? " *" : ""}
            </span>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                required={required}
                disabled={disabled}
                className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar disabled:cursor-not-allowed disabled:bg-cardMuted disabled:text-textSecondary"
            />
            {helper ? (
                <p className="mt-1 text-xs text-textSecondary">{helper}</p>
            ) : null}
        </label>
    );
}

function TextareaField({
    label,
    value,
    onChange,
    rows,
    required = false,
    monospace = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows: number;
    required?: boolean;
    monospace?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-textPrimary">
                {label}
                {required ? " *" : ""}
            </span>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={rows}
                required={required}
                className={`mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-sidebar ${
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
