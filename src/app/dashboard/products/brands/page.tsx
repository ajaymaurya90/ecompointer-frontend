"use client";

import { useEffect, useState } from "react";
import { useBrandStore } from "@/store/brandStore";
import { Plus, Trash2, Pencil } from "lucide-react";
import BrandModal from "@/components/brands/BrandModal";
import DeleteConfirmModal from "@/components/brands/DeleteConfirmModal";

export default function BrandsPage() {
    const {
        brands,
        fetchBrands,
        createBrand,
        updateBrand,
        deleteBrand,
        loading,
    } = useBrandStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleSubmit = async (data: any) => {
        if (editingBrand) {
            await updateBrand(editingBrand.id, data);
        } else {
            await createBrand(data);
        }

        await fetchBrands();
        setIsModalOpen(false);
        setEditingBrand(null);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteBrand(deleteId);
            await fetchBrands();
        } catch (error: any) {
            alert(error.response?.data?.message || "Cannot delete brand.");
        }

        setDeleteId(null);
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-800">
                    Brands
                </h2>

                <button
                    onClick={() => {
                        setEditingBrand(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={16} />
                    Add Brand
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {loading ? (
                    <div className="p-6 text-slate-500">Loading...</div>
                ) : brands.length === 0 ? (
                    <div className="p-12 text-center">
                        <h3 className="text-lg font-medium text-slate-700">
                            No brands yet
                        </h3>
                        <p className="text-slate-500 mt-2">
                            Create your first brand to start adding products.
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Tagline</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {brands.map((brand) => (
                                <tr
                                    key={brand.id}
                                    className="hover:bg-slate-50 transition"
                                >
                                    {/* Name + Logo */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {brand.logoUrl ? (
                                                <img
                                                    src={brand.logoUrl}
                                                    alt={brand.name}
                                                    className="w-10 h-10 rounded-lg object-cover border"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 flex items-center justify-center bg-slate-200 rounded-lg text-slate-600 font-semibold">
                                                    {brand.name.charAt(0)}
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {brand.name}
                                                </p>
                                                {brand.description && (
                                                    <p className="text-xs text-slate-500 truncate max-w-xs">
                                                        {brand.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Tagline */}
                                    <td className="px-6 py-4 text-slate-600">
                                        {brand.tagline || "-"}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${brand.status === "ACTIVE"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {brand.status}
                                        </span>
                                    </td>

                                    {/* Created Date */}
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(
                                            brand.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditingBrand(brand);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-slate-500 hover:text-blue-600"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setDeleteId(brand.id)
                                                }
                                                className="text-slate-500 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            <BrandModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingBrand(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingBrand}
            />

            <DeleteConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}