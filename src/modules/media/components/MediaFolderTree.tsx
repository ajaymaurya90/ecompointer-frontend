"use client";

import { ChevronRight, Folder, Trash2 } from "lucide-react";
import type { MediaFolderTreeNode } from "@/modules/media/lib/folderTree";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

interface MediaFolderTreeProps {
    nodes: MediaFolderTreeNode[];
    selectedFolderId: string;
    expandedIds: Set<string>;
    deletingFolderId?: string | null;
    onToggle: (folderId: string) => void;
    onSelect: (folderId: string) => void;
    onDelete?: (folderId: string) => void;
}

function FolderTreeNode({
    node,
    selectedFolderId,
    expandedIds,
    deletingFolderId,
    onToggle,
    onSelect,
    onDelete,
    level = 0,
}: {
    node: MediaFolderTreeNode;
    selectedFolderId: string;
    expandedIds: Set<string>;
    deletingFolderId?: string | null;
    onToggle: (folderId: string) => void;
    onSelect: (folderId: string) => void;
    onDelete?: (folderId: string) => void;
    level?: number;
}) {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedFolderId === node.id;
    const isDeleting = deletingFolderId === node.id;

    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                    isSelected
                        ? "bg-primary text-textInverse"
                        : "text-textPrimary hover:bg-cardMuted"
                )}
                style={{ paddingLeft: `${12 + level * 14}px` }}
            >
                <button
                    type="button"
                    onClick={() => hasChildren && onToggle(node.id)}
                    className="flex h-5 w-5 items-center justify-center"
                >
                    {hasChildren ? (
                        <ChevronRight
                            size={14}
                            className={cn(
                                "transition-transform",
                                isExpanded ? "rotate-90" : ""
                            )}
                        />
                    ) : (
                        <span className="block h-4 w-4" />
                    )}
                </button>

                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onSelect(node.id)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                        <Folder size={15} className="shrink-0" />
                        <span className="truncate">{node.name}</span>
                    </button>

                    {onDelete && !node.isSystem ? (
                        <button
                            type="button"
                            onClick={() => onDelete(node.id)}
                            disabled={isDeleting}
                            className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition",
                                isSelected ? "hover:bg-white/15" : "hover:bg-card",
                                isDeleting && "opacity-50"
                            )}
                            title="Delete empty folder"
                        >
                            <Trash2 size={13} />
                        </button>
                    ) : null}
                </div>
            </div>

            {hasChildren && isExpanded ? (
                <div className="mt-1 space-y-1">
                    {node.children.map((child) => (
                        <FolderTreeNode
                            key={child.id}
                            node={child}
                            selectedFolderId={selectedFolderId}
                            expandedIds={expandedIds}
                            deletingFolderId={deletingFolderId}
                            onToggle={onToggle}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            level={level + 1}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export default function MediaFolderTree({
    nodes,
    selectedFolderId,
    expandedIds,
    deletingFolderId,
    onToggle,
    onSelect,
    onDelete,
}: MediaFolderTreeProps) {
    return (
        <div className="space-y-1">
            {nodes.map((node) => (
                <FolderTreeNode
                    key={node.id}
                    node={node}
                    selectedFolderId={selectedFolderId}
                    expandedIds={expandedIds}
                    deletingFolderId={deletingFolderId}
                    onToggle={onToggle}
                    onSelect={onSelect}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}