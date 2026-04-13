"use client";

import type { ProductManufacturer } from "../api/productManufacturerApi";
import Button from "@/components/ui/Button";

interface Props {
    data: ProductManufacturer[];
    onEdit: (item: ProductManufacturer) => void;
    onDelete: (id: string) => void;
}

function getLocationLabel(item: ProductManufacturer) {
    return [item.city, item.state, item.country].filter(Boolean).join(", ") || "-";
}

export default function ProductManufacturerTable({
    data,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="overflow-hidden rounded-2xl border border-borderSoft bg-card shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-sm">
                    <thead className="bg-cardMuted text-left">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-textPrimary">
                                Name
                            </th>
                            <th className="px-4 py-3 font-semibold text-textPrimary">
                                Code
                            </th>
                            <th className="px-4 py-3 font-semibold text-textPrimary">
                                Contact Person
                            </th>
                            <th className="px-4 py-3 font-semibold text-textPrimary">
                                Phone
                            </th>
                            <th className="px-4 py-3 font-semibold text-textPrimary">
                                GST
                            </th>
                            <th className="px-4 py-3 font-semibold text-textPrimary">
                                Location
                            </th>
                            <th className="px-4 py-3 font-semibold text-textPrimary">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-textPrimary">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-10 text-center text-textSecondary"
                                >
                                    No manufacturers found.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t border-borderSoft hover:bg-cardMuted/40"
                                >
                                    <td className="px-4 py-4 align-top">
                                        <div className="font-medium text-textPrimary">
                                            {item.name}
                                        </div>
                                        <div className="mt-1 text-xs text-textSecondary">
                                            {item.email || item.website || "-"}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-textSecondary align-top">
                                        {item.code || "-"}
                                    </td>

                                    <td className="px-4 py-4 text-textSecondary align-top">
                                        {item.contactPerson || "-"}
                                    </td>

                                    <td className="px-4 py-4 text-textSecondary align-top">
                                        {item.phone || "-"}
                                    </td>

                                    <td className="px-4 py-4 text-textSecondary align-top">
                                        {item.gstNumber || "-"}
                                    </td>

                                    <td className="px-4 py-4 text-textSecondary align-top">
                                        {getLocationLabel(item)}
                                    </td>

                                    <td className="px-4 py-4 align-top">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${item.isActive !== false
                                                    ? "bg-successSoft text-success"
                                                    : "bg-cardMuted text-textSecondary"
                                                }`}
                                        >
                                            {item.isActive !== false ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 align-top">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" onClick={() => onEdit(item)}>
                                                Edit
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => onDelete(item.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}