export interface ShopOwnerBrandLink {
    id: string;
    brandOwnerId?: string;
    shopOwnerId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    notes?: string | null;
}

export interface ShopOwnerBrandSummary {
    id: string;
    businessName: string;
    phone?: string | null;
}

export interface ShopOwnerConnectedBrandLink extends ShopOwnerBrandLink {
    brandOwner?: ShopOwnerBrandSummary;
}

export interface ShopOwner {
    id: string;
    shopName: string;
    ownerName: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postalCode?: string | null;
    shopSlug: string;
    qrCodeUrl?: string | null;
    isActive: boolean;
    language?: string | null;
    businessName?: string | null;
    legalEntityName?: string | null;
    gstNumber?: string | null;
    createdAt: string;
    updatedAt: string;
    brandLinks?: ShopOwnerConnectedBrandLink[];
}

export interface ShopOwnerListResponse {
    message: string;
    data: ShopOwner[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ShopOwnerListParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: "true" | "false" | "";
}

export interface ShopOwnerFormData {
    shopName: string;
    ownerName: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    shopSlug: string;
    qrCodeUrl?: string;
    language?: string;
    businessName?: string;
    legalEntityName?: string;
    gstNumber?: string;
}

export interface LinkExistingShopOwnerFormData {
    shopOwnerId?: string;
    phone?: string;
    email?: string;
    shopSlug?: string;
    notes?: string;
}