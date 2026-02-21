/*"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function AuthInitializer() {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setInitialized = useAuthStore((s) => s.setInitialized);

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const res = await api.post("/auth/refresh");
                setAccessToken(res.data.accessToken);
            } catch {
                setAccessToken(null);
            } finally {
                setInitialized(true); // 🔥 important
            }
        };

        refreshToken();
    }, [setAccessToken, setInitialized]);

    return null;
}*/

"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function AuthInitializer() {
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setUser = useAuthStore((s) => s.setUser);
    const setInitialized = useAuthStore((s) => s.setInitialized);

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const res = await api.post("/auth/refresh");

                setAccessToken(res.data.accessToken);
                setUser(res.data.user); // assuming backend returns user
            } catch (error) {
                setAccessToken(null);
                setUser(null);
            } finally {
                setInitialized(true);
            }
        };

        refreshToken();
    }, [setAccessToken, setUser, setInitialized]);

    return null;
}