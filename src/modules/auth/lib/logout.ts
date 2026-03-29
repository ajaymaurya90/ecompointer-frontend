import { logoutRequest } from "@/modules/auth/api/authApi";
import { useAuthStore } from "@/modules/auth/store/authStore";

export const logout = async () => {
    try {
        await logoutRequest();
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        // Always clear client-side tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
    }
};