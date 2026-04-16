"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    deleteChildProductMediaLink,
    getChildProductMedia,
    updateChildProductMediaLink,
    uploadChildProductMedia,
    type VariantMediaListResponse,
} from "@/modules/products/api/productVariantApi";
import type { ProductMediaItem } from "@/modules/products/types/product";
import {
    Image as ImageIcon,
    Star,
    Trash2,
    Upload,
    Images,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";
import Button from "@/components/ui/Button";
import MediaPickerModal from "@/modules/media/components/MediaPickerModal";
import { assignMediaToVariant } from "@/modules/media/api/mediaApi";
import type { MediaLibraryItem } from "@/modules/media/types/media";

interface VariantMediaTabProps {
    childProductId: string;
}

export default function VariantMediaTab({
    childProductId,
}: VariantMediaTabProps) {
    const [mediaItems, setMediaItems] = useState<ProductMediaItem[]>([]);
    const [source, setSource] =
        useState<VariantMediaListResponse["source"]>("product-fallback");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [savingPrimaryId, setSavingPrimaryId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [attachingExisting, setAttachingExisting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const loadMedia = async () => {
        try {
            setLoading(true);
            const response = await getChildProductMedia(childProductId, 1, 100);
            setMediaItems(response.data || []);
            setSource(response.source);
        } catch (error) {
            console.error(error);
            alert("Failed to load variant media");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadMedia();
    }, [childProductId]);

    const primaryItem = useMemo(
        () => mediaItems.find((item) => item.isPrimary) || null,
        [mediaItems]
    );

    const hasOwnVariantMedia = source === "variant";
    const hasMedia = mediaItems.length > 0;

    const getPreviewUrl = (item: ProductMediaItem) => {
        return resolveMediaUrl(
            item.variants["product.thumbnail.square"]?.url ||
            item.variants["product.gallery.square"]?.url ||
            item.asset.originalUrl
        );
    };

    const getMainPreviewUrl = (item: ProductMediaItem) => {
        return resolveMediaUrl(
            item.variants["product.gallery.square"]?.url || item.asset.originalUrl
        );
    };

    const handleSelectFiles = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);

        if (!files.length) {
            return;
        }

        setUploading(true);

        try {
            for (const file of files) {
                await uploadChildProductMedia(childProductId, file);
            }

            await loadMedia();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to upload variant media");
        } finally {
            setUploading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleAttachVariantMedia = async (selectedItems: MediaLibraryItem[]) => {
        setAttachingExisting(true);

        try {
            for (const item of selectedItems) {
                await assignMediaToVariant(childProductId, {
                    mediaAssetId: item.id,
                });
            }

            await loadMedia();
        } catch (error: any) {
            console.error(error);
            alert(
                error?.response?.data?.message || "Failed to attach variant media"
            );
        } finally {
            setAttachingExisting(false);
        }
    };

    const handleMakePrimary = async (item: ProductMediaItem) => {
        setSavingPrimaryId(item.id);

        try {
            await updateChildProductMediaLink(item.id, {
                isPrimary: true,
            });
            await loadMedia();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to set primary image");
        } finally {
            setSavingPrimaryId(null);
        }
    };

    const handleDelete = async (item: ProductMediaItem) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this variant media?"
        );

        if (!confirmed) return;

        setDeletingId(item.id);

        try {
            await deleteChildProductMediaLink(item.id);
            await loadMedia();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to delete media");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-borderSoft bg-card p-6 text-textSecondary shadow-sm">
                Loading variant media...
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
                <div className="table-header flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-textPrimary">
                            Variant Media
                        </h4>
                        <p className="mt-1 text-sm text-textSecondary">
                            Upload variant-specific images or choose existing media
                            from the library. Until then, this variant uses the
                            parent product images automatically.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleSelectFiles}
                        />

                        <Button
                            variant="secondary"
                            leftIcon={<Images size={16} />}
                            onClick={() => setPickerOpen(true)}
                            disabled={attachingExisting}
                        >
                            {attachingExisting ? "Attaching..." : "Select Media"}
                        </Button>

                        <Button
                            variant="primary"
                            leftIcon={<Upload size={16} />}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload Variant Images"}
                        </Button>
                    </div>
                </div>

                <div className="table-header px-6 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-textPrimary">
                            Current source:
                        </span>

                        {hasOwnVariantMedia ? (
                            <span className="rounded-full bg-infoSoft px-3 py-1 text-xs font-medium text-info">
                                Using variant images
                            </span>
                        ) : (
                            <span className="rounded-full bg-warningSoft px-3 py-1 text-xs font-medium text-warning">
                                Using parent product images
                            </span>
                        )}
                    </div>
                </div>

                {!hasMedia ? (
                    <div className="p-10 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cardMuted ring-1 ring-borderSoft">
                            <ImageIcon size={24} className="text-textSecondary" />
                        </div>
                        <h5 className="text-lg font-medium text-textPrimary">
                            No media available
                        </h5>
                        <p className="mt-2 text-textSecondary">
                            Upload images for this variant or select media from the
                            library.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 p-6">
                        {primaryItem ? (
                            <div className="rounded-2xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                                <div className="mb-3 text-sm font-medium text-textSecondary">
                                    Primary Preview
                                </div>

                                <div className="overflow-hidden rounded-xl bg-card ring-1 ring-borderSoft">
                                    <img
                                        src={getMainPreviewUrl(primaryItem) || ""}
                                        alt={
                                            primaryItem.asset.altText ||
                                            primaryItem.asset.title ||
                                            "Variant media"
                                        }
                                        className="h-[320px] w-full object-contain"
                                    />
                                </div>
                            </div>
                        ) : null}

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {mediaItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm"
                                >
                                    <div className="relative h-[220px] w-full bg-cardMuted">
                                        <img
                                            src={getPreviewUrl(item) || ""}
                                            alt={
                                                item.asset.altText ||
                                                item.asset.title ||
                                                "Variant media"
                                            }
                                            className="h-full w-full object-contain"
                                        />

                                        {item.isPrimary ? (
                                            <span className="absolute right-3 top-3 rounded-full bg-infoSoft px-2.5 py-1 text-xs font-medium text-info">
                                                Primary
                                            </span>
                                        ) : null}

                                        {!hasOwnVariantMedia ? (
                                            <span className="absolute left-3 top-3 rounded-full bg-warningSoft px-2.5 py-1 text-xs font-medium text-warning">
                                                Product fallback
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="space-y-3 p-4">
                                        <div>
                                            <div className="truncate text-sm font-medium text-textPrimary">
                                                {item.asset.title || "Untitled image"}
                                            </div>
                                            <div className="mt-1 text-xs text-textSecondary">
                                                {item.asset.width ?? "-"} ×{" "}
                                                {item.asset.height ?? "-"} •{" "}
                                                {item.asset.mimeType || "-"}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                leftIcon={<Star size={16} />}
                                                onClick={() => void handleMakePrimary(item)}
                                                disabled={
                                                    item.isPrimary ||
                                                    !hasOwnVariantMedia ||
                                                    savingPrimaryId === item.id
                                                }
                                            >
                                                {item.isPrimary
                                                    ? "Primary"
                                                    : savingPrimaryId === item.id
                                                        ? "Saving..."
                                                        : "Set Primary"}
                                            </Button>

                                            <Button
                                                variant="danger"
                                                size="sm"
                                                leftIcon={<Trash2 size={16} />}
                                                onClick={() => void handleDelete(item)}
                                                disabled={
                                                    !hasOwnVariantMedia ||
                                                    deletingId === item.id
                                                }
                                            >
                                                {deletingId === item.id
                                                    ? "Removing..."
                                                    : "Delete"}
                                            </Button>
                                        </div>

                                        {!hasOwnVariantMedia ? (
                                            <div className="rounded-xl bg-cardMuted px-3 py-2 text-xs text-textSecondary ring-1 ring-borderSoft">
                                                These images come from the parent product.
                                                Upload or attach variant images to override
                                                them for this variant.
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <MediaPickerModal
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onConfirm={handleAttachVariantMedia}
                title="Add Variant Media"
                multiple={true}
                confirmLabel="Attach Media"
            />
        </>
    );
}
