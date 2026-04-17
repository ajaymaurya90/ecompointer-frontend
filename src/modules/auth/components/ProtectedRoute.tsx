"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/authStore";
import type { UserRole } from "@/modules/auth/types/auth";

interface Props {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

function normalizeRole(role?: string | null): UserRole | null {
    if (!role) return null;
    const normalized = role.toUpperCase() as UserRole;
    return ["BRAND_OWNER", "SHOP_OWNER", "SUPER_ADMIN"].includes(normalized)
        ? normalized
        : null;
}

function getDashboardForRole(role: UserRole | null) {
    return role === "SUPER_ADMIN" ? "/admin" : "/dashboard";
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

        const role = normalizeRole(user.role);

        if (!role) {
            router.replace("/login");
            return;
        }

        if (allowedRoles && !allowedRoles.includes(role)) {
            router.replace(getDashboardForRole(role));
        }
    }, [accessToken, user, isInitialized, allowedRoles, router]);

    // Wait until auth system finishes initializing
    if (!isInitialized) {
        return <div className="p-6">Checking authentication...</div>;
    }

    // Not logged in
    if (!accessToken || !user) {
        return null;
    }

    // Role restriction
    const role = normalizeRole(user.role);

    if (!role || (allowedRoles && !allowedRoles.includes(role))) {
        return null;
    }

    return <>{children}</>;
}
