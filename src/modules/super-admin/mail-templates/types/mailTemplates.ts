export type MailTemplate = {
    id: string;
    templateKey: string;
    name: string;
    description?: string | null;
    subjectTemplate: string;
    htmlTemplate: string;
    textTemplate?: string | null;
    isActive: boolean;
    createdByUserId?: string | null;
    updatedByUserId?: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: {
        configs: number;
    };
};

export type MailTemplateQueryParams = {
    search?: string;
    isActive?: boolean;
};

export type CreateMailTemplatePayload = {
    templateKey: string;
    name: string;
    description?: string | null;
    subjectTemplate: string;
    htmlTemplate: string;
    textTemplate?: string | null;
    isActive?: boolean;
};

export type UpdateMailTemplatePayload = Partial<
    Omit<CreateMailTemplatePayload, "templateKey">
>;

