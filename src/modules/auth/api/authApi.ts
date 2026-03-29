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