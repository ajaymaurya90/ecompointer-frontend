import { api } from "@/lib/http";
import type {
    Product,
    ProductFormData,
    ProductOption,
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
    categoryId?: string;
    sortBy?: "createdAt" | "name" | "productCode";
    order?: "asc" | "desc";
}

export async function getProducts(
    params: ProductListParams = {}
): Promise<ProductListResponse> {
    const response = await api.get("/products", {
        params,
    });

    return response.data;
}

export async function getProductById(productId: string): Promise<Product> {
    const response = await api.get(`/products/${productId}`);
    return response.data?.data ?? response.data;
}

export async function getSuggestedProductCode(): Promise<{ code: string; prefix: string; sequence: number }> {
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

// Convert flat category list into nested tree for Shopware-style selector.
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