import { api } from "@/lib/http";
import type { ProductMediaItem, ProductType } from "@/modules/products/types/product";

export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    size?: string | null;
    color?: string | null;

    taxRate: number;
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
}

export interface ProductVariantSummary {
    totalVariants: number;
    totalStock: number;
    priceRange: {
        min: number;
        max: number;
    };
}

export interface ProductVariantFormData {
    sku?: string;
    size?: string;
    color?: string;

    taxRate: number;
    costPrice: number;
    wholesaleNet: number;
    retailNet: number;

    stock: number;

    isFeatured: boolean;
    isFreeShipping: boolean;
    isClearance: boolean;

    minOrderQuantity: number;
    maxOrderQuantity?: number;
    deliveryTimeLabel?: string;
    restockTimeDays?: number;

    isActive?: boolean;
}

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
): Promise<ProductVariant[]> {
    const response = await api.get(`/products/${productId}/variants`);
    return response.data?.data ?? response.data ?? [];
}

export async function getProductVariantSummary(
    productId: string
): Promise<ProductVariantSummary> {
    const response = await api.get(`/products/${productId}/variants/summary`);
    return response.data?.data ?? response.data;
}

export async function createProductVariant(
    productId: string,
    data: ProductVariantFormData
): Promise<ProductVariant> {
    const response = await api.post(`/products/${productId}/variants`, data);
    return response.data?.data ?? response.data;
}

export async function updateProductVariant(
    productId: string,
    variantId: string,
    data: Partial<ProductVariantFormData>
): Promise<ProductVariant> {
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