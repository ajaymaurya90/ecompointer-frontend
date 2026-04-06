"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    ChevronDown,
    ChevronRight,
    Folder,
    GripVertical,
    MoreHorizontal,
    Plus,
} from "lucide-react";

export interface CategoryNode {
    id: string;
    name: string;
    parentId?: string | null;
    description?: string;
    position?: number;
    isActive?: boolean;
    productCount?: number;
    children?: CategoryNode[];
}

export interface InlineCreateState {
    mode: "before" | "after" | "child" | null;
    targetId: string | null;
    parentId: string | null;
    name: string;
}

interface CategoryTreeProps {
    data: CategoryNode[];
    selectedId?: string | null;
    inlineCreate: InlineCreateState;
    onEdit?: (category: CategoryNode) => void;
    onDelete?: (category: CategoryNode) => void;
    onReorder?: (flatData: { id: string; parentId: string | null; order: number }[]) => void;
    onSelect?: (category: CategoryNode) => void;
    onAdd?: (parent: CategoryNode) => void;
    onAddBefore?: (category: CategoryNode) => void;
    onAddAfter?: (category: CategoryNode) => void;
    onInlineCreateNameChange: (value: string) => void;
    onInlineCreateSubmit: () => void;
    onInlineCreateCancel: () => void;
}

interface SortableCategoryNode extends CategoryNode { }

function InlineCreateRow({
    level = 0,
    value,
    onChange,
    onSubmit,
    onCancel,
}: {
    level?: number;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="mb-2" style={{ paddingLeft: level * 24 }}>
            <div className="rounded-lg border border-dashed border-borderColorCustom bg-background px-3 py-3">
                <div className="flex items-center gap-2">
                    <input
                        autoFocus
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onSubmit();
                            if (e.key === "Escape") onCancel();
                        }}
                        placeholder="Enter category name"
                        className="h-10 flex-1 rounded-lg border border-borderColorCustom bg-white px-3 outline-none focus:border-primary"
                    />

                    <button
                        type="button"
                        onClick={onSubmit}
                        className="h-10 rounded-lg bg-blue-600 px-4 text-white transition hover:bg-blue-700"
                    >
                        Save
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-10 rounded-lg border border-borderColorCustom px-4 transition hover:bg-card"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CategoryTree({
    data,
    selectedId,
    inlineCreate,
    onEdit,
    onDelete,
    onReorder,
    onSelect,
    onAdd,
    onAddBefore,
    onAddAfter,
    onInlineCreateNameChange,
    onInlineCreateSubmit,
    onInlineCreateCancel,
}: CategoryTreeProps) {
    const [treeData, setTreeData] = useState<SortableCategoryNode[]>(data);

    useEffect(() => {
        setTreeData(data);
    }, [data]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        })
    );

    const flattenTree = (
        nodes: SortableCategoryNode[],
        parentId: string | null = null
    ) => {
        return nodes.reduce<{ id: string; parentId: string | null; order: number }[]>(
            (acc, node, index) => {
                acc.push({
                    id: node.id,
                    parentId,
                    order: index + 1,
                });

                if (node.children?.length) {
                    acc.push(...flattenTree(node.children as SortableCategoryNode[], node.id));
                }

                return acc;
            },
            []
        );
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = treeData.findIndex((node) => node.id === active.id);
        const newIndex = treeData.findIndex((node) => node.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        const reordered = arrayMove(treeData, oldIndex, newIndex);
        setTreeData(reordered);

        if (onReorder) {
            onReorder(flattenTree(reordered));
        }
    };

    const TreeNode = ({
        category,
        level = 0,
        isLast = false,
    }: {
        category: SortableCategoryNode;
        level?: number;
        isLast?: boolean;
    }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
            id: category.id,
        });

        const [menuOpen, setMenuOpen] = useState(false);
        const [expanded, setExpanded] = useState(true);
        const menuRef = useRef<HTMLDivElement>(null);

        const hasChildren = !!category.children?.length;
        const isSelected = selectedId === category.id;

        const showBeforeInput =
            inlineCreate.mode === "before" && inlineCreate.targetId === category.id;

        const showAfterInput =
            inlineCreate.mode === "after" && inlineCreate.targetId === category.id;

        const showChildInput =
            inlineCreate.mode === "child" && inlineCreate.targetId === category.id;

        const rowStyle = useMemo(
            () => ({
                transform: CSS.Transform.toString(transform),
                transition,
            }),
            [transform, transition]
        );

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    menuOpen &&
                    menuRef.current &&
                    !menuRef.current.contains(event.target as Node)
                ) {
                    setMenuOpen(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [menuOpen]);

        return (
            <div ref={setNodeRef} style={rowStyle}>
                {showBeforeInput ? (
                    <InlineCreateRow
                        level={level}
                        value={inlineCreate.name}
                        onChange={onInlineCreateNameChange}
                        onSubmit={onInlineCreateSubmit}
                        onCancel={onInlineCreateCancel}
                    />
                ) : null}

                <div className="relative">
                    {level > 0 ? (
                        <div
                            className="absolute left-0 top-0 border-l border-gray-200"
                            style={{
                                left: (level - 1) * 24 + 10,
                                height: isLast ? "20px" : "100%",
                            }}
                        />
                    ) : null}

                    <div
                        className="absolute border-t border-gray-200"
                        style={{
                            left: level > 0 ? (level - 1) * 24 + 10 : 0,
                            top: 20,
                            width: level > 0 ? 16 : 0,
                        }}
                    />

                    <div style={{ paddingLeft: level * 24 }} className="relative">
                        <div
                            className={`group flex min-h-[40px] items-center justify-between rounded-md px-2 py-1 transition ${isSelected ? "bg-blue-50 text-primary" : "hover:bg-background"
                                }`}
                            onClick={() => onSelect?.(category)}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (hasChildren) {
                                            setExpanded((prev) => !prev);
                                        }
                                    }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    className="flex h-5 w-5 items-center justify-center text-textSecondary"
                                >
                                    {hasChildren ? (
                                        expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                    ) : (
                                        <span className="block h-4 w-4" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="flex h-5 w-5 cursor-grab items-center justify-center text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    {...attributes}
                                    {...listeners}
                                >
                                    <GripVertical size={14} />
                                </button>

                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${category.isActive === false ? "bg-gray-400" : "bg-green-500"
                                        }`}
                                />

                                <Folder
                                    size={16}
                                    className={isSelected ? "text-primary" : "text-gray-400"}
                                />

                                <span className="truncate text-[15px] font-medium text-textPrimary">
                                    {category.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-textSecondary">
                                    {category.productCount ?? 0}
                                </span>

                                <div className="relative" ref={menuRef}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuOpen((prev) => !prev);
                                        }}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        className={`rounded-md p-1.5 transition ${menuOpen
                                                ? "bg-blue-50 text-primary"
                                                : "text-textSecondary opacity-70 hover:bg-background hover:opacity-100"
                                            }`}
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>

                                    {menuOpen ? (
                                        <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-borderColorCustom bg-white p-2 shadow-lg">
                                            <button
                                                type="button"
                                                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-background"
                                                onPointerDown={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpen(false);
                                                    onAddBefore?.(category);
                                                }}
                                            >
                                                Create before
                                            </button>

                                            <button
                                                type="button"
                                                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-background"
                                                onPointerDown={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpen(false);
                                                    onAddAfter?.(category);
                                                }}
                                            >
                                                Create after
                                            </button>

                                            <button
                                                type="button"
                                                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-background"
                                                onPointerDown={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpen(false);
                                                    onAdd?.(category);
                                                    setExpanded(true);
                                                }}
                                            >
                                                Add subcategory
                                            </button>

                                            <button
                                                type="button"
                                                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-background"
                                                onPointerDown={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpen(false);
                                                    onEdit?.(category);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                                onPointerDown={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpen(false);
                                                    onDelete?.(category);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {expanded ? (
                    <div>
                        {showChildInput ? (
                            <InlineCreateRow
                                level={level + 1}
                                value={inlineCreate.name}
                                onChange={onInlineCreateNameChange}
                                onSubmit={onInlineCreateSubmit}
                                onCancel={onInlineCreateCancel}
                            />
                        ) : null}

                        {hasChildren ? (
                            <SortableContext
                                items={category.children || []}
                                strategy={verticalListSortingStrategy}
                            >
                                <div>
                                    {category.children!.map((child, index) => (
                                        <TreeNode
                                            key={child.id}
                                            category={child as SortableCategoryNode}
                                            level={level + 1}
                                            isLast={index === category.children!.length - 1}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        ) : null}
                    </div>
                ) : null}

                {showAfterInput ? (
                    <InlineCreateRow
                        level={level}
                        value={inlineCreate.name}
                        onChange={onInlineCreateNameChange}
                        onSubmit={onInlineCreateSubmit}
                        onCancel={onInlineCreateCancel}
                    />
                ) : null}
            </div>
        );
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-medium text-textSecondary">
                    Category Tree
                </div>

                <div className="flex items-center gap-2 text-xs text-textSecondary">
                    <Plus size={14} />
                    Use row menu to add
                </div>
            </div>

            {treeData.length === 0 && inlineCreate.targetId === null ? (
                <InlineCreateRow
                    value={inlineCreate.name}
                    onChange={onInlineCreateNameChange}
                    onSubmit={onInlineCreateSubmit}
                    onCancel={onInlineCreateCancel}
                />
            ) : (
                <SortableContext items={treeData} strategy={verticalListSortingStrategy}>
                    {inlineCreate.mode === "after" && inlineCreate.targetId === null ? (
                        <InlineCreateRow
                            value={inlineCreate.name}
                            onChange={onInlineCreateNameChange}
                            onSubmit={onInlineCreateSubmit}
                            onCancel={onInlineCreateCancel}
                        />
                    ) : null}

                    <div className="space-y-1">
                        {treeData.map((category, index) => (
                            <TreeNode
                                key={category.id}
                                category={category}
                                isLast={index === treeData.length - 1}
                            />
                        ))}
                    </div>
                </SortableContext>
            )}
        </DndContext>
    );
}