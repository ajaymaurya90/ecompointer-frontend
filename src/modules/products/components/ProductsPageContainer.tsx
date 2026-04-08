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
import { Search, RotateCcw, Plus, Package, Layers3, ShieldCheck, AlertTriangle } from "lucide-react";

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
        setProductType,
        setFeaturedFilter,
        setFreeShippingFilter,
        setClearanceFilter,
        setStockState,
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

    const stats = useMemo(() => {
        const activeCount = products.filter((item) => item.isActive !== false).length;
        const parentWithVariants = products.filter((item) => (item.variantCount ?? 0) > 0).length;
        const lowStockCount = products.filter((item) => {
            const stock = item.totalStock ?? item.stock ?? 0;
            return stock > 0 && stock <= 5;
        }).length;

        return {
            total: total,
            active: activeCount,
            withVariants: parentWithVariants,
            lowStock: lowStockCount,
        };
    }, [products, total]);

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
                        Manage your catalog with a Shopware-style workspace.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddProduct}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                    <Plus size={16} />
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-borderColorCustom bg-card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-textSecondary">Total Products</div>
                            <div className="mt-2 text-2xl font-semibold text-textPrimary">
                                {stats.total}
                            </div>
                        </div>
                        <div className="rounded-xl border border-borderColorCustom bg-background p-3">
                            <Package size={18} className="text-textSecondary" />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-borderColorCustom bg-card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-textSecondary">Active Products</div>
                            <div className="mt-2 text-2xl font-semibold text-textPrimary">
                                {stats.active}
                            </div>
                        </div>
                        <div className="rounded-xl border border-borderColorCustom bg-background p-3">
                            <ShieldCheck size={18} className="text-textSecondary" />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-borderColorCustom bg-card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-textSecondary">Products With Variants</div>
                            <div className="mt-2 text-2xl font-semibold text-textPrimary">
                                {stats.withVariants}
                            </div>
                        </div>
                        <div className="rounded-xl border border-borderColorCustom bg-background p-3">
                            <Layers3 size={18} className="text-textSecondary" />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-borderColorCustom bg-card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-textSecondary">Low Stock</div>
                            <div className="mt-2 text-2xl font-semibold text-textPrimary">
                                {stats.lowStock}
                            </div>
                        </div>
                        <div className="rounded-xl border border-borderColorCustom bg-background p-3">
                            <AlertTriangle size={18} className="text-textSecondary" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-borderColorCustom bg-card p-6">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
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
                        value={filters.productType}
                        onChange={(e) => void setProductType(e.target.value as any)}
                        className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="">All product types</option>
                        <option value="PHYSICAL">Physical</option>
                        <option value="DIGITAL">Digital</option>
                        <option value="SERVICE">Service</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-5">
                    <select
                        value={filters.isFeatured}
                        onChange={(e) => void setFeaturedFilter(e.target.value as any)}
                        className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="">Featured: All</option>
                        <option value="true">Featured only</option>
                        <option value="false">Not featured</option>
                    </select>

                    <select
                        value={filters.isFreeShipping}
                        onChange={(e) => void setFreeShippingFilter(e.target.value as any)}
                        className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="">Free Shipping: All</option>
                        <option value="true">Free shipping only</option>
                        <option value="false">Without free shipping</option>
                    </select>

                    <select
                        value={filters.isClearance}
                        onChange={(e) => void setClearanceFilter(e.target.value as any)}
                        className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="">Clearance: All</option>
                        <option value="true">Clearance only</option>
                        <option value="false">Not clearance</option>
                    </select>

                    <select
                        value={filters.stockState}
                        onChange={(e) => void setStockState(e.target.value as any)}
                        className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="">Stock: All</option>
                        <option value="in_stock">In stock</option>
                        <option value="low_stock">Low stock</option>
                        <option value="out_of_stock">Out of stock</option>
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
                </div>

                <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <select
                        value={filters.limit}
                        onChange={(e) => void setLimit(Number(e.target.value))}
                        className="rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary xl:w-[180px]"
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
                            onClick={(e) => void handleSearchSubmit(e as any)}
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