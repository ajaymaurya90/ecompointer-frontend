export type ActivityLogActorUser = {
    id: string;
    email: string;
    firstName: string;
    lastName?: string | null;
    role: string;
};

export type ActivityLogBrandOwner = {
    id: string;
    businessName: string;
    user?: {
        email: string;
    } | null;
};

export type ActivityLogItem = {
    id: string;
    actorUserId?: string | null;
    actorRole?: string | null;
    brandOwnerId?: string | null;
    actionKey: string;
    entityType: string;
    entityId?: string | null;
    summary: string;
    metadataJson?: unknown;
    ipAddress?: string | null;
    createdAt: string;
    brandOwner?: ActivityLogBrandOwner | null;
    actorUser?: ActivityLogActorUser | null;
};

export type ActivityLogQueryParams = {
    search?: string;
    actionKey?: string;
    actorRole?: string;
    brandOwnerId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
};

export type ActivityLogListResponse = {
    data: ActivityLogItem[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
