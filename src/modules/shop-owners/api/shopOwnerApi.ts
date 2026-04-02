import { api } from "@/lib/http";
import type {
    LinkExistingShopOwnerFormData,
    ShopOwner,
    ShopOwnerFormData,
    ShopOwnerListParams,
    ShopOwnerListResponse,
} from "@/modules/shop-owners/types/shopOwner";

function cleanParams<T extends object>(params: T) {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) => value !== "" && value !== undefined && value !== null
        )
    );
}

export async function getShopOwners(
    params: ShopOwnerListParams = {}
): Promise<ShopOwnerListResponse> {
    const response = await api.get("/shop-owners", {
        params: cleanParams(params),
    });

    return response.data;
}

export async function getShopOwnerById(shopOwnerId: string): Promise<ShopOwner> {
    const response = await api.get(`/shop-owners/${shopOwnerId}`);
    return response.data?.data ?? response.data;
}

export async function createShopOwner(data: ShopOwnerFormData): Promise<ShopOwner> {
    const response = await api.post("/shop-owners", data);
    return response.data?.data ?? response.data;
}

export async function updateShopOwner(
    shopOwnerId: string,
    data: Partial<ShopOwnerFormData>
): Promise<ShopOwner> {
    const response = await api.patch(`/shop-owners/${shopOwnerId}`, data);
    return response.data?.data ?? response.data;
}

export async function updateShopOwnerStatus(
    shopOwnerId: string,
    data: { isActive: boolean; notes?: string }
): Promise<ShopOwner> {
    const response = await api.patch(`/shop-owners/${shopOwnerId}/status`, data);
    return response.data?.data ?? response.data;
}

export async function linkExistingShopOwner(data: LinkExistingShopOwnerFormData) {
    const response = await api.post("/shop-owners/link-existing", data);
    return response.data?.data ?? response.data;
}