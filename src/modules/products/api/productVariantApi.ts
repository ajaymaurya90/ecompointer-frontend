import { api } from "@/lib/http";
import type {
    CommercialSourceMap,
    ProductCommercialValues,
    ProductMediaItem,
    VariantCommercialRaw,
} from "@/modules/products/types/product";

export interface ChildProduct {
    id: string;
    parentId?: string | null;
    productId: string;
    productCode?: string | null;
    sku: string;
    variantLabel?: string | null;
    name?: string | null;
    description?: string | null;
    effectiveName?: string | null;
    effectiveDescription?: string | null;
    contentSource?: {
        name: "PRODUCT" | "VARIANT";
        description: "PRODUCT" | "VARIANT";
    };
    size?: string | null;
    color?: string | null;

    taxRate: number;
    currencyCode?: string;
    costGross: number;
    costNet?: number;
    costPrice: number;
    wholesaleNet: number;
    wholesaleGross: number;
    retailNet: number;
    retailGross: number;

    stock: number;

    isFeatured: boolean;
    isFreeShipping: boolean;
    isClearance: boolean;

    minOrderQuantity: number;
    maxOrderQuantity?: number | null;
    deliveryTimeLabel?: string | null;
    restockTimeDays?: number | null;

    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;

    commercialRaw?: VariantCommercialRaw;
    commercialEffective?: ProductCommercialValues;
    commercialSource?: CommercialSourceMap;
}

export type ProductVariant = ChildProduct;

export interface ChildProductSummary {
    totalVariants: number;
    totalStock: number;
    priceRange: {
        min: number;
        max: number;
    };
}

export type ProductVariantSummary = ChildProductSummary;

export interface ChildProductFormData {
    sku?: string;
    productCode?: string | null;
    variantLabel?: string | null;
    name?: string | null;
    description?: string | null;
    size?: string;
    color?: string;

    currencyCode?: string | null;
    taxRate?: number | null;
    costGross?: number | null;
    costNet?: number | null;
    costPrice?: number | null;
    wholesaleGross?: number | null;
    wholesaleNet?: number | null;
    retailGross?: number | null;
    retailNet?: number | null;

    stock?: number | null;

    isFeatured?: boolean | null;
    isFreeShipping?: boolean | null;
    isClearance?: boolean | null;

    minOrderQuantity?: number | null;
    maxOrderQuantity?: number | null;
    deliveryTimeLabel?: string | null;
    restockTimeDays?: number | null;

    isActive?: boolean;
}

export type ProductVariantFormData = ChildProductFormData;

export interface VariantMediaListResponse {
    source: "variant" | "product-fallback";
    data: ProductMediaItem[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export async function getProductVariants(
    productId: string
): Promise<ChildProduct[]> {
    const response = await api.get(`/products/${productId}/variants`);
    return response.data?.data ?? response.data ?? [];
}

export async function getProductVariantSummary(
    productId: string
): Promise<ChildProductSummary> {
    const response = await api.get(`/products/${productId}/variants/summary`);
    return response.data?.data ?? response.data;
}

export async function createProductVariant(
    productId: string,
    data: ChildProductFormData
): Promise<ChildProduct> {
    const response = await api.post(`/products/${productId}/variants`, data);
    return response.data?.data ?? response.data;
}

export async function updateProductVariant(
    productId: string,
    variantId: string,
    data: Partial<ChildProductFormData>
): Promise<ChildProduct> {
    const response = await api.patch(
        `/products/${productId}/variants/${variantId}`,
        data
    );
    return response.data?.data ?? response.data;
}

export async function deleteProductVariant(
    productId: string,
    variantId: string
): Promise<void> {
    await api.delete(`/products/${productId}/variants/${variantId}`);
}

export const getChildProducts = getProductVariants;
export const getChildProductSummary = getProductVariantSummary;
export const createChildProduct = createProductVariant;
export const updateChildProduct = updateProductVariant;
export const deleteChildProduct = deleteProductVariant;

/* =====================================================
   VARIANT MEDIA
   ===================================================== */

export async function getVariantMedia(
    variantId: string,
    page = 1,
    limit = 100
): Promise<VariantMediaListResponse> {
    const response = await api.get(`/media/variant/${variantId}`, {
        params: { page, limit },
    });

    return response.data;
}

export const getChildProductMedia = getVariantMedia;
export const uploadChildProductMedia = uploadVariantMedia;
export const updateChildProductMediaLink = updateVariantMediaLink;
export const deleteChildProductMediaLink = deleteVariantMediaLink;

export async function uploadVariantMedia(
    variantId: string,
    file: File
) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/media/upload/variant/${variantId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function updateVariantMediaLink(
    linkId: string,
    payload: {
        isPrimary?: boolean;
        role?: "GALLERY" | "THUMBNAIL" | "ZOOM" | "SWATCH" | "LIFESTYLE";
        title?: string;
        altText?: string;
    }
) {
    const response = await api.patch(`/media/product-link/${linkId}`, payload);
    return response.data;
}

export async function deleteVariantMediaLink(linkId: string) {
    const response = await api.delete(`/media/product-link/${linkId}`);
    return response.data;
}
