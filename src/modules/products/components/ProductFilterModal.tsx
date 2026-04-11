"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import FilterModal from "@/components/ui/FilterModal";
import Button from "@/components/ui/Button";
import type { ProductOption } from "@/modules/products/types/product";
import type { ProductListFilters } from "@/modules/products/store/productStore";

interface ProductFilterModalProps {
    open: boolean;
    onClose: () => void;
    onApply: (filters: Partial<ProductListFilters>) => void;
    onReset: () => void;
    categories: ProductOption[];
    brands: ProductOption[];
    initialFilters: ProductListFilters;
    total: number;
}

interface MultiSelectDropdownOption {
    label: string;
    value: string;
}

interface MultiSelectDropdownProps {
    label: string;
    options: MultiSelectDropdownOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    helperText?: string;
    allLabel?: string;
}

interface SingleSelectOption {
    label: string;
    value: string;
}

interface AppSelectProps {
    label: string;
    value: string;
    options: SingleSelectOption[];
    onChange: (value: string) => void;
}

const ALL_SENTINEL = "__all__";

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function flattenCategoryOptions(
    items: ProductOption[],
    parentPath = ""
): MultiSelectDropdownOption[] {
    const result: MultiSelectDropdownOption[] = [];

    items.forEach((item) => {
        const currentPath = parentPath ? `${parentPath} / ${item.name}` : item.name;

        result.push({
            label: currentPath,
            value: item.id,
        });

        if (item.children?.length) {
            result.push(...flattenCategoryOptions(item.children, currentPath));
        }
    });

    return result;
}

function MultiSelectDropdown({
    label,
    options,
    selectedValues,
    onChange,
    helperText,
    allLabel = "All",
}: MultiSelectDropdownProps) {
    const selectedOptions = useMemo(
        () => options.filter((option) => selectedValues.includes(option.value)),
        [options, selectedValues]
    );

    const toggleValue = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((item) => item !== value));
            return;
        }

        onChange([...selectedValues, value]);
    };

    const removeValue = (
        event: React.MouseEvent<HTMLButtonElement>,
        value: string
    ) => {
        event.preventDefault();
        event.stopPropagation();
        onChange(selectedValues.filter((item) => item !== value));
    };

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-textPrimary">
                {label}
            </label>

            <DropdownMenu.Root modal={false}>
                <DropdownMenu.Trigger asChild>
                    <div
                        role="button"
                        tabIndex={0}
                        className="interactive-button flex min-h-14 w-full cursor-pointer items-center justify-between rounded-xl bg-card px-4 py-3 text-left text-sm text-textPrimary ring-1 ring-borderSoft shadow-sm hover:bg-cardMuted"
                    >
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                            {selectedOptions.length === 0 ? (
                                <span className="text-textPrimary">{allLabel}</span>
                            ) : selectedOptions.length <= 3 ? (
                                selectedOptions.map((option) => (
                                    <span
                                        key={option.value}
                                        className="inline-flex max-w-full items-center gap-1 rounded-full bg-infoSoft px-2.5 py-1 text-xs font-medium text-info"
                                    >
                                        <span className="truncate">{option.label}</span>

                                        <button
                                            type="button"
                                            onClick={(event) => removeValue(event, option.value)}
                                            className="inline-flex h-4 w-4 items-center justify-center rounded-full text-info transition hover:bg-dangerSoft hover:text-danger"
                                            aria-label={`Remove ${option.label}`}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <>
                                    {selectedOptions.slice(0, 2).map((option) => (
                                        <span
                                            key={option.value}
                                            className="inline-flex max-w-full items-center gap-1 rounded-full bg-infoSoft px-2.5 py-1 text-xs font-medium text-info"
                                        >
                                            <span className="truncate">{option.label}</span>

                                            <button
                                                type="button"
                                                onClick={(event) => removeValue(event, option.value)}
                                                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-info transition hover:bg-dangerSoft hover:text-danger"
                                                aria-label={`Remove ${option.label}`}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}

                                    <span className="inline-flex items-center rounded-full bg-cardMuted px-2.5 py-1 text-xs font-medium text-textSecondary">
                                        +{selectedOptions.length - 2}
                                    </span>
                                </>
                            )}
                        </div>

                        <ChevronDown size={16} className="ml-3 shrink-0 text-textSecondary" />
                    </div>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align="start"
                        sideOffset={8}
                        collisionPadding={12}
                        className="z-[9999] max-h-72 min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-xl border border-borderSoft bg-elevated p-1 shadow-md"
                    >
                        {options.map((option) => {
                            const checked = selectedValues.includes(option.value);

                            return (
                                <DropdownMenu.CheckboxItem
                                    key={option.value}
                                    checked={checked}
                                    onCheckedChange={() => toggleValue(option.value)}
                                    className={cn(
                                        "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition",
                                        checked
                                            ? "bg-cardMuted text-textPrimary"
                                            : "text-textPrimary hover:bg-cardMuted focus:bg-cardMuted"
                                    )}
                                >
                                    <span className="truncate">{option.label}</span>

                                    <DropdownMenu.ItemIndicator>
                                        <Check size={14} className="text-primary" />
                                    </DropdownMenu.ItemIndicator>
                                </DropdownMenu.CheckboxItem>
                            );
                        })}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {helperText ? (
                <p className="mt-2 text-xs text-textSecondary">{helperText}</p>
            ) : null}
        </div>
    );
}

function AppSelect({
    label,
    value,
    options,
    onChange,
}: AppSelectProps) {
    const normalizedValue = value === "" ? ALL_SENTINEL : value;

    const normalizedOptions = options.map((option) => ({
        ...option,
        value: option.value === "" ? ALL_SENTINEL : option.value,
    }));

    const selectedLabel =
        normalizedOptions.find((option) => option.value === normalizedValue)?.label ??
        "All";

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-textPrimary">
                {label}
            </label>

            <Select.Root
                value={normalizedValue}
                onValueChange={(nextValue) =>
                    onChange(nextValue === ALL_SENTINEL ? "" : nextValue)
                }
            >
                <Select.Trigger className="interactive-button flex h-14 w-full items-center justify-between rounded-xl bg-card px-4 text-left text-sm text-textPrimary ring-1 ring-borderSoft shadow-sm hover:bg-cardMuted">
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
        </div>
    );
}

function buildDefaultFilters(
    initialFilters: ProductListFilters
): ProductListFilters {
    return {
        ...initialFilters,
        categoryIds: [],
        brandIds: [],
        status: "active",
        flags: [],
        stockStatus: "",
        imageStatus: "",
        productTypes: [],
        createdPreset: "",
        createdFrom: "",
        createdTo: "",
        priceFrom: "",
        priceTo: "",
        salesFrom: "",
        salesTo: "",
    };
}

function countActiveFilters(filters: ProductListFilters) {
    let count = 0;

    if (filters.categoryIds.length) count++;
    if (filters.brandIds.length) count++;
    if (filters.status !== "active") count++;
    if (filters.flags.length) count++;
    if (filters.stockStatus) count++;
    if (filters.imageStatus) count++;
    if (filters.productTypes.length) count++;
    if (filters.createdPreset) count++;
    if (filters.createdFrom || filters.createdTo) count++;
    if (filters.priceFrom || filters.priceTo) count++;
    if (filters.salesFrom || filters.salesTo) count++;

    return count;
}

export default function ProductFilterModal({
    open,
    onClose,
    onApply,
    onReset,
    categories,
    brands,
    initialFilters,
    total,
}: ProductFilterModalProps) {
    const defaultFilters = useMemo(
        () => buildDefaultFilters(initialFilters),
        [initialFilters]
    );

    const [local, setLocal] = useState<ProductListFilters>(defaultFilters);
    const firstSyncDoneRef = useRef(false);

    useEffect(() => {
        if (!open) return;

        setLocal(initialFilters);
        firstSyncDoneRef.current = false;
    }, [initialFilters, open]);

    useEffect(() => {
        if (!open) return;

        if (!firstSyncDoneRef.current) {
            firstSyncDoneRef.current = true;
            return;
        }

        const timer = window.setTimeout(() => {
            onApply(local);
        }, 250);

        return () => {
            window.clearTimeout(timer);
        };
    }, [local, open, onApply]);

    const categoryOptions = useMemo(
        () => flattenCategoryOptions(categories),
        [categories]
    );

    const brandOptions = useMemo(
        () =>
            brands.map((brand) => ({
                label: brand.name,
                value: brand.id,
            })),
        [brands]
    );

    const flagOptions: MultiSelectDropdownOption[] = [
        { label: "Featured", value: "featured" },
        { label: "Free Shipping", value: "free_shipping" },
        { label: "Clearance", value: "clearance" },
    ];

    const productTypeOptions: MultiSelectDropdownOption[] = [
        { label: "Physical", value: "PHYSICAL" },
        { label: "Digital", value: "DIGITAL" },
        { label: "Service", value: "SERVICE" },
        { label: "Other", value: "OTHER" },
    ];

    const statusOptions: SingleSelectOption[] = [
        { label: "Active only", value: "active" },
        { label: "All", value: "all" },
        { label: "Inactive only", value: "inactive" },
    ];

    const stockStatusOptions: SingleSelectOption[] = [
        { label: "All", value: "" },
        { label: "In stock", value: "in_stock" },
        { label: "Low stock", value: "low_stock" },
        { label: "Out of stock", value: "out_of_stock" },
    ];

    const imageOptions: SingleSelectOption[] = [
        { label: "All", value: "" },
        { label: "Product with Image", value: "with_image" },
        { label: "Product Without Image", value: "without_image" },
    ];

    const createdDateOptions: SingleSelectOption[] = [
        { label: "All", value: "" },
        { label: "Today", value: "today" },
        { label: "Last Day", value: "last_day" },
        { label: "Last Week", value: "last_week" },
        { label: "Last Month", value: "last_month" },
        { label: "Last Year", value: "last_year" },
    ];

    const activeFilterCount = useMemo(
        () => countActiveFilters(local),
        [local]
    );

    const modalTitle = `Filters (${total} product${total === 1 ? "" : "s"} found)`;

    return (
        <FilterModal
            open={open}
            title={modalTitle}
            onClose={onClose}
            footer={
                <div className="flex items-center justify-between">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setLocal(defaultFilters);
                            onReset();
                        }}
                    >
                        Reset
                    </Button>

                    <div className="flex items-center gap-3">
                        <div className="text-sm text-textSecondary">
                            {activeFilterCount ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} applied` : "Default filters active"}
                        </div>

                        <Button variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <MultiSelectDropdown
                    label="Category"
                    options={categoryOptions}
                    selectedValues={local.categoryIds}
                    onChange={(values) =>
                        setLocal((prev) => ({
                            ...prev,
                            categoryIds: values,
                        }))
                    }
                    helperText="Leave empty for all categories."
                    allLabel="All"
                />

                <MultiSelectDropdown
                    label="Brand"
                    options={brandOptions}
                    selectedValues={local.brandIds}
                    onChange={(values) =>
                        setLocal((prev) => ({
                            ...prev,
                            brandIds: values,
                        }))
                    }
                    helperText="Leave empty for all brands."
                    allLabel="All"
                />

                <AppSelect
                    label="Status"
                    value={local.status}
                    options={statusOptions}
                    onChange={(value) =>
                        setLocal((prev) => ({
                            ...prev,
                            status: value as ProductListFilters["status"],
                        }))
                    }
                />

                <MultiSelectDropdown
                    label="Flags"
                    options={flagOptions}
                    selectedValues={local.flags}
                    onChange={(values) =>
                        setLocal((prev) => ({
                            ...prev,
                            flags: values as ProductListFilters["flags"],
                        }))
                    }
                    helperText="Leave empty for all flag states."
                    allLabel="All"
                />

                <AppSelect
                    label="Stock Status"
                    value={local.stockStatus}
                    options={stockStatusOptions}
                    onChange={(value) =>
                        setLocal((prev) => ({
                            ...prev,
                            stockStatus: value as ProductListFilters["stockStatus"],
                        }))
                    }
                />

                <AppSelect
                    label="Image"
                    value={local.imageStatus}
                    options={imageOptions}
                    onChange={(value) =>
                        setLocal((prev) => ({
                            ...prev,
                            imageStatus: value as ProductListFilters["imageStatus"],
                        }))
                    }
                />

                <MultiSelectDropdown
                    label="Product Type"
                    options={productTypeOptions}
                    selectedValues={local.productTypes}
                    onChange={(values) =>
                        setLocal((prev) => ({
                            ...prev,
                            productTypes: values as ProductListFilters["productTypes"],
                        }))
                    }
                    allLabel="All"
                />

                <AppSelect
                    label="Created Date"
                    value={local.createdPreset}
                    options={createdDateOptions}
                    onChange={(value) =>
                        setLocal((prev) => ({
                            ...prev,
                            createdPreset: value as ProductListFilters["createdPreset"],
                        }))
                    }
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
                <div className="rounded-xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                    <div className="mb-3 text-sm font-semibold text-textPrimary">
                        Sales Range
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="number"
                            placeholder="From"
                            value={local.salesFrom}
                            onChange={(e) =>
                                setLocal((prev) => ({
                                    ...prev,
                                    salesFrom: e.target.value,
                                }))
                            }
                            className="h-12 w-full rounded-xl bg-card px-3 text-sm text-textPrimary outline-none ring-1 ring-borderSoft focus:ring-2 focus:ring-borderFocus/30"
                        />
                        <input
                            type="number"
                            placeholder="To"
                            value={local.salesTo}
                            onChange={(e) =>
                                setLocal((prev) => ({
                                    ...prev,
                                    salesTo: e.target.value,
                                }))
                            }
                            className="h-12 w-full rounded-xl bg-card px-3 text-sm text-textPrimary outline-none ring-1 ring-borderSoft focus:ring-2 focus:ring-borderFocus/30"
                        />
                    </div>
                </div>

                <div className="rounded-xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                    <div className="mb-3 text-sm font-semibold text-textPrimary">
                        Price Range
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="number"
                            placeholder="From"
                            value={local.priceFrom}
                            onChange={(e) =>
                                setLocal((prev) => ({
                                    ...prev,
                                    priceFrom: e.target.value,
                                }))
                            }
                            className="h-12 w-full rounded-xl bg-card px-3 text-sm text-textPrimary outline-none ring-1 ring-borderSoft focus:ring-2 focus:ring-borderFocus/30"
                        />
                        <input
                            type="number"
                            placeholder="To"
                            value={local.priceTo}
                            onChange={(e) =>
                                setLocal((prev) => ({
                                    ...prev,
                                    priceTo: e.target.value,
                                }))
                            }
                            className="h-12 w-full rounded-xl bg-card px-3 text-sm text-textPrimary outline-none ring-1 ring-borderSoft focus:ring-2 focus:ring-borderFocus/30"
                        />
                    </div>
                </div>

                <div className="rounded-xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                    <div className="mb-3 text-sm font-semibold text-textPrimary">
                        Created Date Range
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="date"
                            value={local.createdFrom}
                            onChange={(e) =>
                                setLocal((prev) => ({
                                    ...prev,
                                    createdFrom: e.target.value,
                                }))
                            }
                            className="h-12 w-full rounded-xl bg-card px-3 text-sm text-textPrimary outline-none ring-1 ring-borderSoft focus:ring-2 focus:ring-borderFocus/30"
                        />
                        <input
                            type="date"
                            value={local.createdTo}
                            onChange={(e) =>
                                setLocal((prev) => ({
                                    ...prev,
                                    createdTo: e.target.value,
                                }))
                            }
                            className="h-12 w-full rounded-xl bg-card px-3 text-sm text-textPrimary outline-none ring-1 ring-borderSoft focus:ring-2 focus:ring-borderFocus/30"
                        />
                    </div>
                </div>
            </div>
        </FilterModal>
    );
}