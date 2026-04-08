"use client";

import { useEffect, useState } from "react";
import FilterModal from "@/components/ui/FilterModal";
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
}

function getSelectedValues(
    event: React.ChangeEvent<HTMLSelectElement>
): string[] {
    return Array.from(event.target.selectedOptions, (option) => option.value);
}

export default function ProductFilterModal({
    open,
    onClose,
    onApply,
    onReset,
    categories,
    brands,
    initialFilters,
}: ProductFilterModalProps) {
    const [local, setLocal] = useState<ProductListFilters>(initialFilters);

    useEffect(() => {
        setLocal(initialFilters);
    }, [initialFilters]);

    return (
        <FilterModal
            open={open}
            title="Filters"
            onClose={onClose}
            footer={
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onReset}
                        className="rounded-lg border border-borderColorCustom px-4 py-2 transition hover:bg-background"
                    >
                        Reset
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-borderColorCustom px-4 py-2 transition hover:bg-background"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                onApply(local);
                                onClose();
                            }}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            }
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Category
                    </label>
                    <select
                        multiple
                        value={local.categoryIds}
                        onChange={(e) =>
                            setLocal((prev) => ({
                                ...prev,
                                categoryIds: getSelectedValues(e),
                            }))
                        }
                        className="min-h-[140px] w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <p className="mt-2 text-xs text-textSecondary">
                        Multi-select. Leave empty for all categories.
                    </p>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Brand
                    </label>
                    <select
                        multiple
                        value={local.brandIds}
                        onChange={(e) =>
                            setLocal((prev) => ({
                                ...prev,
                                brandIds: getSelectedValues(e),
                            }))
                        }
                        className="min-h-[140px] w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    <p className="mt-2 text-xs text-textSecondary">
                        Multi-select. Leave empty for all brands.
                    </p>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Status
                    </label>
                    <select
                        value={local.status}
                        onChange={(e) =>
                            setLocal((prev) => ({
                                ...prev,
                                status: e.target.value as ProductListFilters["status"],
                            }))
                        }
                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="active">Active only</option>
                        <option value="all">All</option>
                        <option value="inactive">Inactive only</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Flags
                    </label>
                    <select
                        multiple
                        value={local.flags}
                        onChange={(e) =>
                            setLocal((prev) => ({
                                ...prev,
                                flags: getSelectedValues(e) as ProductListFilters["flags"],
                            }))
                        }
                        className="min-h-[120px] w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="featured">Featured</option>
                        <option value="free_shipping">Free Shipping</option>
                        <option value="clearance">Clearance</option>
                    </select>
                    <p className="mt-2 text-xs text-textSecondary">
                        Leave empty for all flag states.
                    </p>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Stock Status
                    </label>
                    <select
                        value={local.stockStatus}
                        onChange={(e) =>
                            setLocal((prev) => ({
                                ...prev,
                                stockStatus: e.target.value as ProductListFilters["stockStatus"],
                            }))
                        }
                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="">All</option>
                        <option value="in_stock">In stock</option>
                        <option value="low_stock">Low stock</option>
                        <option value="out_of_stock">Out of stock</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Image
                    </label>
                    <select
                        value={local.imageStatus}
                        onChange={(e) =>
                            setLocal((prev) => ({
                                ...prev,
                                imageStatus: e.target.value as ProductListFilters["imageStatus"],
                            }))
                        }
                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="">All</option>
                        <option value="with_image">Product with Image</option>
                        <option value="without_image">Product Without Image</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Product Type
                    </label>
                    <select
                        multiple
                        value={local.productTypes}
                        onChange={(e) =>
                            setLocal((prev) => ({
                                ...prev,
                                productTypes: getSelectedValues(e) as ProductListFilters["productTypes"],
                            }))
                        }
                        className="min-h-[120px] w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="PHYSICAL">Physical</option>
                        <option value="DIGITAL">Digital</option>
                        <option value="SERVICE">Service</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-textPrimary">
                        Created Date
                    </label>
                    <select
                        value={local.createdPreset}
                        onChange={(e) =>
                            setLocal((prev) => ({
                                ...prev,
                                createdPreset: e.target.value as ProductListFilters["createdPreset"],
                            }))
                        }
                        className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                    >
                        <option value="">All</option>
                        <option value="today">Today</option>
                        <option value="last_day">Last Day</option>
                        <option value="last_week">Last Week</option>
                        <option value="last_month">Last Month</option>
                        <option value="last_year">Last Year</option>
                    </select>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-borderColorCustom bg-background p-4">
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
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
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
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-borderColorCustom bg-background p-4">
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
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
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
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-borderColorCustom bg-background p-4">
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
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
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
                            className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                        />
                    </div>
                </div>
            </div>
        </FilterModal>
    );
}