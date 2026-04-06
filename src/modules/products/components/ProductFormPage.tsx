"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/modules/products/components/ProductForm";
import ProductVariantsTab from "@/modules/products/components/ProductVariantsTab";
import ProductMediaTab from "@/modules/products/components/ProductMediaTab";
import type {
    Product,
    ProductFormData,
    ProductOption,
} from "@/modules/products/types/product";
import {
    createProduct,
    deleteProduct,
    getProductBrands,
    getProductById,
    getProductCategories,
    getSuggestedProductCode,
    updateProduct,
} from "@/modules/products/api/productApi";

interface ProductFormPageProps {
    mode: "create" | "edit";
    productId?: string;
}

type ProductTab = "general" | "variants" | "media" | "seo";

const emptyForm: ProductFormData = {
    name: "",
    productCode: "",
    brandId: "",
    categoryId: "",
    categoryIds: [],
    description: "",
};

export default function ProductFormPage({
    mode,
    productId,
}: ProductFormPageProps) {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<ProductTab>("general");
    const [loading, setLoading] = useState(mode === "edit");
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<ProductFormData>(emptyForm);
    const [brands, setBrands] = useState<ProductOption[]>([]);
    const [categories, setCategories] = useState<ProductOption[]>([]);
    const [productName, setProductName] = useState("Create Product");

    useEffect(() => {
        const init = async () => {
            try {
                const [brandOptions, categoryOptions] = await Promise.all([
                    getProductBrands(),
                    getProductCategories(),
                ]);

                setBrands(brandOptions);
                setCategories(categoryOptions);

                if (mode === "edit" && productId) {
                    const product: Product = await getProductById(productId);

                    const assignedCategoryIds =
                        product?.categoryAssignments?.map(
                            (item) => item.categoryId
                        ) ||
                        product?.categoryIds ||
                        (product?.categoryId ? [product.categoryId] : []);

                    const primaryCategoryId =
                        product?.categoryId ??
                        product?.category?.id ??
                        assignedCategoryIds[0] ??
                        "";

                    setForm({
                        name: product?.name ?? "",
                        productCode: product?.productCode ?? "",
                        brandId: product?.brandId ?? product?.brand?.id ?? "",
                        categoryId: primaryCategoryId,
                        categoryIds: Array.from(
                            new Set(
                                primaryCategoryId
                                    ? [primaryCategoryId, ...assignedCategoryIds]
                                    : assignedCategoryIds
                            )
                        ),
                        description: product?.description ?? "",
                    });

                    setProductName(product?.name ?? "Edit Product");
                    return;
                }

                // Auto-suggest code only in create mode.
                if (mode === "create") {
                    try {
                        const suggested = await getSuggestedProductCode();

                        setForm((prev) => {
                            // Do not overwrite if user already typed something somehow.
                            if (prev.productCode.trim()) {
                                return prev;
                            }

                            return {
                                ...prev,
                                productCode: suggested.code,
                            };
                        });
                    } catch (error) {
                        console.error("Failed to fetch suggested product code:", error);
                    }
                }
            } catch (error) {
                console.error("Failed to load product form data:", error);
                alert("Failed to load product form data");
            } finally {
                setLoading(false);
            }
        };

        void init();
    }, [mode, productId]);

    const handleChange = (
        field: keyof ProductFormData,
        value: string | string[]
    ) => {
        setForm((prev) => {
            const next = {
                ...prev,
                [field]: value,
            } as ProductFormData;

            // Always keep primary category inside assigned category list.
            if (field === "categoryId") {
                const primaryCategoryId = value as string;
                next.categoryIds = primaryCategoryId
                    ? Array.from(new Set([primaryCategoryId, ...prev.categoryIds]))
                    : prev.categoryIds;
            }

            // If category list changes and primary is removed, choose first selected as new primary.
            if (field === "categoryIds") {
                const nextCategoryIds = value as string[];
                next.categoryIds = nextCategoryIds;

                if (!nextCategoryIds.length) {
                    next.categoryId = "";
                } else if (!nextCategoryIds.includes(prev.categoryId)) {
                    next.categoryId = nextCategoryIds[0];
                }
            }

            return next;
        });
    };

    const handleCancel = () => {
        router.push("/dashboard/products");
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            alert("Product name is required");
            return;
        }

        if (!form.productCode.trim()) {
            alert("Product code is required");
            return;
        }

        if (!form.brandId) {
            alert("Please select a brand");
            return;
        }

        if (!form.categoryId) {
            alert("Please select a primary category");
            return;
        }

        if (!form.categoryIds.length) {
            alert("Please assign at least one category");
            return;
        }

        const payload: ProductFormData = {
            ...form,
            categoryIds: Array.from(new Set([form.categoryId, ...form.categoryIds])),
        };

        setSaving(true);

        try {
            if (mode === "create") {
                await createProduct(payload);
            } else if (productId) {
                await updateProduct(productId, payload);
            }

            router.push("/dashboard/products");
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to save product");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!productId) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${productName}"?`
        );

        if (!confirmed) return;

        try {
            await deleteProduct(productId);
            router.push("/dashboard/products");
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to delete product");
        }
    };

    const renderTabContent = () => {
        if (activeTab === "general") {
            return (
                <>
                    <ProductForm
                        form={form}
                        brands={brands}
                        categories={categories}
                        onChange={handleChange}
                    />

                    <div className="mt-6 flex items-center justify-end gap-3">
                        {mode === "edit" && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="rounded-lg border border-red-200 px-4 py-2 text-red-600 transition hover:bg-red-50"
                            >
                                Delete
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-lg border border-borderColorCustom px-4 py-2 transition hover:bg-background"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </>
            );
        }

        if (activeTab === "variants") {
            if (mode === "create" || !productId) {
                return (
                    <div className="rounded-2xl border border-borderColorCustom bg-white p-8">
                        <h4 className="text-lg font-semibold text-textPrimary">
                            Variants
                        </h4>
                        <p className="mt-2 text-textSecondary">
                            Save the product first before adding variants.
                        </p>
                    </div>
                );
            }

            return <ProductVariantsTab productId={productId} />;
        }

        if (activeTab === "media") {
            if (mode === "create" || !productId) {
                return (
                    <div className="rounded-2xl border border-borderColorCustom bg-white p-8">
                        <h4 className="text-lg font-semibold text-textPrimary">
                            Media
                        </h4>
                        <p className="mt-2 text-textSecondary">
                            Save the product first before adding media.
                        </p>
                    </div>
                );
            }

            return <ProductMediaTab productId={productId} />;
        }

        return (
            <div className="rounded-2xl border border-borderColorCustom bg-white p-8">
                <h4 className="text-lg font-semibold text-textPrimary">SEO</h4>
                <p className="mt-2 text-textSecondary">
                    SEO settings will be added next.
                </p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-borderColorCustom bg-card p-6 text-textSecondary">
                Loading product...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-borderColorCustom bg-card px-6 py-4">
                <div>
                    <div className="text-sm text-textSecondary">
                        Product settings
                    </div>
                    <h2 className="text-2xl font-semibold text-textPrimary">
                        {mode === "create" ? "Create Product" : productName}
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-lg border border-borderColorCustom px-4 py-2 transition hover:bg-background"
                    >
                        Cancel
                    </button>

                    {activeTab === "general" && (
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-borderColorCustom bg-card">
                <div className="border-b border-borderColorCustom px-6 pt-4">
                    <div className="flex gap-8">
                        <button
                            type="button"
                            onClick={() => setActiveTab("general")}
                            className={`pb-3 text-sm ${activeTab === "general"
                                    ? "border-b-2 border-primary font-medium text-primary"
                                    : "text-textSecondary"
                                }`}
                        >
                            General
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("variants")}
                            className={`pb-3 text-sm ${activeTab === "variants"
                                    ? "border-b-2 border-primary font-medium text-primary"
                                    : "text-textSecondary"
                                }`}
                        >
                            Variants
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("media")}
                            className={`pb-3 text-sm ${activeTab === "media"
                                    ? "border-b-2 border-primary font-medium text-primary"
                                    : "text-textSecondary"
                                }`}
                        >
                            Media
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("seo")}
                            className={`pb-3 text-sm ${activeTab === "seo"
                                    ? "border-b-2 border-primary font-medium text-primary"
                                    : "text-textSecondary"
                                }`}
                        >
                            SEO
                        </button>
                    </div>
                </div>

                <div className="p-6">{renderTabContent()}</div>
            </div>
        </div>
    );
}