import { api } from "@/lib/http";
import type {
    BrandOwnerLocation,
    CountryOption,
    DistrictOption,
    StateOption,
    UpdateBrandOwnerLocationPayload,
    BrandOwnerServiceArea,
    BrandOwnerServiceAreaDistrictResponse,
    UpdateServiceAreaDistrictPayload,
    UpdateServiceAreaStatePayload,
} from "@/modules/brand-owners/types/brandOwner";
import type {
    BrandOwnerLanguage,
    UpdateBrandOwnerLanguagePayload,
} from "@/modules/brand-owners/types/brandOwner";

export async function getMyBrandOwnerLocation(): Promise<BrandOwnerLocation> {
    const response = await api.get("/brand-owners/me/location");
    return response.data?.data ?? response.data;
}

export async function updateMyBrandOwnerLocation(
    data: UpdateBrandOwnerLocationPayload
): Promise<BrandOwnerLocation> {
    const response = await api.patch("/brand-owners/me/location", data);
    return response.data?.data ?? response.data;
}

export async function getActiveCountries(): Promise<CountryOption[]> {
    const response = await api.get("/master-data/countries", {
        params: {
            isActive: true,
        },
    });

    return response.data?.data ?? response.data ?? [];
}

export async function getActiveStatesByCountry(
    countryId: string
): Promise<StateOption[]> {
    const response = await api.get("/master-data/states", {
        params: {
            countryId,
            isActive: true,
        },
    });

    return response.data?.data ?? response.data ?? [];
}

export async function getActiveDistrictsByState(
    stateId: string
): Promise<DistrictOption[]> {
    const response = await api.get("/master-data/districts", {
        params: {
            stateId,
            isActive: true,
        },
    });

    return response.data?.data ?? response.data ?? [];
}

export async function getMyBrandOwnerLanguage(): Promise<BrandOwnerLanguage> {
    const response = await api.get("/brand-owners/me/language");
    return response.data?.data ?? response.data;
}

export async function updateMyBrandOwnerLanguage(
    data: UpdateBrandOwnerLanguagePayload
): Promise<BrandOwnerLanguage> {
    const response = await api.patch("/brand-owners/me/language", data);
    return response.data?.data ?? response.data;
}

export async function getMyBrandOwnerServiceArea(): Promise<BrandOwnerServiceArea> {
    const response = await api.get("/brand-owners/me/service-area");
    return response.data?.data ?? response.data;
}

export async function getMyBrandOwnerServiceAreaDistricts(
    stateId: string
): Promise<BrandOwnerServiceAreaDistrictResponse> {
    const response = await api.get(
        `/brand-owners/me/service-area/states/${stateId}/districts`
    );
    return response.data?.data ?? response.data;
}

export async function updateMyBrandOwnerServiceAreaState(
    stateId: string,
    data: UpdateServiceAreaStatePayload
) {
    const response = await api.patch(
        `/brand-owners/me/service-area/states/${stateId}`,
        data
    );
    return response.data?.data ?? response.data;
}

export async function updateMyBrandOwnerServiceAreaDistrict(
    districtId: string,
    data: UpdateServiceAreaDistrictPayload
) {
    const response = await api.patch(
        `/brand-owners/me/service-area/districts/${districtId}`,
        data
    );
    return response.data?.data ?? response.data;
}