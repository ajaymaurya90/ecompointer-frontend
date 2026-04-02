"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/modules/orders/api/order.api";
import { getCustomerById } from "@/modules/customers/api/customerApi";
import OrderBuyerTypeSwitch from "@/modules/orders/components/OrderBuyerTypeSwitch";
import OrderBuyerSelector from "@/modules/orders/components/OrderBuyerSelector";
import OrderAddressSelector from "@/modules/orders/components/OrderAddressSelector";
import OrderItemsEditor from "@/modules/orders/components/OrderItemsEditor";
import OrderNotesCard from "@/modules/orders/components/OrderNotesCard";
import OrderProductSearch from "@/modules/orders/components/OrderProductSearch";
import OrderTotalsCard from "@/modules/orders/components/OrderTotalsCard";
import OrderCreateSidebarSummary from "@/modules/orders/components/OrderCreateSidebarSummary";
import type {
    BuyerType,
    CreateOrderLineItem,
    ShopOwnerSearchItem,
} from "@/modules/orders/types/order";
import type { Customer, CustomerAddress } from "@/modules/customers/types/customer";

export default function OrderCreatePage() {
    const router = useRouter();

    const [buyerType, setBuyerType] = useState<BuyerType>("CUSTOMER");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedShopOwner, setSelectedShopOwner] = useState<ShopOwnerSearchItem | null>(null);

    const [billingAddressId, setBillingAddressId] = useState("");
    const [shippingAddressId, setShippingAddressId] = useState("");

    const [items, setItems] = useState<CreateOrderLineItem[]>([]);
    const [shippingAmount, setShippingAmount] = useState("0");
    const [discountAmount, setDiscountAmount] = useState("0");
    const [notes, setNotes] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currencyCode = "INR";

    const customerAddresses = useMemo<CustomerAddress[]>(() => {
        return selectedCustomer?.addresses?.filter((address) => address.isActive) || [];
    }, [selectedCustomer]);

    const subtotal = useMemo(() => {
        return items.reduce((sum, item) => sum + item.lineSubtotal, 0);
    }, [items]);

    const taxAmount = useMemo(() => {
        return items.reduce((sum, item) => sum + item.taxAmount, 0);
    }, [items]);

    const grandTotal = useMemo(() => {
        return subtotal + taxAmount + Number(shippingAmount || 0) - Number(discountAmount || 0);
    }, [subtotal, taxAmount, shippingAmount, discountAmount]);

    const totalQuantity = useMemo(() => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }, [items]);

    const resetBuyerDependentState = () => {
        setSelectedCustomer(null);
        setSelectedShopOwner(null);
        setBillingAddressId("");
        setShippingAddressId("");
        setItems([]);
    };

    const handleBuyerTypeChange = (value: BuyerType) => {
        setBuyerType(value);
        resetBuyerDependentState();
        setError(null);
    };

    const handleCustomerSelect = async (customer: Customer | null) => {
        if (!customer) {
            setSelectedCustomer(null);
            setBillingAddressId("");
            setShippingAddressId("");
            setItems([]);
            setError(null);
            return;
        }

        try {
            setError(null);

            const fullCustomer = await getCustomerById(customer.id);
            setSelectedCustomer(fullCustomer);
            setSelectedShopOwner(null);

            const addresses =
                fullCustomer?.addresses?.filter((address) => address.isActive) || [];

            const defaultBilling =
                addresses.find(
                    (address) =>
                        address.isDefault &&
                        (address.type === "BILLING" || address.type === "BOTH")
                ) ||
                addresses.find(
                    (address) =>
                        address.type === "BILLING" || address.type === "BOTH"
                );

            const defaultShipping =
                addresses.find(
                    (address) =>
                        address.isDefault &&
                        (address.type === "SHIPPING" || address.type === "BOTH")
                ) ||
                addresses.find(
                    (address) =>
                        address.type === "SHIPPING" || address.type === "BOTH"
                );

            setBillingAddressId(defaultBilling?.id || "");
            setShippingAddressId(defaultShipping?.id || "");
            setItems([]);
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load customer details"
            );
        }
    };

    const handleShopOwnerSelect = (shopOwner: ShopOwnerSearchItem | null) => {
        setSelectedShopOwner(shopOwner);
        setSelectedCustomer(null);
        setBillingAddressId("");
        setShippingAddressId("");
        setItems([]);
        setError(null);
    };

    const recalculateLine = (item: CreateOrderLineItem, quantity: number): CreateOrderLineItem => {
        const dynamicMinQty =
            buyerType === "SHOP_OWNER"
                ? item.shopOrderRules?.minLineQty ?? 3
                : 1;

        const safeQty = Math.max(dynamicMinQty, Math.min(quantity, item.stock));
        const lineSubtotal = item.unitPrice * safeQty;
        const taxAmount = (lineSubtotal * item.taxRate) / 100;
        const lineTotal = lineSubtotal + taxAmount;

        return {
            ...item,
            quantity: safeQty,
            lineSubtotal,
            taxAmount,
            lineTotal,
        };
    };

    const handleAddItem = (newItem: CreateOrderLineItem) => {
        setItems((prev) => {
            const existing = prev.find(
                (item) => item.productVariantId === newItem.productVariantId
            );

            if (existing) {
                return prev;
            }

            return [...prev, newItem];
        });
    };

    const handleQuantityChange = (productVariantId: string, quantity: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.productVariantId === productVariantId
                    ? recalculateLine(item, quantity)
                    : item
            )
        );
    };

    const handleRemoveItem = (productVariantId: string) => {
        setItems((prev) => prev.filter((item) => item.productVariantId !== productVariantId));
    };

    const handleSubmit = async () => {
        try {
            setError(null);

            if (buyerType === "CUSTOMER") {
                if (!selectedCustomer) {
                    setError("Please select a customer.");
                    return;
                }

                if (!billingAddressId || !shippingAddressId) {
                    setError("Please select billing and shipping addresses.");
                    return;
                }
            }

            if (buyerType === "SHOP_OWNER" && !selectedShopOwner) {
                setError("Please select a shop owner.");
                return;
            }

            if (!items.length) {
                setError("Please add at least one product.");
                return;
            }

            if (buyerType === "SHOP_OWNER" && items.length > 0) {
                const rules = items[0].shopOrderRules || {
                    minLineQty: 3,
                    minCartQty: 10,
                    allowBelowMinLineQtyAfterCartMin: true,
                };

                if (totalQuantity < rules.minCartQty) {
                    setError(
                        `For shop owner orders, total product quantity in cart must be at least ${rules.minCartQty}.`
                    );
                    return;
                }

                const shouldEnforceLineMin =
                    !rules.allowBelowMinLineQtyAfterCartMin || totalQuantity < rules.minCartQty;

                if (shouldEnforceLineMin) {
                    const invalidLine = items.find(
                        (item) => item.quantity < rules.minLineQty
                    );

                    if (invalidLine) {
                        setError(
                            `For shop owner orders, each line item quantity must be at least ${rules.minLineQty}.`
                        );
                        return;
                    }
                }
            }

            const resolvedBrandOwnerId = items[0]?.brandOwnerId;

            if (!resolvedBrandOwnerId) {
                setError("Unable to resolve brand owner for selected items.");
                return;
            }

            setIsSubmitting(true);

            const createdOrder = await createOrder({
                buyerType,
                brandOwnerId: resolvedBrandOwnerId,
                customerId: buyerType === "CUSTOMER" ? selectedCustomer?.id : undefined,
                shopOwnerId: buyerType === "SHOP_OWNER" ? selectedShopOwner?.id : undefined,
                salesChannel: buyerType === "SHOP_OWNER" ? "SHOP_ORDER" : "MANUAL",
                billingAddressId: buyerType === "CUSTOMER" ? billingAddressId : undefined,
                shippingAddressId: buyerType === "CUSTOMER" ? shippingAddressId : undefined,
                shippingAmount,
                discountAmount,
                notes,
                items: items.map((item) => ({
                    productVariantId: item.productVariantId,
                    quantity: item.quantity,
                })),
            });

            router.push(`/dashboard/orders/${createdOrder.id}`);
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to create order"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                                Order Workspace
                            </div>
                            <h1 className="mt-2 text-2xl font-bold text-gray-900">
                                Create New Order
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-gray-500">
                                Build a customer or shop owner order with guided selection,
                                live cart calculation, and brand-owner pricing rules.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 sm:w-auto">
                            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center">
                                <div className="text-xs text-gray-400">Items</div>
                                <div className="mt-1 text-lg font-bold text-gray-900">
                                    {items.length}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center">
                                <div className="text-xs text-gray-400">Qty</div>
                                <div className="mt-1 text-lg font-bold text-gray-900">
                                    {totalQuantity}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center">
                                <div className="text-xs text-gray-400">Total</div>
                                <div className="mt-1 text-lg font-bold text-gray-900">
                                    ₹{grandTotal.toFixed(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                        {[
                            "Choose buyer type",
                            "Select buyer",
                            buyerType === "CUSTOMER" ? "Select addresses" : "Buyer confirmed",
                            "Add products",
                            "Review and create",
                        ].map((step, index) => (
                            <div
                                key={step}
                                className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                            >
                                <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Step {index + 1}
                                </div>
                                <div className="mt-1 text-sm font-medium text-gray-900">
                                    {step}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {Array.isArray(error) ? error.join(", ") : error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <div className="space-y-6">
                        <OrderBuyerTypeSwitch
                            value={buyerType}
                            onChange={handleBuyerTypeChange}
                        />

                        <OrderBuyerSelector
                            buyerType={buyerType}
                            selectedCustomer={selectedCustomer}
                            selectedShopOwner={selectedShopOwner}
                            onCustomerSelect={handleCustomerSelect}
                            onShopOwnerSelect={handleShopOwnerSelect}
                        />

                        {buyerType === "CUSTOMER" && selectedCustomer ? (
                            <OrderAddressSelector
                                addresses={customerAddresses}
                                billingAddressId={billingAddressId}
                                shippingAddressId={shippingAddressId}
                                onBillingChange={setBillingAddressId}
                                onShippingChange={setShippingAddressId}
                            />
                        ) : null}

                        {(buyerType === "CUSTOMER" && selectedCustomer) ||
                            (buyerType === "SHOP_OWNER" && selectedShopOwner) ? (
                            <OrderProductSearch
                                buyerType={buyerType}
                                existingItems={items}
                                onAddItem={handleAddItem}
                            />
                        ) : null}

                        <OrderItemsEditor
                            buyerType={buyerType}
                            items={items}
                            currencyCode={currencyCode}
                            onQuantityChange={handleQuantityChange}
                            onRemove={handleRemoveItem}
                        />
                    </div>
                </div>

                <div className="space-y-6 xl:col-span-4 xl:sticky xl:top-6 xl:self-start">
                    <OrderCreateSidebarSummary
                        buyerType={buyerType}
                        selectedCustomer={selectedCustomer}
                        selectedShopOwner={selectedShopOwner}
                        items={items}
                        currencyCode={currencyCode}
                    />

                    {buyerType === "SHOP_OWNER" ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
                            <div className="font-semibold">Shop Owner Rules</div>
                            <div className="mt-2">
                                Minimum {items[0]?.shopOrderRules?.minLineQty ?? 3} quantity per line item
                            </div>
                            <div>
                                Total cart quantity must be at least {items[0]?.shopOrderRules?.minCartQty ?? 10}
                            </div>
                            <div className="mt-1">
                                Allow below line minimum after cart minimum:{" "}
                                {(items[0]?.shopOrderRules?.allowBelowMinLineQtyAfterCartMin ?? true)
                                    ? "Yes"
                                    : "No"}
                            </div>
                            <div className="mt-2 font-semibold">
                                Current total quantity: {totalQuantity}
                            </div>
                        </div>
                    ) : null}

                    <OrderTotalsCard
                        currencyCode={currencyCode}
                        subtotal={subtotal}
                        taxAmount={taxAmount}
                        shippingAmount={shippingAmount}
                        discountAmount={discountAmount}
                        onShippingChange={setShippingAmount}
                        onDiscountChange={setDiscountAmount}
                    />

                    <OrderNotesCard
                        value={notes}
                        onChange={setNotes}
                    />

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="text-sm text-gray-500">Grand Total</div>
                        <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                            ₹{grandTotal.toFixed(2)}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="mt-5 w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Creating Order..." : "Create Order"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}