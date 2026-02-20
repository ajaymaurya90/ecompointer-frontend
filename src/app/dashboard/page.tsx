"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { accessToken, isInitialized } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && !accessToken) {
            router.push("/login");
        }
    }, [accessToken, isInitialized, router]);

    if (!isInitialized) {
        return <p>Loading...</p>;
    }

    return <h1>Dashboard (Protected)</h1>;
}