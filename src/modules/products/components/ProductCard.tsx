import React from "react";
import type { Product } from "@/modules/products/types/product";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const primaryImage =
        product.media?.find((m) => m.isPrimary)?.url ||
        product.media?.[0]?.url ||
        "https://via.placeholder.com/300";

    const displayPrice =
        product.variants?.[0]?.retailGross ?? 0;

    const totalStock =
        product.variants?.reduce(
            (sum, variant) => sum + (variant.stock ?? 0),
            0
        ) ?? 0;

    return (
        <div className="rounded-3xl app-card interactive-card p-4">
            <img
                src={primaryImage}
                alt={product.name}
                className="h-40 w-full object-cover rounded-2xl mb-3"
            />

            <h3 className="text-lg font-semibold app-text-primary">
                {product.name}
            </h3>

            <p className="app-text-secondary mt-1">
                ₹ {displayPrice.toLocaleString()}
            </p>

            <p className="text-sm mt-2 app-text-secondary">
                Total Stock: {totalStock}
            </p>
        </div>
    );
}