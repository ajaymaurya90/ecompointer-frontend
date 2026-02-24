"use client";

import { useState, useEffect } from "react";
import { useBrandStore, Brand } from "@/store/brandStore";
import { X } from "lucide-react";

interface BrandForm {
    id?: string;
    name: string;
    tagline: string;
    description: string;
    logoUrl: string;
    status: "ACTIVE" | "INACTIVE";
}

interface BrandPopupProps {
    brand?: Brand; // if passed, we are editing
    onClose: () => void;
}

export default function BrandPopup({ brand, onClose }: BrandPopupProps) {
    const { createBrand, updateBrand } = useBrandStore();

    const [form, setForm] = useState<BrandForm>({
        id: brand?.id,
        name: brand?.name || "",
        tagline: brand?.tagline || "",
        description: brand?.description || "",
        logoUrl: brand?.logoUrl || "",
        status: brand?.status || "ACTIVE",
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        let fieldValue: any = value;

        // checkbox type handling (if ever added in future)
        if (type === "checkbox") {
            const target = e.target as HTMLInputElement;
            fieldValue = target.checked;
        }

        setForm((prev) => ({ ...prev, [name]: fieldValue }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async () => {
        if (!form.name.trim()) {
            alert("Brand name is required");
            return;
        }

        setSubmitting(true);
        try {
            if (form.id) {
                await updateBrand(form.id, form);
            } else {
                await createBrand(form);
            }
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error saving brand");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
            <div className="bg-white rounded-2xl w-96 p-6 relative shadow-lg">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    {form.id ? "Edit Brand" : "Add New Brand"}
                </h2>

                <div className="space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Brand Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="tagline"
                        placeholder="Tagline"
                        value={form.tagline}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description || ""}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="logoUrl"
                        placeholder="Logo URL"
                        value={form.logoUrl}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleSelectChange} // <- new handler
                        className="w-full border p-2 rounded"
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}