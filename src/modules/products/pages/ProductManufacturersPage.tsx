"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Plus, Search } from "lucide-react";

import Button from "@/components/ui/Button";
import ProductManufacturerFormModal from "@/modules/products/components/ProductManufacturerFormModal";
import ProductManufacturerTable from "@/modules/products/components/ProductManufacturerTable";
import {
    createManufacturer,
    deleteManufacturer,
    getManufacturers,
    updateManufacturer,
    type ProductManufacturer,
} from "@/modules/products/api/productManufacturerApi";

export default function ProductManufacturersPage() {
    const [manufacturers, setManufacturers] = useState<ProductManufacturer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ProductManufacturer | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const loadManufacturers = async () => {
        try {
            setLoading(true);
            const response = await getManufacturers();
            setManufacturers(response.data || []);
        } catch (error) {
            console.error(error);
            alert("Failed to load manufacturers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadManufacturers();
    }, []);

    const filteredManufacturers = useMemo(() => {
        const q = search.trim().toLowerCase();

        if (!q) {
            return manufacturers;
        }

        return manufacturers.filter((item) => {
            return [
                item.name,
                item.code,
                item.contactPerson,
                item.email,
                item.phone,
                item.city,
                item.state,
                item.country,
                item.gstNumber,
                item.website,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(q));
        });
    }, [manufacturers, search]);

    const activeCount = useMemo(() => {
        return manufacturers.filter((item) => item.isActive !== false).length;
    }, [manufacturers]);

    const handleCreate = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const handleEdit = (item: ProductManufacturer) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this manufacturer? It will be marked inactive."
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteManufacturer(id);
            await loadManufacturers();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to delete manufacturer");
        }
    };

    const handleSubmit = async (data: Partial<ProductManufacturer>) => {
        try {
            setSubmitting(true);

            if (editingItem) {
                await updateManufacturer(editingItem.id, data);
            } else {
                await createManufacturer(data);
            }

            setModalOpen(false);
            setEditingItem(null);
            await loadManufacturers();
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to save manufacturer");
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-[28px] border border-borderSoft bg-card shadow-sm">
                <div className="bg-gradient-to-r from-card to-cardMuted/40 px-6 py-6">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-card ring-1 ring-borderSoft">
                                <Building2 size={22} className="text-textPrimary" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-semibold tracking-tight text-textPrimary">
                                    Manufacturers
                                </h2>
                                <p className="mt-1 text-sm text-textSecondary">
                                    Manage manufacturers linked to your product catalog.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                variant="primary"
                                leftIcon={<Plus size={16} />}
                                onClick={handleCreate}
                            >
                                Add Manufacturer
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-borderSoft px-6 py-5 md:grid-cols-3">
                    <div className="rounded-2xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                        <div className="text-sm text-textSecondary">Total Manufacturers</div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                            {manufacturers.length}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                        <div className="text-sm text-textSecondary">Active</div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                            {activeCount}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-cardMuted p-4 ring-1 ring-borderSoft">
                        <div className="text-sm text-textSecondary">Inactive</div>
                        <div className="mt-2 text-2xl font-semibold text-textPrimary">
                            {manufacturers.length - activeCount}
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
                <div className="table-header px-6 py-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-textPrimary">
                                Manufacturer List
                            </h3>
                            <p className="mt-1 text-sm text-textSecondary">
                                View and maintain manufacturer details, contacts, GST, and location.
                            </p>
                        </div>

                        <div className="flex w-full max-w-md items-center gap-2 rounded-xl bg-card px-3 ring-1 ring-borderSoft">
                            <Search size={16} className="text-textSecondary" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search manufacturers..."
                                className="h-11 w-full bg-transparent text-sm text-textPrimary outline-none placeholder:text-textSecondary"
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    {loading ? (
                        <div className="rounded-2xl bg-cardMuted p-8 text-sm text-textSecondary">
                            Loading manufacturers...
                        </div>
                    ) : filteredManufacturers.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-borderSoft bg-cardMuted p-10 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-card ring-1 ring-borderSoft">
                                <Building2 size={22} className="text-textSecondary" />
                            </div>

                            <h4 className="mt-4 text-base font-medium text-textPrimary">
                                No manufacturers found
                            </h4>

                            <p className="mt-2 text-sm text-textSecondary">
                                {search.trim()
                                    ? "Try changing your search keyword."
                                    : "Create your first manufacturer to start linking products properly."}
                            </p>

                            {!search.trim() ? (
                                <div className="mt-6">
                                    <Button
                                        variant="primary"
                                        leftIcon={<Plus size={16} />}
                                        onClick={handleCreate}
                                    >
                                        Add Manufacturer
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <ProductManufacturerTable
                            data={filteredManufacturers}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            <ProductManufacturerFormModal
                open={modalOpen}
                onClose={() => {
                    if (submitting) return;
                    setModalOpen(false);
                    setEditingItem(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingItem}
            />
        </div>
    );
}