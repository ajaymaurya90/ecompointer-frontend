"use client";

import { useEffect, useState } from "react";
import { Folder, FolderPlus, Upload } from "lucide-react";

import Button from "@/components/ui/Button";
import MediaFolderTree from "@/modules/media/components/MediaFolderTree";
import MediaLibraryToolbar from "@/modules/media/components/MediaLibraryToolbar";
import MediaLibraryContent from "@/modules/media/components/MediaLibraryContent";
import { useMediaLibraryBrowser } from "@/modules/media/hooks/useMediaLibraryBrowser";

export default function MediaLibraryPage() {
    const [newFolderName, setNewFolderName] = useState("");

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
    } = useMediaLibraryBrowser({
        initialViewMode: "grid",
        libraryLimit: 100,
    });

    useEffect(() => {
        void loadFolders();
    }, [loadFolders]);

    useEffect(() => {
        void loadLibrary();
    }, [loadLibrary]);

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
            await uploadFiles(files);
        } catch (error: any) {
            alert(error?.response?.data?.message || "Failed to upload media");
        } finally {
            event.target.value = "";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-borderSoft bg-card px-6 py-4 shadow-sm">
                <div>
                    <div className="text-sm text-textSecondary">Media management</div>
                    <h2 className="text-2xl font-semibold text-textPrimary">
                        Media Library
                    </h2>
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-textInverse transition hover:bg-primaryHover">
                    <Upload size={16} />
                    {uploading ? "Uploading..." : "Upload Media"}
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

            <div className="flex min-h-[70vh] overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
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
                    </div>
                </aside>

                <section className="flex min-h-0 flex-1 flex-col">
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
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}