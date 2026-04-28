"use client";

import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import {
    createCodServiceArea,
    deleteCodServiceArea,
    getAvailablePaymentGateways,
    getBrandOwnerPaymentSetting,
    setDefaultTenantPaymentGateway,
    updateBrandOwnerPaymentSetting,
    updateCodServiceArea,
    updateTenantPaymentGateway,
    updateTenantPaymentGatewayCredentials,
    upsertTenantPaymentGateway,
} from "@/modules/settings/api/paymentGatewayApi";
import CodServiceAreaModal from "@/modules/settings/components/CodServiceAreaModal";
import PaymentGatewayConfigCard from "@/modules/settings/components/PaymentGatewayConfigCard";
import PaymentGatewayCredentialModal from "@/modules/settings/components/PaymentGatewayCredentialModal";
import type {
    AvailablePaymentGateway,
    BrandOwnerPaymentSetting,
    CodAreaMode,
    CodServiceAreaPayload,
    PaymentGatewayMode,
    TenantPaymentGatewayConfig,
    UpsertTenantPaymentGatewayPayload,
} from "@/modules/settings/types/paymentGateway";

type CredentialModalState = {
    gateway: AvailablePaymentGateway;
    config: TenantPaymentGatewayConfig;
} | null;

export default function PaymentGatewaySettingsPage() {
    const [gateways, setGateways] = useState<AvailablePaymentGateway[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [busyKey, setBusyKey] = useState<string | null>(null);
    const [savingCredentials, setSavingCredentials] = useState(false);
    const [paymentSetting, setPaymentSetting] =
        useState<BrandOwnerPaymentSetting | null>(null);
    const [codForm, setCodForm] = useState({
        isCodEnabled: true,
        maxCodAmount: "",
        codAreaMode: "ALL_SERVICEABLE_AREAS" as CodAreaMode,
    });
    const [savingCod, setSavingCod] = useState(false);
    const [codModalOpen, setCodModalOpen] = useState(false);
    const [codModalError, setCodModalError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [credentialModal, setCredentialModal] =
        useState<CredentialModalState>(null);

    const filteredGateways = useMemo(() => {
        const value = search.trim().toLowerCase();
        if (!value) return gateways;

        return gateways.filter((gateway) =>
            [
                gateway.displayName,
                gateway.name,
                gateway.code,
                gateway.description || "",
            ]
                .join(" ")
                .toLowerCase()
                .includes(value),
        );
    }, [gateways, search]);

    useEffect(() => {
        void loadGateways();
        void loadPaymentSetting();
    }, []);

    async function loadGateways() {
        try {
            setLoading(true);
            setError(null);
            setGateways(await getAvailablePaymentGateways());
        } catch (err) {
            setError(getErrorMessage(err, "Could not load payment gateways."));
        } finally {
            setLoading(false);
        }
    }

    async function loadPaymentSetting() {
        try {
            const setting = await getBrandOwnerPaymentSetting();
            setPaymentSetting(setting);
            setCodForm({
                isCodEnabled: setting.isCodEnabled,
                maxCodAmount:
                    setting.maxCodAmount === null || setting.maxCodAmount === undefined
                        ? ""
                        : String(setting.maxCodAmount),
                codAreaMode: setting.codAreaMode,
            });
        } catch (err) {
            setError(getErrorMessage(err, "Could not load COD settings."));
        }
    }

    async function runAction(action: () => Promise<void>, successMessage: string) {
        try {
            setError(null);
            setMessage(null);
            await action();
            setMessage(successMessage);
            await loadGateways();
        } catch (err) {
            setError(getErrorMessage(err, "Payment gateway action failed."));
        } finally {
            setBusyKey(null);
        }
    }

    async function handleCreateConfig(
        gateway: AvailablePaymentGateway,
        mode: PaymentGatewayMode,
        usePlatformTestCredentials = false,
    ) {
        setBusyKey(`${gateway.id}:${mode}:create`);
        await runAction(
            () =>
                upsertTenantPaymentGateway({
                    paymentGatewayId: gateway.paymentGatewayId,
                    mode,
                    isEnabled: false,
                    usePlatformTestCredentials,
                }).then(() => undefined),
            usePlatformTestCredentials
                ? "Platform test credentials enabled for the new TEST config."
                : `${mode} payment gateway config created.`,
        );
    }

    async function handleUpdateConfig(
        config: TenantPaymentGatewayConfig,
        data: UpsertTenantPaymentGatewayPayload,
    ) {
        setBusyKey(config.id);
        await runAction(
            () => updateTenantPaymentGateway(config.id, data).then(() => undefined),
            getUpdateMessage(config, data),
        );
    }

    async function handleSetDefault(config: TenantPaymentGatewayConfig) {
        setBusyKey(config.id);
        await runAction(
            () => setDefaultTenantPaymentGateway(config.id).then(() => undefined),
            `${config.displayName} is now the default payment gateway.`,
        );
    }

    async function handleSaveCredentials(credentials: Record<string, string>) {
        if (!credentialModal) return;

        try {
            setSavingCredentials(true);
            setError(null);
            setMessage(null);
            await updateTenantPaymentGatewayCredentials(credentialModal.config.id, {
                credentials,
            });
            setCredentialModal(null);
            setMessage("Payment gateway credentials updated.");
            await loadGateways();
        } catch (err) {
            setError(getErrorMessage(err, "Could not update credentials."));
        } finally {
            setSavingCredentials(false);
        }
    }

    async function handleSaveCodSettings() {
        try {
            setSavingCod(true);
            setError(null);
            setMessage(null);
            const updated = await updateBrandOwnerPaymentSetting({
                isCodEnabled: codForm.isCodEnabled,
                maxCodAmount: codForm.maxCodAmount.trim()
                    ? Number(codForm.maxCodAmount)
                    : null,
                codAreaMode: codForm.codAreaMode,
            });
            setPaymentSetting(updated);
            setMessage("COD settings updated.");
        } catch (err) {
            setError(getErrorMessage(err, "Could not update COD settings."));
        } finally {
            setSavingCod(false);
        }
    }

    async function handleCreateCodArea(payload: CodServiceAreaPayload) {
        try {
            setCodModalError(null);
            await createCodServiceArea(payload);
            setCodModalOpen(false);
            setMessage("COD service area added.");
            await loadPaymentSetting();
        } catch (err) {
            setCodModalError(getErrorMessage(err, "Could not add COD area."));
        }
    }

    async function handleToggleCodArea(id: string, isActive: boolean) {
        try {
            setBusyKey(id);
            setError(null);
            await updateCodServiceArea(id, { isActive });
            setMessage(`COD area ${isActive ? "activated" : "deactivated"}.`);
            await loadPaymentSetting();
        } catch (err) {
            setError(getErrorMessage(err, "Could not update COD area."));
        } finally {
            setBusyKey(null);
        }
    }

    async function handleDeleteCodArea(id: string) {
        try {
            setBusyKey(id);
            setError(null);
            await deleteCodServiceArea(id);
            setMessage("COD service area deleted.");
            await loadPaymentSetting();
        } catch (err) {
            setError(getErrorMessage(err, "Could not delete COD area."));
        } finally {
            setBusyKey(null);
        }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-borderSoft bg-white p-7 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Payment Gateway
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                            Enable supported payment gateways for your brand, manage
                            TEST and LIVE credentials, and choose the default gateway for
                            checkout later.
                        </p>
                    </div>
                    <label className="w-full lg:max-w-sm">
                        <span className="text-sm font-medium text-slate-900">
                            Search
                        </span>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search gateways"
                            className="mt-2 w-full rounded-2xl border border-borderSoft px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sidebar"
                        />
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

            {loading ? (
                <section className="rounded-3xl border border-borderSoft bg-white p-8 text-sm text-slate-500">
                    Loading payment gateways...
                </section>
            ) : filteredGateways.length === 0 ? (
                <section className="rounded-3xl border border-borderSoft bg-white p-10 text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                        No payment gateways available
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Active payment gateways created by Super Admin will appear here.
                    </p>
                </section>
            ) : (
                <section className="space-y-4">
                    {filteredGateways.map((gateway) => (
                        <PaymentGatewayConfigCard
                            key={gateway.id}
                            gateway={gateway}
                            isBusy={Boolean(busyKey)}
                            onCreateConfig={handleCreateConfig}
                            onUpdateConfig={handleUpdateConfig}
                            onSetDefault={handleSetDefault}
                            onEditCredentials={(selectedGateway, config) =>
                                setCredentialModal({
                                    gateway: selectedGateway,
                                    config,
                                })
                            }
                        />
                    ))}
                </section>
            )}

            {credentialModal ? (
                <PaymentGatewayCredentialModal
                    gateway={credentialModal.gateway}
                    config={credentialModal.config}
                    isSaving={savingCredentials}
                    onClose={() => setCredentialModal(null)}
                    onSave={handleSaveCredentials}
                />
            ) : null}

            <section className="rounded-3xl border border-borderSoft bg-white p-7 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Cash on Delivery
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                            Control whether customers can choose COD, cap the order
                            amount, and optionally restrict COD to selected delivery areas.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSaveCodSettings}
                        disabled={savingCod || !paymentSetting}
                        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {savingCod ? "Saving..." : "Save COD Settings"}
                    </button>
                </div>

                {!paymentSetting ? (
                    <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        Loading COD settings...
                    </div>
                ) : (
                    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <label className="flex items-start gap-3 rounded-2xl border border-borderSoft bg-slate-50 p-4">
                            <input
                                type="checkbox"
                                checked={codForm.isCodEnabled}
                                onChange={(event) =>
                                    setCodForm((current) => ({
                                        ...current,
                                        isCodEnabled: event.target.checked,
                                    }))
                                }
                                className="mt-1 h-4 w-4"
                            />
                            <span>
                                <span className="block text-sm font-semibold text-slate-900">
                                    Enable COD
                                </span>
                                <span className="mt-1 block text-xs text-slate-500">
                                    Customers can place orders and pay on delivery.
                                </span>
                            </span>
                        </label>

                        <label className="block rounded-2xl border border-borderSoft bg-slate-50 p-4">
                            <span className="text-sm font-semibold text-slate-900">
                                Max COD Amount
                            </span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={codForm.maxCodAmount}
                                onChange={(event) =>
                                    setCodForm((current) => ({
                                        ...current,
                                        maxCodAmount: event.target.value,
                                    }))
                                }
                                placeholder="No limit"
                                className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sidebar"
                            />
                        </label>

                        <label className="block rounded-2xl border border-borderSoft bg-slate-50 p-4">
                            <span className="text-sm font-semibold text-slate-900">
                                Area Mode
                            </span>
                            <select
                                value={codForm.codAreaMode}
                                onChange={(event) =>
                                    setCodForm((current) => ({
                                        ...current,
                                        codAreaMode: event.target.value as CodAreaMode,
                                    }))
                                }
                                className="mt-2 w-full rounded-2xl border border-borderSoft bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sidebar"
                            >
                                <option value="ALL_SERVICEABLE_AREAS">
                                    All serviceable areas
                                </option>
                                <option value="SELECTED_AREAS_ONLY">
                                    Selected areas only
                                </option>
                            </select>
                        </label>
                    </div>
                )}

                {paymentSetting?.codAreaMode === "SELECTED_AREAS_ONLY" ? (
                    <div className="mt-7">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-slate-900">
                                COD Service Areas
                            </h3>
                            <button
                                type="button"
                                onClick={() => setCodModalOpen(true)}
                                className="rounded-2xl border border-borderSoft px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            >
                                Add Area
                            </button>
                        </div>

                        {paymentSetting.codServiceAreas.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-borderSoft p-6 text-sm text-slate-500">
                                No selected COD areas yet.
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-borderSoft">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Level</th>
                                            <th className="px-4 py-3">Area</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borderSoft">
                                        {paymentSetting.codServiceAreas.map((area) => (
                                            <tr key={area.id}>
                                                <td className="px-4 py-3 font-medium text-slate-900">
                                                    {area.level}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">
                                                    {getCodAreaLabel(area)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${area.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                                        {area.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            disabled={busyKey === area.id}
                                                            onClick={() =>
                                                                handleToggleCodArea(area.id, !area.isActive)
                                                            }
                                                            className="rounded-xl border border-borderSoft px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                                        >
                                                            {area.isActive ? "Deactivate" : "Activate"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={busyKey === area.id}
                                                            onClick={() => handleDeleteCodArea(area.id)}
                                                            className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : null}
            </section>

            {codModalOpen ? (
                <CodServiceAreaModal
                    isSaving={Boolean(busyKey)}
                    error={codModalError}
                    onClose={() => {
                        setCodModalOpen(false);
                        setCodModalError(null);
                    }}
                    onSubmit={handleCreateCodArea}
                />
            ) : null}
        </div>
    );
}

function getUpdateMessage(
    config: TenantPaymentGatewayConfig,
    data: UpsertTenantPaymentGatewayPayload,
) {
    if (typeof data.isEnabled === "boolean") {
        return `${config.displayName} ${data.isEnabled ? "enabled" : "disabled"}.`;
    }

    if (typeof data.usePlatformTestCredentials === "boolean") {
        return data.usePlatformTestCredentials
            ? "Platform test credentials enabled."
            : "Platform test credentials disabled.";
    }

    return "Payment gateway configuration updated.";
}

function getErrorMessage(error: unknown, fallback: string) {
    const axiosError = error as AxiosError<{ message?: string | string[] }>;
    const message = axiosError.response?.data?.message;

    if (Array.isArray(message)) return message.join(", ");
    if (message) return message;
    if (error instanceof Error) return error.message;
    return fallback;
}

function getCodAreaLabel(area: NonNullable<BrandOwnerPaymentSetting["codServiceAreas"]>[number]) {
    if (area.level === "COUNTRY") return area.country?.name || area.countryId || "-";
    if (area.level === "STATE") return area.state?.name || area.stateId || "-";
    if (area.level === "DISTRICT") return area.district?.name || area.districtId || "-";
    return area.pincode?.code || area.pincodeId || "-";
}
