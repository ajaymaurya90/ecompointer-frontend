import { api } from "@/lib/http";
import type {
    AssignMediaToProductPayload,
    AssignMediaToVariantPayload,
    CreateMediaFolderPayload,
    ListMediaLibraryParams,
    MediaFolder,
    MediaLibraryResponse,
    UploadMediaLibraryPayload,
} from "@/modules/media/types/media";

export async function getMediaFolders(): Promise<MediaFolder[]> {
    const response = await api.get("/media/folders");
    return response.data;
}

export async function createMediaFolder(
    payload: CreateMediaFolderPayload
): Promise<MediaFolder> {
    const response = await api.post("/media/folders", payload);
    return response.data;
}

export async function getMediaLibrary(
    params: ListMediaLibraryParams = {}
): Promise<MediaLibraryResponse> {
    const response = await api.get("/media/library", {
        params: {
            folderId: params.folderId,
            q: params.q,
            sortBy: params.sortBy ?? "createdAt",
            sortOrder: params.sortOrder ?? "desc",
            page: params.page ?? 1,
            limit: params.limit ?? 24,
        },
    });

    return response.data;
}

export async function uploadMediaToLibrary(
    payload: UploadMediaLibraryPayload
) {
    const formData = new FormData();
    formData.append("file", payload.file);

    if (payload.folderId) {
        formData.append("folderId", payload.folderId);
    }

    if (payload.title) {
        formData.append("title", payload.title);
    }

    if (payload.altText) {
        formData.append("altText", payload.altText);
    }

    const response = await api.post("/media/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function assignMediaToProduct(
    productId: string,
    payload: AssignMediaToProductPayload
) {
    const response = await api.post(`/media/product/${productId}/assign`, payload);
    return response.data;
}

export async function assignMediaToVariant(
    variantId: string,
    payload: AssignMediaToVariantPayload
) {
    const response = await api.post(`/media/variant/${variantId}/assign`, payload);
    return response.data;
}

export async function deleteMediaFolder(folderId: string) {
    const response = await api.delete(`/media/folders/${folderId}`);
    return response.data;
}