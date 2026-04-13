"use client";

import { ChevronRight, LayoutGrid, List, Search } from "lucide-react";
import type { MediaFolder } from "@/modules/media/types/media";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

interface MediaLibraryToolbarProps {
    search: string;
    debouncedSearch: string;
    onSearchChange: (value: string) => void;
    selectedFolderId: string;
    breadcrumb: MediaFolder[];
    itemCount: number;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    onSelectRoot: () => void;
    onSelectFolder: (folderId: string) => void;
}

export default function MediaLibraryToolbar({
    search,
    debouncedSearch,
    onSearchChange,
    selectedFolderId,
    breadcrumb,
    itemCount,
    viewMode,
    onViewModeChange,
    onSelectRoot,
    onSelectFolder,
}: MediaLibraryToolbarProps) {
    return (
        <div className="border-b border-borderSoft px-6 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative max-w-2xl flex-1">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by title, file name, alt text..."
                        className="h-11 w-full rounded-xl bg-card px-10 text-sm text-textPrimary outline-none ring-1 ring-borderSoft focus:ring-2 focus:ring-borderFocus/30"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Searching indicator */}
                    {search !== debouncedSearch ? (
                        <div className="flex items-center gap-2 text-xs text-textSecondary">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            Searching...
                        </div>
                    ) : null}

                    <div className="text-sm text-textSecondary">
                        {itemCount} item{itemCount === 1 ? "" : "s"}
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-cardMuted p-1">
                        <button
                            type="button"
                            onClick={() => onViewModeChange("grid")}
                            className={cn(
                                "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition",
                                viewMode === "grid"
                                    ? "bg-card text-textPrimary shadow-sm"
                                    : "text-textSecondary hover:text-textPrimary"
                            )}
                            title="Thumbnail view"
                        >
                            <LayoutGrid size={15} />
                            Grid
                        </button>

                        <button
                            type="button"
                            onClick={() => onViewModeChange("list")}
                            className={cn(
                                "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition",
                                viewMode === "list"
                                    ? "bg-card text-textPrimary shadow-sm"
                                    : "text-textSecondary hover:text-textPrimary"
                            )}
                            title="List view"
                        >
                            <List size={15} />
                            List
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-textSecondary">
                <button
                    type="button"
                    onClick={onSelectRoot}
                    className={cn(
                        "transition hover:text-textPrimary",
                        selectedFolderId === "" && "font-medium text-textPrimary"
                    )}
                >
                    All Media
                </button>

                {breadcrumb.map((folder) => (
                    <div key={folder.id} className="flex items-center gap-2">
                        <ChevronRight size={14} />
                        <button
                            type="button"
                            onClick={() => onSelectFolder(folder.id)}
                            className={cn(
                                "transition hover:text-textPrimary",
                                selectedFolderId === folder.id &&
                                "font-medium text-textPrimary"
                            )}
                        >
                            {folder.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}