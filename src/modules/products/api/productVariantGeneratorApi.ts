import { api } from "@/lib/http";

export interface VariantGeneratorAttributeInput {
    name: string;
    values: string[];
}

export interface GenerateProductVariantsPayload {
    attributes: VariantGeneratorAttributeInput[];
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
    isActive?: boolean;
}

export type GenerateChildProductsPayload = GenerateProductVariantsPayload;

export interface GenerateProductVariantsResponse {
    createdCount: number;
    skippedCount: number;
    created: Array<{
        id: string;
        productId: string;
        sku: string;
        size?: string | null;
        color?: string | null;
        currencyCode?: string;
        taxRate: number;
        costGross?: number;
        costNet?: number;
        costPrice: number;
        wholesaleNet: number;
        wholesaleGross: number;
        retailNet: number;
        retailGross: number;
        stock: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    }>;
    skipped: Array<{
        sku: string;
        reason: string;
    }>;
}

export type GenerateChildProductsResponse = GenerateProductVariantsResponse;

export async function generateProductVariants(
    productId: string,
    payload: GenerateProductVariantsPayload
): Promise<GenerateProductVariantsResponse> {
    const response = await api.post(
        `/products/${productId}/variants/generate`,
        payload
    );

    return response.data?.data ?? response.data;
}

export const generateChildProducts = generateProductVariants;
