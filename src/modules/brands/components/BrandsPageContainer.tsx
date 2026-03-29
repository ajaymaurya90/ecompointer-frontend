"use client";

import { useEffect, useState } from "react";
import { useBrandStore, Brand } from "@/modules/brands/store/brandStore";
import { Plus, Trash2, Pencil } from "lucide-react";
import BrandPopup from "@/modules/brands/components/BrandPopup";

export default function BrandsPageContainer() {
    const { brands, fetchBrands, deleteBrand, loading } = useBrandStore();

    const [showPopup, setShowPopup] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | undefined>();

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const handleAdd = () => {
        setEditingBrand(undefined);
        setShowPopup(true);
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setShowPopup(true);
    };

    const handleDelete = async (brand: Brand) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete brand "${brand.name}"? This cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteBrand(brand.id);
        } catch (err: any) {
            if (err?.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to delete brand. Make sure no products or orders are linked.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-textPrimary">
                    Brands
                </h2>

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 transition"
                >
                    <Plus size={16} />
                    Add Brand
                </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-borderColorCustom bg-card">
                {loading ? (
                    <div className="p-6 text-textSecondary">
                        Loading...
                    </div>
                ) : brands.length === 0 ? (
                    <div className="p-12 text-center">
                        <h3 className="text-lg font-medium text-textPrimary">
                            No brands yet
                        </h3>
                        <p className="mt-2 text-textSecondary">
                            Create your first brand to start adding products.
                        </p>
                    </div>
                ) : (
                    <table className="w-full border-collapse text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-textSecondary">
                                    Name
                                </th>
                                <th className="px-6 py-3 font-medium text-textSecondary">
                                    Tagline
                                </th>
                                <th className="px-6 py-3 font-medium text-textSecondary">
                                    Status
                                </th>
                                <th className="px-6 py-3 font-medium text-textSecondary">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right font-medium text-textSecondary">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {brands.map((brand) => (
                                <tr
                                    key={brand.id}
                                    className="border-t transition hover:bg-background"
                                >
                                    <td className="flex items-center gap-2 px-6 py-4">
                                        {brand.logoUrl && (
                                            <img
                                                src={brand.logoUrl}
                                                alt={brand.name}
                                                className="h-8 w-8 rounded"
                                            />
                                        )}
                                        {brand.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {brand.tagline || "-"}
                                    </td>

                                    <td className="px-6 py-4">
                                        {brand.status}
                                    </td>

                                    <td className="px-6 py-4">
                                        {new Date(brand.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(brand)}
                                            className="text-blue-500 hover:text-blue-600"
                                            aria-label={`Edit ${brand.name}`}
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(brand)}
                                            className="text-red-500 hover:text-red-600"
                                            aria-label={`Delete ${brand.name}`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showPopup && (
                <BrandPopup
                    brand={editingBrand}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div>
    );
}