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
    return flattenCategories(response.data || []);
}

function flattenCategories(
    categories: any[],
    level = 0
): ProductOption[] {
    return categories.flatMap((category) => {
        const prefix = level > 0 ? `${"— ".repeat(level)}` : "";

        const current: ProductOption = {
            id: category.id,
            name: `${prefix}${category.name}`,
        };

        const children = Array.isArray(category.children)
            ? flattenCategories(category.children, level + 1)
            : [];

        return [current, ...children];
    });
}