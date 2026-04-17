import { api } from "@/lib/http";
import type {
    BrandOwnerDetail,
    BrandOwnerListParams,
    BrandOwnerListResponse,
    CreateBrandOwnerPayload,
    MasterOption,
    SalutationOption,
    UpdateBrandOwnerStatusPayload,
} from "@/modules/super-admin/types/superAdmin";

export async function getBrandOwners(
    params: BrandOwnerListParams = {},
): Promise<BrandOwnerListResponse> {
    const response = await api.get<BrandOwnerListResponse>(
        "/auth/admin/brand-owners",
        {
            params: {
                page: params.page ?? 1,
                limit: params.limit ?? 100,
            },
        },
    );

    const search = params.search?.trim().toLowerCase();

    if (!search) {
        return response.data;
    }

    return {
        ...response.data,
        data: response.data.data.filter((item) =>
            [
                item.businessName,
                item.ownerName,
                item.email,
                item.phone,
                item.country?.name,
                item.state?.name,
                item.district?.name,
                item.accountStatus,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(search)),
        ),
    };
}

export async function createBrandOwner(
    data: CreateBrandOwnerPayload,
): Promise<BrandOwnerDetail> {
    const response = await api.post<BrandOwnerDetail>(
        "/auth/admin/brand-owners",
        data,
    );
    return response.data;
}

export async function getBrandOwnerDetail(
    id: string,
): Promise<BrandOwnerDetail> {
    const response = await api.get<BrandOwnerDetail>(
        `/auth/admin/brand-owners/${id}`,
    );
    return response.data;
}

export async function updateBrandOwnerStatus(
    id: string,
    data: UpdateBrandOwnerStatusPayload,
): Promise<BrandOwnerDetail> {
    const response = await api.patch<BrandOwnerDetail>(
        `/auth/admin/brand-owners/${id}/status`,
        data,
    );
    return response.data;
}

export async function getActiveSalutations(): Promise<SalutationOption[]> {
    const response = await api.get<SalutationOption[]>("/master-data/salutations", {
        params: { isActive: true },
    });
    return response.data ?? [];
}

export async function getActiveCountries(): Promise<MasterOption[]> {
    const response = await api.get<MasterOption[]>("/master-data/countries", {
        params: { isActive: true },
    });
    return response.data ?? [];
}

export async function getActiveStatesByCountry(
    countryId: string,
): Promise<MasterOption[]> {
    const response = await api.get<MasterOption[]>("/master-data/states", {
        params: { countryId, isActive: true },
    });
    return response.data ?? [];
}

export async function getActiveDistrictsByState(
    stateId: string,
): Promise<MasterOption[]> {
    const response = await api.get<MasterOption[]>("/master-data/districts", {
        params: { stateId, isActive: true },
    });
    return response.data ?? [];
}
