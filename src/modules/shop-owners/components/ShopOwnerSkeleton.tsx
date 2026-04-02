"use client";

export default function ShopOwnerSkeleton() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="animate-pulse space-y-4">
                <div className="h-6 w-48 rounded bg-gray-200" />
                <div className="h-12 w-full rounded bg-gray-100" />
                <div className="h-12 w-full rounded bg-gray-100" />
                <div className="h-12 w-full rounded bg-gray-100" />
                <div className="h-12 w-full rounded bg-gray-100" />
            </div>
        </div>
    );
}