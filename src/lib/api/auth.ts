export const logoutRequest = async () => {
    const token = localStorage.getItem("accessToken");

    await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT for cookie clearing
    });
};