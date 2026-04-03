"use client";

import type { ShopOwner } from "@/modules/shop-owners/types/shopOwner";

type Props = {
    shopOwner: ShopOwner;
};

export default function ShopOwnerLocationCard({ shopOwner }: Props) {
    return (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Location & Contact</h2>

            <div className="mt-5 space-y-4">
                <div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">Address</div>
                    <div className="mt-2 text-sm font-medium text-gray-900">
                        {shopOwner.address || "-"}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">City</div>
                        <div className="mt-2 text-sm font-medium text-gray-900">
                            {shopOwner.city || "-"}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">State</div>
                        <div className="mt-2 text-sm font-medium text-gray-900">
                            {shopOwner.state || "-"}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">Country</div>
                        <div className="mt-2 text-sm font-medium text-gray-900">
                            {shopOwner.country || "-"}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">
                        Postal Code
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-900">
                        {shopOwner.postalCode || "-"}
                    </div>
                </div>
            </div>
        </div>
    );
}