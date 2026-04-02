"use client";

import { useEffect } from "react";
import { useOrderListStore } from "@/modules/orders/store/useOrderListStore";
import OrderFilters from "@/modules/orders/components/OrderFilters";
import OrderListTable from "@/modules/orders/components/OrderListTable";
import OrderSkeleton from "@/modules/orders/components/OrderSkeleton";

export default function OrderListPage() {
    const {
        items,
        pagination,
        filters,
        isLoading,
        error,
        setFilter,
        setPage,
        resetFilters,
        fetchOrders,
    } = useOrderListStore();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, filters.page]);

    const handleApplyFilters = async () => {
        setPage(1);
        await fetchOrders();
    };

    const handleResetFilters = async () => {
        resetFilters();
        setTimeout(() => {
            useOrderListStore.getState().fetchOrders();
        }, 0);
    };

    const totalOrders = pagination.total;
    const paidOrders = items.filter((item) => item.paymentStatus === "PAID").length;
    const pendingOrders = items.filter((item) => item.status === "PENDING").length;
    const cancelledOrders = items.filter((item) => item.status === "CANCELLED").length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500">
                    Track and manage orders, payments, and order flow from one place.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="text-sm text-gray-500">Total Orders</div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">{totalOrders}</div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="text-sm text-gray-500">Paid Orders</div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">{paidOrders}</div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="text-sm text-gray-500">Pending Orders</div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">{pendingOrders}</div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="text-sm text-gray-500">Cancelled Orders</div>
                    <div className="mt-2 text-2xl font-bold text-gray-900">{cancelledOrders}</div>
                </div>
            </div>

            <OrderFilters
                search={filters.search}
                status={filters.status}
                paymentStatus={filters.paymentStatus}
                buyerType={filters.buyerType}
                salesChannel={filters.salesChannel}
                fromDate={filters.fromDate}
                toDate={filters.toDate}
                onChange={(key, value) =>
                    setFilter(
                        key as
                        | "search"
                        | "status"
                        | "paymentStatus"
                        | "buyerType"
                        | "salesChannel"
                        | "fromDate"
                        | "toDate",
                        value as never
                    )
                }
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {isLoading ? (
                <OrderSkeleton />
            ) : (
                <OrderListTable
                    orders={items}
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => {
                        setPage(page);
                    }}
                />
            )}
        </div>
    );
}