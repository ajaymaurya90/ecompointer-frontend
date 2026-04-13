"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
    createMediaFolder,
    deleteMediaFolder,
    getMediaFolders,
    getMediaLibrary,
    uploadMediaToLibrary,
} from "@/modules/media/api/mediaApi";
import type { MediaFolder, MediaLibraryItem } from "@/modules/media/types/media";
import {
    buildFolderBreadcrumb,
    buildFolderMap,
    buildFolderTree,
} from "@/modules/media/lib/folderTree";

type ViewMode = "grid" | "list";

interface UseMediaLibraryBrowserOptions {
    initialViewMode?: ViewMode;
    libraryLimit?: number;
    searchDebounceMs?: number;
}

export function useMediaLibraryBrowser(
    options: UseMediaLibraryBrowserOptions = {}
) {
    const {
        initialViewMode = "grid",
        libraryLimit = 60,
        searchDebounceMs = 350,
    } = options;

    const [folders, setFolders] = useState<MediaFolder[]>([]);
    const [items, setItems] = useState<MediaLibraryItem[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState("");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
    const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(
        new Set()
    );

    const [loadingFolders, setLoadingFolders] = useState(false);
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const folderMap = useMemo(() => buildFolderMap(folders), [folders]);
    const folderTree = useMemo(() => buildFolderTree(folders), [folders]);
    const breadcrumb = useMemo(
        () =>
            selectedFolderId
                ? buildFolderBreadcrumb(selectedFolderId, folderMap)
                : [],
        [selectedFolderId, folderMap]
    );

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearch(search);
        }, searchDebounceMs);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [search, searchDebounceMs]);

    const loadFolders = useCallback(async () => {
        setLoadingFolders(true);

        try {
            const data = await getMediaFolders();
            setFolders(data);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoadingFolders(false);
        }
    }, []);

    const loadLibrary = useCallback(async () => {
        setLoadingLibrary(true);

        try {
            const response = await getMediaLibrary({
                folderId: selectedFolderId || undefined,
                q: debouncedSearch.trim() || undefined,
                page: 1,
                limit: libraryLimit,
                sortBy: "createdAt",
                sortOrder: "desc",
            });

            setItems(response.data || []);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoadingLibrary(false);
        }
    }, [libraryLimit, debouncedSearch, selectedFolderId]);

    const reloadAll = useCallback(async () => {
        await Promise.all([loadFolders(), loadLibrary()]);
    }, [loadFolders, loadLibrary]);

    const toggleFolderExpand = useCallback((folderId: string) => {
        setExpandedFolderIds((prev) => {
            const next = new Set(prev);

            if (next.has(folderId)) {
                next.delete(folderId);
            } else {
                next.add(folderId);
            }

            return next;
        });
    }, []);

    const createFolder = useCallback(
        async (name: string) => {
            const trimmedName = name.trim();

            if (!trimmedName) {
                throw new Error("Folder name is required");
            }

            setCreatingFolder(true);

            try {
                const created = await createMediaFolder({
                    name: trimmedName,
                    parentId: selectedFolderId || undefined,
                });

                await loadFolders();

                if (created?.id) {
                    setSelectedFolderId(created.id);

                    if (created.parentId) {
                        setExpandedFolderIds((prev) => {
                            const next = new Set(prev);
                            next.add(created.parentId!);
                            return next;
                        });
                    }
                }

                return created;
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                setCreatingFolder(false);
            }
        },
        [loadFolders, selectedFolderId]
    );

    const removeFolder = useCallback(
        async (folderId: string) => {
            setDeletingFolderId(folderId);

            try {
                await deleteMediaFolder(folderId);

                if (selectedFolderId === folderId) {
                    setSelectedFolderId("");
                }

                await Promise.all([loadFolders(), loadLibrary()]);
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                setDeletingFolderId(null);
            }
        },
        [loadFolders, loadLibrary, selectedFolderId]
    );

    const uploadFiles = useCallback(
        async (files: File[]) => {
            if (!files.length) return [];

            setUploading(true);

            try {
                const uploadedResults: MediaLibraryItem[] = [];

                for (const file of files) {
                    const result = await uploadMediaToLibrary({
                        file,
                        folderId: selectedFolderId || undefined,
                        title: file.name,
                    });

                    if (result?.data) {
                        uploadedResults.push(result.data);
                    }
                }

                await loadLibrary();

                return uploadedResults;
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                setUploading(false);
            }
        },
        [loadLibrary, selectedFolderId]
    );

    const resetBrowserState = useCallback(() => {
        setSelectedFolderId("");
        setSearch("");
        setDebouncedSearch("");
        setViewMode(initialViewMode);
        setExpandedFolderIds(new Set());
    }, [initialViewMode]);

    return {
        folders,
        items,
        selectedFolderId,
        setSelectedFolderId,
        search,
        setSearch,
        debouncedSearch,
        viewMode,
        setViewMode,
        expandedFolderIds,
        setExpandedFolderIds,
        loadingFolders,
        loadingLibrary,
        creatingFolder,
        deletingFolderId,
        uploading,
        folderMap,
        folderTree,
        breadcrumb,
        loadFolders,
        loadLibrary,
        reloadAll,
        toggleFolderExpand,
        createFolder,
        removeFolder,
        uploadFiles,
        resetBrowserState,
    };
}