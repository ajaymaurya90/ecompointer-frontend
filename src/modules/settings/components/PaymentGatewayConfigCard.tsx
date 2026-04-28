"use client";

import { CreditCard, KeyRound, ShieldCheck, Star, ToggleLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type {
    AvailablePaymentGateway,
    PaymentGatewayMode,
    TenantPaymentGatewayConfig,
    UpsertTenantPaymentGatewayPayload,
} from "@/modules/settings/types/paymentGateway";

type PaymentGatewayConfigCardProps = {
    gateway: AvailablePaymentGateway;
    isBusy: boolean;
    onCreateConfig: (
        gateway: AvailablePaymentGateway,
        mode: PaymentGatewayMode,
        usePlatformTestCredentials?: boolean,
    ) => Promise<void>;
    onUpdateConfig: (
        config: TenantPaymentGatewayConfig,
        data: UpsertTenantPaymentGatewayPayload,
    ) => Promise<void>;
    onSetDefault: (config: TenantPaymentGatewayConfig) => Promise<void>;
    onEditCredentials: (
        gateway: AvailablePaymentGateway,
        config: TenantPaymentGatewayConfig,
    ) => void;
};

export default function PaymentGatewayConfigCard({
    gateway,
    isBusy,
    onCreateConfig,
    onUpdateConfig,
    onSetDefault,
    onEditCredentials,
}: PaymentGatewayConfigCardProps) {
    const initialMode = gateway.supportsTestMode ? "TEST" : "LIVE";
    const [mode, setMode] = useState<PaymentGatewayMode>(initialMode);

    const availableModes = useMemo(() => {
        const modes: PaymentGatewayMode[] = [];
        if (gateway.supportsTestMode) modes.push("TEST");
        if (gateway.supportsLiveMode) modes.push("LIVE");
        return modes;
    }, [gateway.supportsLiveMode, gateway.supportsTestMode]);

    const config =
        gateway.tenantConfigs.find((item) => item.mode === mode) ?? null;
    const isMockTestMode = gateway.code === "MOCK" && mode === "TEST";
    const canEnable = Boolean(
        isMockTestMode ||
            config?.hasCredentials ||
            (mode === "TEST" && config?.usePlatformTestCredentials),
    );
    const needsCredentialsMessage =
        config && !canEnable
            ? "Add credentials or enable platform test credentials for TEST mode first."
            : null;

    async function handleToggleEnabled() {
        if (!config) return;
        await onUpdateConfig(config, { isEnabled: !config.isEnabled });
    }

    async function handleTogglePlatformTestCredentials() {
        if (mode !== "TEST") return;

        if (config) {
            await onUpdateConfig(config, {
                usePlatformTestCredentials: !config.usePlatformTestCredentials,
            });
            return;
        }

        await onCreateConfig(gateway, "TEST", true);
    }

    return (
        <article className="rounded-3xl border border-borderSoft bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {gateway.displayName}
                            </h2>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <code className="rounded-lg bg-slate-100 px-2 py-1 text-slate-700">
                                    {gateway.code}
                                </code>
                                {gateway.supportsTestMode ? (
                                    <span className="rounded-full bg-indigo-50 px-2 py-1 font-semibold text-indigo-700">
                                        TEST
                                    </span>
                                ) : null}
                                {gateway.supportsLiveMode ? (
                                    <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
                                        LIVE
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {gateway.description ? (
                        <p className="mt-4 text-sm leading-6 text-slate-500">
                            {gateway.description}
                        </p>
                    ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                    {config?.isDefault ? (
                        <StatusPill tone="amber">Default</StatusPill>
                    ) : null}
                    <StatusPill tone={config?.isEnabled ? "green" : "slate"}>
                        {config?.isEnabled ? "Enabled" : "Disabled"}
                    </StatusPill>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Mode
                    </span>
                    <select
                        value={mode}
                        onChange={(event) =>
                            setMode(event.target.value as PaymentGatewayMode)
                        }
                        className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-sidebar"
                    >
                        {availableModes.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </label>

                <InfoTile
                    icon={<KeyRound size={18} />}
                    label="Credentials"
                    value={
                        isMockTestMode
                            ? "Not required"
                            : config?.hasCredentials
                            ? config.credentialMeta?.maskedKeyId ||
                              "Configured"
                            : "Not configured"
                    }
                />

                <InfoTile
                    icon={<ShieldCheck size={18} />}
                    label="Platform Test"
                    value={
                        mode === "TEST"
                            ? gateway.code === "MOCK"
                                ? "Not required"
                                : config?.usePlatformTestCredentials
                                ? "Enabled"
                                : "Disabled"
                            : "Not available in LIVE"
                    }
                />
            </div>

            {needsCredentialsMessage ? (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {needsCredentialsMessage}
                </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
                {!config ? (
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onCreateConfig(gateway, mode)}
                        className="rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Create {mode} Config
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            disabled={isBusy || (!config.isEnabled && !canEnable)}
                            onClick={handleToggleEnabled}
                            className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ToggleLeft size={17} />
                            {config.isEnabled ? "Disable" : "Enable"}
                        </button>
                        <button
                            type="button"
                            disabled={isBusy || isMockTestMode}
                            onClick={() => onEditCredentials(gateway, config)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-borderSoft px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <KeyRound size={17} />
                            Update Credentials
                        </button>
                        <button
                            type="button"
                            disabled={isBusy || !config.isEnabled || config.isDefault}
                            onClick={() => onSetDefault(config)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-borderSoft px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Star size={17} />
                            Set Default
                        </button>
                    </>
                )}

                {mode === "TEST" && gateway.code !== "MOCK" ? (
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={handleTogglePlatformTestCredentials}
                        className="rounded-2xl border border-borderSoft px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {config?.usePlatformTestCredentials
                            ? "Disable Platform Test Credentials"
                            : "Enable Platform Test Credentials"}
                    </button>
                ) : null}
            </div>
        </article>
    );
}

function InfoTile({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-borderSoft bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {icon}
                {label}
            </div>
            <div className="mt-2 truncate text-sm font-semibold text-slate-900">
                {value}
            </div>
        </div>
    );
}

function StatusPill({
    children,
    tone,
}: {
    children: ReactNode;
    tone: "green" | "slate" | "amber";
}) {
    const classes = {
        green: "bg-emerald-50 text-emerald-700",
        slate: "bg-slate-100 text-slate-600",
        amber: "bg-amber-50 text-amber-700",
    };

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes[tone]}`}>
            {children}
        </span>
    );
}
