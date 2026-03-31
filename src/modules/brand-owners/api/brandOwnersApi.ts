import { api } from "@/lib/http";
import type {
    BrandOwnerLocation,
    CountryOption,
    DistrictOption,
    StateOption,
    UpdateBrandOwnerLocationPayload,
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