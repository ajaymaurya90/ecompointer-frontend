import { logoutRequest } from "@/lib/api/auth";

export const logout = async () => {
    try {
        await logoutRequest();
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        // Always clear client-side tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        window.location.href = "/login";
    }
};