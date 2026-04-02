"use client";

import type { BuyerType } from "@/modules/orders/types/order";

type Props = {
    value: BuyerType;
    onChange: (value: BuyerType) => void;
};

export default function OrderBuyerTypeSwitch({ value, onChange }: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Buyer Type</h2>
                <p className="text-sm text-gray-500">
                    Choose whether this order is for a direct customer or a shop owner.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => onChange("CUSTOMER")}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${value === "CUSTOMER"
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                        }`}
                >
                    <div className="font-medium">Customer</div>
                    <div className={`mt-1 text-sm ${value === "CUSTOMER" ? "text-gray-200" : "text-gray-500"}`}>
                        Retail or direct buyer order
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onChange("SHOP_OWNER")}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${value === "SHOP_OWNER"
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                        }`}
                >
                    <div className="font-medium">Shop Owner</div>
                    <div className={`mt-1 text-sm ${value === "SHOP_OWNER" ? "text-gray-200" : "text-gray-500"}`}>
                        Wholesale order for a linked shop
                    </div>
                </button>
            </div>
        </div>
    );
}