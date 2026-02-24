"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import CategoryTree, { CategoryNode } from "./CategoryTree";

export default function ProductCategoryPage() {
    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(null);
    const [form, setForm] = useState({ name: "", parentId: "", description: "" });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openPopup = (category?: CategoryNode) => {
        if (category) {
            setEditingCategory(category);
            setForm({
                name: category.name,
                parentId: category.parentId || "",
                description: category.description || "",
            });
        } else {
            setEditingCategory(null);
            setForm({ name: "", parentId: "", description: "" });
        }
        setPopupOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (editingCategory) {
                await api.patch(`/categories/${editingCategory.id}`, {
                    name: form.name,
                    parentId: form.parentId || undefined,
                    description: form.description || undefined,
                });
            } else {
                await api.post("/categories", {
                    name: form.name,
                    parentId: form.parentId || undefined,
                    description: form.description || undefined,
                });
            }
            setPopupOpen(false);
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (category: CategoryNode) => {
        if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;
        try {
            await api.delete(`/categories/${category.id}`);
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Cannot delete category if it has products or subcategories.");
        }
    };

    const handleReorder = async (flatData: { id: string; parentId: string | null; order: number }[]) => {
        try {
            const payload = flatData.map((item, index) => ({
                id: item.id,
                parentId: item.parentId,
                position: index + 1,
            }));
            await api.post("/categories/reorder", payload);
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-800">Product Categories</h2>
                <button
                    onClick={() => openPopup()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={16} /> Add Category
                </button>
            </div>

            {loading ? (
                <div>Loading categories...</div>
            ) : (
                <CategoryTree
                    data={categories}
                    onEdit={openPopup}
                    onDelete={handleDelete}
                    onReorder={handleReorder}
                />
            )}

            {popupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-2xl w-96">
                        <h3 className="text-lg font-bold mb-4">
                            {editingCategory ? "Edit Category" : "Add Category"}
                        </h3>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Category Name"
                            className="w-full border p-2 rounded mb-2"
                        />

                        <input
                            name="parentId"
                            value={form.parentId}
                            onChange={handleChange}
                            placeholder="Parent Category ID (optional)"
                            className="w-full border p-2 rounded mb-2"
                        />

                        <textarea
                            name="description"
                            value={form.description || ""}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full border p-2 rounded mb-4"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setPopupOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                {editingCategory ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}