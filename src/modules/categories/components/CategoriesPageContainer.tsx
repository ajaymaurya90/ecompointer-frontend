"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/http";
import CategoryDetailsPanel from "@/modules/categories/components/CategoryDetailsPanel";
import type {
    CategoryNode,
    InlineCreateState,
} from "@/modules/categories/components/CategoryTree";

const CategoryTree = dynamic(
    () => import("@/modules/categories/components/CategoryTree"),
    { ssr: false }
);

interface CategoryFormState {
    name: string;
    description: string;
}

export default function CategoriesPageContainer() {
    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null);

    const [detailsForm, setDetailsForm] = useState<CategoryFormState>({
        name: "",
        description: "",
    });

    const [savingDetails, setSavingDetails] = useState(false);

    const [inlineCreate, setInlineCreate] = useState<InlineCreateState>({
        mode: null,
        targetId: null,
        parentId: null,
        name: "",
    });

    const buildTree = (items: CategoryNode[]): CategoryNode[] => {
        const map = new Map<string, CategoryNode & { children: CategoryNode[] }>();

        items.forEach((item) => {
            map.set(item.id, {
                ...item,
                children: [],
            });
        });

        const roots: Array<CategoryNode & { children: CategoryNode[] }> = [];

        map.forEach((node) => {
            if (node.parentId && map.has(node.parentId)) {
                map.get(node.parentId)!.children.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    };

    const flattenTree = (
        nodes: CategoryNode[],
        parentId: string | null = null
    ): Array<{ id: string; parentId: string | null }> => {
        return nodes.reduce<Array<{ id: string; parentId: string | null }>>((acc, node) => {
            acc.push({ id: node.id, parentId });

            if (node.children?.length) {
                acc.push(...flattenTree(node.children, node.id));
            }

            return acc;
        }, []);
    };

    const findCategoryById = (
        nodes: CategoryNode[],
        id?: string | null
    ): CategoryNode | null => {
        if (!id) {
            return null;
        }

        for (const node of nodes) {
            if (node.id === id) {
                return node;
            }

            const found = findCategoryById(node.children || [], id);
            if (found) {
                return found;
            }
        }

        return null;
    };

    const fetchCategories = async (): Promise<CategoryNode[]> => {
        setLoading(true);

        try {
            const res = await api.get("/categories");
            const tree = buildTree(res.data);
            setCategories(tree);

            if (selectedCategory) {
                const updatedSelected = findCategoryById(tree, selectedCategory.id);
                setSelectedCategory(updatedSelected);

                if (updatedSelected) {
                    setDetailsForm({
                        name: updatedSelected.name || "",
                        description: updatedSelected.description || "",
                    });
                }
            }

            return tree;
        } catch (err) {
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const selectedParentName = useMemo(() => {
        if (!selectedCategory?.parentId) {
            return "Root";
        }

        const parent = findCategoryById(categories, selectedCategory.parentId);
        return parent?.name || "Root";
    }, [categories, selectedCategory]);

    const handleSelectCategory = (category: CategoryNode) => {
        setInlineCreate({
            mode: null,
            targetId: null,
            parentId: null,
            name: "",
        });

        setSelectedCategory(category);
        setDetailsForm({
            name: category.name || "",
            description: category.description || "",
        });
    };

    const handleInlineCreateStart = (
        mode: "before" | "after" | "child",
        target: CategoryNode
    ) => {
        let parentId: string | null = null;

        if (mode === "child") {
            parentId = target.id;
        } else {
            parentId = target.parentId ?? null;
        }

        setSelectedCategory(null);

        setInlineCreate({
            mode,
            targetId: target.id,
            parentId,
            name: "",
        });
    };

    const handleAddRootCategory = () => {
        setSelectedCategory(null);
        setInlineCreate({
            mode: "after",
            targetId: null,
            parentId: null,
            name: "",
        });
    };

    const handleInlineCreateCancel = () => {
        setInlineCreate({
            mode: null,
            targetId: null,
            parentId: null,
            name: "",
        });
    };

    const handleInlineCreateSubmit = async () => {
        const name = inlineCreate.name.trim();

        if (!name) {
            alert("Category name is required");
            return;
        }

        try {
            const createRes = await api.post("/categories", {
                name,
                parentId: inlineCreate.parentId || undefined,
                description: undefined,
            });

            const newCategoryId = createRes.data.id;

            if (inlineCreate.mode === "before" || inlineCreate.mode === "after") {
                const latestTree = await fetchCategories();
                const flat = flattenTree(latestTree);

                const targetIndex = flat.findIndex(
                    (item) => item.id === inlineCreate.targetId
                );

                if (targetIndex !== -1) {
                    const newIndex =
                        inlineCreate.mode === "before" ? targetIndex : targetIndex + 1;

                    const existingIndex = flat.findIndex(
                        (item) => item.id === newCategoryId
                    );

                    if (existingIndex !== -1) {
                        const [newItem] = flat.splice(existingIndex, 1);
                        flat.splice(newIndex, 0, newItem);

                        const payload = flat.map((item, index) => ({
                            id: item.id,
                            parentId: item.parentId,
                            position: index + 1,
                        }));

                        await api.post("/categories/reorder", payload);
                    }
                }
            }

            await fetchCategories();

            setInlineCreate({
                mode: null,
                targetId: null,
                parentId: null,
                name: "",
            });
        } catch (err) {
            console.error(err);
            alert("Failed to create category");
        }
    };

    const handleDelete = async (category: CategoryNode) => {
        if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
            return;
        }

        try {
            await api.delete(`/categories/${category.id}`);

            if (selectedCategory?.id === category.id) {
                setSelectedCategory(null);
                setDetailsForm({
                    name: "",
                    description: "",
                });
            }

            await fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Cannot delete category if it has products or subcategories.");
        }
    };

    const handleSaveDetails = async () => {
        if (!selectedCategory) {
            return;
        }

        const name = detailsForm.name.trim();

        if (!name) {
            alert("Category name is required");
            return;
        }

        setSavingDetails(true);

        try {
            await api.patch(`/categories/${selectedCategory.id}`, {
                name,
                description: detailsForm.description || undefined,
                parentId: selectedCategory.parentId || undefined,
            });

            await fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Failed to update category");
        } finally {
            setSavingDetails(false);
        }
    };

    const handleReorder = async (
        flatData: { id: string; parentId: string | null; order: number }[]
    ) => {
        try {
            const payload = flatData.map((item, index) => ({
                id: item.id,
                parentId: item.parentId,
                position: index + 1,
            }));

            await api.post("/categories/reorder", payload);
            await fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Failed to reorder categories");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-textPrimary">
                    Product Categories
                </h2>

                <button
                    onClick={handleAddRootCategory}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                    Add Category
                </button>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-borderColorCustom bg-card p-6 text-textSecondary">
                    Loading categories...
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                    <div className="rounded-2xl border border-borderColorCustom bg-card p-4">
                        <CategoryTree
                            data={categories}
                            selectedId={selectedCategory?.id || null}
                            inlineCreate={inlineCreate}
                            onSelect={handleSelectCategory}
                            onEdit={handleSelectCategory}
                            onDelete={handleDelete}
                            onReorder={handleReorder}
                            onAddBefore={(category) =>
                                handleInlineCreateStart("before", category)
                            }
                            onAddAfter={(category) =>
                                handleInlineCreateStart("after", category)
                            }
                            onAdd={(category) =>
                                handleInlineCreateStart("child", category)
                            }
                            onInlineCreateNameChange={(value) =>
                                setInlineCreate((prev) => ({
                                    ...prev,
                                    name: value,
                                }))
                            }
                            onInlineCreateSubmit={handleInlineCreateSubmit}
                            onInlineCreateCancel={handleInlineCreateCancel}
                        />
                    </div>

                    <CategoryDetailsPanel
                        category={selectedCategory}
                        parentName={selectedParentName}
                        form={detailsForm}
                        onFormChange={setDetailsForm}
                        onSave={handleSaveDetails}
                        onDelete={() => selectedCategory && handleDelete(selectedCategory)}
                        saving={savingDetails}
                    />
                </div>
            )}
        </div>
    );
}