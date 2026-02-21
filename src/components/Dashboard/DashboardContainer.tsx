"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DashboardGrid from "./DashboardGrid";
import { Product } from "@/types";

const DashboardContainer = () => {
    const router = useRouter();
    const { accessToken, isInitialized } = useAuthStore();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isInitialized && !accessToken) {
            router.replace("/login");
        }
    }, [isInitialized, accessToken, router]);

    useEffect(() => {
        if (!accessToken) return;

        const fetchProducts = async () => {
            try {
                const res = await api.get("/products", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [accessToken]);

    if (!isInitialized) return null;
    if (!accessToken) return null;

    return <DashboardGrid products={products} loading={loading} />;
};

export default DashboardContainer;