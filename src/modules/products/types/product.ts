export interface ProductMedia {
    id: string;
    url: string;
    isPrimary: boolean;
}

export interface ProductVariant {
    id: string;
    retailGross: number;
    stock: number;
    size?: string;
    color?: string;
}

export interface ProductBrand {
    id: string;
    name: string;
}

export interface ProductCategory {
    id: string;
    name: string;
    parentId?: string | null;
    children?: ProductCategory[];
}

export interface ProductOption {
    id: string;
    name: string;
    parentId?: string | null;
    children?: ProductOption[];
}

export interface ProductFormData {
    name: string;
    productCode: string;
    brandId: string;
    categoryId: string;      // primary category
    categoryIds: string[];   // all assigned categories
    description: string;
}

export interface Product {
    id: string;
    name: string;
    productCode: string;
    description?: string;
    brandId?: string;
    categoryId?: string;
    categoryIds?: string[];
    brand?: ProductBrand;
    category?: ProductCategory;
    categoryAssignments?: Array<{
        categoryId: string;
        category: ProductCategory;
    }>;
    media: ProductMedia[];
    variants: ProductVariant[];
    totalStock?: number;
    variantCount?: number;
    isActive?: boolean;
    createdAt?: string;
}