"use client";

import type {
    ProductFormData,
    ProductOption,
} from "@/modules/products/types/product";

interface ProductFormProps {
    form: ProductFormData;
    brands: ProductOption[];
    categories: ProductOption[];
    onChange: (field: keyof ProductFormData, value: string) => void;
}

export default function ProductForm({
    form,
    brands,
    categories,
    onChange,
}: ProductFormProps) {
    return (
        <div className="rounded-2xl border border-borderColorCustom bg-white">
            <div className="border-b border-borderColorCustom px-6 py-4">
                <h4 className="text-lg font-semibold text-textPrimary">
                    General Information
                </h4>
            </div>

            <div className="space-y-6 px-6 py-6">
                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Name
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        placeholder="Product name"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Brand
                        </label>
                        <select
                            value={form.brandId}
                            onChange={(e) => onChange("brandId", e.target.value)}
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        >
                            <option value="">Select brand</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Product Code
                        </label>
                        <input
                            type="text"
                            value={form.productCode}
                            onChange={(e) => onChange("productCode", e.target.value)}
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                            placeholder="Product code"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Category
                    </label>
                    <select
                        value={form.categoryId}
                        onChange={(e) => onChange("categoryId", e.target.value)}
                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Description
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) => onChange("description", e.target.value)}
                        className="min-h-[180px] w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        placeholder="Product description"
                    />
                </div>
            </div>
        </div>
    );
}