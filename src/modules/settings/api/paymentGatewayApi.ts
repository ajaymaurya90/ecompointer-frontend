import { api } from "@/lib/http";
import type {
    AvailablePaymentGateway,
    BrandOwnerPaymentSetting,
    CodServiceArea,
    CodServiceAreaPayload,
    TenantPaymentGatewayConfig,
    UpdateBrandOwnerPaymentSettingPayload,
    UpdatePaymentGatewayCredentialsPayload,
    UpsertTenantPaymentGatewayPayload,
} from "@/modules/settings/types/paymentGateway";

const basePath = "/tenant-payment-gateways/me";

export async function getAvailablePaymentGateways(): Promise<
    AvailablePaymentGateway[]
> {
    const response = await api.get<AvailablePaymentGateway[]>(
        `${basePath}/available`,
    );
    return response.data ?? [];
}

export async function getMyPaymentGatewayConfigs(): Promise<
    TenantPaymentGatewayConfig[]
> {
    const response = await api.get<TenantPaymentGatewayConfig[]>(basePath);
    return response.data ?? [];
}

export async function upsertTenantPaymentGateway(
    data: UpsertTenantPaymentGatewayPayload,
): Promise<TenantPaymentGatewayConfig> {
    const response = await api.post<TenantPaymentGatewayConfig>(basePath, data);
    return response.data;
}

export async function updateTenantPaymentGateway(
    id: string,
    data: UpsertTenantPaymentGatewayPayload,
): Promise<TenantPaymentGatewayConfig> {
    const response = await api.patch<TenantPaymentGatewayConfig>(
        `${basePath}/${id}`,
        data,
    );
    return response.data;
}

export async function updateTenantPaymentGatewayCredentials(
    id: string,
    data: UpdatePaymentGatewayCredentialsPayload,
): Promise<TenantPaymentGatewayConfig> {
    const response = await api.patch<TenantPaymentGatewayConfig>(
        `${basePath}/${id}/credentials`,
        data,
    );
    return response.data;
}

export async function setDefaultTenantPaymentGateway(
    id: string,
): Promise<TenantPaymentGatewayConfig> {
    const response = await api.patch<TenantPaymentGatewayConfig>(
        `${basePath}/${id}/default`,
    );
    return response.data;
}

export async function getBrandOwnerPaymentSetting(): Promise<BrandOwnerPaymentSetting> {
    const response = await api.get("/brand-owners/me/payment-settings");
    return response.data?.data ?? response.data;
}

export async function updateBrandOwnerPaymentSetting(
    data: UpdateBrandOwnerPaymentSettingPayload,
): Promise<BrandOwnerPaymentSetting> {
    const response = await api.patch("/brand-owners/me/payment-settings", data);
    return response.data?.data ?? response.data;
}

export async function createCodServiceArea(
    data: CodServiceAreaPayload,
): Promise<CodServiceArea> {
    const response = await api.post(
        "/brand-owners/me/payment-settings/cod-areas",
        data,
    );
    return response.data?.data ?? response.data;
}

export async function updateCodServiceArea(
    id: string,
    data: Partial<CodServiceAreaPayload>,
): Promise<CodServiceArea> {
    const response = await api.patch(
        `/brand-owners/me/payment-settings/cod-areas/${id}`,
        data,
    );
    return response.data?.data ?? response.data;
}

export async function deleteCodServiceArea(id: string): Promise<void> {
    await api.delete(`/brand-owners/me/payment-settings/cod-areas/${id}`);
}
