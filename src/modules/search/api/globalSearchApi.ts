import { api } from "@/lib/http";
import type {
    GlobalSearchResponse,
    GlobalSearchScope,
} from "@/modules/search/types/search";

interface RunGlobalSearchParams {
    query: string;
    scope: GlobalSearchScope;
    limit?: number;
}

export async function runGlobalSearch({
    query,
    scope,
    limit = 5,
}: RunGlobalSearchParams): Promise<GlobalSearchResponse> {
    const response = await api.get("/search", {
        params: {
            q: query,
            scope,
            limit,
        },
    });

    return response.data?.data ?? response.data;
}