"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Select from "@radix-ui/react-select";
import type {
    ChildProduct,
    ChildProductFormData,
} from "@/modules/products/api/productVariantApi";
import FieldTooltip from "@/components/ui/FieldTooltip";
import { Check, ChevronDown, Lock, Unlock } from "lucide-react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Button from "@/components/ui/Button";

interface ProductVariantFormProps {
    variant?: ChildProduct | null;
    defaultValues?: {
        currencyCode?: string;
        taxRate: number;
        costGross: number;
        costPrice: number;
        costNet?: number;
        wholesaleGross: number;
        wholesaleNet: number;
        retailGross: number;
        retailNet: number;
        stock: number;
        isFeatured: boolean;
        isFreeShipping: boolean;
        isClearance: boolean;
        minOrderQuantity: number;
        maxOrderQuantity?: number | null;
        deliveryTimeLabel?: string | null;
        restockTimeDays?: number | null;
    };
    lockedProductFields?: {
        brand: string;
        manufacturer: string;
        category: string;
        productType: string;
        productName?: string;
        productDescription?: string | null;
    };
    onSubmit: (data: ChildProductFormData) => Promise<void>;
    onCancel: () => void;
    submitting?: boolean;
    hideFooterActions?: boolean;
    submitTrigger?: number;
}

const emptyForm: ChildProductFormData = {
    sku: "",
    name: "",
    description: "",
    size: "",
    color: "",
    currencyCode: "INR",
    taxRate: 18,
    costGross: 0,
    costNet: 0,
    costPrice: 0,
    wholesaleGross: 0,
    wholesaleNet: 0,
    retailGross: 0,
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
    | "costGross"
    | "wholesaleGross"
    | "retailGross"
    | "stock";

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

function calculateNetFromGross(gross: number, taxRate: number) {
    if (taxRate <= -100) {
        return Number(gross.toFixed(2));
    }

    return Number((gross / (1 + taxRate / 100)).toFixed(2));
}

const INHERITABLE_FIELDS = [
    "name",
    "description",
    "taxRate",
    "costGross",
    "wholesaleGross",
    "retailGross",
    "stock",
    "isFeatured",
    "isFreeShipping",
    "isClearance",
    "minOrderQuantity",
    "maxOrderQuantity",
    "deliveryTimeLabel",
    "restockTimeDays",
] as const;

type InheritableField = (typeof INHERITABLE_FIELDS)[number];

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
    disabled = false,
}: {
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    min?: string | number;
    step?: string | number;
    className?: string;
    disabled?: boolean;
}) {
    return (
        <input
            type={type}
            min={min}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
                "h-12 w-full rounded-xl bg-card px-4 text-sm outline-none ring-1 ring-borderSoft transition",
                "placeholder:text-textSecondary focus:ring-2 focus:ring-borderFocus/30",
                disabled && "cursor-not-allowed bg-cardMuted text-textSecondary",
                className
            )}
        />
    );
}

function LockButton({
    locked,
    onClick,
    disabled = false,
}: {
    locked: boolean;
    onClick?: () => void;
    disabled?: boolean;
}) {
    const Icon = locked ? Lock : Unlock;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || !onClick}
            className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-lg ring-1 ring-borderSoft transition",
                locked
                    ? "bg-cardMuted text-textSecondary"
                    : "bg-infoSoft text-primary",
                onClick && !disabled && "hover:bg-card hover:text-textPrimary",
                (disabled || !onClick) && "cursor-not-allowed opacity-80"
            )}
            aria-label={locked ? "Unlock field" : "Lock field"}
        >
            <Icon size={14} />
        </button>
    );
}

function FieldHeader({
    label,
    tooltip,
    locked,
    onToggle,
    disabled = false,
}: {
    label: string;
    tooltip?: string;
    locked: boolean;
    onToggle?: () => void;
    disabled?: boolean;
}) {
    return (
        <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
                <LockButton locked={locked} onClick={onToggle} disabled={disabled} />
                <span className="truncate text-sm font-medium text-textPrimary">
                    {label}
                </span>
                {tooltip ? <FieldTooltip text={tooltip} /> : null}
            </div>
        </div>
    );
}

function PriceOverrideCard({
    title,
    grossValue,
    netValue,
    productGross,
    productNet,
    inherited,
    onGrossChange,
    onToggleLock,
}: {
    title: string;
    grossValue: number;
    netValue: number;
    productGross?: number | null;
    productNet?: number | null;
    inherited: boolean;
    onGrossChange: (value: string) => void;
    onToggleLock: () => void;
}) {
    return (
        <div className="rounded-2xl bg-card p-4 ring-1 ring-borderSoft">
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <LockButton locked={inherited} onClick={onToggleLock} />
                    <h5 className="text-sm font-semibold text-textPrimary">{title}</h5>
                </div>
                <p className="mt-1 text-xs text-textSecondary">
                    Enter gross. Net is calculated automatically.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-textPrimary">Gross</span>
                        <FieldTooltip text="Gross override entered by the brand owner." />
                    </div>
                    <TextInput
                        type="number"
                        min="0"
                        step="0.01"
                        value={grossValue}
                        onChange={onGrossChange}
                        disabled={inherited}
                        className={
                            inherited
                                ? "text-textSecondary"
                                : "text-textPrimary ring-2 ring-info/30"
                        }
                    />
                    {productGross !== undefined ? (
                        <div className="mt-2 text-xs text-textSecondary">
                            Product gross: {formatNumber(productGross ?? 0)}
                        </div>
                    ) : null}
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-textPrimary">Net</span>
                        <FieldTooltip text="Calculated from gross using the active tax rate." />
                    </div>
                    <div className="flex h-12 items-center rounded-xl bg-cardMuted px-4 text-sm text-textSecondary ring-1 ring-borderSoft">
                        {formatNumber(netValue)}
                    </div>
                    {productNet !== undefined ? (
                        <div className="mt-2 text-xs text-textSecondary">
                            Product net: {formatNumber(productNet ?? 0)}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
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
    lockedProductFields,
    onSubmit,
    onCancel,
    submitting = false,
    hideFooterActions = false,
    submitTrigger,
}: ProductVariantFormProps) {
    const [form, setForm] = useState<ChildProductFormData>(emptyForm);
    const [inheritedFields, setInheritedFields] = useState<Set<InheritableField>>(
        () => new Set(INHERITABLE_FIELDS)
    );
    const lastSubmitTriggerRef = useRef<number | undefined>(submitTrigger);

    useEffect(() => {
        if (variant) {
            const effective = variant.commercialEffective;
            const nextInheritedFields = new Set<InheritableField>();

            INHERITABLE_FIELDS.forEach((field) => {
                if (field === "name" || field === "description") {
                    return;
                }

                if (variant.commercialSource?.[field] === "PRODUCT") {
                    nextInheritedFields.add(field);
                }
            });

            if (variant.contentSource?.name !== "VARIANT") {
                nextInheritedFields.add("name");
            }

            if (variant.contentSource?.description !== "VARIANT") {
                nextInheritedFields.add("description");
            }

            setForm({
                sku: variant.sku || "",
                name:
                    variant.contentSource?.name === "VARIANT"
                        ? variant.name || ""
                        : lockedProductFields?.productName || variant.effectiveName || "",
                description:
                    variant.contentSource?.description === "VARIANT"
                        ? variant.description || ""
                        : lockedProductFields?.productDescription ||
                        variant.effectiveDescription ||
                        "",
                size: variant.size || "",
                color: variant.color || "",
                currencyCode: effective?.currencyCode ?? variant.currencyCode ?? "INR",
                taxRate: effective?.taxRate ?? variant.taxRate,
                costGross: effective?.costGross ?? variant.costGross ?? variant.costPrice,
                costNet: effective?.costNet ?? variant.costNet ?? variant.costPrice,
                costPrice: effective?.costNet ?? variant.costNet ?? variant.costPrice,
                wholesaleGross: effective?.wholesaleGross ?? variant.wholesaleGross,
                wholesaleNet: effective?.wholesaleNet ?? variant.wholesaleNet,
                retailGross: effective?.retailGross ?? variant.retailGross,
                retailNet: effective?.retailNet ?? variant.retailNet,
                stock: effective?.stock ?? variant.stock,
                isFeatured: effective?.isFeatured ?? variant.isFeatured,
                isFreeShipping: effective?.isFreeShipping ?? variant.isFreeShipping,
                isClearance: effective?.isClearance ?? variant.isClearance,
                minOrderQuantity:
                    effective?.minOrderQuantity ?? variant.minOrderQuantity,
                maxOrderQuantity:
                    effective?.maxOrderQuantity ?? variant.maxOrderQuantity ?? undefined,
                deliveryTimeLabel:
                    effective?.deliveryTimeLabel ?? variant.deliveryTimeLabel ?? "",
                restockTimeDays:
                    effective?.restockTimeDays ?? variant.restockTimeDays ?? undefined,
                isActive: variant.isActive,
            });
            setInheritedFields(nextInheritedFields);
            return;
        }

        setForm({
            ...emptyForm,
            name: "",
            description: "",
            currencyCode: defaultValues?.currencyCode ?? emptyForm.currencyCode,
            taxRate: defaultValues?.taxRate ?? emptyForm.taxRate,
            costGross: defaultValues?.costGross ?? emptyForm.costGross,
            costNet: defaultValues?.costNet ?? defaultValues?.costPrice ?? emptyForm.costNet,
            costPrice: defaultValues?.costNet ?? defaultValues?.costPrice ?? emptyForm.costPrice,
            wholesaleGross:
                defaultValues?.wholesaleGross ?? emptyForm.wholesaleGross,
            wholesaleNet: defaultValues?.wholesaleNet ?? emptyForm.wholesaleNet,
            retailGross: defaultValues?.retailGross ?? emptyForm.retailGross,
            retailNet: defaultValues?.retailNet ?? emptyForm.retailNet,
            stock: defaultValues?.stock ?? emptyForm.stock,
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
        setInheritedFields(new Set(INHERITABLE_FIELDS));
    }, [variant, defaultValues, lockedProductFields]);

    const costNet = useMemo(
        () => calculateNetFromGross(Number(form.costGross ?? 0), Number(form.taxRate ?? 0)),
        [form.costGross, form.taxRate]
    );

    const wholesaleNet = useMemo(
        () => calculateNetFromGross(Number(form.wholesaleGross ?? 0), Number(form.taxRate ?? 0)),
        [form.wholesaleGross, form.taxRate]
    );

    const retailNet = useMemo(
        () => calculateNetFromGross(Number(form.retailGross ?? 0), Number(form.taxRate ?? 0)),
        [form.retailGross, form.taxRate]
    );

    const getParentFieldValue = (field: InheritableField) => {
        if (field === "name") {
            return lockedProductFields?.productName ?? "";
        }

        if (field === "description") {
            return lockedProductFields?.productDescription ?? "";
        }

        return (defaultValues as any)?.[field];
    };

    const lockFieldToParent = (field: InheritableField) => {
        setForm((prev) => ({
            ...prev,
            [field]: getParentFieldValue(field),
        }));
        setInheritedFields((prev) => new Set(prev).add(field));
    };

    const unlockField = (field: InheritableField) => {
        setInheritedFields((prev) => {
            const next = new Set(prev);
            next.delete(field);
            return next;
        });
    };

    const toggleInheritedField = (field: InheritableField) => {
        if (inheritedFields.has(field)) {
            unlockField(field);
            return;
        }

        lockFieldToParent(field);
    };

    const markOverridden = (field: keyof ChildProductFormData) => {
        if (!INHERITABLE_FIELDS.includes(field as InheritableField)) {
            return;
        }

        unlockField(field as InheritableField);
    };

    const handleNumberChange = (
        field: keyof ChildProductFormData,
        value: string
    ) => {
        markOverridden(field);

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
        const commercialPayload: Partial<ChildProductFormData> = {
            currencyCode: inheritedFields.has("taxRate") ? null : form.currencyCode,
            taxRate: inheritedFields.has("taxRate") ? null : Number(form.taxRate ?? 0),
            costGross: inheritedFields.has("costGross")
                ? null
                : Number(form.costGross ?? 0),
            costNet: inheritedFields.has("costGross") ? null : costNet,
            costPrice: inheritedFields.has("costGross") ? null : costNet,
            wholesaleGross: inheritedFields.has("wholesaleGross")
                ? null
                : Number(form.wholesaleGross ?? 0),
            wholesaleNet: inheritedFields.has("wholesaleGross") ? null : wholesaleNet,
            retailGross: inheritedFields.has("retailGross")
                ? null
                : Number(form.retailGross ?? 0),
            retailNet: inheritedFields.has("retailGross") ? null : retailNet,
            stock: inheritedFields.has("stock") ? null : Number(form.stock ?? 0),
            isFeatured: inheritedFields.has("isFeatured")
                ? null
                : Boolean(form.isFeatured),
            isFreeShipping: inheritedFields.has("isFreeShipping")
                ? null
                : Boolean(form.isFreeShipping),
            isClearance: inheritedFields.has("isClearance")
                ? null
                : Boolean(form.isClearance),
            minOrderQuantity: inheritedFields.has("minOrderQuantity")
                ? null
                : Number(form.minOrderQuantity ?? 1),
            maxOrderQuantity: inheritedFields.has("maxOrderQuantity")
                ? null
                : form.maxOrderQuantity ?? null,
            deliveryTimeLabel: inheritedFields.has("deliveryTimeLabel")
                ? null
                : form.deliveryTimeLabel?.trim() || null,
            restockTimeDays: inheritedFields.has("restockTimeDays")
                ? null
                : form.restockTimeDays ?? null,
        };

        if (form.sku !== undefined && form.sku.trim() === "") {
            const payload = { ...form, ...commercialPayload };
            delete payload.sku;
            await onSubmit({
                ...payload,
                name: inheritedFields.has("name")
                    ? null
                    : payload.name?.trim() || null,
                description: inheritedFields.has("description")
                    ? null
                    : payload.description?.trim() || null,
                size: payload.size?.trim() || undefined,
                color: payload.color?.trim() || undefined,
            });
            return;
        }

        await onSubmit({
            ...form,
            ...commercialPayload,
            sku: form.sku?.trim() || undefined,
            name: inheritedFields.has("name") ? null : form.name?.trim() || null,
            description: inheritedFields.has("description")
                ? null
                : form.description?.trim() || null,
            size: form.size?.trim() || undefined,
            color: form.color?.trim() || undefined,
        });
    }, [costNet, form, inheritedFields, onSubmit, retailNet, wholesaleNet]);

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

        return inheritedFields.has(field as InheritableField);
    };

    const renderLockHeader = (
        label: string,
        field:
            | CommercialField
            | MerchandisingField
            | FulfillmentField,
        tooltip: string
    ) => {
        return (
            <FieldHeader
                label={label}
                tooltip={tooltip}
                locked={isUsingProductDefault(field)}
                onToggle={() => toggleInheritedField(field as InheritableField)}
            />
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
                {lockedProductFields ? (
                    <SectionBox
                        title="Parent-Owned Fields"
                        description="These stay locked on variants and are inherited from the product."
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {[
                                ["Brand", lockedProductFields.brand],
                                ["Manufacturer", lockedProductFields.manufacturer],
                                ["Category", lockedProductFields.category],
                                ["Product Type", lockedProductFields.productType],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-2xl bg-card p-4 ring-1 ring-borderSoft"
                                >
                                    <div className="flex items-center gap-2 text-xs font-medium uppercase text-textSecondary">
                                        <Lock size={13} />
                                        <span>{label}</span>
                                    </div>
                                    <div className="mt-1 truncate text-sm font-medium text-textPrimary">
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionBox>
                ) : null}

                <SectionBox
                    title="Variant Content"
                    description="Name and description inherit from the product until you add variant-specific copy."
                >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                            <FieldHeader
                                label="Variant Name"
                                locked={inheritedFields.has("name")}
                                onToggle={() => toggleInheritedField("name")}
                            />
                            <TextInput
                                value={form.name || ""}
                                onChange={(value) => {
                                    markOverridden("name");
                                    setForm((prev) => ({ ...prev, name: value }));
                                }}
                                disabled={inheritedFields.has("name")}
                                placeholder={lockedProductFields?.productName || "Same as product"}
                            />
                            <div className="mt-2 text-xs text-textSecondary">
                                Product default: {lockedProductFields?.productName || "-"}
                            </div>
                        </div>

                        <div>
                            <FieldHeader
                                label="Variant Description"
                                locked={inheritedFields.has("description")}
                                onToggle={() => toggleInheritedField("description")}
                            />
                            <textarea
                                value={form.description || ""}
                                disabled={inheritedFields.has("description")}
                                onChange={(event) => {
                                    markOverridden("description");
                                    setForm((prev) => ({
                                        ...prev,
                                        description: event.target.value,
                                    }));
                                }}
                                placeholder={
                                    lockedProductFields?.productDescription ||
                                    "Same as product"
                                }
                                rows={4}
                                className={cn(
                                    "w-full resize-y rounded-xl bg-card px-4 py-3 text-sm text-textPrimary outline-none ring-1 ring-borderSoft transition",
                                    "placeholder:text-textSecondary focus:ring-2 focus:ring-borderFocus/30",
                                    inheritedFields.has("description") &&
                                    "cursor-not-allowed bg-cardMuted text-textSecondary"
                                )}
                            />
                            <div className="mt-2 line-clamp-1 text-xs text-textSecondary">
                                Product default:{" "}
                                {lockedProductFields?.productDescription || "-"}
                            </div>
                        </div>
                    </div>
                </SectionBox>

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
                            {renderLockHeader(
                                "Featured Product",
                                "isFeatured",
                                "Highlight this variant in curated or promoted sections."
                            )}
                            <ToggleSwitch
                                checked={Boolean(form.isFeatured)}
                                disabled={isUsingProductDefault("isFeatured")}
                                onChange={(checked) => {
                                    markOverridden("isFeatured");
                                    setForm((prev) => ({
                                        ...prev,
                                        isFeatured: checked,
                                    }));
                                }}
                                label="Enabled"
                            />
                            {renderBooleanDefaultHint("isFeatured", defaultValues?.isFeatured)}
                        </div>

                        <div className="rounded-2xl bg-card p-4 ring-1 ring-borderSoft">
                            {renderLockHeader(
                                "Free Shipping",
                                "isFreeShipping",
                                "Mark this variant as eligible for free shipping."
                            )}
                            <ToggleSwitch
                                checked={Boolean(form.isFreeShipping)}
                                disabled={isUsingProductDefault("isFreeShipping")}
                                onChange={(checked) => {
                                    markOverridden("isFreeShipping");
                                    setForm((prev) => ({
                                        ...prev,
                                        isFreeShipping: checked,
                                    }));
                                }}
                                label="Enabled"
                            />
                            {renderBooleanDefaultHint(
                                "isFreeShipping",
                                defaultValues?.isFreeShipping
                            )}
                        </div>

                        <div className="rounded-2xl bg-card p-4 ring-1 ring-borderSoft">
                            {renderLockHeader(
                                "Clearance Sale",
                                "isClearance",
                                "Use this for end-of-line or clearance stock."
                            )}
                            <ToggleSwitch
                                checked={Boolean(form.isClearance)}
                                disabled={isUsingProductDefault("isClearance")}
                                onChange={(checked) => {
                                    markOverridden("isClearance");
                                    setForm((prev) => ({
                                        ...prev,
                                        isClearance: checked,
                                    }));
                                }}
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
                    description="Variants inherit product prices until a gross value is changed. Net values are calculated from gross and tax rate."
                >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            {renderLockHeader(
                                "Tax Rate %",
                                "taxRate",
                                "Default tax rate comes from the parent product. Change only if this variant truly differs."
                            )}
                            <TextInput
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.taxRate ?? 0}
                                onChange={(value) => handleNumberChange("taxRate", value)}
                                disabled={isUsingProductDefault("taxRate")}
                                className={
                                    isUsingProductDefault("taxRate")
                                        ? "text-textSecondary"
                                        : "text-textPrimary ring-2 ring-info/30"
                                }
                            />
                            {renderNumericDefaultHint("taxRate", defaultValues?.taxRate)}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
                        <PriceOverrideCard
                            title="Cost"
                            grossValue={Number(form.costGross ?? 0)}
                            netValue={costNet}
                            productGross={defaultValues?.costGross}
                            productNet={defaultValues?.costNet ?? defaultValues?.costPrice}
                            inherited={isUsingProductDefault("costGross")}
                            onGrossChange={(value) => handleNumberChange("costGross", value)}
                            onToggleLock={() => toggleInheritedField("costGross")}
                        />

                        <PriceOverrideCard
                            title="Wholesale"
                            grossValue={Number(form.wholesaleGross ?? 0)}
                            netValue={wholesaleNet}
                            productGross={defaultValues?.wholesaleGross}
                            productNet={defaultValues?.wholesaleNet}
                            inherited={isUsingProductDefault("wholesaleGross")}
                            onGrossChange={(value) =>
                                handleNumberChange("wholesaleGross", value)
                            }
                            onToggleLock={() => toggleInheritedField("wholesaleGross")}
                        />

                        <PriceOverrideCard
                            title="Retail"
                            grossValue={Number(form.retailGross ?? 0)}
                            netValue={retailNet}
                            productGross={defaultValues?.retailGross}
                            productNet={defaultValues?.retailNet}
                            inherited={isUsingProductDefault("retailGross")}
                            onGrossChange={(value) => handleNumberChange("retailGross", value)}
                            onToggleLock={() => toggleInheritedField("retailGross")}
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            {renderLockHeader(
                                "Stock",
                                "stock",
                                "Variant stock can inherit from the product or override it."
                            )}
                            <TextInput
                                type="number"
                                min="0"
                                step="1"
                                value={form.stock ?? 0}
                                onChange={(value) => handleNumberChange("stock", value)}
                                disabled={isUsingProductDefault("stock")}
                                className={
                                    isUsingProductDefault("stock")
                                        ? "text-textSecondary"
                                        : "text-textPrimary ring-2 ring-info/30"
                                }
                            />
                            {renderNumericDefaultHint("stock", defaultValues?.stock)}
                        </div>

                    </div>
                </SectionBox>

                <SectionBox
                    title="Fulfillment & Order Rules"
                    description="These values also inherit from the product by default and can be overridden for this variant."
                >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            {renderLockHeader(
                                "Min Order Quantity",
                                "minOrderQuantity",
                                "Minimum quantity a buyer can purchase."
                            )}
                            <TextInput
                                type="number"
                                min="1"
                                step="1"
                                value={form.minOrderQuantity ?? 1}
                                onChange={(value) =>
                                    handleNumberChange("minOrderQuantity", value)
                                }
                                disabled={isUsingProductDefault("minOrderQuantity")}
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
                            {renderLockHeader(
                                "Max Order Quantity",
                                "maxOrderQuantity",
                                "Optional upper quantity limit per order."
                            )}
                            <TextInput
                                type="number"
                                min="1"
                                step="1"
                                value={
                                    form.maxOrderQuantity === undefined ||
                                        form.maxOrderQuantity === null
                                        ? ""
                                        : form.maxOrderQuantity
                                }
                                onChange={(value) => {
                                    markOverridden("maxOrderQuantity");
                                    setForm((prev) => ({
                                        ...prev,
                                        maxOrderQuantity:
                                            value === "" ? undefined : Number(value),
                                    }));
                                }}
                                placeholder="Optional"
                                disabled={isUsingProductDefault("maxOrderQuantity")}
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
                            {renderLockHeader(
                                "Restock Time (days)",
                                "restockTimeDays",
                                "Manual restock lead time in days."
                            )}
                            <TextInput
                                type="number"
                                min="0"
                                step="1"
                                value={
                                    form.restockTimeDays === undefined ||
                                        form.restockTimeDays === null
                                        ? ""
                                        : form.restockTimeDays
                                }
                                onChange={(value) => {
                                    markOverridden("restockTimeDays");
                                    setForm((prev) => ({
                                        ...prev,
                                        restockTimeDays:
                                            value === "" ? undefined : Number(value),
                                    }));
                                }}
                                placeholder="Optional"
                                disabled={isUsingProductDefault("restockTimeDays")}
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
                            {renderLockHeader(
                                "Delivery Time",
                                "deliveryTimeLabel",
                                "Merchant-defined label like 1-2 days or 3-5 days."
                            )}
                            <TextInput
                                value={form.deliveryTimeLabel || ""}
                                onChange={(value) => {
                                    markOverridden("deliveryTimeLabel");
                                    setForm((prev) => ({
                                        ...prev,
                                        deliveryTimeLabel: value,
                                    }));
                                }}
                                placeholder="e.g. 3-5 days"
                                disabled={isUsingProductDefault("deliveryTimeLabel")}
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
