export type MasterStatusFilter = "all" | "active" | "inactive";

export type MasterQueryParams = {
    search?: string;
    isActive?: boolean;
    countryId?: string;
    stateId?: string;
    districtId?: string;
};

export type Salutation = {
    id: string;
    label: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type Country = {
    id: string;
    code: string;
    name: string;
    phoneCode?: string | null;
    currencyCode?: string | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type State = {
    id: string;
    countryId: string;
    code?: string | null;
    name: string;
    isActive: boolean;
    country?: Pick<Country, "id" | "code" | "name"> | null;
    createdAt?: string;
    updatedAt?: string;
};

export type District = {
    id: string;
    stateId: string;
    name: string;
    isActive: boolean;
    state?: (Pick<State, "id" | "code" | "name" | "countryId"> & {
        country?: Pick<Country, "id" | "code" | "name"> | null;
    }) | null;
    createdAt?: string;
    updatedAt?: string;
};

export type Pincode = {
    id: string;
    code: string;
    districtId: string;
    isActive: boolean;
    district?: (Pick<District, "id" | "name" | "stateId"> & {
        state?: (Pick<State, "id" | "code" | "name" | "countryId"> & {
            country?: Pick<Country, "id" | "code" | "name"> | null;
        }) | null;
    }) | null;
    createdAt?: string;
    updatedAt?: string;
};

export type SalesChannelTypeCode =
    | "DIRECT_WEBSITE"
    | "SHOP_ORDER"
    | "FRANCHISE_SHOP"
    | "MARKETPLACE"
    | "SOCIAL_MEDIA"
    | "MANUAL";

export type SalesChannelTypeMaster = {
    id: string;
    code: SalesChannelTypeCode;
    label: string;
    description?: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
};

export type SalutationPayload = {
    id: string;
    label: string;
    isActive?: boolean;
};

export type CountryPayload = {
    code: string;
    name: string;
    phoneCode?: string;
    currencyCode?: string;
    isActive?: boolean;
};

export type StatePayload = {
    countryId: string;
    name: string;
    code?: string;
    isActive?: boolean;
};

export type DistrictPayload = {
    stateId: string;
    name: string;
    isActive?: boolean;
};

export type PincodePayload = {
    code: string;
    districtId: string;
    isActive?: boolean;
};

export type SalesChannelTypePayload = {
    code: SalesChannelTypeCode;
    label: string;
    description?: string | null;
    sortOrder?: number;
    isActive?: boolean;
};
