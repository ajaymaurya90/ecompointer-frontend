"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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

interface CategoryProduct {
    id: string;
    name: string;
    productCode: string;
    description?: string | null;
    totalStock: number;
    variantCount: number;
    isPrimaryCategory?: boolean;
    brand?: {
        id: string;
        name: string;
    } | null;
}

interface AssignableProduct {
    id: string;
    name: string;
    productCode: string;
    brand?: {
        id: string;
        name: string;
    } | null;
}

interface MappedPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function CategoriesPageContainer() {
    const router = useRouter();

    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null);

    const [detailsForm, setDetailsForm] = useState<CategoryFormState>({
        name: "",
        description: "",
    });

    const [savingDetails, setSavingDetails] = useState(false);

    const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);

    const [mappedPagination, setMappedPagination] = useState<MappedPagination>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    const [assignableProducts, setAssignableProducts] = useState<AssignableProduct[]>([]);
    const [assignableLoading, setAssignableLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [productSearch, setProductSearch] = useState("");
    const [selectedAssignableProductIds, setSelectedAssignableProductIds] = useState<string[]>(
        []
    );
    const [isBrowseOpen, setIsBrowseOpen] = useState(false);
    const [removingAssignmentProductId, setRemovingAssignmentProductId] = useState<string | null>(null);

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

            const normalized = (res.data || []).map((item: any) => ({
                ...item,
                productCount: item._count?.products ?? 0,
            }));

            const tree = buildTree(normalized);
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

    const fetchCategoryProducts = async (
        categoryId: string,
        page = 1,
        limit = 10
    ) => {
        setProductsLoading(true);

        try {
            const res = await api.get(`/categories/${categoryId}/products`, {
                params: {
                    page,
                    limit,
                },
            });

            setCategoryProducts(res.data?.data ?? []);
            setMappedPagination(
                res.data?.pagination ?? {
                    total: 0,
                    page,
                    limit,
                    totalPages: 1,
                }
            );
        } catch (err) {
            console.error(err);
            setCategoryProducts([]);
            setMappedPagination({
                total: 0,
                page,
                limit,
                totalPages: 1,
            });
        } finally {
            setProductsLoading(false);
        }
    };

    const fetchAssignableProducts = async (
        categoryId: string,
        search: string
    ) => {
        setAssignableLoading(true);

        try {
            const trimmedSearch = search.trim();

            const res = await api.get(`/categories/${categoryId}/product-options`, {
                params: {
                    search: trimmedSearch || undefined,
                },
            });

            setAssignableProducts(res.data?.data ?? []);
        } catch (err) {
            console.error(err);
            setAssignableProducts([]);
        } finally {
            setAssignableLoading(false);
        }
    };

    useEffect(() => {
        void fetchCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategory?.id) {
            setCategoryProducts([]);
            setAssignableProducts([]);
            setSelectedAssignableProductIds([]);
            setMappedPagination({
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
            });
            setIsBrowseOpen(false);
            return;
        }

        void fetchCategoryProducts(selectedCategory.id, 1, mappedPagination.limit);
        setAssignableProducts([]);
        setSelectedAssignableProductIds([]);
        setIsBrowseOpen(false);
    }, [selectedCategory?.id]);

    useEffect(() => {
        if (!selectedCategory?.id || !isBrowseOpen) {
            return;
        }

        const timeout = setTimeout(() => {
            setSelectedAssignableProductIds([]);
            void fetchAssignableProducts(selectedCategory.id, productSearch);
        }, 250);

        return () => clearTimeout(timeout);
    }, [productSearch, selectedCategory?.id, isBrowseOpen]);

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
        setProductSearch("");
        setAssignableProducts([]);
        setSelectedAssignableProductIds([]);
        setIsBrowseOpen(false);
        setMappedPagination((prev) => ({
            ...prev,
            page: 1,
        }));
        setDetailsForm({
            name: category.name || "",
            description: category.description || "",
        });
    };

    const handleInlineCreateStart = (
        mode: "before" | "after" | "child",
        target: CategoryNode
    ) => {
        const parentId = mode === "child" ? target.id : target.parentId ?? null;

        setSelectedCategory(null);
        setCategoryProducts([]);
        setAssignableProducts([]);
        setSelectedAssignableProductIds([]);
        setProductSearch("");
        setIsBrowseOpen(false);

        setInlineCreate({
            mode,
            targetId: target.id,
            parentId,
            name: "",
        });
    };

    const handleAddRootCategory = () => {
        setSelectedCategory(null);
        setCategoryProducts([]);
        setAssignableProducts([]);
        setSelectedAssignableProductIds([]);
        setProductSearch("");
        setIsBrowseOpen(false);
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
                setCategoryProducts([]);
                setAssignableProducts([]);
                setSelectedAssignableProductIds([]);
                setProductSearch("");
                setIsBrowseOpen(false);
                setDetailsForm({
                    name: "",
                    description: "",
                });
            }

            await fetchCategories();
        } catch (err: any) {
            console.error(err);
            alert(
                err?.response?.data?.message ||
                "Cannot delete category if it has products or subcategories."
            );
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

    const handleToggleAssignableProduct = (productId: string) => {
        setSelectedAssignableProductIds((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const handleAssignSelectedProducts = async () => {
        if (!selectedCategory?.id || selectedAssignableProductIds.length === 0) {
            return;
        }

        setAssigning(true);

        try {
            const response = await api.post(
                `/categories/${selectedCategory.id}/assign-products`,
                {
                    productIds: selectedAssignableProductIds,
                }
            );

            await Promise.all([
                fetchCategories(),
                fetchCategoryProducts(
                    selectedCategory.id,
                    mappedPagination.page,
                    mappedPagination.limit
                ),
                fetchAssignableProducts(selectedCategory.id, productSearch),
            ]);

            setSelectedAssignableProductIds([]);

            alert(`${response.data?.assignedCount ?? 0} products assigned successfully.`);
        } catch (err: any) {
            console.error(err);
            alert(
                err?.response?.data?.message ||
                "Failed to assign selected products to category"
            );
        } finally {
            setAssigning(false);
        }
    };

    const handleOpenBrowse = async () => {
        if (!selectedCategory?.id) {
            return;
        }

        setIsBrowseOpen(true);
        await fetchAssignableProducts(selectedCategory.id, productSearch);
    };

    const handleMappedPageChange = async (page: number) => {
        if (!selectedCategory?.id) {
            return;
        }

        const safePage = Math.max(page, 1);

        await fetchCategoryProducts(
            selectedCategory.id,
            safePage,
            mappedPagination.limit
        );
    };

    const handleMappedLimitChange = async (limit: number) => {
        if (!selectedCategory?.id) {
            return;
        }

        await fetchCategoryProducts(selectedCategory.id, 1, limit);
    };

    const handleRemoveAssignment = async (productId: string) => {
        if (!selectedCategory?.id) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to remove this category assignment from the product?"
        );

        if (!confirmed) {
            return;
        }

        setRemovingAssignmentProductId(productId);

        try {
            await api.delete(
                `/categories/${selectedCategory.id}/assigned-products/${productId}`
            );

            await Promise.all([
                fetchCategories(),
                fetchCategoryProducts(
                    selectedCategory.id,
                    mappedPagination.page,
                    mappedPagination.limit
                ),
                isBrowseOpen
                    ? fetchAssignableProducts(selectedCategory.id, productSearch)
                    : Promise.resolve(),
            ]);
        } catch (err: any) {
            console.error(err);
            alert(
                err?.response?.data?.message ||
                "Failed to remove category assignment"
            );
        } finally {
            setRemovingAssignmentProductId(null);
        }
    };

    const handleViewProduct = (productId: string) => {
        router.push(`/dashboard/products/${productId}`);
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
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_3fr]">
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
                        products={categoryProducts}
                        productsLoading={productsLoading}
                        mappedPagination={mappedPagination}
                        assignableProducts={assignableProducts}
                        assignableLoading={assignableLoading}
                        productSearch={productSearch}
                        selectedAssignableProductIds={selectedAssignableProductIds}
                        assigning={assigning}
                        isBrowseOpen={isBrowseOpen}
                        removingAssignmentProductId={removingAssignmentProductId}
                        onBrowseFocus={handleOpenBrowse}
                        onProductSearchChange={setProductSearch}
                        onToggleAssignableProduct={handleToggleAssignableProduct}
                        onAssignSelectedProducts={handleAssignSelectedProducts}
                        onMappedPageChange={handleMappedPageChange}
                        onMappedLimitChange={handleMappedLimitChange}
                        onRemoveAssignment={handleRemoveAssignment}
                        onViewProduct={handleViewProduct}
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