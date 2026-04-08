"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    deleteVariantMediaLink,
    getVariantMedia,
    updateVariantMediaLink,
    uploadVariantMedia,
    type VariantMediaListResponse,
} from "@/modules/products/api/productVariantApi";
import type { ProductMediaItem } from "@/modules/products/types/product";
import {
    Image as ImageIcon,
    Star,
    Trash2,
    Upload,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";

interface VariantMediaTabProps {
    variantId: string;
}

export default function VariantMediaTab({
    variantId,
}: VariantMediaTabProps) {
    const [mediaItems, setMediaItems] = useState<ProductMediaItem[]>([]);
    const [source, setSource] =
        useState<VariantMediaListResponse["source"]>("product-fallback");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [savingPrimaryId, setSavingPrimaryId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const loadMedia = async () => {
        try {
            setLoading(true);
            const response = await getVariantMedia(variantId, 1, 100);
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
    }, [variantId]);

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
                await uploadVariantMedia(variantId, file);
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

    const handleMakePrimary = async (item: ProductMediaItem) => {
        setSavingPrimaryId(item.id);

        try {
            await updateVariantMediaLink(item.id, {
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
            await deleteVariantMediaLink(item.id);
            await loadMedia();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to delete media");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="rounded-2xl border border-borderColorCustom bg-white">
            <div className="flex items-center justify-between border-b border-borderColorCustom px-6 py-4">
                <div>
                    <h4 className="text-lg font-semibold text-textPrimary">
                        Variant Media
                    </h4>
                    <p className="mt-1 text-sm text-textSecondary">
                        Upload variant-specific images. Until then, this variant uses
                        the parent product images automatically.
                    </p>
                </div>

                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleSelectFiles}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >
                        <Upload size={16} />
                        {uploading ? "Uploading..." : "Upload Variant Images"}
                    </button>
                </div>
            </div>

            <div className="border-b border-borderColorCustom px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-textPrimary">
                        Current source:
                    </span>

                    {hasOwnVariantMedia ? (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            Using variant images
                        </span>
                    ) : (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                            Using parent product images
                        </span>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="p-6 text-textSecondary">Loading variant media...</div>
            ) : !hasMedia ? (
                <div className="p-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background">
                        <ImageIcon size={24} className="text-textSecondary" />
                    </div>
                    <h5 className="text-lg font-medium text-textPrimary">
                        No media available
                    </h5>
                    <p className="mt-2 text-textSecondary">
                        Upload images for this variant or rely on the parent product
                        gallery.
                    </p>
                </div>
            ) : (
                <div className="space-y-6 p-6">
                    {primaryItem ? (
                        <div className="rounded-2xl border border-borderColorCustom bg-background p-4">
                            <div className="mb-3 text-sm font-medium text-textSecondary">
                                Primary Preview
                            </div>

                            <div className="overflow-hidden rounded-xl border border-borderColorCustom bg-white">
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
                                className="overflow-hidden rounded-2xl border border-borderColorCustom bg-card"
                            >
                                <div className="relative h-[220px] w-full bg-background">
                                    <img
                                        src={getPreviewUrl(item) || ""}
                                        alt={item.asset.altText || item.asset.title || "Variant media"}
                                        className="h-full w-full object-contain"
                                    />

                                    {item.isPrimary ? (
                                        <span className="absolute right-3 top-3 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                            Primary
                                        </span>
                                    ) : null}

                                    {!hasOwnVariantMedia ? (
                                        <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
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
                                            {item.asset.width ?? "-"} × {item.asset.height ?? "-"} •{" "}
                                            {item.asset.mimeType || "-"}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            onClick={() => void handleMakePrimary(item)}
                                            disabled={
                                                item.isPrimary ||
                                                !hasOwnVariantMedia ||
                                                savingPrimaryId === item.id
                                            }
                                            className="inline-flex items-center gap-2 rounded-lg border border-borderColorCustom px-3 py-2 text-sm transition hover:bg-background disabled:opacity-50"
                                        >
                                            <Star size={16} />
                                            {item.isPrimary
                                                ? "Primary"
                                                : savingPrimaryId === item.id
                                                    ? "Saving..."
                                                    : "Set Primary"}
                                        </button>

                                        <button
                                            onClick={() => void handleDelete(item)}
                                            disabled={!hasOwnVariantMedia || deletingId === item.id}
                                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />
                                            {deletingId === item.id ? "Removing..." : "Delete"}
                                        </button>
                                    </div>

                                    {!hasOwnVariantMedia ? (
                                        <div className="rounded-lg border border-borderColorCustom bg-background px-3 py-2 text-xs text-textSecondary">
                                            These images come from the parent product. Upload
                                            variant images to override them for this variant.
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}