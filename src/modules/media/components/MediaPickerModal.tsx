"use client";

import { useEffect, useState } from "react";
import { Folder, FolderPlus, Upload, X } from "lucide-react";

import Button from "@/components/ui/Button";
import { resolveMediaLibraryPreviewUrl, formatFileSize } from "@/modules/media/lib/mediaHelpers";
import MediaFolderTree from "@/modules/media/components/MediaFolderTree";
import MediaLibraryToolbar from "@/modules/media/components/MediaLibraryToolbar";
import MediaLibraryContent from "@/modules/media/components/MediaLibraryContent";
import { useMediaLibraryBrowser } from "@/modules/media/hooks/useMediaLibraryBrowser";
import type { MediaLibraryItem } from "@/modules/media/types/media";

interface MediaPickerModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (items: MediaLibraryItem[]) => Promise<void> | void;
    title?: string;
    multiple?: boolean;
    confirmLabel?: string;
}

type PickerTab = "library" | "upload";

export default function MediaPickerModal({
    open,
    onClose,
    onConfirm,
    title = "Select Media",
    multiple = true,
    confirmLabel = "Attach Media",
}: MediaPickerModalProps) {
    const [tab, setTab] = useState<PickerTab>("library");
    const [newFolderName, setNewFolderName] = useState("");
    const [selectedItems, setSelectedItems] = useState<MediaLibraryItem[]>([]);
    const [confirming, setConfirming] = useState(false);

    const {
        folderTree,
        items,
        selectedFolderId,
        setSelectedFolderId,
        search,
        setSearch,
        debouncedSearch,
        viewMode,
        setViewMode,
        expandedFolderIds,
        loadingFolders,
        loadingLibrary,
        creatingFolder,
        deletingFolderId,
        uploading,
        breadcrumb,
        loadFolders,
        loadLibrary,
        toggleFolderExpand,
        createFolder,
        removeFolder,
        uploadFiles,
        resetBrowserState,
    } = useMediaLibraryBrowser({
        initialViewMode: "grid",
        libraryLimit: 60,
    });

    useEffect(() => {
        if (!open) return;

        void (async () => {
            await loadFolders();
            await loadLibrary();
        })();
    }, [open, loadFolders, loadLibrary]);

    useEffect(() => {
        if (!open || tab !== "library") return;
        void loadLibrary();
    }, [open, tab, loadLibrary]);

    useEffect(() => {
        if (!open) {
            setTab("library");
            setNewFolderName("");
            setSelectedItems([]);
            setConfirming(false);
            resetBrowserState();
        }
    }, [open, resetBrowserState]);

    const handleSelectItem = (item: MediaLibraryItem) => {
        if (!multiple) {
            setSelectedItems([item]);
            return;
        }

        setSelectedItems((prev) => {
            const exists = prev.some((entry) => entry.id === item.id);

            if (exists) {
                return prev.filter((entry) => entry.id !== item.id);
            }

            return [...prev, item];
        });
    };

    const handleCreateFolder = async () => {
        try {
            await createFolder(newFolderName);
            setNewFolderName("");
        } catch (error: any) {
            alert(error?.response?.data?.message || error?.message || "Failed to create folder");
        }
    };

    const handleDeleteFolder = async (folderId: string) => {
        const confirmed = window.confirm(
            "Delete this folder? Only empty folders can be deleted."
        );

        if (!confirmed) return;

        try {
            await removeFolder(folderId);
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to delete folder");
        }
    };

    const handleUploadFiles = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);

        if (!files.length) return;

        try {
            const uploadedItems = await uploadFiles(files);

            if (uploadedItems?.length) {
                if (multiple) {
                    setSelectedItems((prev) => {
                        const next = [...prev];

                        for (const uploadedItem of uploadedItems) {
                            const exists = next.some((entry) => entry.id === uploadedItem.id);
                            if (!exists) next.push(uploadedItem);
                        }

                        return next;
                    });
                } else {
                    setSelectedItems([uploadedItems[0]]);
                }
            }

            setTab("library");
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to upload media");
        } finally {
            event.target.value = "";
        }
    };

    const handleConfirm = async () => {
        if (!selectedItems.length) {
            alert("Please select at least one media item");
            return;
        }

        setConfirming(true);

        try {
            await onConfirm(selectedItems);
            onClose();
        } finally {
            setConfirming(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-overlay p-4">
            <div className="flex h-[88vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-card shadow-lg">
                <div className="table-header flex items-center justify-between px-6 py-4">
                    <div>
                        <h3 className="text-xl font-semibold text-textPrimary">{title}</h3>
                        <p className="mt-1 text-sm text-textSecondary">
                            Browse folders, search media, upload new files, and attach them.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="interactive-button flex h-10 w-10 items-center justify-center rounded-xl text-textSecondary hover:bg-cardMuted hover:text-textPrimary"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="border-b border-borderSoft px-6 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setTab("library")}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === "library"
                                ? "bg-primary text-textInverse"
                                : "bg-cardMuted text-textPrimary hover:bg-cardMuted/80"
                                }`}
                        >
                            Media Library
                        </button>

                        <button
                            type="button"
                            onClick={() => setTab("upload")}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === "upload"
                                ? "bg-primary text-textInverse"
                                : "bg-cardMuted text-textPrimary hover:bg-cardMuted/80"
                                }`}
                        >
                            Upload
                        </button>
                    </div>
                </div>

                <div className="flex min-h-0 flex-1">
                    <aside className="flex w-[280px] flex-col border-r border-borderSoft bg-cardMuted/40">
                        <div className="border-b border-borderSoft p-4">
                            <div className="mb-3 text-sm font-semibold text-textPrimary">
                                Folders
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedFolderId("")}
                                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${selectedFolderId === ""
                                    ? "bg-primary text-textInverse"
                                    : "text-textPrimary hover:bg-cardMuted"
                                    }`}
                            >
                                <Folder size={15} />
                                <span>All Media</span>
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-auto p-3">
                            {loadingFolders ? (
                                <div className="px-3 py-2 text-sm text-textSecondary">
                                    Loading folders...
                                </div>
                            ) : folderTree.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-textSecondary">
                                    No folders yet.
                                </div>
                            ) : (
                                <MediaFolderTree
                                    nodes={folderTree}
                                    selectedFolderId={selectedFolderId}
                                    expandedIds={expandedFolderIds}
                                    deletingFolderId={deletingFolderId}
                                    onToggle={toggleFolderExpand}
                                    onSelect={setSelectedFolderId}
                                    onDelete={handleDeleteFolder}
                                />
                            )}
                        </div>

                        <div className="border-t border-borderSoft p-4">
                            <div className="mb-2 text-sm font-semibold text-textPrimary">
                                Create Folder
                            </div>

                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="Folder name"
                                className="mb-2 h-11 w-full rounded-xl bg-card px-3 text-sm text-textPrimary outline-none ring-1 ring-borderSoft focus:ring-2 focus:ring-borderFocus/30"
                            />

                            <Button
                                variant="secondary"
                                size="sm"
                                fullWidth
                                leftIcon={<FolderPlus size={15} />}
                                onClick={handleCreateFolder}
                                disabled={creatingFolder}
                            >
                                {creatingFolder ? "Creating..." : "Create Folder"}
                            </Button>

                            {deletingFolderId ? (
                                <div className="mt-2 text-xs text-textSecondary">
                                    Deleting folder...
                                </div>
                            ) : null}
                        </div>
                    </aside>

                    <section className="flex min-h-0 flex-1 flex-col">
                        {tab === "library" ? (
                            <>
                                <MediaLibraryToolbar
                                    search={search}
                                    debouncedSearch={debouncedSearch}
                                    onSearchChange={setSearch}
                                    selectedFolderId={selectedFolderId}
                                    breadcrumb={breadcrumb}
                                    itemCount={items.length}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    onSelectRoot={() => setSelectedFolderId("")}
                                    onSelectFolder={setSelectedFolderId}
                                />

                                <div className="min-h-0 flex-1 overflow-auto p-6">
                                    <MediaLibraryContent
                                        items={items}
                                        loading={loadingLibrary}
                                        viewMode={viewMode}
                                        selectable
                                        selectedItemIds={selectedItems.map((item) => item.id)}
                                        onItemClick={handleSelectItem}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-0 flex-1 items-center justify-center p-6">
                                <div className="w-full max-w-2xl rounded-2xl border border-borderSoft bg-cardMuted p-8 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-card ring-1 ring-borderSoft">
                                        <Upload size={22} className="text-textSecondary" />
                                    </div>

                                    <h4 className="mt-4 text-lg font-semibold text-textPrimary">
                                        Upload Media
                                    </h4>

                                    <p className="mt-2 text-sm text-textSecondary">
                                        Upload files into{" "}
                                        {breadcrumb.length
                                            ? breadcrumb.map((item) => item.name).join(" / ")
                                            : "root library"}
                                        .
                                    </p>

                                    <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-textInverse transition hover:bg-primaryHover">
                                        <Upload size={16} />
                                        {uploading ? "Uploading..." : "Choose Files"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleUploadFiles}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                    </section>

                    <aside className="flex w-[320px] flex-col border-l border-borderSoft bg-cardMuted/30 p-4">
                        <div className="mb-3 text-sm font-semibold text-textPrimary">
                            Selected ({selectedItems.length})
                        </div>

                        <div className="min-h-0 flex-1 space-y-3 overflow-auto pr-1">
                            {selectedItems.length === 0 ? (
                                <div className="rounded-xl bg-card px-4 py-3 text-sm text-textSecondary ring-1 ring-borderSoft">
                                    No media selected yet.
                                </div>
                            ) : (
                                selectedItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="overflow-hidden rounded-xl bg-card ring-1 ring-borderSoft"
                                    >
                                        <div className="flex h-[140px] items-center justify-center bg-cardMuted">
                                            <img
                                                src={resolveMediaLibraryPreviewUrl(item)}
                                                alt={item.altText || item.title || "Media"}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>

                                        <div className="space-y-1 p-3">
                                            <div className="truncate text-sm font-medium text-textPrimary">
                                                {item.title ||
                                                    item.originalName ||
                                                    "Untitled"}
                                            </div>
                                            <div className="text-xs text-textSecondary">
                                                {item.width ?? "-"} × {item.height ?? "-"}
                                            </div>
                                            <div className="text-xs text-textSecondary">
                                                {formatFileSize(item.fileSize)}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedItems((prev) =>
                                                        prev.filter(
                                                            (entry) => entry.id !== item.id
                                                        )
                                                    )
                                                }
                                                className="mt-2 text-xs font-medium text-danger transition hover:opacity-80"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 border-t border-borderSoft pt-4">
                            <div className="mb-3 text-sm text-textSecondary">
                                {selectedItems.length > 0
                                    ? `${selectedItems.length} media selected`
                                    : "No media selected"}
                            </div>

                            <div className="flex items-center gap-3">
                                <Button variant="secondary" fullWidth onClick={onClose}>
                                    Cancel
                                </Button>

                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={handleConfirm}
                                    disabled={confirming || selectedItems.length === 0}
                                >
                                    {confirming ? "Attaching..." : confirmLabel}
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}