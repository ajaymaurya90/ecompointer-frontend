import { api } from "@/lib/http";

export interface ProductManufacturer {
    id: string;
    name: string;
    code?: string | null;
    description?: string | null;

    contactPerson?: string | null;
    email?: string | null;
    phone?: string | null;

    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postalCode?: string | null;

    gstNumber?: string | null;
    website?: string | null;
    supportNotes?: string | null;

    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ManufacturerListResponse {
    data: ProductManufacturer[];
    meta?: {
        total: number;
        page: number;
        lastPage: number;
    };
}

export async function getManufacturers(
    params: Record<string, unknown> = {}
): Promise<ManufacturerListResponse> {
    const response = await api.get("/product-manufacturers", { params });

    // Supports both:
    // 1. paginated response { data, meta }
    // 2. plain array response []
    if (Array.isArray(response.data)) {
        return {
            data: response.data,
        };
    }

    return response.data;
}

export async function createManufacturer(
    data: Partial<ProductManufacturer>
): Promise<ProductManufacturer> {
    const response = await api.post("/product-manufacturers", data);
    return response.data?.data ?? response.data;
}

export async function updateManufacturer(
    id: string,
    data: Partial<ProductManufacturer>
): Promise<ProductManufacturer> {
    const response = await api.patch(`/product-manufacturers/${id}`, data);
    return response.data?.data ?? response.data;
}

export async function deleteManufacturer(id: string) {
    const response = await api.delete(`/product-manufacturers/${id}`);
    return response.data?.data ?? response.data;
}