import { api } from "@/lib/http";
import type {
    BrandOwnerActivityLogItem,
    BrandOwnerActivityLogListResponse,
    BrandOwnerActivityLogQueryParams,
} from "@/modules/activity-logs/types/activityLogs";

function buildParams(params: BrandOwnerActivityLogQueryParams = {}) {
    return {
        search: params.search?.trim() || undefined,
        actionKey: params.actionKey?.trim() || undefined,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
        page: params.page,
        limit: params.limit,
    };
}

export async function getMyActivityLogs(
    params?: BrandOwnerActivityLogQueryParams,
): Promise<BrandOwnerActivityLogListResponse> {
    const response = await api.get<BrandOwnerActivityLogListResponse>(
        "/activity-logs/me",
        { params: buildParams(params) },
    );
    return response.data;
}

export async function getMyActivityLog(
    id: string,
): Promise<BrandOwnerActivityLogItem> {
    const response = await api.get<BrandOwnerActivityLogItem>(
        `/activity-logs/me/${id}`,
    );
    return response.data;
}
