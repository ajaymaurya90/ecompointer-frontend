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