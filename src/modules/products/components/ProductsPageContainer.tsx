"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProductListTable from "@/modules/products/components/ProductListTable";
import { useProductStore } from "@/modules/products/store/productStore";
import type { Product, ProductOption } from "@/modules/products/types/product";
import {
    deleteProduct,
    getProductCategories,
} from "@/modules/products/api/productApi";
import { Search, RotateCcw } from "lucide-react";

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
        setSearch,
        setCategoryId,
        setSort,
        setLimit,
        applySearch,
        resetFilters,
    } = useProductStore();

    const [categories, setCategories] = useState<ProductOption[]>([]);

    useEffect(() => {
        void fetchProducts();
        void loadCategories();
    }, [fetchProducts]);

    const loadCategories = async () => {
        try {
            const categoryOptions = await getProductCategories();
            setCategories(categoryOptions);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleAddProduct = () => {
        router.push("/dashboard/products/new");
    };

    const handleEditProduct = (product: Product) => {
        router.push(`/dashboard/products/${product.id}`);
    };

    const handleDeleteProduct = async (product: Product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProduct(product.id);
            await fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Failed to delete product");
        }
    };

    const pageSummary = useMemo(() => {
        if (total === 0) {
            return "0 products";
        }

        const from = (page - 1) * filters.limit + 1;
        const to = Math.min(page * filters.limit, total);

        return `${from}-${to} of ${total} products`;
    }, [page, total, filters.limit]);

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await applySearch();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-borderColorCustom bg-card p-6 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-textPrimary">
                        Products
                    </h2>
                    <p className="mt-2 text-textSecondary">
                        Manage your catalog with search, filters, sorting and pagination.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddProduct}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                    Add Product
                </button>
            </div>

            <div className="rounded-2xl border border-borderColorCustom bg-card p-6">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_220px_220px_180px_auto]">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"
                        />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by product name or code"
                            className="w-full rounded-lg border border-borderColorCustom bg-white py-2 pl-10 pr-4 outline-none focus:border-primary"
                        />
                    </form>

                    <select
                        value={filters.categoryId}
                        onChange={(e) => void setCategoryId(e.target.value)}
                        className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={`${filters.sortBy}:${filters.order}`}
                        onChange={(e) => {
                            const [sortBy, order] = e.target.value.split(":") as [
                                "createdAt" | "name" | "productCode",
                                "asc" | "desc"
                            ];
                            void setSort(sortBy, order);
                        }}
                        className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="createdAt:desc">Newest first</option>
                        <option value="createdAt:asc">Oldest first</option>
                        <option value="name:asc">Name A-Z</option>
                        <option value="name:desc">Name Z-A</option>
                        <option value="productCode:asc">Code A-Z</option>
                        <option value="productCode:desc">Code Z-A</option>
                    </select>

                    <select
                        value={filters.limit}
                        onChange={(e) => void setLimit(Number(e.target.value))}
                        className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={50}>50 / page</option>
                    </select>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => void resetFilters()}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-borderColorCustom px-4 py-2 transition hover:bg-background"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            ) : null}

            <ProductListTable
                products={products}
                loading={loading}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
            />

            <div className="flex flex-col gap-4 rounded-2xl border border-borderColorCustom bg-card px-6 py-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-textSecondary">
                    {pageSummary}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => void setPage(page - 1)}
                        disabled={page <= 1}
                        className="rounded-lg border border-borderColorCustom px-4 py-2 transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <div className="rounded-lg border border-borderColorCustom px-4 py-2 text-sm text-textPrimary">
                        Page {page} of {lastPage || 1}
                    </div>

                    <button
                        type="button"
                        onClick={() => void setPage(page + 1)}
                        disabled={page >= lastPage}
                        className="rounded-lg border border-borderColorCustom px-4 py-2 transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}