export type BuyerType = "CUSTOMER" | "SHOP_OWNER";

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PARTIALLY_CONFIRMED"
    | "PROCESSING"
    | "PARTIALLY_DISPATCHED"
    | "DISPATCHED"
    | "DELIVERED"
    | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID";

export type SalesChannelType =
    | "DIRECT_WEBSITE"
    | "SHOP_ORDER"
    | "FRANCHISE_SHOP"
    | "MARKETPLACE"
    | "SOCIAL_MEDIA"
    | "MANUAL";

export interface OrderListItemSummary {
    id: string;
    productName: string;
    variantLabel?: string | null;
    quantity: number;
    lineTotal: string;
}

export interface OrderBrandOwnerSummary {
    id: string;
    businessName: string;
}

export interface OrderCustomerSummary {
    id: string;
    customerCode: string;
    name: string;
    phone?: string | null;
}

export interface OrderShopOwnerSummary {
    id: string;
    shopName: string;
    ownerName: string;
    phone?: string | null;
}

export interface OrderListItem {
    id: string;
    orderNumber: string;
    createdAt: string;
    buyerType: BuyerType;
    salesChannel: SalesChannelType;
    buyerName: string;
    buyerPhone?: string | null;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    currencyCode: string;
    subtotalAmount: string;
    discountAmount: string;
    taxAmount: string;
    shippingAmount: string;
    totalAmount: string;
    totalPaid: string;
    pendingAmount: string;
    itemCount: number;
    itemSummary: OrderListItemSummary[];
    brandOwner: OrderBrandOwnerSummary | null;
    customer: OrderCustomerSummary | null;
    shopOwner: OrderShopOwnerSummary | null;
}

export interface OrderListPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface OrderListResponse {
    message: string;
    data: OrderListItem[];
    pagination: OrderListPagination;
}

export interface OrderListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: OrderStatus | "";
    paymentStatus?: PaymentStatus | "";
    buyerType?: BuyerType | "";
    salesChannel?: SalesChannelType | "";
    fromDate?: string;
    toDate?: string;
}

export interface OrderDetailBrandOwner {
    id: string;
    businessName: string;
    phone?: string | null;
    gstNumber?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    logoUrl?: string | null;
}

export interface OrderDetailCustomer {
    id: string;
    customerCode: string;
    type: string;
    status: string;
    firstName: string;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    alternatePhone?: string | null;
}

export interface OrderDetailShopOwner {
    id: string;
    shopName: string;
    ownerName: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    shopSlug: string;
}

export interface OrderDetailVariantRef {
    id: string;
    sku: string;
    size?: string | null;
    color?: string | null;
    taxRate: number;
    stock: number;
    isActive: boolean;
}

export interface OrderDetailItem {
    id: string;
    orderId: string;
    orderSellerId?: string | null;
    brandOwnerId: string;
    productVariantId: string;
    productId?: string | null;
    productName: string;
    productCode?: string | null;
    variantSku: string;
    variantLabel?: string | null;
    quantity: number;
    unitPrice: string;
    taxRate?: string | null;
    taxAmount: string;
    discountAmount: string;
    lineSubtotal: string;
    lineTotal: string;
    createdAt: string;
    updatedAt: string;
    productVariant: OrderDetailVariantRef | null;
}

export interface OrderPaymentItem {
    id: string;
    orderId: string;
    amountPaid: string;
    paymentDate: string;
    paymentMethod?: string | null;
    referenceNo?: string | null;
    note?: string | null;
    createdAt: string;
}

export interface OrderSellerOrder {
    id: string;
    orderId: string;
    brandOwnerId: string;
    sellerOrderNumber?: string | null;
    subtotalAmount: string;
    discountAmount: string;
    taxAmount: string;
    shippingAmount: string;
    totalAmount: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
    brandOwner: {
        id: string;
        businessName: string;
    };
    items: {
        id: string;
        productName: string;
        productCode?: string | null;
        variantSku: string;
        variantLabel?: string | null;
        quantity: number;
        unitPrice: string;
        taxAmount: string;
        lineSubtotal: string;
        lineTotal: string;
    }[];
}

export interface OrderDetail {
    id: string;
    orderNumber: string;
    brandOwnerId: string;
    buyerType: BuyerType;
    shopOwnerId?: string | null;
    customerId?: string | null;
    salesChannel: SalesChannelType;
    buyerName: string;
    buyerEmail?: string | null;
    buyerPhone?: string | null;

    billingFullName?: string | null;
    billingPhone?: string | null;
    billingAddressLine1: string;
    billingAddressLine2?: string | null;
    billingLandmark?: string | null;
    billingCity: string;
    billingDistrict?: string | null;
    billingState?: string | null;
    billingCountry?: string | null;
    billingPostalCode?: string | null;

    shippingFullName?: string | null;
    shippingPhone?: string | null;
    shippingAddressLine1: string;
    shippingAddressLine2?: string | null;
    shippingLandmark?: string | null;
    shippingCity: string;
    shippingDistrict?: string | null;
    shippingState?: string | null;
    shippingCountry?: string | null;
    shippingPostalCode?: string | null;

    currencyCode: string;
    subtotalAmount: string;
    discountAmount: string;
    taxAmount: string;
    shippingAmount: string;
    totalAmount: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;

    brandOwner: OrderDetailBrandOwner | null;
    customer: OrderDetailCustomer | null;
    shopOwner: OrderDetailShopOwner | null;
    items: OrderDetailItem[];
    payments: OrderPaymentItem[];
    sellerOrders: OrderSellerOrder[];
}

export interface OrderDetailResponse {
    message: string;
    data: OrderDetail;
}