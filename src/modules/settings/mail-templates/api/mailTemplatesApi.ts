import { api } from "@/lib/http";
import type {
    BrandOwnerMailTemplateListItem,
    BrandOwnerResolvedMailTemplate,
    BrandOwnerMailTemplateConfig,
    UpsertBrandOwnerMailTemplateConfigPayload,
} from "@/modules/settings/mail-templates/types/mailTemplates";

export async function getMyMailTemplates(): Promise<
    BrandOwnerMailTemplateListItem[]
> {
    const response = await api.get<BrandOwnerMailTemplateListItem[]>(
        "/mail/templates/me",
    );
    return response.data ?? [];
}

export async function getMyResolvedMailTemplate(
    templateKey: string,
): Promise<BrandOwnerResolvedMailTemplate> {
    const response = await api.get<BrandOwnerResolvedMailTemplate>(
        `/mail/templates/me/${encodeURIComponent(templateKey)}`,
    );
    return response.data;
}

export async function upsertMyMailTemplateConfig(
    templateKey: string,
    data: UpsertBrandOwnerMailTemplateConfigPayload,
): Promise<BrandOwnerMailTemplateConfig> {
    const response = await api.patch<BrandOwnerMailTemplateConfig>(
        `/mail/templates/me/${encodeURIComponent(templateKey)}/config`,
        data,
    );
    return response.data;
}

