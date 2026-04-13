import { resolveMediaUrl } from "@/lib/media";
import type { MediaLibraryItem } from "@/modules/media/types/media";

export function formatFileSize(value?: number | null) {
    if (!value) return "-";
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function resolveMediaLibraryPreviewUrl(item: MediaLibraryItem) {
    return resolveMediaUrl(
        item.variants?.["product.thumbnail.square"]?.url ||
        item.variants?.["product.gallery.square"]?.url ||
        item.originalUrl
    );
}