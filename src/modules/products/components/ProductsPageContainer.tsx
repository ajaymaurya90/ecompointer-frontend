"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProductListTable from "@/modules/products/components/ProductListTable";
import { useProductStore } from "@/modules/products/store/productStore";
import type { Product, ProductOption } from "@/modules/products/types/product";
import {
    deleteProduct,
    getProductBrands,
    getProductCategories,
} from "@/modules/products/api/productApi";
import { RotateCcw, Plus, SlidersHorizontal } from "lucide-react";
import FilterChip from "@/components/ui/FilterChip";
import ProductFilterModal from "@/modules/products/components/ProductFilterModal";

export default function ProductsPageContainer() {
    const router = useRouter();

    const {
        products,
        loading,
        error,
        total,
        page,
        lastPage,
        filters,
        fetchProducts,
        setPage,
        setLimit,
        applyFilters,
        removeFilterChip,
        resetFilters,
    } = useProductStore();

    const [categories, setCategories] = useState<ProductOption[]>([]);
    const [brands, setBrands] = useState<ProductOption[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        void fetchProducts();
        void loadOptions();
    }, [fetchProducts]);

    const loadOptions = async () => {
        try {
            const [categoryOptions, brandOptions] = await Promise.all([
                getProductCategories(),
                getProductBrands(),
            ]);

            setCategories(categoryOptions);
            setBrands(brandOptions);
        } catch (error) {
            console.error("Failed to fetch filter options", error);
        }
    };

    const handleAddProduct = () => {
        router.push("/dashboard/products/new");
    };

    const handleEditProduct = (product: Product) => {
        router.push(`/dashboard/products/${product.id}`);
    };

    const handleShowVariants = (product: Product) => {
        router.push(`/dashboard/products/${product.id}?tab=variants`);
    };

    const handleDeleteProduct = async (product: Product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            await deleteProduct(product.id);
            await fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Failed to delete product");
        }
    };

    const pageSummary = useMemo(() => {
        if (total === 0) return "0 products";

        const from = (page - 1) * filters.limit + 1;
        const to = Math.min(page * filters.limit, total);

        return `${from}-${to} of ${total} products`;
    }, [page, total, filters.limit]);

    const categoryNameMap = useMemo(() => {
        const map = new Map<string, string>();

        const visit = (items: ProductOption[]) => {
            items.forEach((item) => {
                map.set(item.id, item.name);
                if (item.children?.length) visit(item.children);
            });
        };

        visit(categories);
        return map;
    }, [categories]);

    const brandNameMap = useMemo(() => {
        const map = new Map<string, string>();
        brands.forEach((brand) => map.set(brand.id, brand.name));
        return map;
    }, [brands]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 bg-card p-2 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-textPrimary">
                        Products ({total})
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {filters.categoryIds.map((id) => (
                            <FilterChip
                                key={`category-${id}`}
                                label={`Category: ${categoryNameMap.get(id) || "Selected"}`}
                                onRemove={() => void removeFilterChip("categoryIds", id)}
                            />
                        ))}

                        {filters.brandIds.map((id) => (
                            <FilterChip
                                key={`brand-${id}`}
                                label={`Brand: ${brandNameMap.get(id) || "Selected"}`}
                                onRemove={() => void removeFilterChip("brandIds", id)}
                            />
                        ))}

                        {filters.status !== "active" && (
                            <FilterChip
                                label={`Status: ${filters.status}`}
                                onRemove={() => void removeFilterChip("status")}
                            />
                        )}

                        {filters.flags.map((flag) => (
                            <FilterChip
                                key={`flag-${flag}`}
                                label={`Flag: ${flag}`}
                                onRemove={() => void removeFilterChip("flags", flag)}
                            />
                        ))}

                        {filters.stockStatus && (
                            <FilterChip
                                label={`Stock: ${filters.stockStatus}`}
                                onRemove={() => void removeFilterChip("stockStatus")}
                            />
                        )}

                        {filters.imageStatus && (
                            <FilterChip
                                label={`Image: ${filters.imageStatus}`}
                                onRemove={() => void removeFilterChip("imageStatus")}
                            />
                        )}

                        {filters.productTypes.map((type) => (
                            <FilterChip
                                key={`type-${type}`}
                                label={`Type: ${type}`}
                                onRemove={() => void removeFilterChip("productTypes", type)}
                            />
                        ))}

                        {filters.createdPreset && (
                            <FilterChip
                                label={`Created: ${filters.createdPreset}`}
                                onRemove={() => void removeFilterChip("createdPreset")}
                            />
                        )}

                        {(filters.createdFrom || filters.createdTo) && (
                            <FilterChip
                                label="Created range"
                                onRemove={() => void removeFilterChip("createdRange")}
                            />
                        )}

                        {(filters.priceFrom || filters.priceTo) && (
                            <FilterChip
                                label="Price range"
                                onRemove={() => void removeFilterChip("priceRange")}
                            />
                        )}

                        {(filters.salesFrom || filters.salesTo) && (
                            <FilterChip
                                label="Sales range"
                                onRemove={() => void removeFilterChip("salesRange")}
                            />
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setFilterOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-slate-300"
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                    </button>

                    <button
                        type="button"
                        onClick={() => void resetFilters()}
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-slate-300"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>

                    <button
                        type="button"
                        onClick={handleAddProduct}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Add Product
                    </button>
                </div>
            </div>

            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            ) : null}

            <div className="overflow-hidden rounded-2xl bg-card">
                <ProductListTable
                    products={products}
                    loading={loading}
                    onEdit={handleEditProduct}
                    onShowVariants={handleShowVariants}
                    onDelete={handleDeleteProduct}
                />

                <div className="flex items-center justify-between border-t border-slate-300 bg-slate-200 px-6 py-2">
                    <div className="flex items-center gap-4">
                        <select
                            value={filters.limit}
                            onChange={(e) => void setLimit(Number(e.target.value))}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>

                        <span className="text-sm text-textSecondary">{pageSummary}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => void setPage(page - 1)}
                            disabled={page <= 1}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="text-sm text-textPrimary">
                            Page {page} of {lastPage}
                        </span>

                        <button
                            onClick={() => void setPage(page + 1)}
                            disabled={page >= lastPage}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <ProductFilterModal
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                onApply={(data) => void applyFilters(data)}
                onReset={() => void resetFilters()}
                categories={categories}
                brands={brands}
                initialFilters={filters}
            />
        </div>
    );
}