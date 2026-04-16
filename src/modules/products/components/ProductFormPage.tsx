"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Package2 } from "lucide-react";

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
    ChildProduct,
    ChildProductFormData,
} from "@/modules/products/api/productVariantApi";
import {
    createProduct,
    deleteProduct,
    getProductBrands,
    getProductById,
    getProductCategories,
    getProductManufacturers,
    getSuggestedProductCode,
    updateProduct,
} from "@/modules/products/api/productApi";
import {
    createChildProduct,
    updateChildProduct,
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
    manufacturerId: "",
    categoryId: "",
    categoryIds: [],
    description: "",
    productType: "PHYSICAL",
    currencyCode: "INR",
    taxRate: 18,
    costGross: 0,
    costPrice: 0,
    costNet: 0,
    wholesaleGross: 0,
    wholesaleNet: 0,
    retailGross: 0,
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

function calculateNetFromGross(gross: number, taxRate: number) {
    if (taxRate <= -100) {
        return Number(gross.toFixed(2));
    }

    return Number((gross / (1 + taxRate / 100)).toFixed(2));
}

function getOptionLabel(options: ProductOption[], id: string) {
    const visit = (items: ProductOption[]): string | null => {
        for (const item of items) {
            if (item.id === id) {
                return item.name;
            }

            const childMatch = item.children?.length ? visit(item.children) : null;
            if (childMatch) {
                return childMatch;
            }
        }

        return null;
    };

    return visit(options);
}

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
            className={`relative pb-4 pt-1 text-sm font-medium transition ${active
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
    const [manufacturers, setManufacturers] = useState<ProductOption[]>([]);
    const [productName, setProductName] = useState("Create Product");

    const [variantEditorMode, setVariantEditorMode] =
        useState<VariantEditorMode>(null);
    const [editingVariant, setEditingVariant] =
        useState<ChildProduct | null>(null);
    const [variantSubmitting, setVariantSubmitting] = useState(false);
    const [variantRefreshKey, setVariantRefreshKey] = useState(0);
    const [variantSubmitTrigger, setVariantSubmitTrigger] = useState(0);

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
                const [brandOptions, categoryOptions, manufacturerOptions] = await Promise.all([
                    getProductBrands(),
                    getProductCategories(),
                    getProductManufacturers(),
                ]);

                setBrands(brandOptions);
                setCategories(categoryOptions);
                setManufacturers(manufacturerOptions);

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
                        manufacturerId: product?.manufacturerId ?? product?.manufacturer?.id ?? "",
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
                        currencyCode:
                            product?.commercialEffective?.currencyCode ??
                            product?.currencyCode ??
                            "INR",
                        taxRate: product?.commercialEffective?.taxRate ?? product?.taxRate ?? 18,
                        costGross:
                            product?.commercialEffective?.costGross ??
                            product?.costGross ??
                            product?.costGrossPrice ??
                            0,
                        costPrice:
                            product?.commercialEffective?.costNet ??
                            product?.costNet ??
                            product?.costPrice ??
                            0,
                        costNet:
                            product?.commercialEffective?.costNet ??
                            product?.costNet ??
                            product?.costPrice ??
                            0,
                        wholesaleGross:
                            product?.commercialEffective?.wholesaleGross ??
                            product?.wholesaleGross ??
                            product?.wholesaleGrossPrice ??
                            0,
                        wholesaleNet:
                            product?.commercialEffective?.wholesaleNet ??
                            product?.wholesaleNet ??
                            0,
                        retailGross:
                            product?.commercialEffective?.retailGross ??
                            product?.retailGross ??
                            product?.retailGrossPrice ??
                            0,
                        retailNet:
                            product?.commercialEffective?.retailNet ??
                            product?.retailNet ??
                            0,
                        isFeatured:
                            product?.commercialEffective?.isFeatured ??
                            product?.isFeatured ??
                            false,
                        isFreeShipping:
                            product?.commercialEffective?.isFreeShipping ??
                            product?.isFreeShipping ??
                            false,
                        isClearance:
                            product?.commercialEffective?.isClearance ??
                            product?.isClearance ??
                            false,
                        stock: product?.commercialEffective?.stock ?? product?.stock ?? 0,
                        minOrderQuantity:
                            product?.commercialEffective?.minOrderQuantity ??
                            product?.minOrderQuantity ??
                            1,
                        maxOrderQuantity:
                            product?.commercialEffective?.maxOrderQuantity ??
                            product?.maxOrderQuantity ??
                            "",
                        deliveryTimeLabel:
                            product?.commercialEffective?.deliveryTimeLabel ??
                            product?.deliveryTimeLabel ??
                            "",
                        restockTimeDays:
                            product?.commercialEffective?.restockTimeDays ??
                            product?.restockTimeDays ??
                            "",
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
                "costGross",
                "costPrice",
                "costNet",
                "wholesaleGross",
                "wholesaleNet",
                "retailGross",
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

    const handleBackToProductList = () => {
        router.push("/dashboard/products");
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
            costNet: calculateNetFromGross(form.costGross, form.taxRate),
            costPrice: calculateNetFromGross(form.costGross, form.taxRate),
            wholesaleNet: calculateNetFromGross(form.wholesaleGross, form.taxRate),
            retailNet: calculateNetFromGross(form.retailGross, form.taxRate),
            maxOrderQuantity:
                form.maxOrderQuantity === "" || form.maxOrderQuantity === null
                    ? null
                    : Number(form.maxOrderQuantity),
            restockTimeDays:
                form.restockTimeDays === "" || form.restockTimeDays === null
                    ? null
                    : Number(form.restockTimeDays),
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
        currencyCode: form.currencyCode,
        taxRate: form.taxRate,
        costGross: form.costGross,
        costPrice: calculateNetFromGross(form.costGross, form.taxRate),
        costNet: calculateNetFromGross(form.costGross, form.taxRate),
        wholesaleGross: form.wholesaleGross,
        wholesaleNet: calculateNetFromGross(form.wholesaleGross, form.taxRate),
        retailGross: form.retailGross,
        retailNet: calculateNetFromGross(form.retailGross, form.taxRate),
        stock: form.stock,
        isFeatured: form.isFeatured,
        isFreeShipping: form.isFreeShipping,
        isClearance: form.isClearance,
        minOrderQuantity: form.minOrderQuantity,
        maxOrderQuantity:
            form.maxOrderQuantity === "" || form.maxOrderQuantity === null
                ? null
                : Number(form.maxOrderQuantity),
        deliveryTimeLabel: form.deliveryTimeLabel || undefined,
        restockTimeDays:
            form.restockTimeDays === "" || form.restockTimeDays === null
                ? null
                : Number(form.restockTimeDays),
    });

    const productLockedSummary = {
        brand: getOptionLabel(brands, form.brandId) ?? "Selected on product",
        manufacturer:
            getOptionLabel(manufacturers, form.manufacturerId) ??
            (form.manufacturerId ? "Selected on product" : "Not selected"),
        category:
            getOptionLabel(categories, form.categoryId) ?? "Selected on product",
        productType: form.productType,
        productName: form.name,
        productDescription: form.description,
    };

    const handleAddVariant = () => {
        setEditingVariant(null);
        setVariantEditorMode("create");
        setActiveTab("variants");
    };

    const handleEditVariant = (variant: ChildProduct) => {
        setEditingVariant(variant);
        setVariantEditorMode("edit");
        setActiveTab("variants");
    };

    const handleCancelVariantEditor = () => {
        setEditingVariant(null);
        setVariantEditorMode(null);
    };

    const handleSubmitVariant = async (data: ChildProductFormData) => {
        if (!productId) return;

        setVariantSubmitting(true);

        try {
            if (variantEditorMode === "edit" && editingVariant) {
                await updateChildProduct(productId, editingVariant.id, data);
            } else {
                await createChildProduct(productId, data);
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

    const isVariantEditorOpen =
        activeTab === "variants" && variantEditorMode !== null;

    const handleHeaderCancel = () => {
        if (isVariantEditorOpen) {
            handleCancelVariantEditor();
            return;
        }

        handleCancel();
    };

    const handleHeaderSave = () => {
        if (isVariantEditorOpen) {
            setVariantSubmitTrigger((prev) => prev + 1);
            return;
        }

        void handleSave();
    };

    const headerSaveLabel = isVariantEditorOpen ? "Save Variant" : "Save Product";
    const headerSaveDisabled = isVariantEditorOpen ? variantSubmitting : saving;

    const renderGeneralTab = () => {
        return (
            <div className="space-y-6">
                <ProductForm
                    form={form}
                    brands={brands}
                    categories={categories}
                    manufacturers={manufacturers}
                    onChange={handleChange}
                />

                {mode === "edit" && productId ? (
                    <ProductMediaTab productId={productId} />
                ) : (
                    <div className="rounded-3xl border border-borderSoft bg-card p-10 shadow-sm">
                        <div className="mx-auto flex max-w-md flex-col items-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cardMuted ring-1 ring-borderSoft">
                                <Package2 size={22} className="text-textSecondary" />
                            </div>
                            <h4 className="mt-4 text-lg font-semibold text-textPrimary">
                                Product Gallery
                            </h4>
                            <p className="mt-2 text-textSecondary">
                                Save the product first before uploading media.
                            </p>
                        </div>
                    </div>
                )}

                {mode === "edit" ? (
                    <div className="flex items-center justify-end">
                        <Button variant="danger" onClick={handleDelete}>
                            Delete Product
                        </Button>
                    </div>
                ) : null}
            </div>
        );
    };

    const renderVariantsTab = () => {
        if (mode === "create" || !productId) {
            return (
                <div className="rounded-3xl border border-borderSoft bg-card p-10 shadow-sm">
                    <div className="mx-auto max-w-md text-center">
                        <h4 className="text-lg font-semibold text-textPrimary">
                            Variants
                        </h4>
                        <p className="mt-2 text-textSecondary">
                            Save the product first before adding variants.
                        </p>
                    </div>
                </div>
            );
        }

        if (variantEditorMode) {
            return (
                <div className="space-y-6">
                    <div className="rounded-[28px] bg-infoSoft/40 p-1 ring-1 ring-info/10">
                        <ProductVariantForm
                            variant={editingVariant}
                            defaultValues={getVariantDefaults()}
                            lockedProductFields={productLockedSummary}
                            onSubmit={handleSubmitVariant}
                            onCancel={handleCancelVariantEditor}
                            submitting={variantSubmitting}
                            hideFooterActions
                            submitTrigger={variantSubmitTrigger}
                        />
                    </div>

                    {variantEditorMode === "edit" && editingVariant ? (
                        <VariantMediaTab childProductId={editingVariant.id} />
                    ) : null}
                </div>
            );
        }

        return (
            <ProductVariantsTab
                key={variantRefreshKey}
                productId={productId}
                onAddVariant={handleAddVariant}
                onEditVariant={handleEditVariant}
                defaultValues={{
                    currencyCode: form.currencyCode,
                    taxRate: form.taxRate,
                    costGross: form.costGross,
                    costPrice: calculateNetFromGross(form.costGross, form.taxRate),
                    costNet: calculateNetFromGross(form.costGross, form.taxRate),
                    wholesaleGross: form.wholesaleGross,
                    wholesaleNet: calculateNetFromGross(form.wholesaleGross, form.taxRate),
                    retailGross: form.retailGross,
                    retailNet: calculateNetFromGross(form.retailGross, form.taxRate),
                    stock: form.stock,
                    isActive: true,
                }}
            />
        );
    };

    const renderSeoTab = () => {
        return (
            <div className="rounded-3xl border border-borderSoft bg-card p-10 shadow-sm">
                <div className="mx-auto max-w-md text-center">
                    <h4 className="text-lg font-semibold text-textPrimary">SEO</h4>
                    <p className="mt-2 text-textSecondary">
                        SEO settings will be added next.
                    </p>
                </div>
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
            <div className="rounded-3xl border border-borderSoft bg-card p-6 text-textSecondary shadow-sm">
                Loading product...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-[30px] border border-borderSoft bg-card shadow-sm">
                <div className="bg-gradient-to-r from-card to-cardMuted/40 px-6 py-6">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handleBackToProductList}
                                className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium text-textSecondary transition hover:bg-cardMuted hover:text-textPrimary"
                            >
                                <ChevronLeft size={16} />
                                Back to Product List
                            </button>

                            <div>
                                <h2 className="text-3xl font-semibold tracking-tight text-textPrimary">
                                    {mode === "create" ? "Create Product" : productName}
                                </h2>
                                <p className="mt-1 text-sm text-textSecondary">
                                    Manage product details, variants, media, and future SEO settings.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button variant="secondary" onClick={handleHeaderCancel}>
                                {isVariantEditorOpen ? "Back to List" : "Cancel"}
                            </Button>

                            <Button
                                variant="primary"
                                onClick={handleHeaderSave}
                                disabled={headerSaveDisabled}
                            >
                                {headerSaveDisabled ? "Saving..." : headerSaveLabel}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-borderSoft px-6 pt-4">
                    <div className="flex items-center gap-8">
                        <TabButton
                            label="General"
                            active={activeTab === "general"}
                            onClick={() => setActiveTab("general")}
                        />

                        <TabButton
                            label="Variants"
                            active={activeTab === "variants"}
                            onClick={() => {
                                setActiveTab("variants");
                                if (variantEditorMode) {
                                    handleCancelVariantEditor();
                                }
                            }}
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
