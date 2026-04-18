import { api } from "@/lib/http";
import type {
    ActivityLogItem,
    ActivityLogListResponse,
    ActivityLogQueryParams,
} from "@/modules/super-admin/activity-logs/types/activityLogs";

function buildParams(params: ActivityLogQueryParams = {}) {
    return {
        search: params.search?.trim() || undefined,
        actionKey: params.actionKey?.trim() || undefined,
        actorRole: params.actorRole?.trim() || undefined,
        brandOwnerId: params.brandOwnerId?.trim() || undefined,
        dateFrom: params.dateFrom || undefined,
        dateTo: params.dateTo || undefined,
        page: params.page,
        limit: params.limit,
    };
}

export async function getActivityLogs(
    params?: ActivityLogQueryParams,
): Promise<ActivityLogListResponse> {
    const response = await api.get<ActivityLogListResponse>("/activity-logs", {
        params: buildParams(params),
    });
    return response.data;
}

export async function getActivityLog(id: string): Promise<ActivityLogItem> {
    const response = await api.get<ActivityLogItem>(`/activity-logs/${id}`);
    return response.data;
}
