export type CountryOption = {
    id: string;
    code: string;
    name: string;
    phoneCode?: string | null;
    currencyCode?: string | null;
};

export type StateOption = {
    id: string;
    name: string;
    code?: string | null;
    countryId: string;
    country?: {
        id: string;
        code: string;
        name: string;
    };
};

export type DistrictOption = {
    id: string;
    name: string;
    stateId: string;
    state?: {
        id: string;
        name: string;
        code?: string | null;
        countryId: string;
        country?: {
            id: string;
            code: string;
            name: string;
        };
    };
};

export type PincodeOption = {
    id: string;
    code: string;
    districtId: string;
    isActive: boolean;
    district?: DistrictOption | null;
};

export type SalesChannelType =
    | "DIRECT_WEBSITE"
    | "SHOP_ORDER"
    | "FRANCHISE_SHOP"
    | "MARKETPLACE"
    | "SOCIAL_MEDIA"
    | "MANUAL";

export type ServiceAreaLevel = "COUNTRY" | "STATE" | "DISTRICT" | "PINCODE";

export type SalesChannelTypeMaster = {
    id: string;
    code: SalesChannelType;
    label: string;
    description?: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
};

export type BrandOwnerSalesChannel = {
    id: string;
    brandOwnerId: string;
    channelType: SalesChannelType;
    salesChannelTypeId?: string | null;
    salesChannelType?: SalesChannelTypeMaster | null;
    internalName?: string | null;
    displayName?: string | null;
    isPrimary?: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type UpdateBrandOwnerSalesChannelPayload = {
    displayName?: string | null;
    isActive?: boolean;
};

export type CreateBrandOwnerSalesChannelPayload = {
    salesChannelTypeId: string;
    channelType?: SalesChannelType;
    displayName?: string | null;
    isActive?: boolean;
};

export type BrandOwnerSalesChannelServiceArea = {
    id: string;
    brandOwnerSalesChannelId: string;
    level: ServiceAreaLevel;
    countryId?: string | null;
    stateId?: string | null;
    districtId?: string | null;
    pincodeId?: string | null;
    isActive: boolean;
    country?: CountryOption | null;
    state?: StateOption | null;
    district?: DistrictOption | null;
    pincode?: PincodeOption | null;
    createdAt?: string;
    updatedAt?: string;
};

export type CreateBrandOwnerSalesChannelServiceAreaPayload = {
    level: ServiceAreaLevel;
    countryId?: string;
    stateId?: string;
    districtId?: string;
    pincodeId?: string;
    isActive?: boolean;
};

export type ServiceabilityCheckResult = {
    serviceable: boolean;
    matchedLevel: ServiceAreaLevel | null;
};

export type BrandOwnerUserInfo = {
    id: string;
    email: string;
    firstName: string;
    lastName?: string | null;
    phone?: string | null;
    role: string;
};

export type BrandOwnerLocation = {
    id: string;
    businessName: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    countryId?: string | null;
    stateId?: string | null;
    districtId?: string | null;
    countryRef?: CountryOption | null;
    stateRef?: StateOption | null;
    districtRef?: DistrictOption | null;
    user?: BrandOwnerUserInfo;
};

export type UpdateBrandOwnerLocationPayload = {
    address?: string;
    city?: string;
    countryId?: string;
    stateId?: string;
    districtId?: string;
};

export type BrandOwnerLanguage = {
    id: string;
    businessName: string;
    language?: string | null;
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string | null;
        role: string;
    };
};

export type UpdateBrandOwnerLanguagePayload = {
    language: "en" | "de" | "hi";
};

export type ServiceAreaSource = "default" | "override";

export type BrandOwnerServiceAreaState = {
    id: string;
    name: string;
    code?: string | null;
    masterActive: boolean;
    isActive: boolean;
    source: ServiceAreaSource;
    districtCount: number;
    activeDistrictCount: number;
};

export type BrandOwnerServiceAreaSummary = {
    totalStates: number;
    activeStates: number;
    inactiveStates: number;
};

export type BrandOwnerServiceArea = {
    country: {
        id: string;
        code: string;
        name: string;
    };
    summary: BrandOwnerServiceAreaSummary;
    states: BrandOwnerServiceAreaState[];
};

export type BrandOwnerServiceAreaDistrict = {
    id: string;
    name: string;
    masterActive: boolean;
    isActive: boolean;
    source: ServiceAreaSource;
};

export type BrandOwnerServiceAreaDistrictSummary = {
    totalDistricts: number;
    activeDistricts: number;
    inactiveDistricts: number;
};

export type BrandOwnerServiceAreaDistrictResponse = {
    state: {
        id: string;
        name: string;
        code?: string | null;
        isActive: boolean;
        source: ServiceAreaSource;
    };
    summary: BrandOwnerServiceAreaDistrictSummary;
    districts: BrandOwnerServiceAreaDistrict[];
};

export type UpdateServiceAreaStatePayload = {
    isActive: boolean;
};

export type UpdateServiceAreaDistrictPayload = {
    isActive: boolean;
};

export interface BrandOwnerShopOrderRules {
    id: string;
    businessName: string;
    minShopOrderLineQty: number;
    minShopOrderCartQty: number;
    allowBelowMinLineQtyAfterCartMin: boolean;
}

export interface UpdateBrandOwnerShopOrderRulesPayload {
    minShopOrderLineQty: number;
    minShopOrderCartQty: number;
    allowBelowMinLineQtyAfterCartMin: boolean;
}

export interface BrandOwnerStorefrontSettings {
    id: string;
    businessName: string | null;
    storefrontName?: string | null;
    storefrontLogoUrl?: string | null;
    storefrontTagline?: string | null;
    storefrontShortDescription?: string | null;
    storefrontAboutDescription?: string | null;
    storefrontSupportEmail?: string | null;
    storefrontSupportPhone?: string | null;
    isStorefrontEnabled: boolean;
    isGuestCheckoutEnabled: boolean;
    isCustomerRegistrationEnabled: boolean;
    currencyCode?: string | null;
    activeStorefrontThemeCode: string;
    isStorefrontThemeActive: boolean;
}

export interface UpdateBrandOwnerStorefrontSettingsPayload {
    storefrontName?: string;
    storefrontLogoUrl?: string;
    storefrontTagline?: string;
    storefrontShortDescription?: string;
    storefrontAboutDescription?: string;
    storefrontSupportEmail?: string;
    storefrontSupportPhone?: string;
    isStorefrontEnabled?: boolean;
    isGuestCheckoutEnabled?: boolean;
    isCustomerRegistrationEnabled?: boolean;
    activeStorefrontThemeCode?: string;
    isStorefrontThemeActive?: boolean;
}

export interface BrandOwnerStorefrontDomain {
    id: string;
    brandOwnerId: string;
    hostName: string;
    isPrimary: boolean;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBrandOwnerStorefrontDomainPayload {
    hostName: string;
    isPrimary?: boolean;
    isActive?: boolean;
}

export interface UpdateBrandOwnerStorefrontDomainPayload {
    hostName?: string;
    isPrimary?: boolean;
    isActive?: boolean;
    isVerified?: boolean;
}
