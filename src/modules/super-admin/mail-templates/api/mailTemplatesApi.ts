import { api } from "@/lib/http";
import type {
    CreateMailTemplatePayload,
    MailTemplate,
    MailTemplateQueryParams,
    UpdateMailTemplatePayload,
} from "@/modules/super-admin/mail-templates/types/mailTemplates";

function buildParams(params: MailTemplateQueryParams = {}) {
    return {
        search: params.search?.trim() || undefined,
        isActive:
            params.isActive === undefined ? undefined : String(params.isActive),
    };
}

export async function getPlatformMailTemplates(
    params?: MailTemplateQueryParams,
): Promise<MailTemplate[]> {
    const response = await api.get<MailTemplate[]>("/mail/templates/platform", {
        params: buildParams(params),
    });
    return response.data ?? [];
}

export async function getPlatformMailTemplate(
    id: string,
): Promise<MailTemplate> {
    const response = await api.get<MailTemplate>(
        `/mail/templates/platform/${id}`,
    );
    return response.data;
}

export async function createPlatformMailTemplate(
    data: CreateMailTemplatePayload,
): Promise<MailTemplate> {
    const response = await api.post<MailTemplate>(
        "/mail/templates/platform",
        data,
    );
    return response.data;
}

export async function updatePlatformMailTemplate(
    id: string,
    data: UpdateMailTemplatePayload,
): Promise<MailTemplate> {
    const response = await api.patch<MailTemplate>(
        `/mail/templates/platform/${id}`,
        data,
    );
    return response.data;
}

