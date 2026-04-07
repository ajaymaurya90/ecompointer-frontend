const MEDIA_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export function resolveMediaUrl(url?: string | null) {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    return `${MEDIA_BASE_URL}${url}`;
}