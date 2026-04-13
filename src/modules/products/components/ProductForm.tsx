"use client";

import { useEffect, useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Select from "@radix-ui/react-select";
import {
    Check,
    ChevronDown,
    ChevronRight,
    ChevronsUpDown,
    Search,
    X,
} from "lucide-react";

import type {
    ProductFormData,
    ProductOption,
    ProductType,
} from "@/modules/products/types/product";
import FieldTooltip from "@/components/ui/FieldTooltip";
import RichTextEditor from "@/components/ui/RichTextEditor";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface ProductFormProps {
    form: ProductFormData;
    brands: ProductOption[];
    categories: ProductOption[];
    manufacturers: ProductOption[];
    onChange: (
        field: keyof ProductFormData,
        value: string | string[] | boolean
    ) => void;
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function SectionCard({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
            <div className="border-b border-borderSoft px-6 py-4">
                <h4 className="text-lg font-semibold text-textPrimary">{title}</h4>
                {description ? (
                    <p className="mt-1 text-sm text-textSecondary">{description}</p>
                ) : null}
            </div>

            <div className="space-y-6 px-6 py-6">{children}</div>
        </div>
    );
}

function FieldLabel({
    label,
    tooltip,
}: {
    label: string;
    tooltip?: string;
}) {
    return (
        <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-textPrimary">{label}</span>
            {tooltip ? <FieldTooltip text={tooltip} /> : null}
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
            value={value}
            min={min}
            step={step}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
                "h-12 w-full rounded-xl bg-card px-4 text-sm text-textPrimary outline-none ring-1 ring-borderSoft transition",
                "placeholder:text-textSecondary focus:ring-2 focus:ring-borderFocus/30",
                className
            )}
        />
    );
}

function ReadonlyValue({
    value,
}: {
    value: string | number;
}) {
    return (
        <div className="flex h-12 items-center rounded-xl bg-cardMuted px-4 text-sm text-textSecondary ring-1 ring-borderSoft">
            {value}
        </div>
    );
}

const ALL_SENTINEL = "__placeholder__";

function AppSelect({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ label: string; value: string }>;
    placeholder: string;
}) {
    const normalizedValue = value || ALL_SENTINEL;

    const normalizedOptions = [
        { label: placeholder, value: ALL_SENTINEL },
        ...options,
    ];

    const selectedLabel =
        normalizedOptions.find((item) => item.value === normalizedValue)?.label ??
        placeholder;

    return (
        <Select.Root
            value={normalizedValue}
            onValueChange={(nextValue) =>
                onChange(nextValue === ALL_SENTINEL ? "" : nextValue)
            }
        >
            <Select.Trigger className="interactive-button flex h-12 w-full items-center justify-between rounded-xl bg-card px-4 text-left text-sm text-textPrimary ring-1 ring-borderSoft shadow-sm hover:bg-cardMuted">
                <Select.Value>{selectedLabel}</Select.Value>
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
                        {normalizedOptions.map((option) => (
                            <Select.Item
                                key={option.value}
                                value={option.value}
                                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2.5 text-sm text-textPrimary outline-none transition hover:bg-cardMuted focus:bg-cardMuted data-[state=checked]:bg-cardMuted"
                            >
                                <Select.ItemText>{option.label}</Select.ItemText>
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

type CategoryFlatOption = {
    id: string;
    name: string;
    path: string;
    parentId: string | null;
    children?: ProductOption[];
};

function buildCategoryMap(nodes: ProductOption[]) {
    const map = new Map<string, ProductOption>();

    const visit = (items: ProductOption[]) => {
        items.forEach((item) => {
            map.set(item.id, item);
            if (item.children?.length) {
                visit(item.children);
            }
        });
    };

    visit(nodes);
    return map;
}

function buildParentMap(nodes: ProductOption[]) {
    const map = new Map<string, string | null>();

    const visit = (items: ProductOption[], parentId: string | null = null) => {
        items.forEach((item) => {
            map.set(item.id, parentId);
            if (item.children?.length) {
                visit(item.children, item.id);
            }
        });
    };

    visit(nodes);
    return map;
}

function filterTree(nodes: ProductOption[], search: string): ProductOption[] {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
        return nodes;
    }

    return nodes
        .map((node) => {
            const filteredChildren = node.children?.length
                ? filterTree(node.children, normalizedSearch)
                : [];

            const matchesSelf = node.name.toLowerCase().includes(normalizedSearch);

            if (matchesSelf || filteredChildren.length) {
                return {
                    ...node,
                    children: filteredChildren,
                };
            }

            return null;
        })
        .filter(Boolean) as ProductOption[];
}

export default function ProductForm({
    form,
    brands,
    categories,
    manufacturers,
    onChange,
}: ProductFormProps) {
    const [categorySearch, setCategorySearch] = useState("");
    const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const selectedCategoryMap = useMemo(() => buildCategoryMap(categories), [categories]);
    const parentMap = useMemo(() => buildParentMap(categories), [categories]);

    const selectedCategories = form.categoryIds
        .map((id) => selectedCategoryMap.get(id))
        .filter(Boolean) as ProductOption[];

    const visuallySelectedIds = useMemo(() => {
        const result = new Set<string>();

        for (const categoryId of form.categoryIds) {
            let currentId: string | null | undefined = categoryId;

            while (currentId) {
                result.add(currentId);
                currentId = parentMap.get(currentId) ?? null;
            }
        }

        return result;
    }, [form.categoryIds, parentMap]);

    useEffect(() => {
        const nextExpandedIds = new Set<string>();

        for (const categoryId of form.categoryIds) {
            let currentParentId = parentMap.get(categoryId);

            while (currentParentId) {
                nextExpandedIds.add(currentParentId);
                currentParentId = parentMap.get(currentParentId) ?? null;
            }
        }

        setExpandedIds((prev) => {
            const merged = new Set([...prev, ...nextExpandedIds]);
            return [...merged];
        });
    }, [form.categoryIds, parentMap]);

    const brandOptions = useMemo(
        () =>
            brands.map((brand) => ({
                label: brand.name,
                value: brand.id,
            })),
        [brands]
    );

    const manufacturerOptions = useMemo(
        () =>
            manufacturers.map((m) => ({
                label: m.name,
                value: m.id,
            })),
        [manufacturers]
    );

    const productTypeOptions = useMemo(
        () => [
            { label: "Physical", value: "PHYSICAL" },
            { label: "Digital", value: "DIGITAL" },
            { label: "Service", value: "SERVICE" },
            { label: "Other", value: "OTHER" },
        ],
        []
    );

    const primaryCategoryOptions = useMemo(
        () =>
            selectedCategories.map((category) => ({
                label: category.name,
                value: category.id,
            })),
        [selectedCategories]
    );

    const filteredCategories = useMemo(() => {
        return filterTree(categories, categorySearch);
    }, [categories, categorySearch]);

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

    const handleNumberChange = (
        field: keyof ProductFormData,
        value: string
    ) => {
        if (value === "") {
            onChange(field, "0");
            return;
        }

        const parsed = Number(value);
        onChange(field, String(Number.isNaN(parsed) ? 0 : parsed));
    };

    const toggleExpanded = (categoryId: string) => {
        setExpandedIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const toggleCategorySelection = (categoryId: string) => {
        const isSelected = form.categoryIds.includes(categoryId);

        if (isSelected) {
            const nextCategoryIds = form.categoryIds.filter((id) => id !== categoryId);
            onChange("categoryIds", nextCategoryIds);

            if (form.categoryId === categoryId) {
                onChange("categoryId", nextCategoryIds[0] || "");
            }

            return;
        }

        const nextCategoryIds = [...form.categoryIds, categoryId];
        onChange("categoryIds", nextCategoryIds);

        if (!form.categoryId) {
            onChange("categoryId", categoryId);
        }
    };

    const removeSelectedCategory = (categoryId: string) => {
        const nextCategoryIds = form.categoryIds.filter((id) => id !== categoryId);
        onChange("categoryIds", nextCategoryIds);

        if (form.categoryId === categoryId) {
            onChange("categoryId", nextCategoryIds[0] || "");
        }
    };

    const renderCategoryNode = (category: ProductOption, level = 0) => {
        const hasChildren = !!category.children?.length;
        const isExpanded = expandedIds.includes(category.id);
        const isActuallySelected = form.categoryIds.includes(category.id);
        const isVisuallySelected = visuallySelectedIds.has(category.id);
        const isPrimary = form.categoryId === category.id;

        return (
            <div key={category.id}>
                <div
                    className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2 transition",
                        isActuallySelected
                            ? "bg-infoSoft"
                            : isVisuallySelected
                                ? "bg-cardMuted"
                                : "hover:bg-cardMuted"
                    )}
                    style={{ paddingLeft: `${12 + level * 18}px` }}
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => hasChildren && toggleExpanded(category.id)}
                            className="flex h-5 w-5 items-center justify-center text-textSecondary"
                        >
                            {hasChildren ? (
                                isExpanded ? (
                                    <ChevronDown size={14} />
                                ) : (
                                    <ChevronRight size={14} />
                                )
                            ) : (
                                <span className="block h-5 w-5" />
                            )}
                        </button>

                        <input
                            type="checkbox"
                            checked={isActuallySelected}
                            onChange={() => toggleCategorySelection(category.id)}
                            className="h-4 w-4 rounded border-borderSoft"
                        />

                        <span
                            className={cn(
                                "truncate text-sm",
                                isActuallySelected
                                    ? "font-medium text-primary"
                                    : "text-textPrimary"
                            )}
                        >
                            {category.name}
                        </span>
                    </div>

                    <div className="ml-3 flex items-center gap-2">
                        {isPrimary ? (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                Primary
                            </span>
                        ) : null}

                        <span
                            className={cn(
                                "h-2.5 w-2.5 rounded-full",
                                isActuallySelected
                                    ? "bg-success"
                                    : isVisuallySelected
                                        ? "bg-info"
                                        : "bg-textMuted"
                            )}
                        />
                    </div>
                </div>

                {hasChildren && isExpanded ? (
                    <div>
                        {category.children!.map((child) =>
                            renderCategoryNode(child, level + 1)
                        )}
                    </div>
                ) : null}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <SectionCard title="General Information">
                <div className="space-y-6">
                    <div>
                        <FieldLabel label="Name" />
                        <TextInput
                            value={form.name}
                            onChange={(value) => onChange("name", value)}
                            placeholder="Product name"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            <FieldLabel label="Brand" />
                            <AppSelect
                                value={form.brandId}
                                onChange={(value) => onChange("brandId", value)}
                                options={brandOptions}
                                placeholder="Select brand"
                            />
                        </div>

                        <div>
                            <FieldLabel
                                label="Product Code"
                                tooltip="Product code is auto-suggested on create, but you can still edit it manually."
                            />
                            <TextInput
                                value={form.productCode}
                                onChange={(value) => onChange("productCode", value)}
                                placeholder="Product code"
                            />
                        </div>

                        <div>
                            <FieldLabel
                                label="Product Type"
                                tooltip="Use PHYSICAL for normal shippable products. DIGITAL and SERVICE can later drive storefront and fulfillment behavior."
                            />
                            <AppSelect
                                value={form.productType}
                                onChange={(value) =>
                                    onChange("productType", value as ProductType)
                                }
                                options={productTypeOptions}
                                placeholder="Select product type"
                            />
                        </div>
                        <div>
                            <FieldLabel
                                label="Manufacturer"
                                tooltip="Select the manufacturer who produces this product. This helps in supplier management and analytics."
                            />

                            {manufacturerOptions.length === 0 ? (
                                <div className="rounded-xl bg-cardMuted px-4 py-3 text-sm text-textSecondary ring-1 ring-borderSoft">
                                    No manufacturers found. Create one from the Manufacturers section.
                                </div>
                            ) : (
                                <AppSelect
                                    value={form.manufacturerId}
                                    onChange={(value) => onChange("manufacturerId", value)}
                                    options={manufacturerOptions}
                                    placeholder="Select manufacturer"
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                            <FieldLabel
                                label="Categories"
                                tooltip="Assign multiple categories to this product. If a child category is selected, its parent path is highlighted visually in the tree."
                            />

                            <Popover.Root
                                open={categoryPopoverOpen}
                                onOpenChange={setCategoryPopoverOpen}
                            >
                                <Popover.Trigger asChild>
                                    <button
                                        type="button"
                                        className="interactive-button flex min-h-[52px] w-full flex-wrap items-center justify-between gap-3 rounded-xl bg-card px-3 py-2 text-left outline-none ring-1 ring-borderSoft transition hover:bg-cardMuted"
                                    >
                                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                                            {selectedCategories.length ? (
                                                selectedCategories.map((category) => {
                                                    const isPrimary = form.categoryId === category.id;

                                                    return (
                                                        <span
                                                            key={category.id}
                                                            className={cn(
                                                                "inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1 text-sm",
                                                                isPrimary
                                                                    ? "bg-infoSoft text-primary ring-1 ring-primary/20"
                                                                    : "bg-cardMuted text-textPrimary ring-1 ring-borderSoft"
                                                            )}
                                                        >
                                                            <span className="truncate">
                                                                {category.name}
                                                            </span>

                                                            {isPrimary ? (
                                                                <span className="text-[11px] font-medium">
                                                                    Primary
                                                                </span>
                                                            ) : null}

                                                            <span
                                                                role="button"
                                                                tabIndex={-1}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    removeSelectedCategory(category.id);
                                                                }}
                                                                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-textSecondary transition hover:bg-dangerSoft hover:text-danger"
                                                            >
                                                                <X size={12} />
                                                            </span>
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-textSecondary">
                                                    Assign categories to...
                                                </span>
                                            )}
                                        </div>

                                        <ChevronsUpDown
                                            size={16}
                                            className="shrink-0 text-textSecondary"
                                        />
                                    </button>
                                </Popover.Trigger>

                                <Popover.Portal>
                                    <Popover.Content
                                        align="start"
                                        sideOffset={8}
                                        collisionPadding={12}
                                        className="z-[9999] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-2xl border border-borderSoft bg-elevated shadow-md"
                                    >
                                        <div className="border-b border-borderSoft p-3">
                                            <div className="flex items-center gap-2 rounded-xl bg-card px-3 ring-1 ring-borderSoft">
                                                <Search size={14} className="text-textSecondary" />
                                                <input
                                                    type="text"
                                                    value={categorySearch}
                                                    onChange={(e) =>
                                                        setCategorySearch(e.target.value)
                                                    }
                                                    placeholder="Search categories..."
                                                    className="h-11 w-full bg-transparent text-sm text-textPrimary outline-none placeholder:text-textSecondary"
                                                />
                                            </div>
                                        </div>

                                        <div className="max-h-[340px] overflow-auto p-2">
                                            {filteredCategories.length ? (
                                                filteredCategories.map((category) =>
                                                    renderCategoryNode(category)
                                                )
                                            ) : (
                                                <div className="px-3 py-6 text-sm text-textSecondary">
                                                    No categories found.
                                                </div>
                                            )}
                                        </div>
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>
                        </div>

                        <div className="lg:col-span-4">
                            <FieldLabel
                                label="Primary Category"
                                tooltip="This is the default category used for the main product classification, storefront navigation, and future SEO/canonical logic."
                            />
                            <AppSelect
                                value={form.categoryId}
                                onChange={(value) => onChange("categoryId", value)}
                                options={primaryCategoryOptions}
                                placeholder="Select primary"
                            />
                        </div>
                    </div>

                    <div>
                        <FieldLabel
                            label="Description"
                            tooltip="Add detailed product description with formatting, links, and lists."
                        />

                        <RichTextEditor
                            value={form.description}
                            onChange={(html) => onChange("description", html)}
                            placeholder="Write product description..."
                        />
                    </div>
                </div>
            </SectionCard>

            <SectionCard
                title="Product Flags"
                description="Merchandising flags used for listing, promotion, and future storefront behavior."
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-cardMuted px-4 py-4 ring-1 ring-borderSoft">
                        <ToggleSwitch
                            checked={form.isFeatured}
                            onChange={(checked) => onChange("isFeatured", checked)}
                            label="Featured Product"
                            description="Highlight this product in curated or promoted sections."
                        />
                    </div>

                    <div className="rounded-2xl bg-cardMuted px-4 py-4 ring-1 ring-borderSoft">
                        <ToggleSwitch
                            checked={form.isFreeShipping}
                            onChange={(checked) => onChange("isFreeShipping", checked)}
                            label="Free Shipping"
                            description="Mark this product as eligible for free shipping."
                        />
                    </div>

                    <div className="rounded-2xl bg-cardMuted px-4 py-4 ring-1 ring-borderSoft">
                        <ToggleSwitch
                            checked={form.isClearance}
                            onChange={(checked) => onChange("isClearance", checked)}
                            label="Clearance Sale"
                            description="Use this for end-of-line or clearance stock."
                        />
                    </div>
                </div>
            </SectionCard>

            <SectionCard
                title="Price Settings"
                description="These values act as default commercial values for new variants. Variants can override them later if needed."
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            <FieldLabel
                                label="Tax Rate %"
                                tooltip="Default product tax rate. New variants will start with this value."
                            />
                            <TextInput
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.taxRate}
                                onChange={(value) => handleNumberChange("taxRate", value)}
                            />
                        </div>

                        <div>
                            <FieldLabel
                                label="Cost Price"
                                tooltip="Default cost price for the product. New variants can inherit and override it."
                            />
                            <TextInput
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.costPrice}
                                onChange={(value) => handleNumberChange("costPrice", value)}
                            />
                        </div>

                        <div>
                            <FieldLabel
                                label="Wholesale Net"
                                tooltip="Default wholesale net price for new variants."
                            />
                            <TextInput
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.wholesaleNet}
                                onChange={(value) => handleNumberChange("wholesaleNet", value)}
                            />
                        </div>

                        <div>
                            <FieldLabel
                                label="Wholesale Gross"
                                tooltip="Calculated automatically from wholesale net and tax rate."
                            />
                            <ReadonlyValue value={wholesaleGross} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            <FieldLabel
                                label="Retail Net"
                                tooltip="Default retail net price for new variants."
                            />
                            <TextInput
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.retailNet}
                                onChange={(value) => handleNumberChange("retailNet", value)}
                            />
                        </div>

                        <div>
                            <FieldLabel
                                label="Retail Gross"
                                tooltip="Calculated automatically from retail net and tax rate."
                            />
                            <ReadonlyValue value={retailGross} />
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard
                title="Inventory & Fulfillment"
                description="Product-level stock is meaningful for standalone products. When variants exist, storefront and orders should use variant stock."
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div>
                            <FieldLabel
                                label="Stock"
                                tooltip="Use this for standalone products. For products with variants, variant stock is the actual sellable stock."
                            />
                            <TextInput
                                type="number"
                                min="0"
                                step="1"
                                value={form.stock}
                                onChange={(value) => handleNumberChange("stock", value)}
                            />
                        </div>

                        <div>
                            <FieldLabel
                                label="Min Order Quantity"
                                tooltip="Smallest quantity a buyer can order."
                            />
                            <TextInput
                                type="number"
                                min="1"
                                step="1"
                                value={form.minOrderQuantity}
                                onChange={(value) =>
                                    handleNumberChange("minOrderQuantity", value)
                                }
                            />
                        </div>

                        <div>
                            <FieldLabel
                                label="Max Order Quantity"
                                tooltip="Optional upper order limit per purchase."
                            />
                            <TextInput
                                type="number"
                                min="1"
                                step="1"
                                value={form.maxOrderQuantity === "" ? "" : form.maxOrderQuantity}
                                onChange={(value) =>
                                    onChange("maxOrderQuantity", value === "" ? "" : value)
                                }
                                placeholder="Optional"
                            />
                        </div>

                        <div>
                            <FieldLabel
                                label="Restock Time (days)"
                                tooltip="Manual restock lead time in days, e.g. 1, 3, 5."
                            />
                            <TextInput
                                type="number"
                                min="0"
                                step="1"
                                value={form.restockTimeDays === "" ? "" : form.restockTimeDays}
                                onChange={(value) =>
                                    onChange("restockTimeDays", value === "" ? "" : value)
                                }
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                            <FieldLabel
                                label="Delivery Time"
                                tooltip="Merchant-defined label like 1-2 days, 3-5 days, 5-7 days."
                            />
                            <TextInput
                                value={form.deliveryTimeLabel}
                                onChange={(value) => onChange("deliveryTimeLabel", value)}
                                placeholder="e.g. 3-5 days"
                            />
                        </div>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}