"use client";

import Link from "next/link";
import type { ShopOwner } from "@/modules/shop-owners/types/shopOwner";

type Props = {
    items: ShopOwner[];
};

export default function ShopOwnerListTable({ items }: Props) {
    if (!items.length) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <h3 className="text-lg font-semibold text-gray-900">No shop owners found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Create a new shop owner or link an existing one.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                        <tr>
                            <th className="px-4 py-3 font-medium">Shop</th>
                            <th className="px-4 py-3 font-medium">Owner</th>
                            <th className="px-4 py-3 font-medium">Contact</th>
                            <th className="px-4 py-3 font-medium">Location</th>
                            <th className="px-4 py-3 font-medium">Link Status</th>
                            <th className="px-4 py-3 font-medium">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => {
                            const activeLink = item.brandLinks?.find((link) => link.isActive);

                            return (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="px-4 py-4">
                                        <div className="font-medium text-gray-900">{item.shopName}</div>
                                        <div className="mt-1 text-xs text-gray-500">{item.shopSlug}</div>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="text-gray-900">{item.ownerName}</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {item.businessName || "-"}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="text-gray-900">{item.phone}</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {item.email || "-"}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="text-gray-900">{item.city || "-"}</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {[item.state, item.country].filter(Boolean).join(", ") || "-"}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${activeLink?.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {activeLink?.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <Link
                                            href={`/dashboard/shop-owners/${item.id}`}
                                            className="inline-flex rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}