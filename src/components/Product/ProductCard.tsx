/*import React from "react";
import { Product } from "@/types";

type ProductCardProps = {
    product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="border rounded p-4 shadow hover:shadow-lg transition">
            {product.image && (
                <img
                    src={product.image}
                    alt={product.name}
                    className="mb-2 h-32 w-full object-cover rounded"
                />
            )}
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
        </div>
    );
};

export default ProductCard;*/
// src/components/Product/productCard.tsx

import React from "react";
import { Product } from "@/store/productStore";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white">
            <h3 className="text-lg font-semibold">{product.name}</h3>

            <p className="text-gray-600 mt-1">
                ₹ {product.price}
            </p>

            <p className="text-sm mt-2">
                Stock: {product.stock}
            </p>
        </div>
    );
}