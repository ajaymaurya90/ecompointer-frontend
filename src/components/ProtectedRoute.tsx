"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface Props {
    children: React.ReactNode;
    allowedRoles?: ("BRAND_OWNER" | "SHOP_OWNER" | "SUPER_ADMIN")[];
}

export default function ProtectedRoute({
    children,
    allowedRoles,
}: Props) {
    const router = useRouter();
    const { accessToken, user, isInitialized } = useAuthStore();

    useEffect(() => {
        if (!isInitialized) return;

        if (!accessToken || !user) {
            router.replace("/login");
            return;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            router.replace("/unauthorized");
        }
    }, [accessToken, user, isInitialized, allowedRoles, router]);

    // ⏳ Wait until auth system finishes initializing
    if (!isInitialized) {
        return <div className="p-6">Checking authentication...</div>;
    }

    // 🔒 Not logged in
    if (!accessToken || !user) {
        return null;
    }

    // 🚫 Role restriction
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}