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
    Images,
} from "lucide-react";
import Button from "@/components/ui/Button";
import MediaPickerModal from "@/modules/media/components/MediaPickerModal";
import { assignMediaToProduct } from "@/modules/media/api/mediaApi";
import type { MediaLibraryItem } from "@/modules/media/types/media";
import { resolveMediaUrl } from "@/lib/media";

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
            className={`overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm ${isDragging ? "opacity-70 shadow-lg" : ""
                }`}
        >
            <div className="relative flex h-[220px] items-center justify-center bg-cardMuted">
                <img
                    src={getPreviewUrl(item)}
                    alt={item.asset.altText || item.asset.title || "Product media"}
                    className="h-full w-full object-contain"
                />

                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-medium text-textPrimary shadow-sm ring-1 ring-borderSoft"
                    title="Drag to reorder"
                >
                    <GripVertical size={12} />
                    Drag
                </button>

                {item.isPrimary ? (
                    <div className="absolute right-3 top-3 rounded-full bg-warningSoft px-2.5 py-1 text-xs font-medium text-warning">
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
                    <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Star size={15} />}
                        onClick={() => onSetPrimary(item.id)}
                        disabled={item.isPrimary || savingPrimaryId === item.id}
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
                        leftIcon={<Trash2 size={15} />}
                        onClick={() => onDelete(item.id)}
                        disabled={deletingId === item.id}
                    >
                        {deletingId === item.id ? "Removing..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function ProductMediaTab({ productId }: ProductMediaTabProps) {
    const [items, setItems] = useState<ProductMediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [savingPrimaryId, setSavingPrimaryId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [reordering, setReordering] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [attachingExisting, setAttachingExisting] = useState(false);

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

    const handleAttachExistingMedia = async (selectedItems: MediaLibraryItem[]) => {
        setAttachingExisting(true);

        try {
            for (const item of selectedItems) {
                await assignMediaToProduct(productId, {
                    mediaAssetId: item.id,
                });
            }

            await loadMedia();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to attach media");
        } finally {
            setAttachingExisting(false);
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
            <div className="rounded-2xl border border-borderSoft bg-card p-8 text-textSecondary shadow-sm">
                Loading media...
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
                    <div className="table-header flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h4 className="text-lg font-semibold text-textPrimary">
                                Product Media
                            </h4>
                            <p className="mt-1 text-sm text-textSecondary">
                                Upload product images or select from the media library.
                                The system automatically generates gallery, thumbnail,
                                and zoom versions.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
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
                                {uploading ? "Uploading..." : "Upload Images"}
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        {!hasMedia ? (
                            <div className="rounded-2xl border border-dashed border-borderSoft bg-cardMuted p-10 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-card ring-1 ring-borderSoft">
                                    <ImageIcon size={22} className="text-textSecondary" />
                                </div>
                                <h5 className="mt-4 text-base font-medium text-textPrimary">
                                    No media uploaded yet
                                </h5>
                                <p className="mt-2 text-sm text-textSecondary">
                                    Upload one or more images or choose existing media from
                                    the library to build the product gallery.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {primaryItem ? (
                                    <div className="rounded-2xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <div className="text-sm font-medium text-textSecondary">
                                                Primary Preview
                                            </div>
                                            <div className="rounded-full bg-warningSoft px-3 py-1 text-xs font-medium text-warning">
                                                Main Storefront Image
                                            </div>
                                        </div>

                                        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-borderSoft">
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

            <MediaPickerModal
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onConfirm={handleAttachExistingMedia}
                title="Add Product Media"
                multiple={true}
                confirmLabel="Attach Media"
            />
        </>
    );
}