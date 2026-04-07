"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    deleteProductMediaLink,
    getProductMedia,
    reorderProductMedia,
    updateProductMediaLink,
    uploadProductMedia,
} from "@/modules/products/api/productApi";
import type { ProductMediaItem } from "@/modules/products/types/product";
import {
    GripVertical,
    Image as ImageIcon,
    Star,
    Trash2,
    Upload,
} from "lucide-react";

interface ProductMediaTabProps {
    productId: string;
}

interface SortableMediaCardProps {
    item: ProductMediaItem;
    onSetPrimary: (linkId: string) => void;
    onDelete: (linkId: string) => void;
    savingPrimaryId: string | null;
    deletingId: string | null;
    getPreviewUrl: (item: ProductMediaItem) => string;
}

function SortableMediaCard({
    item,
    onSetPrimary,
    onDelete,
    savingPrimaryId,
    deletingId,
    getPreviewUrl,
}: SortableMediaCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`overflow-hidden rounded-2xl border border-borderColorCustom bg-white ${isDragging ? "opacity-70 shadow-lg" : ""
                }`}
        >
            <div className="relative flex h-[220px] items-center justify-center bg-background">
                <img
                    src={getPreviewUrl(item)}
                    alt={item.asset.altText || item.asset.title || "Product media"}
                    className="h-full w-full object-contain"
                />

                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-medium text-textPrimary shadow-sm"
                    title="Drag to reorder"
                >
                    <GripVertical size={12} />
                    Drag
                </button>

                {item.isPrimary ? (
                    <div className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                        Primary
                    </div>
                ) : null}
            </div>

            <div className="space-y-3 p-4">
                <div className="min-w-0">
                    <div className="truncate font-medium text-textPrimary">
                        {item.asset.title || "Untitled image"}
                    </div>
                    <div className="mt-1 text-xs text-textSecondary">
                        {item.asset.width ?? "-"} × {item.asset.height ?? "-"} •{" "}
                        {item.asset.mimeType || "-"}
                    </div>
                    <div className="mt-1 text-xs text-textSecondary">
                        Role: {item.role} • Position: {item.position}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <button
                        type="button"
                        onClick={() => onSetPrimary(item.id)}
                        disabled={item.isPrimary || savingPrimaryId === item.id}
                        className="inline-flex items-center gap-2 rounded-lg border border-borderColorCustom px-3 py-2 text-sm transition hover:bg-background disabled:opacity-60"
                    >
                        <Star size={15} />
                        {item.isPrimary
                            ? "Primary"
                            : savingPrimaryId === item.id
                                ? "Saving..."
                                : "Set Primary"}
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                        <Trash2 size={15} />
                        {deletingId === item.id ? "Removing..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const MEDIA_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

function resolveMediaUrl(url?: string | null) {
    if (!url) {
        return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    return `${MEDIA_BASE_URL}${url}`;
}

export default function ProductMediaTab({ productId }: ProductMediaTabProps) {
    const [items, setItems] = useState<ProductMediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [savingPrimaryId, setSavingPrimaryId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [reordering, setReordering] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        })
    );

    const loadMedia = async () => {
        setLoading(true);

        try {
            const response = await getProductMedia(productId, 1, 100);
            setItems(response.data || []);
        } catch (error) {
            console.error("Failed to load product media", error);
            alert("Failed to load product media");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadMedia();
    }, [productId]);

    const hasMedia = items.length > 0;

    const primaryItem = useMemo(
        () => items.find((item) => item.isPrimary) || null,
        [items]
    );

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
                await uploadProductMedia(productId, file);
            }

            await loadMedia();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to upload media");
        } finally {
            setUploading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleSetPrimary = async (linkId: string) => {
        setSavingPrimaryId(linkId);

        try {
            await updateProductMediaLink(linkId, { isPrimary: true });
            await loadMedia();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to update primary media");
        } finally {
            setSavingPrimaryId(null);
        }
    };

    const handleDelete = async (linkId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this image from the product?"
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(linkId);

        try {
            await deleteProductMediaLink(linkId);
            await loadMedia();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to delete media");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        const reorderedItems = arrayMove(items, oldIndex, newIndex).map(
            (item, index) => ({
                ...item,
                position: index + 1,
            })
        );

        const previousItems = items;
        setItems(reorderedItems);
        setReordering(true);

        try {
            await reorderProductMedia(
                productId,
                reorderedItems.map((item, index) => ({
                    id: item.id,
                    position: index + 1,
                }))
            );

            await loadMedia();
        } catch (error: any) {
            console.error(error);
            setItems(previousItems);
            alert(error?.response?.data?.message || "Failed to reorder media");
        } finally {
            setReordering(false);
        }
    };

    const getPreviewUrl = (item: ProductMediaItem) => {
        return resolveMediaUrl(
            item.variants["product.thumbnail.square"]?.url ||
            item.variants["product.gallery.square"]?.url ||
            item.asset.originalUrl
        );
    };

    const getGalleryUrl = (item: ProductMediaItem) => {
        return resolveMediaUrl(
            item.variants["product.gallery.square"]?.url ||
            item.asset.originalUrl
        );
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-borderColorCustom bg-white p-8 text-textSecondary">
                Loading media...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-borderColorCustom bg-white">
                <div className="flex flex-col gap-4 border-b border-borderColorCustom px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-textPrimary">
                            Product Media
                        </h4>
                        <p className="mt-1 text-sm text-textSecondary">
                            Upload product images. The system automatically generates
                            gallery, thumbnail, and zoom versions.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {reordering ? (
                            <span className="text-sm text-textSecondary">
                                Saving order...
                            </span>
                        ) : null}

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
                            {uploading ? "Uploading..." : "Upload Images"}
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {!hasMedia ? (
                        <div className="rounded-xl border border-dashed border-borderColorCustom bg-background p-10 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-borderColorCustom bg-white">
                                <ImageIcon size={22} className="text-textSecondary" />
                            </div>
                            <h5 className="mt-4 text-base font-medium text-textPrimary">
                                No media uploaded yet
                            </h5>
                            <p className="mt-2 text-sm text-textSecondary">
                                Upload one or more images to build the product gallery.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {primaryItem ? (
                                <div className="rounded-2xl border border-borderColorCustom bg-background p-4">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <div className="text-sm font-medium text-textSecondary">
                                            Primary Preview
                                        </div>
                                        <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                            Main Storefront Image
                                        </div>
                                    </div>

                                    <div className="overflow-hidden rounded-xl border border-borderColorCustom bg-white">
                                        <img
                                            src={getGalleryUrl(primaryItem)}
                                            alt={
                                                primaryItem.asset.altText ||
                                                primaryItem.asset.title ||
                                                "Primary media"
                                            }
                                            className="h-[360px] w-full object-contain"
                                        />
                                    </div>
                                </div>
                            ) : null}

                            <div>
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="text-sm font-medium text-textSecondary">
                                        Gallery
                                    </div>
                                    <div className="text-xs text-textSecondary">
                                        Drag images to change storefront order
                                    </div>
                                </div>

                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={(event) => void handleDragEnd(event)}
                                >
                                    <SortableContext
                                        items={items.map((item) => item.id)}
                                        strategy={rectSortingStrategy}
                                    >
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                            {items.map((item) => (
                                                <SortableMediaCard
                                                    key={item.id}
                                                    item={item}
                                                    onSetPrimary={handleSetPrimary}
                                                    onDelete={handleDelete}
                                                    savingPrimaryId={savingPrimaryId}
                                                    deletingId={deletingId}
                                                    getPreviewUrl={getPreviewUrl}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}