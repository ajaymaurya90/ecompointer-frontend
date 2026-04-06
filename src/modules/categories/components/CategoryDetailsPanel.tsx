"use client";

import { useMemo, useState } from "react";
import type { CategoryNode } from "@/modules/categories/components/CategoryTree";
import RichTextEditor from "@/components/ui/RichTextEditor";

type CategoryProduct = {
    id: string;
    name: string;
    productCode: string;
    description?: string | null;
    totalStock: number;
    variantCount: number;
    brand?: {
        id: string;
        name: string;
    } | null;
};

type AssignableProduct = {
    id: string;
    name: string;
    productCode: string;
    brand?: {
        id: string;
        name: string;
    } | null;
    alreadyAssignedToThisCategory?: boolean;
};

type MappedPagination = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

interface CategoryDetailsPanelProps {
    category: CategoryNode | null;
    parentName: string;
    form: {
        name: string;
        description: string;
    };
    products: CategoryProduct[];
    productsLoading: boolean;
    mappedPagination: MappedPagination;
    assignableProducts: AssignableProduct[];
    assignableLoading: boolean;
    productSearch: string;
    selectedAssignableProductIds: string[];
    assigning: boolean;
    onProductSearchChange: (value: string) => void;
    onToggleAssignableProduct: (productId: string) => void;
    onAssignSelectedProducts: () => void;
    onMappedPageChange: (page: number) => void;
    onMappedLimitChange: (limit: number) => void;
    onFormChange: (form: { name: string; description: string }) => void;
    onSave: () => void;
    onDelete: () => void;
    saving?: boolean;
}

export default function CategoryDetailsPanel({
    category,
    parentName,
    form,
    products,
    productsLoading,
    mappedPagination,
    assignableProducts,
    assignableLoading,
    productSearch,
    selectedAssignableProductIds,
    assigning,
    onProductSearchChange,
    onToggleAssignableProduct,
    onAssignSelectedProducts,
    onMappedPageChange,
    onMappedLimitChange,
    onFormChange,
    onSave,
    onDelete,
    saving = false,
}: CategoryDetailsPanelProps) {
    const [activeTab, setActiveTab] = useState<"general" | "products" | "layout" | "seo">(
        "general"
    );

    const productCount = useMemo(() => {
        return category?.productCount ?? products.length;
    }, [category, products.length]);

    const selectedCount = selectedAssignableProductIds.length;
    const hasTypedSearch = productSearch.trim().length > 0;

    if (!category) {
        return (
            <div className="rounded-2xl border border-borderColorCustom bg-card p-8">
                <div className="mb-2 text-lg font-semibold text-textPrimary">
                    Category Settings
                </div>
                <p className="text-textSecondary">
                    Select a category from the left tree to edit its settings.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-borderColorCustom bg-card">
            <div className="border-b border-borderColorCustom px-6 py-5">
                <div className="mb-2 text-sm text-textSecondary">
                    Category settings
                </div>
                <h3 className="text-2xl font-semibold text-textPrimary">
                    {category.name}
                </h3>
                <p className="mt-2 text-sm text-textSecondary">
                    Manage the selected category and review mapped products.
                </p>
            </div>

            <div className="border-b border-borderColorCustom px-6 pt-4">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`pb-3 text-sm ${activeTab === "general"
                                ? "border-b-2 border-primary font-medium text-primary"
                                : "text-textSecondary"
                            }`}
                    >
                        General
                    </button>

                    <button
                        onClick={() => setActiveTab("products")}
                        className={`pb-3 text-sm ${activeTab === "products"
                                ? "border-b-2 border-primary font-medium text-primary"
                                : "text-textSecondary"
                            }`}
                    >
                        Products
                    </button>

                    <button
                        onClick={() => setActiveTab("layout")}
                        className={`pb-3 text-sm ${activeTab === "layout"
                                ? "border-b-2 border-primary font-medium text-primary"
                                : "text-textSecondary"
                            }`}
                    >
                        Layout
                    </button>

                    <button
                        onClick={() => setActiveTab("seo")}
                        className={`pb-3 text-sm ${activeTab === "seo"
                                ? "border-b-2 border-primary font-medium text-primary"
                                : "text-textSecondary"
                            }`}
                    >
                        SEO
                    </button>
                </div>
            </div>

            <div className="p-6">
                {activeTab === "general" ? (
                    <>
                        <div className="rounded-2xl border border-borderColorCustom bg-white">
                            <div className="border-b border-borderColorCustom px-6 py-4">
                                <h4 className="text-lg font-semibold text-textPrimary">
                                    General
                                </h4>
                            </div>

                            <div className="space-y-6 px-6 py-6">
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) =>
                                                onFormChange({
                                                    ...form,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                            placeholder="Category name"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                                            Parent
                                        </label>
                                        <div className="rounded-lg border border-borderColorCustom bg-background px-3 py-2 text-textSecondary">
                                            {parentName}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                                            Mapped Products
                                        </label>
                                        <div className="rounded-lg border border-borderColorCustom bg-background px-3 py-2 text-textSecondary">
                                            {productCount}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Description
                                    </label>

                                    <RichTextEditor
                                        value={form.description}
                                        onChange={(html) =>
                                            onFormChange({
                                                ...form,
                                                description: html,
                                            })
                                        }
                                        placeholder="Write category description..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                onClick={onDelete}
                                className="rounded-lg border border-red-200 px-4 py-2 text-red-600 transition hover:bg-red-50"
                            >
                                Delete
                            </button>

                            <button
                                onClick={onSave}
                                disabled={saving}
                                className="h-10 rounded-lg bg-blue-600 px-4 text-white transition hover:bg-blue-700"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </>
                ) : null}

                {activeTab === "products" ? (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-borderColorCustom bg-white">
                            <div className="border-b border-borderColorCustom px-6 py-4">
                                <h4 className="text-lg font-semibold text-textPrimary">
                                    Product assignment
                                </h4>
                            </div>

                            <div className="space-y-5 px-6 py-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Type
                                    </label>
                                    <div className="rounded-lg border border-borderColorCustom bg-background px-3 py-2 text-textSecondary">
                                        Manual selection
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                                        Products
                                    </label>

                                    <input
                                        type="text"
                                        value={productSearch}
                                        onChange={(e) => onProductSearchChange(e.target.value)}
                                        placeholder="Browse and assign products..."
                                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                    />

                                    {selectedCount > 0 ? (
                                        <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                                            {selectedCount} product
                                            {selectedCount > 1 ? "s" : ""} selected.
                                        </div>
                                    ) : null}

                                    {!hasTypedSearch ? (
                                        <div className="mt-3 rounded-xl border border-dashed border-borderColorCustom bg-background p-4 text-sm text-textSecondary">
                                            Start typing in the browse box to search products for assignment.
                                        </div>
                                    ) : (
                                        <div className="mt-3 rounded-xl border border-borderColorCustom">
                                            {assignableLoading ? (
                                                <div className="p-4 text-sm text-textSecondary">
                                                    Searching products...
                                                </div>
                                            ) : assignableProducts.length === 0 ? (
                                                <div className="p-4 text-sm text-textSecondary">
                                                    No matching products found.
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-borderColorCustom">
                                                    {assignableProducts.map((product) => {
                                                        const isChecked = selectedAssignableProductIds.includes(
                                                            product.id
                                                        );

                                                        return (
                                                            <label
                                                                key={product.id}
                                                                className="flex cursor-pointer items-start gap-3 px-4 py-3"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() =>
                                                                        onToggleAssignableProduct(product.id)
                                                                    }
                                                                    className="mt-1 h-4 w-4 rounded border-borderColorCustom"
                                                                />

                                                                <div className="min-w-0 flex-1">
                                                                    <div className="truncate font-medium text-textPrimary">
                                                                        {product.name}
                                                                    </div>

                                                                    <div className="mt-1 truncate text-sm text-textSecondary">
                                                                        {product.brand?.name || "No brand"} •{" "}
                                                                        {product.productCode}
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={onAssignSelectedProducts}
                                            disabled={
                                                !hasTypedSearch ||
                                                selectedCount === 0 ||
                                                assigning
                                            }
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            {assigning
                                                ? "Assigning..."
                                                : `Assign Selected (${selectedCount})`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-borderColorCustom bg-white">
                            <div className="border-b border-borderColorCustom px-6 py-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-textPrimary">
                                            Mapped Products
                                        </h4>
                                        <p className="mt-1 text-sm text-textSecondary">
                                            Review products directly assigned to this category.
                                        </p>
                                    </div>

                                    <div className="rounded-full bg-background px-3 py-1 text-sm text-textSecondary">
                                        {mappedPagination.total} products
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-6">
                                {productsLoading ? (
                                    <div className="text-sm text-textSecondary">
                                        Loading category products...
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-borderColorCustom bg-background p-6 text-sm text-textSecondary">
                                        No products are mapped to this category yet.
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-hidden rounded-xl border border-borderColorCustom">
                                            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 border-b border-borderColorCustom bg-background px-4 py-3 text-sm font-medium text-textSecondary">
                                                <div>Product</div>
                                                <div>Brand</div>
                                            </div>

                                            <div className="divide-y divide-borderColorCustom">
                                                {products.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 px-4 py-4 text-sm"
                                                    >
                                                        <div className="min-w-0">
                                                            <div className="truncate font-medium text-textPrimary">
                                                                {product.name}
                                                            </div>
                                                            <div className="mt-1 truncate text-textSecondary">
                                                                {product.productCode}
                                                            </div>
                                                        </div>

                                                        <div className="truncate text-textSecondary">
                                                            {product.brand?.name || "No brand"}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="text-sm text-textSecondary">
                                                Page {mappedPagination.page} of{" "}
                                                {mappedPagination.totalPages || 1} • Total{" "}
                                                {mappedPagination.total}
                                            </div>

                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-textSecondary">
                                                        Per page
                                                    </span>
                                                    <select
                                                        value={mappedPagination.limit}
                                                        onChange={(e) =>
                                                            onMappedLimitChange(Number(e.target.value))
                                                        }
                                                        className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                                                    >
                                                        <option value={5}>5</option>
                                                        <option value={10}>10</option>
                                                        <option value={20}>20</option>
                                                    </select>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={mappedPagination.page <= 1}
                                                        onClick={() =>
                                                            onMappedPageChange(mappedPagination.page - 1)
                                                        }
                                                        className="rounded-lg border border-borderColorCustom px-3 py-2 text-sm text-textSecondary transition hover:bg-background disabled:opacity-50"
                                                    >
                                                        Previous
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            mappedPagination.page >=
                                                            mappedPagination.totalPages
                                                        }
                                                        onClick={() =>
                                                            onMappedPageChange(mappedPagination.page + 1)
                                                        }
                                                        className="rounded-lg border border-borderColorCustom px-3 py-2 text-sm text-textSecondary transition hover:bg-background disabled:opacity-50"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}

                {activeTab === "layout" ? (
                    <div className="rounded-2xl border border-borderColorCustom bg-white p-6 text-sm text-textSecondary">
                        Layout settings can be added later.
                    </div>
                ) : null}

                {activeTab === "seo" ? (
                    <div className="rounded-2xl border border-borderColorCustom bg-white p-6 text-sm text-textSecondary">
                        SEO settings can be added later.
                    </div>
                ) : null}
            </div>
        </div>
    );
}