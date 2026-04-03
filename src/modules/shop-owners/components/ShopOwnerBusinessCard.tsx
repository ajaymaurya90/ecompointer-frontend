"use client";

import type { ShopOwner } from "@/modules/shop-owners/types/shopOwner";

type Props = {
    shopOwner: ShopOwner;
};

export default function ShopOwnerBusinessCard({ shopOwner }: Props) {
    return (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">
                        Business Name
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-900">
                        {shopOwner.businessName || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">
                        Legal Entity Name
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-900">
                        {shopOwner.legalEntityName || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">
                        GST Number
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-900">
                        {shopOwner.gstNumber || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">
                        QR Code URL
                    </div>
                    <div className="mt-2 break-all text-sm font-medium text-gray-900">
                        {shopOwner.qrCodeUrl || "-"}
                    </div>
                </div>
            </div>
        </div>
    );
}