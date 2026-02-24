"use client";

import React, { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface CategoryNode {
    id: string;
    name: string;
    parentId?: string | null;
    description?: string;
    position?: number;
    children?: CategoryNode[];
}

// Extended node with optional callbacks
interface SortableCategoryNode extends CategoryNode {
    onEdit?: (category: CategoryNode) => void;
    onDelete?: (category: CategoryNode) => void;
}

interface CategoryTreeProps {
    data: CategoryNode[];
    onEdit?: (category: CategoryNode) => void;
    onDelete?: (category: CategoryNode) => void;
    onReorder?: (flatData: { id: string; parentId: string | null; order: number }[]) => void;
}

export default function CategoryTree({ data, onEdit, onDelete, onReorder }: CategoryTreeProps) {
    const [treeData, setTreeData] = useState<SortableCategoryNode[]>(
        data.map(cat => ({ ...cat, onEdit, onDelete }))
    );

    useEffect(() => {
        setTreeData(data.map(cat => ({ ...cat, onEdit, onDelete })));
    }, [data, onEdit, onDelete]);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        // Only same-level drag (simplified)
        const oldIndex = treeData.findIndex(node => node.id === active.id);
        const newIndex = treeData.findIndex(node => node.id === over.id);
        const newTree = arrayMove(treeData, oldIndex, newIndex);
        setTreeData(newTree);

        // Flatten tree and send to backend
        if (onReorder) {
            const flattenTree = (nodes: SortableCategoryNode[], parentId: string | null = null) => {
                return nodes.reduce<{ id: string; parentId: string | null; order: number }[]>((acc, node, index) => {
                    acc.push({ id: node.id, parentId, order: index + 1 });
                    if (node.children?.length) {
                        acc.push(...flattenTree(node.children as SortableCategoryNode[], node.id));
                    }
                    return acc;
                }, []);
            };
            const flatData = flattenTree(newTree);
            onReorder(flatData);
        }
    };

    const SortableItem: React.FC<{ category: SortableCategoryNode; level?: number }> = ({ category, level = 0 }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            paddingLeft: level * 20,
            border: "1px solid #ddd",
            marginBottom: 4,
            borderRadius: 4,
            padding: "8px",
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                <span>{category.name}</span>
                <div className="flex gap-2">
                    <button onClick={() => category.onEdit?.(category)} className="text-blue-600 hover:text-blue-800">
                        Edit
                    </button>
                    <button onClick={() => category.onDelete?.(category)} className="text-red-600 hover:text-red-800">
                        Delete
                    </button>
                </div>
                {category.children?.length && (
                    <div className="mt-2 w-full">
                        <SortableContext items={category.children} strategy={verticalListSortingStrategy}>
                            {category.children.map(child => (
                                <SortableItem key={child.id} category={child as SortableCategoryNode} level={level + 1} />
                            ))}
                        </SortableContext>
                    </div>
                )}
            </div>
        );
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={treeData} strategy={verticalListSortingStrategy}>
                {treeData.map(cat => (
                    <SortableItem key={cat.id} category={cat} />
                ))}
            </SortableContext>
        </DndContext>
    );
}