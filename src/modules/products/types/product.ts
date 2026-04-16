export type ProductType = "PHYSICAL" | "DIGITAL" | "SERVICE" | "OTHER";

export interface ProductMedia {
    id: string;
    url: string;
    isPrimary: boolean;
}

export interface ProductMediaVariant {
    id: string;
    url: string;
    width: number | null;
    height: number | null;
    format: string;
    quality: number;
}

export interface ProductMediaAsset {
    id: string;
    title: string | null;
    altText: string | null;
    originalUrl: string;
    mimeType: string | null;
    fileSize: number | null;
    width: number | null;
    height: number | null;
}

export interface ProductMediaItem {
    id: string;
    productId: string | null;
    variantId: string | null;
    role: "GALLERY" | "THUMBNAIL" | "ZOOM" | "SWATCH" | "LIFESTYLE";
    isPrimary: boolean;
    position: number;
    asset: ProductMediaAsset;
    variants: Record<string, ProductMediaVariant>;
    createdAt: string;
    updatedAt: string;
}

export interface ProductMediaListResponse {
    data: ProductMediaItem[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ChildProduct {
    id: string;
    parentId?: string | null;
    productId?: string;
    sku?: string | null;
    productCode?: string | null;
    variantLabel?: string | null;
    name?: string | null;
    description?: string | null;
    effectiveName?: string | null;
    effectiveDescription?: string | null;
    contentSource?: {
        name: CommercialFieldSource;
        description: CommercialFieldSource;
    };
    retailGross: number;
    wholesaleGross?: number;
    retailNet?: number;
    wholesaleNet?: number;
    costGross?: number;
    costNet?: number;
    taxRate?: number;
    currencyCode?: string;
    stock: number;
    size?: string | null;
    color?: string | null;
    isActive?: boolean;
    commercialSource?: CommercialSourceMap;
    commercialRaw?: VariantCommercialRaw;
    commercialEffective?: ProductCommercialValues;
}

export type ProductVariant = ChildProduct;

export interface ProductBrand {
    id: string;
    name: string;
}

export interface ProductManufacturer {
    id: string;
    name: string;
    code?: string | null;
    description?: string | null;

    contactPerson?: string | null;
    email?: string | null;
    phone?: string | null;

    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postalCode?: string | null;

    gstNumber?: string | null;
    website?: string | null;
    supportNotes?: string | null;

    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductManufacturerOption {
    id: string;
    name: string;
    code?: string | null;
}

export interface ProductCategory {
    id: string;
    name: string;
    parentId?: string | null;
    children?: ProductCategory[];
}

export interface ProductOption {
    id: string;
    name: string;
    parentId?: string | null;
    children?: ProductOption[];
}

export interface ProductFormData {
    name: string;
    productCode: string;
    brandId: string;
    manufacturerId: string;
    categoryId: string;
    categoryIds: string[];
    description: string;

    productType: ProductType;

    currencyCode: string;
    taxRate: number;
    costGross: number;
    costPrice: number;
    costNet: number;
    wholesaleGross: number;
    wholesaleNet: number;
    retailGross: number;
    retailNet: number;

    stock: number;

    isFeatured: boolean;
    isFreeShipping: boolean;
    isClearance: boolean;

    minOrderQuantity: number;
    maxOrderQuantity: number | "" | null;
    deliveryTimeLabel: string;
    restockTimeDays: number | "" | null;
}

export interface ProductCommercialValues {
    currencyCode: string;
    taxRate: number;
    costGross: number;
    costNet: number;
    wholesaleGross: number;
    wholesaleNet: number;
    retailGross: number;
    retailNet: number;
    stock: number;
    isFeatured: boolean;
    isFreeShipping: boolean;
    isClearance: boolean;
    minOrderQuantity: number;
    maxOrderQuantity: number | null;
    deliveryTimeLabel: string | null;
    restockTimeDays: number | null;
}

export type CommercialFieldSource = "PRODUCT" | "VARIANT";

export type CommercialSourceMap = Record<
    keyof ProductCommercialValues,
    CommercialFieldSource
>;

export type VariantCommercialRaw = {
    [K in keyof ProductCommercialValues]: ProductCommercialValues[K] | null;
};

export interface Product {
    id: string;
    parentId?: string | null;
    name: string | null;
    productCode: string;
    sku?: string | null;
    variantLabel?: string | null;
    description?: string | null;

    brandId?: string;
    manufacturerId?: string | null;
    categoryId?: string;
    categoryIds?: string[];

    brand?: ProductBrand;
    manufacturer?: ProductManufacturer | null;
    category?: ProductCategory;
    categoryAssignments?: Array<{
        categoryId: string;
        category: ProductCategory;
    }>;

    productType?: ProductType;

    currencyCode?: string;
    taxRate?: number;
    costGross?: number;
    costNet?: number;
    costPrice?: number;
    wholesaleGross?: number;
    wholesaleNet?: number;
    retailGross?: number;
    retailNet?: number;

    costGrossPrice?: number;
    wholesaleGrossPrice?: number;
    retailGrossPrice?: number;

    stock?: number;

    isFeatured?: boolean;
    isFreeShipping?: boolean;
    isClearance?: boolean;

    minOrderQuantity?: number;
    maxOrderQuantity?: number | null;
    deliveryTimeLabel?: string | null;
    restockTimeDays?: number | null;

    commercialRaw?: ProductCommercialValues | null;
    commercialEffective?: ProductCommercialValues;

    hasVariants?: boolean;
    children?: ChildProduct[];

    media: ProductMedia[];
    variants: ChildProduct[];
    totalStock?: number;
    variantCount?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
