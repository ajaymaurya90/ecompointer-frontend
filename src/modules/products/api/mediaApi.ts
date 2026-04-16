import { api } from "@/lib/http";

export type MediaType = "THUMBNAIL" | "GALLERY" | "ZOOM" | "VIDEO";

export interface ProductMediaItem {
    id: string;
    productId?: string | null;
    childProductId?: string | null;
    variantId?: string | null;
    url: string;
    altText?: string | null;
    type: MediaType;
    mimeType?: string | null;
    size?: number | null;
    isPrimary: boolean;
    sortOrder: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateMediaPayload {
    productId?: string;
    childProductId?: string;
    variantId?: string;
    url: string;
    altText?: string;
    type?: MediaType;
    mimeType?: string;
    size?: number;
    isPrimary?: boolean;
    sortOrder?: number;
}

export interface UpdateMediaPayload {
    url?: string;
    altText?: string;
    type?: MediaType;
    mimeType?: string;
    size?: number;
    isPrimary?: boolean;
    sortOrder?: number;
    isActive?: boolean;
}

export async function getProductMedia(
    productId: string
): Promise<ProductMediaItem[]> {
    const response = await api.get(`/media/product/${productId}`);
    return response.data?.data ?? response.data ?? [];
}

export async function getVariantMedia(
    variantId: string
): Promise<ProductMediaItem[]> {
    const response = await api.get(`/media/variant/${variantId}`);
    return response.data?.data ?? response.data ?? [];
}

export const getChildProductMedia = getVariantMedia;

export async function createMedia(
    payload: CreateMediaPayload
): Promise<ProductMediaItem> {
    const response = await api.post("/media", payload);
    return response.data?.data ?? response.data;
}

export async function updateMedia(
    mediaId: string,
    payload: UpdateMediaPayload
): Promise<ProductMediaItem> {
    const response = await api.patch(`/media/${mediaId}`, payload);
    return response.data?.data ?? response.data;
}

export async function deleteMedia(mediaId: string): Promise<void> {
    await api.delete(`/media/${mediaId}`);
}

export async function uploadProductImage(
    productId: string,
    file: File
): Promise<ProductMediaItem> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/media/upload/product/${productId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data?.data ?? response.data;
}

export async function uploadVariantImage(
    variantId: string,
    file: File
): Promise<ProductMediaItem> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/media/upload/variant/${variantId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data?.data ?? response.data;
}

export const uploadChildProductImage = uploadVariantImage;

export async function createVariantMediaByUrl(
    variantId: string,
    payload: {
        url: string;
        altText?: string;
        type?: MediaType;
        isPrimary?: boolean;
        sortOrder?: number;
    }
): Promise<ProductMediaItem> {
    return createMedia({
        variantId,
        url: payload.url,
        altText: payload.altText,
        type: payload.type,
        isPrimary: payload.isPrimary,
        sortOrder: payload.sortOrder,
    });
}

export const createChildProductMediaByUrl = createVariantMediaByUrl;
