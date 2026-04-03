"use client";

/**
 * ---------------------------------------------------------
 * SHOP OWNER DETAIL PAGE
 * ---------------------------------------------------------
 * Purpose:
 * Displays the complete Shop Owner profile view for a
 * Brand Owner, including overview, business details,
 * location details, and relationship status controls.
 *
 * Page Pattern:
 * 1. Load detail data on mount
 * 2. Clear current detail state on unmount
 * 3. Render loading, error, empty, or full detail state
 * ---------------------------------------------------------
 */

import { useEffect } from "react";
import { useShopOwnerStore } from "@/modules/shop-owners/store/shopOwnerStore";
import ShopOwnerOverviewCard from "@/modules/shop-owners/components/ShopOwnerOverviewCard";
import ShopOwnerBusinessCard from "@/modules/shop-owners/components/ShopOwnerBusinessCard";
import ShopOwnerLocationCard from "@/modules/shop-owners/components/ShopOwnerLocationCard";
import ShopOwnerLinkStatusCard from "@/modules/shop-owners/components/ShopOwnerLinkStatusCard";
import ShopOwnerSkeleton from "@/modules/shop-owners/components/ShopOwnerSkeleton";

type Props = {
    shopOwnerId: string;
};

export default function ShopOwnerDetailPage({ shopOwnerId }: Props) {
    const {
        currentItem,
        isDetailLoading,
        isStatusUpdating,
        error,
        fetchShopOwnerById,
        toggleShopOwnerStatus,
        clearCurrentItem,
    } = useShopOwnerStore();

    useEffect(() => {
        // Load the requested shop owner detail when page opens.
        void fetchShopOwnerById(shopOwnerId);

        // Clear the current detail state when page unmounts.
        return () => {
            clearCurrentItem();
        };
    }, [shopOwnerId, fetchShopOwnerById, clearCurrentItem]);

    // Show skeleton while detail record is loading.
    if (isDetailLoading) {
        return <ShopOwnerSkeleton />;
    }

    // Show backend or store error if present.
    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {Array.isArray(error) ? error.join(", ") : error}
            </div>
        );
    }

    // Show empty state when no record is available.
    if (!currentItem) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Shop owner not found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    The requested shop owner detail could not be loaded.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ShopOwnerOverviewCard shopOwner={currentItem} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ShopOwnerBusinessCard shopOwner={currentItem} />
                <ShopOwnerLocationCard shopOwner={currentItem} />
            </div>

            <ShopOwnerLinkStatusCard
                shopOwner={currentItem}
                isUpdating={isStatusUpdating}
                // Toggle the BO ↔ shop owner relationship status from detail page.
                onToggle={async (isActive, notes) => {
                    await toggleShopOwnerStatus(currentItem.id, { isActive, notes });
                }}
            />
        </div>
    );
}