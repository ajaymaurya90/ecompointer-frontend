"use client";

import { useEffect, useState } from "react";
import {
    createMedia,
    deleteMedia,
    getProductMedia,
    updateMedia,
    uploadProductImage,
    type MediaType,
    type ProductMediaItem,
} from "@/modules/products/api/mediaApi";
import ProductMediaUploadForm from "@/modules/products/components/ProductMediaUploadForm";
import { Star, Trash2, Image as ImageIcon } from "lucide-react";

interface ProductMediaTabProps {
    productId: string;
}

export default function ProductMediaTab({
    productId,
}: ProductMediaTabProps) {
    const [mediaItems, setMediaItems] = useState<ProductMediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadMedia = async () => {
        try {
            setLoading(true);
            const items = await getProductMedia(productId);
            setMediaItems(items);
        } catch (error) {
            console.error(error);
            alert("Failed to load media");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMedia();
    }, [productId]);

    const handleUploadFile = async (file: File) => {
        await uploadProductImage(productId, file);
        await loadMedia();
    };

    const handleAddByUrl = async (payload: {
        url: string;
        altText?: string;
        type: MediaType;
        isPrimary: boolean;
    }) => {
        await createMedia({
            productId,
            url: payload.url,
            altText: payload.altText,
            type: payload.type,
            isPrimary: payload.isPrimary,
        });

        await loadMedia();
    };

    const handleMakePrimary = async (item: ProductMediaItem) => {
        try {
            await updateMedia(item.id, {
                isPrimary: true,
            });
            await loadMedia();
        } catch (error) {
            console.error(error);
            alert("Failed to set primary image");
        }
    };

    const handleDelete = async (item: ProductMediaItem) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this media item?"
        );

        if (!confirmed) return;

        try {
            await deleteMedia(item.id);
            await loadMedia();
        } catch (error) {
            console.error(error);
            alert("Failed to delete media");
        }
    };

    return (
        <div className="space-y-6">
            <ProductMediaUploadForm
                onUploadFile={handleUploadFile}
                onAddByUrl={handleAddByUrl}
            />

            <div className="overflow-hidden rounded-2xl border border-borderColorCustom bg-white">
                <div className="border-b border-borderColorCustom px-6 py-4">
                    <h4 className="text-lg font-semibold text-textPrimary">
                        Product Media
                    </h4>
                </div>

                {loading ? (
                    <div className="p-6 text-textSecondary">Loading media...</div>
                ) : mediaItems.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background">
                            <ImageIcon size={24} className="text-textSecondary" />
                        </div>
                        <h5 className="text-lg font-medium text-textPrimary">
                            No media yet
                        </h5>
                        <p className="mt-2 text-textSecondary">
                            Upload an image or add one by URL.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                        {mediaItems.map((item) => (
                            <div
                                key={item.id}
                                className="overflow-hidden rounded-2xl border border-borderColorCustom bg-card"
                            >
                                <div className="aspect-[4/3] w-full bg-background">
                                    <img
                                        src={
                                            item.url.startsWith("http")
                                                ? item.url
                                                : `http://localhost:3001${item.url}`
                                        }
                                        alt={item.altText || "Product media"}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="space-y-3 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-medium text-textPrimary">
                                                {item.type}
                                            </div>
                                            <div className="mt-1 text-sm text-textSecondary">
                                                {item.altText || "No alt text"}
                                            </div>
                                        </div>

                                        {item.isPrimary && (
                                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                                Primary
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            onClick={() => handleMakePrimary(item)}
                                            disabled={item.isPrimary}
                                            className="inline-flex items-center gap-2 rounded-lg border border-borderColorCustom px-3 py-2 text-sm transition hover:bg-background disabled:opacity-50"
                                        >
                                            <Star size={16} />
                                            {item.isPrimary ? "Primary" : "Set Primary"}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}