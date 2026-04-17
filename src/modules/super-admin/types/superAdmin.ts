export type AccountStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type BrandOwnerListParams = {
    page?: number;
    limit?: number;
    search?: string;
};

export type MasterOption = {
    id: string;
    name?: string;
    label?: string;
    code?: string;
    isActive?: boolean;
};

export type SalutationOption = {
    id: string;
    label: string;
    isActive: boolean;
};

export type BrandOwnerListItem = {
    id: string;
    userId: string;
    salutationId?: string | null;
    firstName: string;
    lastName: string;
    ownerName: string;
    businessName: string;
    email: string;
    phone: string | null;
    countryId: string | null;
    stateId: string | null;
    districtId: string | null;
    country?: MasterOption | null;
    state?: MasterOption | null;
    district?: MasterOption | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    accountStatus: AccountStatus;
    isActive: boolean;
    isVerified: boolean;
    verifiedAt?: string | null;
    createdAt: string;
    updatedAt?: string;
};

export type BrandOwnerDetail = BrandOwnerListItem;

export type BrandOwnerListResponse = {
    data: BrandOwnerListItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

export type CreateBrandOwnerPayload = {
    salutationId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    countryId: string;
    stateId: string;
    districtId: string;
    addressLine1: string;
    addressLine2?: string;
};

export type UpdateBrandOwnerStatusPayload = {
    accountStatus: AccountStatus;
    isVerified?: boolean;
};
