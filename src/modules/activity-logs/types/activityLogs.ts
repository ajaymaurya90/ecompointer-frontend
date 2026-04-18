export type BrandOwnerActivityLogItem = {
    id: string;
    actorRole?: string | null;
    actionKey: string;
    entityType: string;
    entityId?: string | null;
    summary: string;
    metadataJson?: unknown;
    createdAt: string;
};

export type BrandOwnerActivityLogQueryParams = {
    search?: string;
    actionKey?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
};

export type BrandOwnerActivityLogListResponse = {
    data: BrandOwnerActivityLogItem[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
