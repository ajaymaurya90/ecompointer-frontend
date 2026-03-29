import { api } from "@/lib/http";
import type {
    Product,
    ProductFormData,
    ProductOption,
} from "@/modules/products/types/product";

interface ProductListResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

export async function getProducts(page = 1): Promise<ProductListResponse> {
    const response = await api.get("/products", {
        params: { page },
    });

    return response.data;
}

export async function getProductById(productId: string): Promise<Product> {
    const response = await api.get(`/products/${productId}`);

    // Supports both:
    // response.data = product
    // response.data.data = product
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

function flattenCategories(categories: any[], level = 0): ProductOption[] {
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