import React from "react";
import { Product } from "@/store/productStore";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    // Get primary image or fallback
    const primaryImage =
        product.media?.find((m) => m.isPrimary)?.url ||
        product.media?.[0]?.url ||
        "https://via.placeholder.com/300";

    // Get first variant price (if exists)
    const displayPrice =
        product.variants?.[0]?.retailGross ?? 0;

    // Calculate total stock across variants
    const totalStock =
        product.variants?.reduce(
            (sum, variant) => sum + (variant.stock ?? 0),
            0
        ) ?? 0;

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition">
            <img
                src={primaryImage}
                alt={product.name}
                className="h-40 w-full object-cover rounded mb-3"
            />

            <h3 className="text-lg font-semibold">
                {product.name}
            </h3>

            <p className="text-gray-600 mt-1">
                ₹ {displayPrice.toLocaleString()}
            </p>

            <p className="text-sm mt-2 text-gray-500">
                Total Stock: {totalStock}
            </p>
        </div>
    );
}