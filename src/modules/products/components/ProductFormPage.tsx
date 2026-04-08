"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface ProductFormPageProps {
    mode: "create" | "edit";
    productId?: string;
}

type ProductTab = "general" | "variants" | "seo";
type VariantEditorMode = "create" | "edit" | null;

/**
 * ✅ UPDATED EMPTY FORM
 */
const emptyForm: ProductFormData = {
    name: "",
    productCode: "",
    brandId: "",
    categoryId: "",
    categoryIds: [],
    description: "",

    // NEW
    productType: "PHYSICAL",

    taxRate: 18,
    costPrice: 0,
    wholesaleNet: 0,
    retailNet: 0,

    // FLAGS
    isFeatured: false,
    isFreeShipping: false,
    isClearance: false,

    // INVENTORY
    stock: 0,

    // FULFILLMENT
    minOrderQuantity: 1,
    maxOrderQuantity: "",
    deliveryTimeLabel: "",
    restockTimeDays: "",
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

    const [variantEditorMode, setVariantEditorMode] =
        useState<VariantEditorMode>(null);
    const [editingVariant, setEditingVariant] =
        useState<ProductVariant | null>(null);
    const [variantSubmitting, setVariantSubmitting] = useState(false);
    const [variantRefreshKey, setVariantRefreshKey] = useState(0);

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
                        maxOrderQuantity:
                            product?.maxOrderQuantity ?? "",
                        deliveryTimeLabel:
                            product?.deliveryTimeLabel ?? "",
                        restockTimeDays:
                            product?.restockTimeDays ?? "",
                    });

                    setProductName(product?.name ?? "Edit Product");
                    return;
                }

                if (mode === "create") {
                    const suggested = await getSuggestedProductCode();
                    setForm((prev) => ({
                        ...prev,
                        productCode: prev.productCode || suggested.code,
                    }));
                }
            } catch (error) {
                console.error(error);
                alert("Failed to load product form data");
            } finally {
                setLoading(false);
            }
        };

        void init();
    }, [mode, productId]);

    /**
     * ✅ UPDATED HANDLE CHANGE
     */
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

            let normalizedValue: any = value;

            if (typeof value === "string" && numericFields.includes(field)) {
                normalizedValue = value === "" ? "" : Number(value);
            }

            const next = {
                ...prev,
                [field]: normalizedValue,
            } as ProductFormData;

            if (field === "categoryId") {
                const id = value as string;
                next.categoryIds = id
                    ? Array.from(new Set([id, ...prev.categoryIds]))
                    : prev.categoryIds;
            }

            if (field === "categoryIds") {
                const ids = value as string[];
                next.categoryIds = ids;

                if (!ids.length) next.categoryId = "";
                else if (!ids.includes(prev.categoryId)) {
                    next.categoryId = ids[0];
                }
            }

            return next;
        });
    };

    const handleSave = async () => {
        if (!form.name.trim()) return alert("Product name required");
        if (!form.productCode.trim()) return alert("Product code required");
        if (!form.brandId) return alert("Select brand");
        if (!form.categoryId) return alert("Select primary category");

        const payload: ProductFormData = {
            ...form,
            categoryIds: Array.from(
                new Set([form.categoryId, ...form.categoryIds])
            ),
        };

        setSaving(true);

        try {
            if (mode === "create") await createProduct(payload);
            else if (productId) await updateProduct(productId, payload);

            router.push("/dashboard/products");
        } catch (e: any) {
            console.error(e);
            alert(e?.response?.data?.message || "Failed");
        } finally {
            setSaving(false);
        }
    };

    /**
     * ✅ VARIANT DEFAULT VALUES UPDATED
     */
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

    const handleSubmitVariant = async (data: ProductVariantFormData) => {
        if (!productId) return;

        setVariantSubmitting(true);

        try {
            if (variantEditorMode === "edit" && editingVariant) {
                await updateProductVariant(productId, editingVariant.id, data);
            } else {
                await createProductVariant(productId, data);
            }

            setVariantEditorMode(null);
            setEditingVariant(null);
            setVariantRefreshKey((prev) => prev + 1);
            setActiveTab("variants");
        } catch (e: any) {
            alert(e?.response?.data?.message || "Variant failed");
        } finally {
            setVariantSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <ProductForm
                form={form}
                brands={brands}
                categories={categories}
                onChange={handleChange}
            />

            {mode === "edit" && productId && (
                <>
                    <ProductVariantsTab
                        key={variantRefreshKey}
                        productId={productId}
                        onAddVariant={() => setVariantEditorMode("create")}
                        onEditVariant={(v) => {
                            setEditingVariant(v);
                            setVariantEditorMode("edit");
                        }}
                        defaultValues={{
                            ...getVariantDefaults(),
                            stock: 0,
                            isActive: true,
                        }}
                    />

                    {variantEditorMode && (
                        <ProductVariantForm
                            variant={editingVariant}
                            defaultValues={getVariantDefaults()}
                            onSubmit={handleSubmitVariant}
                            onCancel={() => setVariantEditorMode(null)}
                            submitting={variantSubmitting}
                        />
                    )}

                    <ProductMediaTab productId={productId} />
                </>
            )}

            <button onClick={handleSave}>
                {saving ? "Saving..." : "Save Product"}
            </button>
        </div>
    );
}