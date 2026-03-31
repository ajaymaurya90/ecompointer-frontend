import { api } from "@/lib/http";
import type {
    AuthProfileResponse,
    UpdateProfilePayload,
} from "@/modules/auth/types/auth";

export async function getMyProfile(): Promise<AuthProfileResponse> {
    const response = await api.get("/auth/profile");
    return response.data?.data ?? response.data;
}

export async function updateMyProfile(
    data: UpdateProfilePayload
): Promise<AuthProfileResponse> {
    const response = await api.patch("/auth/profile", data);
    return response.data?.data ?? response.data;
}

export const logoutRequest = async () => {
    const token = localStorage.getItem("accessToken");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT for cookie clearing
    });
};