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
}

export interface ProductOption {
    id: string;
    name: string;
}

export interface ProductFormData {
    name: string;
    productCode: string;
    brandId: string;
    categoryId: string;
    description: string;
}

export interface Product {
    id: string;
    name: string;
    productCode: string;
    description?: string;
    brandId?: string;
    categoryId?: string;
    brand?: ProductBrand;
    category?: ProductCategory;
    media: ProductMedia[];
    variants: ProductVariant[];
    totalStock?: number;
    isActive?: boolean;
    createdAt?: string;
}