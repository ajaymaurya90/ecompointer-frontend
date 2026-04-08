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

export interface ProductVariant {
    id: string;
    retailGross: number;
    stock: number;
    size?: string;
    color?: string;
}

export interface ProductBrand {
    id: string;
    name: string;
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
    categoryId: string;
    categoryIds: string[];
    description: string;

    productType: ProductType;

    taxRate: number;
    costPrice: number;
    wholesaleNet: number;
    retailNet: number;

    stock: number;

    isFeatured: boolean;
    isFreeShipping: boolean;
    isClearance: boolean;

    minOrderQuantity: number;
    maxOrderQuantity: number | "";
    deliveryTimeLabel: string;
    restockTimeDays: number | "";
}

export interface Product {
    id: string;
    name: string;
    productCode: string;
    description?: string;

    brandId?: string;
    categoryId?: string;
    categoryIds?: string[];

    brand?: ProductBrand;
    category?: ProductCategory;
    categoryAssignments?: Array<{
        categoryId: string;
        category: ProductCategory;
    }>;

    productType?: ProductType;

    taxRate?: number;
    costPrice?: number;
    wholesaleNet?: number;
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

    hasVariants?: boolean;

    media: ProductMedia[];
    variants: ProductVariant[];
    totalStock?: number;
    variantCount?: number;
    isActive?: boolean;
    createdAt?: string;
}