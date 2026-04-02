"use client";

import type { CustomerAddress } from "@/modules/customers/types/customer";

type Props = {
    addresses: CustomerAddress[];
    billingAddressId: string;
    shippingAddressId: string;
    onBillingChange: (addressId: string) => void;
    onShippingChange: (addressId: string) => void;
};

function formatAddress(address: CustomerAddress) {
    return [
        address.fullName,
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.state,
        address.country,
        address.postalCode,
    ]
        .filter(Boolean)
        .join(", ");
}

export default function OrderAddressSelector({
    addresses,
    billingAddressId,
    shippingAddressId,
    onBillingChange,
    onShippingChange,
}: Props) {
    const billingAddresses = addresses.filter(
        (address) => address.isActive && (address.type === "BILLING" || address.type === "BOTH")
    );

    const shippingAddresses = addresses.filter(
        (address) => address.isActive && (address.type === "SHIPPING" || address.type === "BOTH")
    );

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Addresses</h2>
                <p className="text-sm text-gray-500">
                    Select billing and shipping addresses for this customer order.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Billing Address
                    </label>
                    <select
                        value={billingAddressId}
                        onChange={(e) => onBillingChange(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="">Select billing address</option>
                        {billingAddresses.map((address) => (
                            <option key={address.id} value={address.id}>
                                {formatAddress(address)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Shipping Address
                    </label>
                    <select
                        value={shippingAddressId}
                        onChange={(e) => onShippingChange(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="">Select shipping address</option>
                        {shippingAddresses.map((address) => (
                            <option key={address.id} value={address.id}>
                                {formatAddress(address)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}