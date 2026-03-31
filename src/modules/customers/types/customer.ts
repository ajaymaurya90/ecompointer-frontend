export type CustomerType = "INDIVIDUAL" | "BUSINESS" | "BOTH";
export type CustomerStatus = "LEAD" | "ACTIVE" | "INACTIVE" | "BLOCKED";
export type CustomerSource =
    | "WEBSITE"
    | "MOBILE_APP"
    | "MANUAL"
    | "SHOP_REFERRAL"
    | "IMPORT"
    | "MARKETPLACE"
    | "OTHER";

export type AddressType = "BILLING" | "SHIPPING" | "BOTH";

export interface CustomerBusiness {
    id: string;
    customerId: string;
    shopOwnerId?: string | null;
    businessName: string;
    legalBusinessName?: string | null;
    businessType: string;
    contactPersonName?: string | null;
    contactPersonPhone?: string | null;
    contactPersonEmail?: string | null;
    gstNumber?: string | null;
    taxId?: string | null;
    registrationNumber?: string | null;
    website?: string | null;
    isPrimary: boolean;
    isActive: boolean;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
    shopOwner?: {
        id: string;
        shopName: string;
        ownerName: string;
        shopSlug: string;
    } | null;
}

export interface CustomerAddress {
    id: string;
    customerId: string;
    type: AddressType;
    fullName?: string | null;
    phone?: string | null;
    addressLine1: string;
    addressLine2?: string | null;
    landmark?: string | null;
    city: string;
    district?: string | null;
    state?: string | null;
    country?: string | null;
    postalCode?: string | null;
    countryId?: string | null;
    stateId?: string | null;
    districtId?: string | null;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    countryRef?: {
        id: string;
        code: string;
        name: string;
    } | null;
    stateRef?: {
        id: string;
        code?: string | null;
        name: string;
    } | null;
    districtRef?: {
        id: string;
        name: string;
    } | null;
}

export interface CustomerGroupMemberCustomer {
    id: string;
    customerCode: string;
    type: CustomerType;
    status: CustomerStatus;
    firstName: string;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    isActive: boolean;
}

export interface CustomerGroupMemberRecord {
    id: string;
    customer: CustomerGroupMemberCustomer;
}

export interface CustomerGroup {
    id: string;
    brandOwnerId: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    memberCount?: number;
    members?: CustomerGroupMemberRecord[];
}

export interface CustomerGroupMember {
    id: string;
    customerGroup: CustomerGroup;
}

export interface Customer {
    id: string;
    customerCode: string;
    brandOwnerId: string;
    type: CustomerType;
    status: CustomerStatus;
    source: CustomerSource;
    firstName: string;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    alternatePhone?: string | null;
    dateOfBirth?: string | null;
    notes?: string | null;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;

    businesses?: CustomerBusiness[];
    addresses?: CustomerAddress[];
    groupMembers?: CustomerGroupMember[];
    orders?: any[];
}

export interface CustomerFormData {
    type?: CustomerType;
    status?: CustomerStatus;
    source?: CustomerSource;
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    alternatePhone?: string;
    dateOfBirth?: string;
    notes?: string;
}

export interface CustomerListMeta {
    total: number;
    page: number;
    lastPage: number;
}

export interface CustomerListResponse {
    data: Customer[];
    meta: CustomerListMeta;
}

export interface CustomerListParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: CustomerType | "";
    status?: CustomerStatus | "";
    source?: CustomerSource | "";
    sortBy?: "createdAt" | "updatedAt" | "firstName" | "customerCode" | "status" | "type";
    sortOrder?: "asc" | "desc";
}

export interface CustomerBusinessFormData {
    businessName: string;
    legalBusinessName?: string;
    businessType?: string;
    shopOwnerId?: string;
    contactPersonName?: string;
    contactPersonPhone?: string;
    contactPersonEmail?: string;
    gstNumber?: string;
    taxId?: string;
    registrationNumber?: string;
    website?: string;
    isPrimary?: boolean;
    notes?: string;
}

export interface CustomerAddressFormData {
    type?: AddressType;
    fullName?: string;
    phone?: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    district?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    countryId?: string;
    stateId?: string;
    districtId?: string;
    isDefault?: boolean;
}