export type UserRole = "SUPER_ADMIN" | "BRAND_OWNER" | "SHOP_OWNER";

export type AuthProfileResponse = {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName?: string | null;
    phone?: string | null;
    createdAt: string;
    business?: {
        id: string;
        businessName: string;
    } | null;
};

export type UpdateProfilePayload = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    businessName?: string;
};