export interface MediaFolder {
    id: string;
    brandOwnerId: string;
    name: string;
    slug?: string | null;
    parentId?: string | null;
    isSystem: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MediaVariant {
    id: string;
    mediaAssetId: string;
    presetId?: string | null;
    variantKey: string;
    url: string;
    storageKey?: string | null;
    width?: number | null;
    height?: number | null;
    fileSize?: number | null;
    quality?: number | null;
    format?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface MediaLibraryItem {
    id: string;
    title?: string | null;
    altText?: string | null;
    originalName?: string | null;
    fileName?: string | null;
    extension?: string | null;
    originalUrl: string;
    storageKey?: string | null;
    mimeType?: string | null;
    fileSize?: number | null;
    width?: number | null;
    height?: number | null;
    folderId?: string | null;
    folderName?: string | null;
    variants: Record<string, MediaVariant>;
    createdAt: string;
    updatedAt: string;
}

export interface MediaLibraryResponse {
    data: MediaLibraryItem[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateMediaFolderPayload {
    name: string;
    parentId?: string;
}

export interface ListMediaLibraryParams {
    folderId?: string;
    q?: string;
    sortBy?: "createdAt" | "title" | "fileName";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}

export interface UploadMediaLibraryPayload {
    file: File;
    folderId?: string;
    title?: string;
    altText?: string;
}

export interface AssignMediaToProductPayload {
    mediaAssetId: string;
    role?: string;
    isPrimary?: boolean;
}

export interface AssignMediaToVariantPayload {
    mediaAssetId: string;
    role?: string;
    isPrimary?: boolean;
}