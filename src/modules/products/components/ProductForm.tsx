"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
    ProductFormData,
    ProductOption,
} from "@/modules/products/types/product";
import FieldTooltip from "@/components/ui/FieldTooltip";
import RichTextEditor from "@/components/ui/RichTextEditor";

interface ProductFormProps {
    form: ProductFormData;
    brands: ProductOption[];
    categories: ProductOption[];
    onChange: (field: keyof ProductFormData, value: string | string[]) => void;
}

export default function ProductForm({
    form,
    brands,
    categories,
    onChange,
}: ProductFormProps) {
    const [categorySearch, setCategorySearch] = useState("");
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const categoryDropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(event.target as Node)
            ) {
                setCategoryDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedCategoryMap = useMemo(() => {
        const map = new Map<string, ProductOption>();

        const visit = (nodes: ProductOption[]) => {
            nodes.forEach((node) => {
                map.set(node.id, node);

                if (node.children?.length) {
                    visit(node.children);
                }
            });
        };

        visit(categories);
        return map;
    }, [categories]);

    const parentMap = useMemo(() => {
        const map = new Map<string, string | null>();

        const visit = (nodes: ProductOption[], parentId: string | null = null) => {
            nodes.forEach((node) => {
                map.set(node.id, parentId);

                if (node.children?.length) {
                    visit(node.children, node.id);
                }
            });
        };

        visit(categories);
        return map;
    }, [categories]);

    const selectedCategories = form.categoryIds
        .map((id) => selectedCategoryMap.get(id))
        .filter(Boolean) as ProductOption[];

    // Build a visual-highlight set so when child category is selected,
    // its full parent chain also appears active in the tree.
    const visuallySelectedIds = useMemo(() => {
        const result = new Set<string>();

        for (const categoryId of form.categoryIds) {
            let currentId: string | null | undefined = categoryId;

            while (currentId) {
                result.add(currentId);
                currentId = parentMap.get(currentId) ?? null;
            }
        }

        return result;
    }, [form.categoryIds, parentMap]);

    // Auto-expand parent chain for selected categories so user can see the path.
    useEffect(() => {
        const nextExpandedIds = new Set<string>();

        for (const categoryId of form.categoryIds) {
            let currentParentId = parentMap.get(categoryId);

            while (currentParentId) {
                nextExpandedIds.add(currentParentId);
                currentParentId = parentMap.get(currentParentId) ?? null;
            }
        }

        setExpandedIds((prev) => {
            const merged = new Set([...prev, ...nextExpandedIds]);
            return [...merged];
        });
    }, [form.categoryIds, parentMap]);

    const toggleExpanded = (categoryId: string) => {
        setExpandedIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const toggleCategorySelection = (categoryId: string) => {
        const isSelected = form.categoryIds.includes(categoryId);

        if (isSelected) {
            const nextCategoryIds = form.categoryIds.filter((id) => id !== categoryId);
            onChange("categoryIds", nextCategoryIds);

            // If removed category was primary, fallback to first remaining category.
            if (form.categoryId === categoryId) {
                onChange("categoryId", nextCategoryIds[0] || "");
            }

            return;
        }

        const nextCategoryIds = [...form.categoryIds, categoryId];
        onChange("categoryIds", nextCategoryIds);

        // Auto-set first selected category as primary.
        if (!form.categoryId) {
            onChange("categoryId", categoryId);
        }
    };

    const removeSelectedCategory = (categoryId: string) => {
        const nextCategoryIds = form.categoryIds.filter((id) => id !== categoryId);
        onChange("categoryIds", nextCategoryIds);

        if (form.categoryId === categoryId) {
            onChange("categoryId", nextCategoryIds[0] || "");
        }
    };

    const filterTree = (nodes: ProductOption[], search: string): ProductOption[] => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return nodes;
        }

        return nodes
            .map((node) => {
                const filteredChildren = node.children?.length
                    ? filterTree(node.children, normalizedSearch)
                    : [];

                const matchesSelf = node.name.toLowerCase().includes(normalizedSearch);

                if (matchesSelf || filteredChildren.length) {
                    return {
                        ...node,
                        children: filteredChildren,
                    };
                }

                return null;
            })
            .filter(Boolean) as ProductOption[];
    };

    const filteredCategories = useMemo(() => {
        return filterTree(categories, categorySearch);
    }, [categories, categorySearch]);

    const renderCategoryNode = (category: ProductOption, level = 0) => {
        const hasChildren = !!category.children?.length;
        const isExpanded = expandedIds.includes(category.id);
        const isActuallySelected = form.categoryIds.includes(category.id);
        const isVisuallySelected = visuallySelectedIds.has(category.id);
        const isPrimary = form.categoryId === category.id;

        return (
            <div key={category.id}>
                <div
                    className={`flex items-center justify-between rounded-lg px-3 py-2 transition ${isActuallySelected
                            ? "bg-blue-50"
                            : isVisuallySelected
                                ? "bg-slate-50"
                                : "hover:bg-background"
                        }`}
                    style={{ paddingLeft: `${12 + level * 20}px` }}
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => hasChildren && toggleExpanded(category.id)}
                            className="flex h-5 w-5 items-center justify-center text-textSecondary"
                        >
                            {hasChildren ? (
                                <span className="text-sm">{isExpanded ? "▾" : "▸"}</span>
                            ) : (
                                <span className="block h-5 w-5" />
                            )}
                        </button>

                        <input
                            type="checkbox"
                            checked={isActuallySelected}
                            onChange={() => toggleCategorySelection(category.id)}
                            className="h-4 w-4 rounded border-borderColorCustom"
                        />

                        <span
                            className={`truncate text-sm ${isActuallySelected
                                    ? "font-medium text-primary"
                                    : isVisuallySelected
                                        ? "text-textPrimary"
                                        : "text-textPrimary"
                                }`}
                        >
                            {category.name}
                        </span>
                    </div>

                    <div className="ml-3 flex items-center gap-2">
                        {isPrimary ? (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                Primary
                            </span>
                        ) : null}

                        <span
                            className={`h-2.5 w-2.5 rounded-full ${isActuallySelected
                                    ? "bg-green-500"
                                    : isVisuallySelected
                                        ? "bg-blue-300"
                                        : "bg-slate-300"
                                }`}
                        />
                    </div>
                </div>

                {hasChildren && isExpanded ? (
                    <div>
                        {category.children!.map((child) =>
                            renderCategoryNode(child, level + 1)
                        )}
                    </div>
                ) : null}
            </div>
        );
    };

    return (
        <div className="rounded-2xl border border-borderColorCustom bg-white">
            <div className="border-b border-borderColorCustom px-6 py-4">
                <h4 className="text-lg font-semibold text-textPrimary">
                    General Information
                </h4>
            </div>

            <div className="space-y-6 px-6 py-6">
                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Name
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        placeholder="Product name"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Brand
                        </label>
                        <select
                            value={form.brandId}
                            onChange={(e) => onChange("brandId", e.target.value)}
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        >
                            <option value="">Select brand</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-textPrimary">
                                Product Code
                            </span>

                            <FieldTooltip text="Product code is auto-suggested on create, but you can still edit it manually." />
                        </div>

                        <input
                            type="text"
                            value={form.productCode}
                            onChange={(e) => onChange("productCode", e.target.value)}
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                            placeholder="Product code"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-textPrimary">
                                Categories
                            </span>

                            <FieldTooltip text="Assign multiple categories to this product. If a child category is selected, its parent path is highlighted visually in the tree." />
                        </div>

                        <div ref={categoryDropdownRef} className="relative">
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setCategoryDropdownOpen((prev) => !prev);
                                    }

                                    if (e.key === "Escape") {
                                        setCategoryDropdownOpen(false);
                                    }
                                }}
                                className="flex min-h-[52px] w-full flex-wrap items-center gap-2 rounded-lg border border-borderColorCustom bg-white px-3 py-2 text-left outline-none transition focus:border-primary"
                            >
                                {selectedCategories.length ? (
                                    selectedCategories.map((category) => {
                                        const isPrimary = form.categoryId === category.id;

                                        return (
                                            <span
                                                key={category.id}
                                                className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm ${isPrimary
                                                        ? "border-primary bg-blue-50 text-primary"
                                                        : "border-borderColorCustom bg-background text-textPrimary"
                                                    }`}
                                            >
                                                <span>{category.name}</span>

                                                {isPrimary ? (
                                                    <span className="text-[11px] font-medium">
                                                        Primary
                                                    </span>
                                                ) : null}

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeSelectedCategory(category.id);
                                                    }}
                                                    className="text-textSecondary transition hover:text-red-600"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        );
                                    })
                                ) : (
                                    <span className="text-textSecondary">
                                        Assign categories to...
                                    </span>
                                )}
                            </div>

                            {categoryDropdownOpen ? (
                                <div className="absolute z-20 mt-2 max-h-[420px] w-full overflow-hidden rounded-xl border border-borderColorCustom bg-white shadow-lg">
                                    <div className="border-b border-borderColorCustom p-3">
                                        <input
                                            type="text"
                                            value={categorySearch}
                                            onChange={(e) => setCategorySearch(e.target.value)}
                                            placeholder="Search categories..."
                                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                        />
                                    </div>

                                    <div className="max-h-[340px] overflow-auto p-2">
                                        {filteredCategories.length ? (
                                            filteredCategories.map((category) =>
                                                renderCategoryNode(category)
                                            )
                                        ) : (
                                            <div className="px-3 py-6 text-sm text-textSecondary">
                                                No categories found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-textPrimary">
                                Primary Category
                            </span>

                            <FieldTooltip text="This is the default category used for the main product classification, storefront navigation, and future SEO/canonical logic." />
                        </div>

                        <select
                            value={form.categoryId}
                            onChange={(e) => onChange("categoryId", e.target.value)}
                            className="min-h-[52px] w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        >
                            <option value="">Select primary</option>
                            {selectedCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-textPrimary">
                            Description
                        </span>

                        <FieldTooltip text="Add detailed product description with formatting, links, and lists." />
                    </div>

                    <RichTextEditor
                        value={form.description}
                        onChange={(html) => onChange("description", html)}
                        placeholder="Write product description..."
                    />
                </div>
            </div>
        </div>
    );
}