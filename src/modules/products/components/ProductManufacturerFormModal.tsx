"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import type { ProductManufacturer } from "../api/productManufacturerApi";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<ProductManufacturer>) => Promise<void>;
    initialData?: ProductManufacturer | null;
}

function inputClassName() {
    return "w-full rounded-xl border border-borderSoft bg-card px-4 py-3 text-sm text-textPrimary outline-none transition focus:ring-2 focus:ring-borderFocus/30";
}

export default function ProductManufacturerFormModal({
    open,
    onClose,
    onSubmit,
    initialData,
}: Props) {
    const [form, setForm] = useState<Partial<ProductManufacturer>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm(initialData || {});
    }, [initialData]);

    if (!open) return null;

    const handleChange = (field: keyof ProductManufacturer, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name?.trim()) {
            alert("Name is required");
            return;
        }

        setLoading(true);
        try {
            await onSubmit(form);
            onClose();
        } catch (e: any) {
            alert(e?.response?.data?.message || "Failed to save manufacturer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-xl">
                <div className="border-b border-borderSoft px-6 py-4">
                    <h3 className="text-lg font-semibold text-textPrimary">
                        {initialData ? "Edit Manufacturer" : "Create Manufacturer"}
                    </h3>
                    <p className="mt-1 text-sm text-textSecondary">
                        Manage supplier details for products under this brand owner.
                    </p>
                </div>

                <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                                placeholder="Manufacturer Name *"
                                value={form.name || ""}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={inputClassName()}
                            />

                            <input
                                placeholder="Manufacturer Code"
                                value={form.code || ""}
                                onChange={(e) => handleChange("code", e.target.value)}
                                className={inputClassName()}
                            />
                        </div>

                        <textarea
                            placeholder="Description"
                            value={form.description || ""}
                            onChange={(e) => handleChange("description", e.target.value)}
                            rows={3}
                            className={inputClassName()}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <input
                                placeholder="Contact Person"
                                value={form.contactPerson || ""}
                                onChange={(e) => handleChange("contactPerson", e.target.value)}
                                className={inputClassName()}
                            />

                            <input
                                placeholder="Email"
                                value={form.email || ""}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className={inputClassName()}
                            />

                            <input
                                placeholder="Phone"
                                value={form.phone || ""}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className={inputClassName()}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                                placeholder="Website"
                                value={form.website || ""}
                                onChange={(e) => handleChange("website", e.target.value)}
                                className={inputClassName()}
                            />

                            <input
                                placeholder="GST Number"
                                value={form.gstNumber || ""}
                                onChange={(e) => handleChange("gstNumber", e.target.value)}
                                className={inputClassName()}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                                placeholder="Address Line 1"
                                value={form.addressLine1 || ""}
                                onChange={(e) => handleChange("addressLine1", e.target.value)}
                                className={inputClassName()}
                            />

                            <input
                                placeholder="Address Line 2"
                                value={form.addressLine2 || ""}
                                onChange={(e) => handleChange("addressLine2", e.target.value)}
                                className={inputClassName()}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <input
                                placeholder="City"
                                value={form.city || ""}
                                onChange={(e) => handleChange("city", e.target.value)}
                                className={inputClassName()}
                            />

                            <input
                                placeholder="State"
                                value={form.state || ""}
                                onChange={(e) => handleChange("state", e.target.value)}
                                className={inputClassName()}
                            />

                            <input
                                placeholder="Country"
                                value={form.country || ""}
                                onChange={(e) => handleChange("country", e.target.value)}
                                className={inputClassName()}
                            />

                            <input
                                placeholder="Postal Code"
                                value={form.postalCode || ""}
                                onChange={(e) => handleChange("postalCode", e.target.value)}
                                className={inputClassName()}
                            />
                        </div>

                        <textarea
                            placeholder="Support Notes"
                            value={form.supportNotes || ""}
                            onChange={(e) => handleChange("supportNotes", e.target.value)}
                            rows={4}
                            className={inputClassName()}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-borderSoft px-6 py-4">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save Manufacturer"}
                    </Button>
                </div>
            </div>
        </div>
    );
}