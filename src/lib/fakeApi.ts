import { Product } from "@/types";

export const fetchProducts = (): Promise<Product[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: "1",
                    name: "T-Shirt",
                    price: 20,
                    image: "https://via.placeholder.com/150",
                },
                {
                    id: "2",
                    name: "Jeans",
                    price: 45,
                },
                {
                    id: "3",
                    name: "Sneakers",
                    price: 80,
                },
            ]);
        }, 1500); // simulate network delay
    });
};