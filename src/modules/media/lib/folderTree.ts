import type { MediaFolder } from "@/modules/media/types/media";

export type MediaFolderTreeNode = MediaFolder & {
    children: MediaFolderTreeNode[];
};

export function buildFolderTree(
    folders: MediaFolder[],
    parentId: string | null = null
): MediaFolderTreeNode[] {
    return folders
        .filter((folder) => (folder.parentId ?? null) === parentId)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((folder): MediaFolderTreeNode => ({
            ...folder,
            children: buildFolderTree(folders, folder.id),
        }));
}

export function buildFolderMap(folders: MediaFolder[]) {
    return new Map(folders.map((folder) => [folder.id, folder]));
}

export function buildFolderBreadcrumb(
    folderId: string,
    folderMap: Map<string, MediaFolder>
): MediaFolder[] {
    const result: MediaFolder[] = [];
    let current = folderMap.get(folderId);

    while (current) {
        result.unshift(current);
        current = current.parentId ? folderMap.get(current.parentId) : undefined;
    }

    return result;
}