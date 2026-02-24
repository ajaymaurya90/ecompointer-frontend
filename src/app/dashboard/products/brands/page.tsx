"use client";

import { useEffect, useState } from "react";
import { useBrandStore, Brand } from "@/store/brandStore";
import { Plus, Trash2, Pencil } from "lucide-react";
import BrandPopup from "./BrandPopup"; // make sure path is correct

export default function BrandsPage() {
    const { brands, fetchBrands, deleteBrand, loading } = useBrandStore();

    const [showPopup, setShowPopup] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | undefined>();

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleAdd = () => {
        setEditingBrand(undefined);
        setShowPopup(true);
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setShowPopup(true);
    };

    const handleDelete = async (brand: Brand) => {
        const confirm = window.confirm(
            `Are you sure you want to delete brand "${brand.name}"? This cannot be undone.`
        );
        if (!confirm) return;

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
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-800">Brands</h2>

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={16} />
                    Add Brand
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                {loading ? (
                    <div className="p-6 text-slate-500">Loading...</div>
                ) : brands.length === 0 ? (
                    <div className="p-12 text-center">
                        <h3 className="text-lg font-medium text-slate-700">No brands yet</h3>
                        <p className="text-slate-500 mt-2">
                            Create your first brand to start adding products.
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-slate-600">Name</th>
                                <th className="px-6 py-3 font-medium text-slate-600">Tagline</th>
                                <th className="px-6 py-3 font-medium text-slate-600">Status</th>
                                <th className="px-6 py-3 font-medium text-slate-600">Created</th>
                                <th className="px-6 py-3 font-medium text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map((brand) => (
                                <tr key={brand.id} className="border-t hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        {brand.logoUrl && (
                                            <img src={brand.logoUrl} alt={brand.name} className="w-8 h-8 rounded" />
                                        )}
                                        {brand.name}
                                    </td>
                                    <td className="px-6 py-4">{brand.tagline || "-"}</td>
                                    <td className="px-6 py-4">{brand.status}</td>
                                    <td className="px-6 py-4">
                                        {new Date(brand.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                        <button
                                            onClick={() => handleEdit(brand)}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(brand)}
                                            className="text-red-500 hover:text-red-600"
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