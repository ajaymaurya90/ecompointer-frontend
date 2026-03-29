import { api } from "@/lib/http";

export interface VariantGeneratorAttributeInput {
    name: string;
    values: string[];
}

export interface GenerateProductVariantsPayload {
    attributes: VariantGeneratorAttributeInput[];
    taxRate: number;
    costPrice: number;
    wholesaleNet: number;
    retailNet: number;
    stock: number;
    isActive?: boolean;
}

export interface GenerateProductVariantsResponse {
    createdCount: number;
    skippedCount: number;
    created: Array<{
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
        createdAt: string;
        updatedAt: string;
    }>;
    skipped: Array<{
        sku: string;
        reason: string;
    }>;
}

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