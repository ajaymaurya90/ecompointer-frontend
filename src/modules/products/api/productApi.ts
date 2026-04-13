import { api } from "@/lib/http";
import type {
    Product,
    ProductFormData,
    ProductOption,
    ProductMediaListResponse,
} from "@/modules/products/types/product";

interface ProductListMeta {
    total: number;
    page: number;
    lastPage: number;
}

interface ProductListResponse {
    data: Product[];
    meta: ProductListMeta;
}

export interface ProductListParams {
    page?: number;
    limit?: number;
    search?: string;

    categoryIds?: string[];
    brandIds?: string[];
    manufacturerIds?: string[];

    status?: "active" | "inactive" | "all";
    flags?: Array<"featured" | "free_shipping" | "clearance">;

    stockStatus?: "in_stock" | "low_stock" | "out_of_stock";
    imageStatus?: "with_image" | "without_image";

    productTypes?: Array<"PHYSICAL" | "DIGITAL" | "SERVICE" | "OTHER">;

    createdPreset?: "today" | "last_day" | "last_week" | "last_month" | "last_year";
    createdFrom?: string;
    createdTo?: string;

    priceFrom?: number;
    priceTo?: number;

    salesFrom?: number;
    salesTo?: number;

    sortBy?: "createdAt" | "name" | "productCode" | "manufacturer";
    order?: "asc" | "desc";
}

export async function getProducts(
    params: ProductListParams = {}
): Promise<ProductListResponse> {
    const response = await api.get("/products", {
        params: {
            ...params,
            categoryIds: params.categoryIds?.join(","),
            brandIds: params.brandIds?.join(","),
            manufacturerIds: params.manufacturerIds?.join(","),
            productTypes: params.productTypes?.join(","),
            flags: params.flags?.join(","),
        },
    });

    return response.data;
}

export async function getProductManufacturers(): Promise<ProductOption[]> {
    const response = await api.get("/product-manufacturers/active-options");

    return (response.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
    }));
}

export async function getProductById(productId: string): Promise<Product> {
    const response = await api.get(`/products/${productId}`);
    return response.data?.data ?? response.data;
}

export async function getSuggestedProductCode(): Promise<{
    code: string;
    prefix: string;
    sequence: number;
}> {
    const response = await api.get("/products/suggest-code");
    return response.data;
}

export async function createProduct(data: ProductFormData): Promise<Product> {
    const response = await api.post("/products", data);
    return response.data?.data ?? response.data;
}

export async function updateProduct(
    productId: string,
    data: ProductFormData
): Promise<Product> {
    const response = await api.patch(`/products/${productId}`, data);
    return response.data?.data ?? response.data;
}

export async function deleteProduct(productId: string): Promise<void> {
    await api.delete(`/products/${productId}`);
}

export async function getProductBrands(): Promise<ProductOption[]> {
    const response = await api.get("/brand");

    return (response.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
    }));
}

export async function getProductCategories(): Promise<ProductOption[]> {
    const response = await api.get("/categories");
    return buildCategoryTree(response.data || []);
}

export async function getProductMedia(
    productId: string,
    page = 1,
    limit = 20
): Promise<ProductMediaListResponse> {
    const response = await api.get(`/media/product/${productId}`, {
        params: { page, limit },
    });

    return response.data;
}

export async function uploadProductMedia(
    productId: string,
    file: File
) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/media/upload/product/${productId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function updateProductMediaLink(
    linkId: string,
    payload: {
        isPrimary?: boolean;
        role?: "GALLERY" | "THUMBNAIL" | "ZOOM" | "SWATCH" | "LIFESTYLE";
        title?: string;
        altText?: string;
    }
) {
    const response = await api.patch(`/media/product-link/${linkId}`, payload);
    return response.data;
}

export async function deleteProductMediaLink(linkId: string) {
    const response = await api.delete(`/media/product-link/${linkId}`);
    return response.data;
}

export async function reorderProductMedia(
    productId: string,
    items: Array<{ id: string; position: number }>
) {
    const response = await api.patch(`/media/product/${productId}/reorder`, {
        items,
    });

    return response.data;
}

function buildCategoryTree(categories: any[]): ProductOption[] {
    const normalized = categories.map((item) => ({
        id: item.id,
        name: item.name,
        parentId: item.parentId ?? null,
        children: [] as ProductOption[],
    }));

    const map = new Map<string, ProductOption>();

    normalized.forEach((item) => {
        map.set(item.id, item);
    });

    const roots: ProductOption[] = [];

    normalized.forEach((item) => {
        if (item.parentId && map.has(item.parentId)) {
            map.get(item.parentId)!.children!.push(item);
        } else {
            roots.push(item);
        }
    });

    return roots;
}