"use client";

import { useEffect, useState } from "react";

interface BrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
}

export default function BrandModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: BrandModalProps) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        tagline: "",
        logoUrl: "",
        status: "ACTIVE",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name ?? "",
                description: initialData.description ?? "",
                tagline: initialData.tagline ?? "",
                logoUrl: initialData.logoUrl ?? "",
                status: initialData.status ?? "ACTIVE",
            });
        } else {
            setForm({
                name: "",
                description: "",
                tagline: "",
                logoUrl: "",
                status: "ACTIVE",
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!form.name.trim()) return;
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    {initialData ? "Edit Brand" : "Add Brand"}
                </h2>

                <div className="space-y-4">
                    <input
                        name="name"
                        placeholder="Brand Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        name="tagline"
                        placeholder="Tagline"
                        value={form.tagline}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <input
                        name="logoUrl"
                        placeholder="Logo URL"
                        value={form.logoUrl}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        {initialData ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}