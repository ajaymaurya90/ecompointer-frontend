import { api } from "@/lib/http";
import type {
    BrandOwnerLocation,
    CountryOption,
    DistrictOption,
    PincodeOption,
    StateOption,
    UpdateBrandOwnerLocationPayload,
    BrandOwnerServiceArea,
    BrandOwnerServiceAreaDistrictResponse,
    UpdateServiceAreaDistrictPayload,
    UpdateServiceAreaStatePayload,
    BrandOwnerShopOrderRules,
    UpdateBrandOwnerShopOrderRulesPayload,
    BrandOwnerStorefrontSettings,
    UpdateBrandOwnerStorefrontSettingsPayload,
    BrandOwnerStorefrontDomain,
    CreateBrandOwnerStorefrontDomainPayload,
    UpdateBrandOwnerStorefrontDomainPayload,
    BrandOwnerSalesChannel,
    BrandOwnerSalesChannelServiceArea,
    CreateBrandOwnerSalesChannelPayload,
    CreateBrandOwnerSalesChannelServiceAreaPayload,
    SalesChannelTypeMaster,
    SalesChannelType,
    ServiceabilityCheckResult,
    UpdateBrandOwnerSalesChannelPayload,
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

export async function getActivePincodesByDistrict(
    districtId: string
): Promise<PincodeOption[]> {
    const response = await api.get("/master-data/pincodes", {
        params: {
            districtId,
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

export async function getMyBrandOwnerSalesChannels(): Promise<BrandOwnerSalesChannel[]> {
    const response = await api.get("/brand-owner-sales-channels/me");
    return response.data?.data ?? response.data ?? [];
}

export async function getActiveSalesChannelTypes(): Promise<SalesChannelTypeMaster[]> {
    const response = await api.get("/master-data/sales-channel-types/active");
    return response.data?.data ?? response.data ?? [];
}

export async function createMyBrandOwnerSalesChannel(
    data: CreateBrandOwnerSalesChannelPayload
): Promise<BrandOwnerSalesChannel> {
    const response = await api.post("/brand-owner-sales-channels/me", data);
    return response.data?.data ?? response.data;
}

export async function getMyBrandOwnerSalesChannelById(
    channelId: string
): Promise<BrandOwnerSalesChannel> {
    const response = await api.get(
        `/brand-owner-sales-channels/me/by-id/${channelId}`
    );
    return response.data?.data ?? response.data;
}

export async function updateMyBrandOwnerSalesChannel(
    channelType: SalesChannelType,
    data: UpdateBrandOwnerSalesChannelPayload
): Promise<BrandOwnerSalesChannel> {
    const response = await api.patch(
        `/brand-owner-sales-channels/me/${channelType}`,
        data
    );
    return response.data?.data ?? response.data;
}

export async function updateMyBrandOwnerSalesChannelById(
    channelId: string,
    data: UpdateBrandOwnerSalesChannelPayload
): Promise<BrandOwnerSalesChannel> {
    const response = await api.patch(
        `/brand-owner-sales-channels/me/by-id/${channelId}`,
        data
    );
    return response.data?.data ?? response.data;
}

export async function getMyBrandOwnerSalesChannelServiceAreas(
    channelType: SalesChannelType
): Promise<BrandOwnerSalesChannelServiceArea[]> {
    const response = await api.get(
        `/brand-owner-sales-channels/me/${channelType}/service-areas`
    );
    return response.data?.data ?? response.data ?? [];
}

export async function createMyBrandOwnerSalesChannelServiceArea(
    channelType: SalesChannelType,
    data: CreateBrandOwnerSalesChannelServiceAreaPayload
): Promise<BrandOwnerSalesChannelServiceArea> {
    const response = await api.post(
        `/brand-owner-sales-channels/me/${channelType}/service-areas`,
        data
    );
    return response.data?.data ?? response.data;
}

export async function deleteMyBrandOwnerSalesChannelServiceArea(
    channelType: SalesChannelType,
    serviceAreaId: string
): Promise<{ message: string }> {
    const response = await api.delete(
        `/brand-owner-sales-channels/me/${channelType}/service-areas/${serviceAreaId}`
    );
    return response.data?.data ?? response.data;
}

export async function checkStorefrontServiceability(params: {
    pincode: string;
    channelType: SalesChannelType;
    brandOwnerId?: string;
}): Promise<ServiceabilityCheckResult> {
    const response = await api.get("/storefront/serviceability/check", {
        params: {
            pincode: params.pincode,
            channelType: params.channelType,
            brandOwnerId: params.brandOwnerId || undefined,
        },
    });

    return response.data?.data ?? response.data;
}

export async function getMyBrandOwnerShopOrderRules(): Promise<BrandOwnerShopOrderRules> {
    const response = await api.get("/brand-owners/me/shop-order-rules");
    return response.data?.data ?? response.data;
}

export async function updateMyBrandOwnerShopOrderRules(
    data: UpdateBrandOwnerShopOrderRulesPayload
): Promise<BrandOwnerShopOrderRules> {
    const response = await api.patch("/brand-owners/me/shop-order-rules", data);
    return response.data?.data ?? response.data;
}

export async function getMyBrandOwnerStorefrontSettings(): Promise<BrandOwnerStorefrontSettings> {
    const response = await api.get("/brand-owners/me/storefront-settings");
    return response.data?.data ?? response.data;
}

export async function updateMyBrandOwnerStorefrontSettings(
    data: UpdateBrandOwnerStorefrontSettingsPayload
): Promise<BrandOwnerStorefrontSettings> {
    const response = await api.patch("/brand-owners/me/storefront-settings", data);
    return response.data?.data ?? response.data;
}

export async function getMyBrandOwnerStorefrontDomains(): Promise<
    BrandOwnerStorefrontDomain[]
> {
    const response = await api.get("/brand-owners/me/storefront-domains");
    return response.data?.data ?? response.data ?? [];
}

export async function createMyBrandOwnerStorefrontDomain(
    data: CreateBrandOwnerStorefrontDomainPayload
): Promise<BrandOwnerStorefrontDomain> {
    const response = await api.post("/brand-owners/me/storefront-domains", data);
    return response.data?.data ?? response.data;
}

export async function updateMyBrandOwnerStorefrontDomain(
    domainId: string,
    data: UpdateBrandOwnerStorefrontDomainPayload
): Promise<BrandOwnerStorefrontDomain> {
    const response = await api.patch(
        `/brand-owners/me/storefront-domains/${domainId}`,
        data
    );
    return response.data?.data ?? response.data;
}

export async function deleteMyBrandOwnerStorefrontDomain(
    domainId: string
): Promise<{ message: string }> {
    const response = await api.delete(
        `/brand-owners/me/storefront-domains/${domainId}`
    );
    return response.data?.data ?? response.data;
}
