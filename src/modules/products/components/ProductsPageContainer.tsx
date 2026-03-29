"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/modules/products/store/productStore";
import ProductListTable from "@/modules/products/components/ProductListTable";
import type { Product } from "@/modules/products/types/product";
import { deleteProduct } from "@/modules/products/api/productApi";

export default function ProductsPageContainer() {
    const router = useRouter();
    const { products, loading, error, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-textPrimary">
                    Products
                </h2>

                <button
                    onClick={handleAddProduct}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                    Add Product
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            <ProductListTable
                products={products}
                loading={loading}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
            />
        </div>
    );
}