export type PaymentGatewayProvider =
    | "RAZORPAY"
    | "MOCK"
    | "STRIPE"
    | "CASHFREE"
    | "PAYPAL"
    | "OTHER";

export type PaymentGatewayMode = "TEST" | "LIVE";

export type PaymentGatewayCredentialMeta = {
    configuredFields?: string[];
    maskedKeyId?: string;
    updatedAt?: string;
    [key: string]: unknown;
};

export type TenantPaymentGatewayConfig = {
    id: string;
    paymentGatewayId: string;
    code: PaymentGatewayProvider;
    displayName: string;
    isEnabled: boolean;
    isDefault: boolean;
    mode: PaymentGatewayMode;
    hasCredentials: boolean;
    credentialMeta: PaymentGatewayCredentialMeta | null;
    usePlatformTestCredentials: boolean;
};

export type AvailablePaymentGateway = {
    id: string;
    paymentGatewayId: string;
    code: PaymentGatewayProvider;
    name: string;
    displayName: string;
    description?: string | null;
    supportsTestMode: boolean;
    supportsLiveMode: boolean;
    sortOrder: number;
    tenantConfigs: TenantPaymentGatewayConfig[];
};

export type UpsertTenantPaymentGatewayPayload = {
    paymentGatewayId?: string;
    mode?: PaymentGatewayMode;
    isEnabled?: boolean;
    isDefault?: boolean;
    usePlatformTestCredentials?: boolean;
};

export type UpdatePaymentGatewayCredentialsPayload = {
    credentials: Record<string, string>;
};

export type CodAreaMode = "ALL_SERVICEABLE_AREAS" | "SELECTED_AREAS_ONLY";
export type ServiceAreaLevel = "COUNTRY" | "STATE" | "DISTRICT" | "PINCODE";

export type CodServiceArea = {
    id: string;
    level: ServiceAreaLevel;
    countryId?: string | null;
    stateId?: string | null;
    districtId?: string | null;
    pincodeId?: string | null;
    isActive: boolean;
    country?: { id: string; code: string; name: string } | null;
    state?: { id: string; code?: string | null; name: string; countryId: string } | null;
    district?: { id: string; name: string; stateId: string } | null;
    pincode?: { id: string; code: string; districtId: string } | null;
    createdAt?: string;
    updatedAt?: string;
};

export type BrandOwnerPaymentSetting = {
    id: string;
    brandOwnerId: string;
    isCodEnabled: boolean;
    maxCodAmount?: string | number | null;
    codAreaMode: CodAreaMode;
    codServiceAreas: CodServiceArea[];
};

export type UpdateBrandOwnerPaymentSettingPayload = {
    isCodEnabled?: boolean;
    maxCodAmount?: number | null;
    codAreaMode?: CodAreaMode;
};

export type CodServiceAreaPayload = {
    level: ServiceAreaLevel;
    countryId?: string | null;
    stateId?: string | null;
    districtId?: string | null;
    pincodeId?: string | null;
    isActive?: boolean;
};
