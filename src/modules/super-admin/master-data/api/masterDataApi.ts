import { api } from "@/lib/http";
import type {
    Country,
    CountryPayload,
    District,
    DistrictPayload,
    MasterQueryParams,
    Pincode,
    PincodePayload,
    Salutation,
    SalutationPayload,
    SalesChannelTypeMaster,
    SalesChannelTypePayload,
    State,
    StatePayload,
} from "@/modules/super-admin/master-data/types/masterData";

function buildParams(params: MasterQueryParams = {}) {
    return {
        search: params.search || undefined,
        isActive:
            params.isActive === undefined ? undefined : String(params.isActive),
        countryId: params.countryId || undefined,
        stateId: params.stateId || undefined,
        districtId: params.districtId || undefined,
    };
}

export async function getSalutations(
    params?: MasterQueryParams,
): Promise<Salutation[]> {
    const response = await api.get<Salutation[]>("/master-data/salutations", {
        params: buildParams(params),
    });
    return response.data ?? [];
}

export async function createSalutation(
    data: SalutationPayload,
): Promise<Salutation> {
    const response = await api.post<Salutation>("/master-data/salutations", data);
    return response.data;
}

export async function updateSalutation(
    id: string,
    data: Partial<SalutationPayload>,
): Promise<Salutation> {
    const response = await api.patch<Salutation>(
        `/master-data/salutations/${id}`,
        data,
    );
    return response.data;
}

export async function getCountries(params?: MasterQueryParams): Promise<Country[]> {
    const response = await api.get<Country[]>("/master-data/countries", {
        params: buildParams(params),
    });
    return response.data ?? [];
}

export async function createCountry(data: CountryPayload): Promise<Country> {
    const response = await api.post<Country>("/master-data/countries", data);
    return response.data;
}

export async function updateCountry(
    id: string,
    data: Partial<CountryPayload>,
): Promise<Country> {
    const response = await api.patch<Country>(`/master-data/countries/${id}`, data);
    return response.data;
}

export async function getStates(params?: MasterQueryParams): Promise<State[]> {
    const response = await api.get<State[]>("/master-data/states", {
        params: buildParams(params),
    });
    return response.data ?? [];
}

export async function createState(data: StatePayload): Promise<State> {
    const response = await api.post<State>("/master-data/states", data);
    return response.data;
}

export async function updateState(
    id: string,
    data: Partial<StatePayload>,
): Promise<State> {
    const response = await api.patch<State>(`/master-data/states/${id}`, data);
    return response.data;
}

export async function getDistricts(params?: MasterQueryParams): Promise<District[]> {
    const response = await api.get<District[]>("/master-data/districts", {
        params: buildParams(params),
    });
    return response.data ?? [];
}

export async function createDistrict(data: DistrictPayload): Promise<District> {
    const response = await api.post<District>("/master-data/districts", data);
    return response.data;
}

export async function updateDistrict(
    id: string,
    data: Partial<DistrictPayload>,
): Promise<District> {
    const response = await api.patch<District>(
        `/master-data/districts/${id}`,
        data,
    );
    return response.data;
}

export async function getPincodes(params?: MasterQueryParams): Promise<Pincode[]> {
    const response = await api.get<Pincode[]>("/master-data/pincodes", {
        params: buildParams(params),
    });
    return response.data ?? [];
}

export async function createPincode(data: PincodePayload): Promise<Pincode> {
    const response = await api.post<Pincode>("/master-data/pincodes", data);
    return response.data;
}

export async function updatePincode(
    id: string,
    data: Partial<PincodePayload>,
): Promise<Pincode> {
    const response = await api.patch<Pincode>(`/master-data/pincodes/${id}`, data);
    return response.data;
}

export async function getSalesChannelTypes(
    params?: MasterQueryParams,
): Promise<SalesChannelTypeMaster[]> {
    const response = await api.get<SalesChannelTypeMaster[]>(
        "/master-data/sales-channel-types",
        { params: buildParams(params) },
    );
    return response.data ?? [];
}

export async function getSalesChannelTypeById(
    id: string,
): Promise<SalesChannelTypeMaster> {
    const response = await api.get<SalesChannelTypeMaster>(
        `/master-data/sales-channel-types/${id}`,
    );
    return response.data;
}

export async function createSalesChannelType(
    data: SalesChannelTypePayload,
): Promise<SalesChannelTypeMaster> {
    const response = await api.post<SalesChannelTypeMaster>(
        "/master-data/sales-channel-types",
        data,
    );
    return response.data;
}

export async function updateSalesChannelType(
    id: string,
    data: Partial<SalesChannelTypePayload>,
): Promise<SalesChannelTypeMaster> {
    const response = await api.patch<SalesChannelTypeMaster>(
        `/master-data/sales-channel-types/${id}`,
        data,
    );
    return response.data;
}
