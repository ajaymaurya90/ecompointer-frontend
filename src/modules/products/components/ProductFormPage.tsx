"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductForm from "@/modules/products/components/ProductForm";
import ProductVariantsTab from "@/modules/products/components/ProductVariantsTab";
import ProductMediaTab from "@/modules/products/components/ProductMediaTab";
import ProductVariantForm from "@/modules/products/components/ProductVariantForm";
import VariantMediaTab from "@/modules/products/components/VariantMediaTab";
import type {
    Product,
    ProductFormData,
    ProductOption,
} from "@/modules/products/types/product";
import type {
    ProductVariant,
    ProductVariantFormData,
} from "@/modules/products/api/productVariantApi";
import {
    createProduct,
    deleteProduct,
    getProductBrands,
    getProductById,
    getProductCategories,
    getSuggestedProductCode,
    updateProduct,
} from "@/modules/products/api/productApi";
import {
    createProductVariant,
    updateProductVariant,
} from "@/modules/products/api/productVariantApi";
import Button from "@/components/ui/Button";

interface ProductFormPageProps {
    mode: "create" | "edit";
    productId?: string;
}

type ProductTab = "general" | "variants" | "seo";
type VariantEditorMode = "create" | "edit" | null;

const emptyForm: ProductFormData = {
    name: "",
    productCode: "",
    brandId: "",
    categoryId: "",
    categoryIds: [],
    description: "",
    productType: "PHYSICAL",
    taxRate: 18,
    costPrice: 0,
    wholesaleNet: 0,
    retailNet: 0,
    isFeatured: false,
    isFreeShipping: false,
    isClearance: false,
    stock: 0,
    minOrderQuantity: 1,
    maxOrderQuantity: "",
    deliveryTimeLabel: "",
    restockTimeDays: "",
};

function TabButton({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative pb-4 text-sm font-medium transition ${active
                    ? "text-primary"
                    : "text-textSecondary hover:text-textPrimary"
                }`}
        >
            {label}
            <span
                className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-all ${active ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
            />
        </button>
    );
}

export default function ProductFormPage({
    mode,
    productId,
}: ProductFormPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState<ProductTab>("general");
    const [loading, setLoading] = useState(mode === "edit");
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<ProductFormData>(emptyForm);
    const [brands, setBrands] = useState<ProductOption[]>([]);
    const [categories, setCategories] = useState<ProductOption[]>([]);
    const [productName, setProductName] = useState("Create Product");

    const [variantEditorMode, setVariantEditorMode] =
        useState<VariantEditorMode>(null);
    const [editingVariant, setEditingVariant] =
        useState<ProductVariant | null>(null);
    const [variantSubmitting, setVariantSubmitting] = useState(false);
    const [variantRefreshKey, setVariantRefreshKey] = useState(0);

    useEffect(() => {
        const requestedTab = searchParams.get("tab");
        const requestedVariantMode = searchParams.get("variantMode");

        if (requestedTab === "variants") {
            setActiveTab("variants");
        } else if (requestedTab === "seo") {
            setActiveTab("seo");
        } else {
            setActiveTab("general");
        }

        if (requestedVariantMode === "create") {
            setVariantEditorMode("create");
            setEditingVariant(null);
            setActiveTab("variants");
        }
    }, [searchParams]);

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
                        ...emptyForm,
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
                        productType: product?.productType ?? "PHYSICAL",
                        taxRate: product?.taxRate ?? 18,
                        costPrice: product?.costPrice ?? 0,
                        wholesaleNet: product?.wholesaleNet ?? 0,
                        retailNet: product?.retailNet ?? 0,
                        isFeatured: product?.isFeatured ?? false,
                        isFreeShipping: product?.isFreeShipping ?? false,
                        isClearance: product?.isClearance ?? false,
                        stock: product?.stock ?? 0,
                        minOrderQuantity: product?.minOrderQuantity ?? 1,
                        maxOrderQuantity: product?.maxOrderQuantity ?? "",
                        deliveryTimeLabel: product?.deliveryTimeLabel ?? "",
                        restockTimeDays: product?.restockTimeDays ?? "",
                    });

                    setProductName(product?.name ?? "Edit Product");
                    return;
                }

                if (mode === "create") {
                    try {
                        const suggested = await getSuggestedProductCode();

                        setForm((prev) => ({
                            ...prev,
                            productCode: prev.productCode.trim()
                                ? prev.productCode
                                : suggested.code,
                        }));
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
        value: string | string[] | boolean
    ) => {
        setForm((prev) => {
            const numericFields: Array<keyof ProductFormData> = [
                "taxRate",
                "costPrice",
                "wholesaleNet",
                "retailNet",
                "stock",
                "minOrderQuantity",
                "maxOrderQuantity",
                "restockTimeDays",
            ];

            let normalizedValue: string | string[] | boolean | number = value;

            if (typeof value === "string" && numericFields.includes(field)) {
                normalizedValue = value === "" ? "" : Number(value);
            }

            const next = {
                ...prev,
                [field]: normalizedValue,
            } as ProductFormData;

            if (field === "categoryId") {
                const primaryCategoryId = value as string;
                next.categoryIds = primaryCategoryId
                    ? Array.from(new Set([primaryCategoryId, ...prev.categoryIds]))
                    : prev.categoryIds;
            }

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

    const getVariantDefaults = () => ({
        taxRate: form.taxRate,
        costPrice: form.costPrice,
        wholesaleNet: form.wholesaleNet,
        retailNet: form.retailNet,
        isFeatured: form.isFeatured,
        isFreeShipping: form.isFreeShipping,
        isClearance: form.isClearance,
        minOrderQuantity: form.minOrderQuantity,
        maxOrderQuantity:
            form.maxOrderQuantity === "" ? undefined : Number(form.maxOrderQuantity),
        deliveryTimeLabel: form.deliveryTimeLabel || undefined,
        restockTimeDays:
            form.restockTimeDays === "" ? undefined : Number(form.restockTimeDays),
    });

    const handleAddVariant = () => {
        setEditingVariant(null);
        setVariantEditorMode("create");
        setActiveTab("variants");
    };

    const handleEditVariant = (variant: ProductVariant) => {
        setEditingVariant(variant);
        setVariantEditorMode("edit");
        setActiveTab("variants");
    };

    const handleCancelVariantEditor = () => {
        setEditingVariant(null);
        setVariantEditorMode(null);
    };

    const handleSubmitVariant = async (data: ProductVariantFormData) => {
        if (!productId) return;

        setVariantSubmitting(true);

        try {
            if (variantEditorMode === "edit" && editingVariant) {
                await updateProductVariant(productId, editingVariant.id, data);
            } else {
                await createProductVariant(productId, data);
            }

            setEditingVariant(null);
            setVariantEditorMode(null);
            setVariantRefreshKey((prev) => prev + 1);
            setActiveTab("variants");
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to save variant");
        } finally {
            setVariantSubmitting(false);
        }
    };

    const renderGeneralTab = () => {
        return (
            <div className="space-y-6">
                <ProductForm
                    form={form}
                    brands={brands}
                    categories={categories}
                    onChange={handleChange}
                />

                {mode === "edit" && productId ? (
                    <ProductMediaTab productId={productId} />
                ) : (
                    <div className="rounded-2xl border border-borderSoft bg-card p-8 shadow-sm">
                        <h4 className="text-lg font-semibold text-textPrimary">
                            Product Gallery
                        </h4>
                        <p className="mt-2 text-textSecondary">
                            Save the product first before uploading media.
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-end gap-3">
                    {mode === "edit" ? (
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    ) : null}

                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </div>
        );
    };

    const renderVariantsTab = () => {
        if (mode === "create" || !productId) {
            return (
                <div className="rounded-2xl border border-borderSoft bg-card p-8 shadow-sm">
                    <h4 className="text-lg font-semibold text-textPrimary">
                        Variants
                    </h4>
                    <p className="mt-2 text-textSecondary">
                        Save the product first before adding variants.
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <ProductVariantsTab
                    key={variantRefreshKey}
                    productId={productId}
                    onAddVariant={handleAddVariant}
                    onEditVariant={handleEditVariant}
                    defaultValues={{
                        taxRate: form.taxRate,
                        costPrice: form.costPrice,
                        wholesaleNet: form.wholesaleNet,
                        retailNet: form.retailNet,
                        stock: 0,
                        isActive: true,
                    }}
                />

                {variantEditorMode ? (
                    <ProductVariantForm
                        variant={editingVariant}
                        defaultValues={getVariantDefaults()}
                        onSubmit={handleSubmitVariant}
                        onCancel={handleCancelVariantEditor}
                        submitting={variantSubmitting}
                    />
                ) : null}

                {variantEditorMode === "edit" && editingVariant ? (
                    <VariantMediaTab variantId={editingVariant.id} />
                ) : null}
            </div>
        );
    };

    const renderSeoTab = () => {
        return (
            <div className="rounded-2xl border border-borderSoft bg-card p-8 shadow-sm">
                <h4 className="text-lg font-semibold text-textPrimary">SEO</h4>
                <p className="mt-2 text-textSecondary">
                    SEO settings will be added next.
                </p>
            </div>
        );
    };

    const renderTabContent = () => {
        if (activeTab === "general") {
            return renderGeneralTab();
        }

        if (activeTab === "variants") {
            return renderVariantsTab();
        }

        return renderSeoTab();
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-borderSoft bg-card p-6 text-textSecondary shadow-sm">
                Loading product...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-borderSoft bg-card px-6 py-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <div className="text-sm text-textSecondary">
                            Product settings
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight text-textPrimary">
                            {mode === "create" ? "Create Product" : productName}
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>

                        {activeTab === "general" ? (
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Product"}
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
                <div className="table-header px-6 pt-4">
                    <div className="flex items-center gap-8">
                        <TabButton
                            label="General"
                            active={activeTab === "general"}
                            onClick={() => setActiveTab("general")}
                        />

                        <TabButton
                            label="Variants"
                            active={activeTab === "variants"}
                            onClick={() => setActiveTab("variants")}
                        />

                        <TabButton
                            label="SEO"
                            active={activeTab === "seo"}
                            onClick={() => setActiveTab("seo")}
                        />
                    </div>
                </div>

                <div className="p-6">{renderTabContent()}</div>
            </div>
        </div>
    );
}