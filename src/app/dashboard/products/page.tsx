"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/productStore";
import ProductCard from "@/components/Product/ProductCard";
import ProductSkeleton from "@/components/Product/ProductSkeleton";

export default function ProductsPage() {
    const { products, loading, error, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                All Products
            </h2>

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))
                    : products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
            </div>
        </div>
    );
}