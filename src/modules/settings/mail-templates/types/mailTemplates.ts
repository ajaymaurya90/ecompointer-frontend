export type BrandOwnerMailTemplateConfig = {
    id: string;
    mailTemplateId: string;
    brandOwnerId: string;
    subjectOverride?: string | null;
    htmlOverride?: string | null;
    textOverride?: string | null;
    isActive: boolean;
    createdByUserId?: string | null;
    updatedByUserId?: string | null;
    createdAt: string;
    updatedAt: string;
};

export type BrandOwnerMailTemplateListItem = {
    id: string;
    templateKey: string;
    name: string;
    description?: string | null;
    subjectTemplate: string;
    htmlTemplate: string;
    textTemplate?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    config?: BrandOwnerMailTemplateConfig | null;
};

export type BrandOwnerResolvedMailTemplate = {
    template: BrandOwnerMailTemplateListItem;
    config?: BrandOwnerMailTemplateConfig | null;
    resolved: {
        subjectTemplate: string;
        htmlTemplate: string;
        textTemplate?: string | null;
        isActive: boolean;
    };
};

export type UpsertBrandOwnerMailTemplateConfigPayload = {
    subjectOverride?: string | null;
    htmlOverride?: string | null;
    textOverride?: string | null;
    isActive?: boolean;
};

