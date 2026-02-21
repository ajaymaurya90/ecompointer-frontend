export default function DashboardHome() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                Welcome, Brand Owner 👋
            </h2>

            <p className="text-gray-600">
                Use the sidebar to manage your products and business.
            </p>
        </div>
    );
}
/*"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/productStore";
import ProductCard from "@/components/Product/ProductCard";
import ProductSkeleton from "@/components/Product/ProductSkeleton";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
    const { products, loading, error, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProtectedRoute allowedRoles={["BRAND_OWNER"]}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Products
                </h1>

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
        </ProtectedRoute>
    );
}*/