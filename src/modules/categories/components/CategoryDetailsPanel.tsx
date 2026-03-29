"use client";

import type { CategoryNode } from "@/modules/categories/components/CategoryTree";

interface CategoryDetailsPanelProps {
    category: CategoryNode | null;
    parentName: string;
    form: {
        name: string;
        description: string;
    };
    onFormChange: (form: { name: string; description: string }) => void;
    onSave: () => void;
    onDelete: () => void;
    saving?: boolean;
}

export default function CategoryDetailsPanel({
    category,
    parentName,
    form,
    onFormChange,
    onSave,
    onDelete,
    saving = false,
}: CategoryDetailsPanelProps) {
    if (!category) {
        return (
            <div className="rounded-2xl border border-borderColorCustom bg-card p-8">
                <div className="mb-2 text-lg font-semibold text-textPrimary">
                    Category Settings
                </div>
                <p className="text-textSecondary">
                    Select a category from the left tree to edit its settings.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-borderColorCustom bg-card">
            <div className="border-b border-borderColorCustom px-6 py-5">
                <div className="mb-2 text-sm text-textSecondary">
                    Category settings
                </div>
                <h3 className="text-2xl font-semibold text-textPrimary">
                    {category.name}
                </h3>
                <p className="mt-2 text-sm text-textSecondary">
                    Manage the general settings of the selected category.
                </p>
            </div>

            <div className="border-b border-borderColorCustom px-6 pt-4">
                <div className="flex gap-8">
                    <button className="border-b-2 border-primary pb-3 text-sm font-medium text-primary">
                        General
                    </button>
                    <button className="pb-3 text-sm text-textSecondary">
                        Products
                    </button>
                    <button className="pb-3 text-sm text-textSecondary">
                        Layout
                    </button>
                    <button className="pb-3 text-sm text-textSecondary">
                        SEO
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="rounded-2xl border border-borderColorCustom bg-white">
                    <div className="border-b border-borderColorCustom px-6 py-4">
                        <h4 className="text-lg font-semibold text-textPrimary">
                            General
                        </h4>
                    </div>

                    <div className="space-y-6 px-6 py-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-textPrimary">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        onFormChange({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                    placeholder="Category name"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-textPrimary">
                                    Parent
                                </label>
                                <div className="rounded-lg border border-borderColorCustom bg-background px-3 py-2 text-textSecondary">
                                    {parentName}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-textPrimary">
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    onFormChange({
                                        ...form,
                                        description: e.target.value,
                                    })
                                }
                                className="min-h-[140px] w-full rounded-lg border border-borderColorCustom bg-white px-3 py-2 outline-none focus:border-primary"
                                placeholder="Category description"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onDelete}
                        className="rounded-lg border border-red-200 px-4 py-2 text-red-600 transition hover:bg-red-50"
                    >
                        Delete
                    </button>

                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="h-10 rounded-lg bg-blue-600 px-4 text-white transition hover:bg-blue-700"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}