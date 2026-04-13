"use client";

import { Check, ImagePlus } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";
import type { MediaLibraryItem } from "@/modules/media/types/media";
import {
    formatFileSize,
    resolveMediaLibraryPreviewUrl,
} from "@/modules/media/lib/mediaHelpers";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

interface MediaLibraryContentProps {
    items: MediaLibraryItem[];
    loading: boolean;
    viewMode: "grid" | "list";
    selectable?: boolean;
    selectedItemIds?: string[];
    onItemClick?: (item: MediaLibraryItem) => void;
}

export default function MediaLibraryContent({
    items,
    loading,
    viewMode,
    selectable = false,
    selectedItemIds = [],
    onItemClick,
}: MediaLibraryContentProps) {
    if (loading) {
        return (
            <div className="rounded-2xl bg-cardMuted p-8 text-sm text-textSecondary">
                Loading media...
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-borderSoft bg-cardMuted p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-card ring-1 ring-borderSoft">
                    <ImagePlus size={22} className="text-textSecondary" />
                </div>
                <h4 className="mt-4 text-base font-medium text-textPrimary">
                    No media found
                </h4>
                <p className="mt-2 text-sm text-textSecondary">
                    Upload new media or choose another folder.
                </p>
            </div>
        );
    }

    if (viewMode === "grid") {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {items.map((item) => {
                    const selected = selectedItemIds.includes(item.id);

                    const content = (
                        <div
                            className={cn(
                                "overflow-hidden rounded-2xl border bg-card text-left transition",
                                selectable
                                    ? selected
                                        ? "border-primary shadow-md ring-2 ring-primary/20"
                                        : "border-borderSoft hover:border-borderStrong"
                                    : "border-borderSoft hover:border-borderStrong"
                            )}
                        >
                            <div className="relative flex h-[200px] items-center justify-center bg-cardMuted">
                                <img
                                    src={resolveMediaLibraryPreviewUrl(item)}
                                    alt={item.altText || item.title || "Media"}
                                    className="h-full w-full object-contain"
                                />

                                {selectable && selected ? (
                                    <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-textInverse">
                                        <Check size={14} />
                                    </div>
                                ) : null}
                            </div>

                            <div className="space-y-1 p-4">
                                <div className="truncate font-medium text-textPrimary">
                                    {item.title || item.originalName || "Untitled"}
                                </div>

                                <div className="truncate text-xs text-textSecondary">
                                    {item.width ?? "-"} × {item.height ?? "-"} •{" "}
                                    {formatFileSize(item.fileSize)}
                                </div>

                                <div className="truncate text-xs text-textSecondary">
                                    {item.folderName || "Unfoldered"}
                                </div>
                            </div>
                        </div>
                    );

                    if (onItemClick) {
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onItemClick(item)}
                            >
                                {content}
                            </button>
                        );
                    }

                    return <div key={item.id}>{content}</div>;
                })}
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card">
            <div className="grid grid-cols-[88px_minmax(0,1.5fr)_120px_130px_minmax(0,1fr)] gap-4 border-b border-borderSoft bg-cardMuted px-4 py-3 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                <div>Preview</div>
                <div>Name</div>
                <div>Size</div>
                <div>Dimensions</div>
                <div>Folder</div>
            </div>

            <div className="divide-y divide-borderSoft">
                {items.map((item) => {
                    const selected = selectedItemIds.includes(item.id);

                    const row = (
                        <div
                            className={cn(
                                "grid w-full grid-cols-[88px_minmax(0,1.5fr)_120px_130px_minmax(0,1fr)] gap-4 px-4 py-3 text-left transition",
                                selectable
                                    ? selected
                                        ? "bg-primary/10 hover:bg-primary/10"
                                        : "hover:bg-cardMuted"
                                    : "hover:bg-cardMuted"
                            )}
                        >
                            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-cardMuted">
                                <img
                                    src={resolveMediaLibraryPreviewUrl(item)}
                                    alt={item.altText || item.title || "Media"}
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div className="min-w-0">
                                <div className="truncate font-medium text-textPrimary">
                                    {item.title || item.originalName || "Untitled"}
                                </div>
                                <div className="mt-1 truncate text-xs text-textSecondary">
                                    {item.originalName || "-"}
                                </div>
                            </div>

                            <div className="text-sm text-textSecondary">
                                {formatFileSize(item.fileSize)}
                            </div>

                            <div className="text-sm text-textSecondary">
                                {item.width ?? "-"} × {item.height ?? "-"}
                            </div>

                            <div className="truncate text-sm text-textSecondary">
                                {item.folderName || "Unfoldered"}
                            </div>
                        </div>
                    );

                    if (onItemClick) {
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onItemClick(item)}
                            >
                                {row}
                            </button>
                        );
                    }

                    return <div key={item.id}>{row}</div>;
                })}
            </div>
        </div>
    );
}