"use client";

import { useState } from "react";
import type { MediaType } from "@/modules/products/api/mediaApi";

interface ProductMediaUploadFormProps {
    onUploadFile: (file: File) => Promise<void>;
    onAddByUrl: (payload: {
        url: string;
        altText?: string;
        type: MediaType;
        isPrimary: boolean;
    }) => Promise<void>;
}

export default function ProductMediaUploadForm({
    onUploadFile,
    onAddByUrl,
}: ProductMediaUploadFormProps) {
    const [activeMode, setActiveMode] = useState<"upload" | "url">("upload");
    const [uploading, setUploading] = useState(false);

    const [url, setUrl] = useState("");
    const [altText, setAltText] = useState("");
    const [type, setType] = useState<MediaType>("GALLERY");
    const [isPrimary, setIsPrimary] = useState(false);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await onUploadFile(file);
            event.target.value = "";
        } catch (error) {
            console.error(error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleAddUrl = async () => {
        if (!url.trim()) {
            alert("Image URL is required");
            return;
        }

        setUploading(true);
        try {
            await onAddByUrl({
                url: url.trim(),
                altText: altText.trim() || undefined,
                type,
                isPrimary,
            });

            setUrl("");
            setAltText("");
            setType("GALLERY");
            setIsPrimary(false);
        } catch (error) {
            console.error(error);
            alert("Failed to add image by URL");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="rounded-2xl border border-borderColorCustom bg-white">
            <div className="border-b border-borderColorCustom px-6 py-4">
                <h4 className="text-lg font-semibold text-textPrimary">
                    Add Media
                </h4>
            </div>

            <div className="px-6 pt-4">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveMode("upload")}
                        className={`pb-3 text-sm ${activeMode === "upload"
                            ? "border-b-2 border-primary font-medium text-primary"
                            : "text-textSecondary"
                            }`}
                    >
                        Upload File
                    </button>

                    <button
                        onClick={() => setActiveMode("url")}
                        className={`pb-3 text-sm ${activeMode === "url"
                            ? "border-b-2 border-primary font-medium text-primary"
                            : "text-textSecondary"
                            }`}
                    >
                        Add by URL
                    </button>
                </div>
            </div>

            <div className="space-y-6 px-6 py-6">
                {activeMode === "upload" ? (
                    <div className="rounded-xl border border-dashed border-borderColorCustom bg-background p-6">
                        <label className="mb-3 block text-sm font-medium text-textPrimary">
                            Choose image file
                        </label>

                        <input
                            key={uploading ? "uploading" : "idle"}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="block w-full text-sm text-textSecondary file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                        />

                        <p className="mt-3 text-sm text-textSecondary">
                            Supported: image files up to 5MB.
                        </p>
                    </div>
                ) : (
                    <>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-textPrimary">
                                Image URL
                            </label>
                            <input
                                type="text"
                                value={url || ""}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/image.webp"
                                className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-textPrimary">
                                    Alt Text
                                </label>
                                <input
                                    type="text"
                                    value={altText || ""}
                                    onChange={(e) => setAltText(e.target.value)}
                                    placeholder="Image alt text"
                                    className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-textPrimary">
                                    Type
                                </label>
                                <select
                                    value={type || "GALLERY"}
                                    onChange={(e) => setType(e.target.value as MediaType)}
                                    className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                >
                                    <option value="GALLERY">Gallery</option>
                                    <option value="THUMBNAIL">Thumbnail</option>
                                    <option value="ZOOM">Zoom</option>
                                    <option value="VIDEO">Video</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="isPrimaryMedia"
                                type="checkbox"
                                checked={!!isPrimary}
                                onChange={(e) => setIsPrimary(e.target.checked)}
                                className="h-4 w-4"
                            />
                            <label
                                htmlFor="isPrimaryMedia"
                                className="text-sm text-textPrimary"
                            >
                                Mark as primary image
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleAddUrl}
                                disabled={uploading}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {uploading ? "Adding..." : "Add Media"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}