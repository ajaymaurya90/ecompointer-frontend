import { api } from "@/lib/http";

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
    isActive?: boolean;
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