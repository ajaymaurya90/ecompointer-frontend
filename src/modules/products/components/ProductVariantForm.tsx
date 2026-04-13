"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Select from "@radix-ui/react-select";
import type {
    ProductVariant,
    ProductVariantFormData,
} from "@/modules/products/api/productVariantApi";
import FieldTooltip from "@/components/ui/FieldTooltip";
import { Check, ChevronDown, RotateCcw } from "lucide-react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Button from "@/components/ui/Button";

interface ProductVariantFormProps {
    variant?: ProductVariant | null;
    defaultValues?: {
        taxRate: number;
        costPrice: number;
        wholesaleNet: number;
        retailNet: number;
        isFeatured: boolean;
        isFreeShipping: boolean;
        isClearance: boolean;
        minOrderQuantity: number;
        maxOrderQuantity?: number | null;
        deliveryTimeLabel?: string | null;
        restockTimeDays?: number | null;
    };
    onSubmit: (data: ProductVariantFormData) => Promise<void>;
    onCancel: () => void;
    submitting?: boolean;
    hideFooterActions?: boolean;
    submitTrigger?: number;
}

const emptyForm: ProductVariantFormData = {
    sku: "",
    size: "",
    color: "",
    taxRate: 18,
    costPrice: 0,
    wholesaleNet: 0,
    retailNet: 0,
    stock: 0,
    isFeatured: false,
    isFreeShipping: false,
    isClearance: false,
    minOrderQuantity: 1,
    maxOrderQuantity: undefined,
    deliveryTimeLabel: "",
    restockTimeDays: undefined,
    isActive: true,
};

type CommercialField =
    | "taxRate"
    | "costPrice"
    | "wholesaleNet"
    | "retailNet";

type MerchandisingField =
    | "isFeatured"
    | "isFreeShipping"
    | "isClearance";

type FulfillmentField =
    | "minOrderQuantity"
    | "maxOrderQuantity"
    | "deliveryTimeLabel"
    | "restockTimeDays";

function formatNumber(value: number) {
    return Number(value || 0).toFixed(2);
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function SectionBox({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-[24px] bg-cardMuted/70 p-5 ring-1 ring-borderSoft">
            <div className="mb-5">
                <h5 className="text-base font-semibold text-textPrimary">{title}</h5>
                {description ? (
                    <p className="mt-1 text-sm leading-6 text-textSecondary">
                        {description}
                    </p>
                ) : null}
            </div>
            {children}
        </div>
    );
}

function TextInput({
    value,
    onChange,
    placeholder,
    type = "text",
    min,
    step,
    className,
}: {
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    min?: string | number;
    step?: string | number;
    className?: string;
}) {
    return (
        <input
            type={type}
            min={min}
            step={step}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
                "h-12 w-full rounded-xl bg-card px-4 text-sm outline-none ring-1 ring-borderSoft transition",
                "placeholder:text-textSecondary focus:ring-2 focus:ring-borderFocus/30",
                className
            )}
        />
    );
}

function StatusSelect({
    value,
    onChange,
}: {
    value: "ACTIVE" | "INACTIVE";
    onChange: (value: "ACTIVE" | "INACTIVE") => void;
}) {
    return (
        <Select.Root
            value={value}
            onValueChange={(next) => onChange(next as "ACTIVE" | "INACTIVE")}
        >
            <Select.Trigger className="interactive-button flex h-12 w-full items-center justify-between rounded-xl bg-card px-4 text-left text-sm text-textPrimary ring-1 ring-borderSoft shadow-sm hover:bg-cardMuted">
                <Select.Value />
                <Select.Icon>
                    <ChevronDown size={16} className="text-textSecondary" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    sideOffset={8}
                    position="popper"
                    className="z-[9999] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-borderSoft bg-elevated shadow-md"
                >
                    <Select.Viewport className="p-1">
                        {["ACTIVE", "INACTIVE"].map((option) => (
                            <Select.Item
                                key={option}
                                value={option}
                                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2.5 text-sm text-textPrimary outline-none transition hover:bg-cardMuted focus:bg-cardMuted data-[state=checked]:bg-cardMuted"
                            >
                                <Select.ItemText>
                                    {option === "ACTIVE" ? "Active" : "Inactive"}
                                </Select.ItemText>
                                <Select.ItemIndicator>
                                    <Check size={14} className="text-primary" />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}

export default function ProductVariantForm({
    variant,
    defaultValues,
    onSubmit,
    onCancel,
    submitting = false,
    hideFooterActions = false,
    submitTrigger,
}: ProductVariantFormProps) {
    const [form, setForm] = useState<ProductVariantFormData>(emptyForm);
    const lastSubmitTriggerRef = useRef<number | undefined>(submitTrigger);

    useEffect(() => {
        if (variant) {
            setForm({
                sku: variant.sku || "",
                size: variant.size || "",
                color: variant.color || "",
                taxRate: variant.taxRate,
                costPrice: variant.costPrice,
                wholesaleNet: variant.wholesaleNet,
                retailNet: variant.retailNet,
                stock: variant.stock,
                isFeatured: variant.isFeatured,
                isFreeShipping: variant.isFreeShipping,
                isClearance: variant.isClearance,
                minOrderQuantity: variant.minOrderQuantity,
                maxOrderQuantity: variant.maxOrderQuantity ?? undefined,
                deliveryTimeLabel: variant.deliveryTimeLabel ?? "",
                restockTimeDays: variant.restockTimeDays ?? undefined,
                isActive: variant.isActive,
            });
            return;
        }

        setForm({
            ...emptyForm,
            taxRate: defaultValues?.taxRate ?? emptyForm.taxRate,
            costPrice: defaultValues?.costPrice ?? emptyForm.costPrice,
            wholesaleNet: defaultValues?.wholesaleNet ?? emptyForm.wholesaleNet,
            retailNet: defaultValues?.retailNet ?? emptyForm.retailNet,
            isFeatured: defaultValues?.isFeatured ?? emptyForm.isFeatured,
            isFreeShipping:
                defaultValues?.isFreeShipping ?? emptyForm.isFreeShipping,
            isClearance: defaultValues?.isClearance ?? emptyForm.isClearance,
            minOrderQuantity:
                defaultValues?.minOrderQuantity ?? emptyForm.minOrderQuantity,
            maxOrderQuantity:
                defaultValues?.maxOrderQuantity ?? emptyForm.maxOrderQuantity,
            deliveryTimeLabel:
                defaultValues?.deliveryTimeLabel ?? emptyForm.deliveryTimeLabel,
            restockTimeDays:
                defaultValues?.restockTimeDays ?? emptyForm.restockTimeDays,
        });
    }, [variant, defaultValues]);

    const wholesaleGross = useMemo(() => {
        return Number(
            (form.wholesaleNet + (form.wholesaleNet * form.taxRate) / 100).toFixed(2)
        );
    }, [form.wholesaleNet, form.taxRate]);

    const retailGross = useMemo(() => {
        return Number(
            (form.retailNet + (form.retailNet * form.taxRate) / 100).toFixed(2)
        );
    }, [form.retailNet, form.taxRate]);

    const productWholesaleGross = useMemo(() => {
        return Number(
            (
                (defaultValues?.wholesaleNet ?? 0) +
                ((defaultValues?.wholesaleNet ?? 0) * (defaultValues?.taxRate ?? 0)) /
                100
            ).toFixed(2)
        );
    }, [defaultValues]);

    const productRetailGross = useMemo(() => {
        return Number(
            (
                (defaultValues?.retailNet ?? 0) +
                ((defaultValues?.retailNet ?? 0) * (defaultValues?.taxRate ?? 0)) /
                100
            ).toFixed(2)
        );
    }, [defaultValues]);

    const handleNumberChange = (
        field: keyof ProductVariantFormData,
        value: string
    ) => {
        if (value === "") {
            setForm((prev) => ({
                ...prev,
                [field]: 0,
            }));
            return;
        }

        const parsed = Number(value);

        setForm((prev) => ({
            ...prev,
            [field]: Number.isNaN(parsed) ? 0 : parsed,
        }));
    };

    const handleSubmit = useCallback(async () => {
        if (form.sku !== undefined && form.sku.trim() === "") {
            const payload = { ...form };
            delete payload.sku;
            await onSubmit({
                ...payload,
                size: payload.size?.trim() || undefined,
                color: payload.color?.trim() || undefined,
                deliveryTimeLabel: payload.deliveryTimeLabel?.trim() || undefined,
            });
            return;
        }

        await onSubmit({
            ...form,
            sku: form.sku?.trim() || undefined,
            size: form.size?.trim() || undefined,
            color: form.color?.trim() || undefined,
            deliveryTimeLabel: form.deliveryTimeLabel?.trim() || undefined,
        });
    }, [form, onSubmit]);

    useEffect(() => {
        if (submitTrigger === undefined) {
            return;
        }

        if (lastSubmitTriggerRef.current === undefined) {
            lastSubmitTriggerRef.current = submitTrigger;
            return;
        }

        if (submitTrigger !== lastSubmitTriggerRef.current) {
            lastSubmitTriggerRef.current = submitTrigger;
            void handleSubmit();
        }
    }, [submitTrigger, handleSubmit]);

    const isUsingProductDefault = (
        field: CommercialField | MerchandisingField | FulfillmentField
    ) => {
        if (!defaultValues) {
            return false;
        }

        return (form as any)[field] === (defaultValues as any)[field];
    };

    const resetToProductDefault = (
        field: CommercialField | MerchandisingField | FulfillmentField
    ) => {
        if (!defaultValues) {
            return;
        }

        setForm((prev) => ({
            ...prev,
            [field]: (defaultValues as any)[field],
        }));
    };

    const renderHeaderWithBadge = (
        label: string,
        field:
            | CommercialField
            | MerchandisingField
            | FulfillmentField,
        tooltip: string
    ) => {
        const inherited = isUsingProductDefault(field);

        return (
            <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-textPrimary">{label}</span>
                    <FieldTooltip text={tooltip} />
                </div>

                <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${inherited
                            ? "bg-card ring-1 ring-borderSoft text-textSecondary"
                            : "bg-infoSoft text-primary"
                        }`}
                >
                    {inherited ? "Same as product" : "Overridden"}
                </span>
            </div>
        );
    };

    const renderNumericDefaultHint = (
        field: CommercialField | FulfillmentField,
        value: number | null | undefined
    ) => {
        const inherited = isUsingProductDefault(field);

        return (
            <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                <span className={inherited ? "text-textSecondary" : "text-primary"}>
                    Product default: {value ?? 0}
                </span>

                {!inherited ? (
                    <button
                        type="button"
                        onClick={() => resetToProductDefault(field)}
                        className="inline-flex items-center gap-1 text-textSecondary transition hover:text-textPrimary"
                    >
                        <RotateCcw size={12} />
                        Reset
                    </button>
                ) : null}
            </div>
        );
    };

    const renderTextDefaultHint = (
        field: FulfillmentField,
        value: string | null | undefined
    ) => {
        const inherited = isUsingProductDefault(field);

        return (
            <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                <span className={inherited ? "text-textSecondary" : "text-primary"}>
                    Product default: {value || "-"}
                </span>

                {!inherited ? (
                    <button
                        type="button"
                        onClick={() => resetToProductDefault(field)}
                        className="inline-flex items-center gap-1 text-textSecondary transition hover:text-textPrimary"
                    >
                        <RotateCcw size={12} />
                        Reset
                    </button>
                ) : null}
            </div>
        );
    };

    const renderBooleanDefaultHint = (
        field: MerchandisingField,
        value: boolean | null | undefined
    ) => {
        const inherited = isUsingProductDefault(field);

        return (
            <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                <span className={inherited ? "text-textSecondary" : "text-primary"}>
                    Product default: {value ? "Yes" : "No"}
                </span>

                {!inherited ? (
                    <button
                        type="button"
                        onClick={() => resetToProductDefault(field)}
                        className="inline-flex items-center gap-1 text-textSecondary transition hover:text-textPrimary"
                    >
                        <RotateCcw size={12} />
                        Reset
                    </button>
                ) : null}
            </div>
        );
    };

    return (
        <div className="overflow-hidden rounded-[28px] border border-borderSoft bg-card shadow-sm">
            <div className="table-header px-6 py-5">
                <h4 className="text-xl font-semibold text-textPrimary">
                    {variant ? "Edit Variant" : "Add Variant"}
                </h4>
                <p className="mt-1 text-sm leading-6 text-textSecondary">
                    {variant
                        ? "Compare this variant against the product defaults and override only where needed."
                        : "New variants start from product defaults and can be adjusted here."}
                </p>
            </div>

            <div className="space-y-8 px-6 py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            SKU
                        </label>
                        <TextInput
                            value={form.sku || ""}
                            onChange={(value) =>
                                setForm((prev) => ({ ...prev, sku: value }))
                            }
                            placeholder="Leave empty to auto-generate"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Size
                        </label>
                        <TextInput
                            value={form.size || ""}
                            onChange={(value) =>
                                setForm((prev) => ({ ...prev, size: value }))
                            }
                            placeholder="e.g. M, L, XL"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Color
                        </label>
                        <TextInput
                            value={form.color || ""}
                            onChange={(value) =>
                                setForm((prev) => ({ ...prev, color: value }))
                            }
                            placeholder="e.g. Black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-textPrimary">
                            Status
                        </label>
                        <StatusSelect
                            value={form.isActive ? "ACTIVE" : "INACTIVE"}
                            onChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    isActive: value === "ACTIVE",
                                }))
                            }
                        />
                    </div>
                </div>

                <SectionBox
                    title="Variant Flags"
                    description="These flags inherit from the product by default and can be overridden for this variant."
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-card p-4 ring-1 ring-borderSoft">
                            {renderHeaderWithBadge(
                                "Featured Product",
                                "isFeatured",
                                "Highlight this variant in curated or promoted sections."
                            )}
                            <ToggleSwitch
                                checked={form.isFeatured}
                                onChange={(checked) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isFeatured: checked,
                                    }))
                                }
                                label="Enabled"
                            />
                            {renderBooleanDefaultHint("isFeatured", defaultValues?.isFeatured)}
                        </div>

                        <div className="rounded-2xl bg-card p-4 ring-1 ring-borderSoft">
                            {renderHeaderWithBadge(
                                "Free Shipping",
                                "isFreeShipping",
                                "Mark this variant as eligible for free shipping."
                            )}
                            <ToggleSwitch
                                checked={form.isFreeShipping}
                                onChange={(checked) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isFreeShipping: checked,
                                    }))
                                }
                                label="Enabled"
                            />
                            {renderBooleanDefaultHint(
                                "isFreeShipping",
                                defaultValues?.isFreeShipping
                            )}
                        </div>

                        <div className="rounded-2xl bg-card p-4 ring-1 ring-borderSoft">
                            {renderHeaderWithBadge(
                                "Clearance Sale",
                                "isClearance",
                                "Use this for end-of-line or clearance stock."
                            )}
                            <ToggleSwitch
                                checked={form.isClearance}
                                onChange={(checked) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isClearance: checked,
                                    }))
                                }
                                label="Enabled"
                            />
                            {renderBooleanDefaultHint(
                                "isClearance",
                                defaultValues?.isClearance
                            )}
                        </div>
                    </div>
                </SectionBox>

                <SectionBox
                    title="Commercial Values"
                    description="Product defaults are shown below each field. When the value differs, this variant is treated as overridden."
                >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            {renderHeaderWithBadge(
                                "Tax Rate %",
                                "taxRate",
                                "Default tax rate comes from the parent product. Change only if this variant truly differs."
                            )}
                            <TextInput
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.taxRate}
                                onChange={(value) => handleNumberChange("taxRate", value)}
                                className={
                                    isUsingProductDefault("taxRate")
                                        ? "text-textSecondary"
                                        : "text-textPrimary ring-2 ring-info/30"
                                }
                            />
                            {renderNumericDefaultHint("taxRate", defaultValues?.taxRate)}
                        </div>

                        <div>
                            {renderHeaderWithBadge(
                                "Cost Price",
                                "costPrice",
                                "Parent product default cost price for this variant."
                            )}
                            <TextInput
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.costPrice}
                                onChange={(value) => handleNumberChange("costPrice", value)}
                                className={
                                    isUsingProductDefault("costPrice")
                                        ? "text-textSecondary"
                                        : "text-textPrimary ring-2 ring-info/30"
                                }
                            />
                            {renderNumericDefaultHint("costPrice", defaultValues?.costPrice)}
                        </div>

                        <div>
                            {renderHeaderWithBadge(
                                "Wholesale Net",
                                "wholesaleNet",
                                "Parent product default wholesale net price."
                            )}
                            <TextInput
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.wholesaleNet}
                                onChange={(value) =>
                                    handleNumberChange("wholesaleNet", value)
                                }
                                className={
                                    isUsingProductDefault("wholesaleNet")
                                        ? "text-textSecondary"
                                        : "text-textPrimary ring-2 ring-info/30"
                                }
                            />
                            {renderNumericDefaultHint(
                                "wholesaleNet",
                                defaultValues?.wholesaleNet
                            )}
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-textPrimary">
                                    Wholesale Gross
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${isUsingProductDefault("wholesaleNet") &&
                                            isUsingProductDefault("taxRate")
                                            ? "bg-card ring-1 ring-borderSoft text-textSecondary"
                                            : "bg-infoSoft text-primary"
                                        }`}
                                >
                                    {isUsingProductDefault("wholesaleNet") &&
                                        isUsingProductDefault("taxRate")
                                        ? "Same as product"
                                        : "Overridden"}
                                </span>
                            </div>
                            <div className="flex h-12 items-center rounded-xl bg-card px-4 text-textSecondary ring-1 ring-borderSoft">
                                {formatNumber(wholesaleGross)}
                            </div>
                            <div className="mt-2 text-xs text-textSecondary">
                                Product default: {formatNumber(productWholesaleGross)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            {renderHeaderWithBadge(
                                "Retail Net",
                                "retailNet",
                                "Parent product default retail net price."
                            )}
                            <TextInput
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.retailNet}
                                onChange={(value) =>
                                    handleNumberChange("retailNet", value)
                                }
                                className={
                                    isUsingProductDefault("retailNet")
                                        ? "text-textSecondary"
                                        : "text-textPrimary ring-2 ring-info/30"
                                }
                            />
                            {renderNumericDefaultHint("retailNet", defaultValues?.retailNet)}
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-textPrimary">
                                    Retail Gross
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${isUsingProductDefault("retailNet") &&
                                            isUsingProductDefault("taxRate")
                                            ? "bg-card ring-1 ring-borderSoft text-textSecondary"
                                            : "bg-infoSoft text-primary"
                                        }`}
                                >
                                    {isUsingProductDefault("retailNet") &&
                                        isUsingProductDefault("taxRate")
                                        ? "Same as product"
                                        : "Overridden"}
                                </span>
                            </div>
                            <div className="flex h-12 items-center rounded-xl bg-card px-4 text-textSecondary ring-1 ring-borderSoft">
                                {formatNumber(retailGross)}
                            </div>
                            <div className="mt-2 text-xs text-textSecondary">
                                Product default: {formatNumber(productRetailGross)}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-textPrimary">
                                Stock
                            </label>
                            <TextInput
                                type="number"
                                min="0"
                                step="1"
                                value={form.stock}
                                onChange={(value) => handleNumberChange("stock", value)}
                            />
                        </div>
                    </div>
                </SectionBox>

                <SectionBox
                    title="Fulfillment & Order Rules"
                    description="These values also inherit from the product by default and can be overridden for this variant."
                >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            {renderHeaderWithBadge(
                                "Min Order Quantity",
                                "minOrderQuantity",
                                "Minimum quantity a buyer can purchase."
                            )}
                            <TextInput
                                type="number"
                                min="1"
                                step="1"
                                value={form.minOrderQuantity}
                                onChange={(value) =>
                                    handleNumberChange("minOrderQuantity", value)
                                }
                                className={
                                    isUsingProductDefault("minOrderQuantity")
                                        ? "text-textSecondary"
                                        : "text-textPrimary ring-2 ring-info/30"
                                }
                            />
                            {renderNumericDefaultHint(
                                "minOrderQuantity",
                                defaultValues?.minOrderQuantity
                            )}
                        </div>

                        <div>
                            {renderHeaderWithBadge(
                                "Max Order Quantity",
                                "maxOrderQuantity",
                                "Optional upper quantity limit per order."
                            )}
                            <TextInput
                                type="number"
                                min="1"
                                step="1"
                                value={
                                    form.maxOrderQuantity === undefined
                                        ? ""
                                        : form.maxOrderQuantity
                                }
                                onChange={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        maxOrderQuantity:
                                            value === "" ? undefined : Number(value),
                                    }))
                                }
                                placeholder="Optional"
                                className={
                                    isUsingProductDefault("maxOrderQuantity")
                                        ? "text-textSecondary"
                                        : "text-textPrimary ring-2 ring-info/30"
                                }
                            />
                            {renderNumericDefaultHint(
                                "maxOrderQuantity",
                                defaultValues?.maxOrderQuantity
                            )}
                        </div>

                        <div>
                            {renderHeaderWithBadge(
                                "Restock Time (days)",
                                "restockTimeDays",
                                "Manual restock lead time in days."
                            )}
                            <TextInput
                                type="number"
                                min="0"
                                step="1"
                                value={
                                    form.restockTimeDays === undefined
                                        ? ""
                                        : form.restockTimeDays
                                }
                                onChange={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        restockTimeDays:
                                            value === "" ? undefined : Number(value),
                                    }))
                                }
                                placeholder="Optional"
                                className={
                                    isUsingProductDefault("restockTimeDays")
                                        ? "text-textSecondary"
                                        : "text-textPrimary ring-2 ring-info/30"
                                }
                            />
                            {renderNumericDefaultHint(
                                "restockTimeDays",
                                defaultValues?.restockTimeDays
                            )}
                        </div>

                        <div>
                            {renderHeaderWithBadge(
                                "Delivery Time",
                                "deliveryTimeLabel",
                                "Merchant-defined label like 1-2 days or 3-5 days."
                            )}
                            <TextInput
                                value={form.deliveryTimeLabel || ""}
                                onChange={(value) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        deliveryTimeLabel: value,
                                    }))
                                }
                                placeholder="e.g. 3-5 days"
                                className={
                                    isUsingProductDefault("deliveryTimeLabel")
                                        ? "text-textSecondary"
                                        : "text-textPrimary ring-2 ring-info/30"
                                }
                            />
                            {renderTextDefaultHint(
                                "deliveryTimeLabel",
                                defaultValues?.deliveryTimeLabel
                            )}
                        </div>
                    </div>
                </SectionBox>
            </div>

            {!hideFooterActions ? (
                <div className="table-footer flex items-center justify-end gap-3 px-6 py-4">
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => void handleSubmit()}
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Save Variant"}
                    </Button>
                </div>
            ) : null}
        </div>
    );
}