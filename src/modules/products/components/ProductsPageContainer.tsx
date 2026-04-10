"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RotateCcw, SlidersHorizontal } from "lucide-react";

import ProductListTable from "@/modules/products/components/ProductListTable";
import ProductFilterModal from "@/modules/products/components/ProductFilterModal";
import { useProductStore } from "@/modules/products/store/productStore";
import type { Product, ProductOption } from "@/modules/products/types/product";
import {
    deleteProduct,
    getProductBrands,
    getProductCategories,
} from "@/modules/products/api/productApi";

import Button from "@/components/ui/Button";
import FilterChip from "@/components/ui/FilterChip";
import PageShell from "@/components/layout/PageShell";
import DataPanel from "@/components/layout/DataPanel";

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
        } catch (loadError) {
            console.error("Failed to fetch filter options", loadError);
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
        } catch (deleteError) {
            console.error(deleteError);
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

                if (item.children?.length) {
                    visit(item.children);
                }
            });
        };

        visit(categories);

        return map;
    }, [categories]);

    const brandNameMap = useMemo(() => {
        const map = new Map<string, string>();

        brands.forEach((brand) => {
            map.set(brand.id, brand.name);
        });

        return map;
    }, [brands]);

    const hasActiveFilters =
        filters.categoryIds.length > 0 ||
        filters.brandIds.length > 0 ||
        filters.status !== "active" ||
        filters.flags.length > 0 ||
        Boolean(filters.stockStatus) ||
        Boolean(filters.imageStatus) ||
        filters.productTypes.length > 0 ||
        Boolean(filters.createdPreset) ||
        Boolean(filters.createdFrom || filters.createdTo) ||
        Boolean(filters.priceFrom || filters.priceTo) ||
        Boolean(filters.salesFrom || filters.salesTo);

    const panelHeaderActions = (
        <>
            <Button
                variant="ghost"
                leftIcon={<SlidersHorizontal size={16} />}
                onClick={() => setFilterOpen(true)}
            >
                Filters
            </Button>

            <Button
                variant="secondary"
                leftIcon={<RotateCcw size={16} />}
                onClick={() => void resetFilters()}
            >
                Reset
            </Button>

            <Button
                variant="primary"
                leftIcon={<Plus size={16} />}
                onClick={handleAddProduct}
            >
                Add Product
            </Button>
        </>
    );

    const panelFooter = (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4">
                <select
                    value={filters.limit}
                    onChange={(e) => void setLimit(Number(e.target.value))}
                    className="h-11 rounded-md border border-borderSoft bg-inputBg px-3 text-sm text-textPrimary outline-none transition focus:border-borderFocus"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>

                <span className="text-sm text-textSecondary">{pageSummary}</span>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="secondary"
                    onClick={() => void setPage(page - 1)}
                    disabled={page <= 1}
                >
                    Prev
                </Button>

                <span className="text-sm font-medium text-textPrimary">
                    Page {page} of {lastPage}
                </span>

                <Button
                    variant="secondary"
                    onClick={() => void setPage(page + 1)}
                    disabled={page >= lastPage}
                >
                    Next
                </Button>
            </div>
        </div>
    );

    return (
        <PageShell>
            {error ? (
                <div className="rounded-lg border border-danger bg-dangerSoft px-4 py-3 text-sm text-danger">
                    {error}
                </div>
            ) : null}

            <DataPanel
                title={`Product List (${total})`}
                description="Manage your catalog, inventory visibility, and product structure."
                headerContent={panelHeaderActions}
                footer={panelFooter}
            >
                {hasActiveFilters ? (
                    <div className="bg-cardMuted px-6 py-4">
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
                ) : null}

                <ProductListTable
                    products={products}
                    loading={loading}
                    onEdit={handleEditProduct}
                    onShowVariants={handleShowVariants}
                    onDelete={handleDeleteProduct}
                />
            </DataPanel>

            <ProductFilterModal
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                onApply={(data) => void applyFilters(data)}
                onReset={() => void resetFilters()}
                categories={categories}
                brands={brands}
                initialFilters={filters}
            />
        </PageShell>
    );
}