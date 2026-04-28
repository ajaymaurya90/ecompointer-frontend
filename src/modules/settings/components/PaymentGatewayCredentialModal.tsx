"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type {
    AvailablePaymentGateway,
    TenantPaymentGatewayConfig,
} from "@/modules/settings/types/paymentGateway";

type PaymentGatewayCredentialModalProps = {
    gateway: AvailablePaymentGateway;
    config: TenantPaymentGatewayConfig;
    isSaving: boolean;
    onClose: () => void;
    onSave: (credentials: Record<string, string>) => Promise<void>;
};

export default function PaymentGatewayCredentialModal({
    gateway,
    config,
    isSaving,
    onClose,
    onSave,
}: PaymentGatewayCredentialModalProps) {
    const [keyId, setKeyId] = useState("");
    const [secret, setSecret] = useState("");

    useEffect(() => {
        setKeyId("");
        setSecret("");
    }, [config.id]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const credentials: Record<string, string> = {};

        if (!keyId.trim() || !secret.trim()) return;

        credentials.keyId = keyId.trim();
        credentials.secret = secret.trim();

        await onSave(credentials);
    }

    const configuredFields = config.credentialMeta?.configuredFields ?? [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg rounded-3xl border border-borderSoft bg-white p-6 shadow-xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Update Credentials
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {gateway.displayName} - {config.mode} mode. Enter the
                            full credential set to replace the stored secret.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-borderSoft px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {config.hasCredentials ? (
                        <div className="space-y-1">
                            <div>
                                Current credentials are configured
                                {config.credentialMeta?.maskedKeyId
                                    ? ` (${config.credentialMeta.maskedKeyId})`
                                    : "."}
                            </div>
                            {configuredFields.length > 0 ? (
                                <div className="text-xs text-slate-500">
                                    Fields: {configuredFields.join(", ")}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        "No credentials have been added for this mode yet."
                    )}
                </div>

                <div className="mt-5 space-y-4">
                    <label className="block">
                        <span className="text-sm font-semibold text-slate-900">
                            Key ID
                        </span>
                        <input
                            value={keyId}
                            onChange={(event) => setKeyId(event.target.value)}
                            placeholder="Enter gateway key ID"
                            autoComplete="off"
                            className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sidebar"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-semibold text-slate-900">
                            Secret
                        </span>
                        <input
                            value={secret}
                            onChange={(event) => setSecret(event.target.value)}
                            placeholder="Enter gateway secret"
                            type="password"
                            autoComplete="new-password"
                            className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sidebar"
                        />
                    </label>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-2xl border border-borderSoft px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || !keyId.trim() || !secret.trim()}
                        className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Credentials"}
                    </button>
                </div>
            </form>
        </div>
    );
}
