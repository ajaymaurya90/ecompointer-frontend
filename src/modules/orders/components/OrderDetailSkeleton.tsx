"use client";

export default function OrderDetailSkeleton() {
    return (
        <div className="space-y-6">
            <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="h-8 w-64 rounded bg-gray-200" />
                <div className="mt-3 h-4 w-40 rounded bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                        <div className="h-4 w-24 rounded bg-gray-100" />
                        <div className="mt-3 h-8 w-28 rounded bg-gray-200" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
                    <div className="h-6 w-48 rounded bg-gray-200" />
                    <div className="mt-4 h-24 rounded bg-gray-100" />
                </div>

                <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="h-6 w-40 rounded bg-gray-200" />
                    <div className="mt-4 h-24 rounded bg-gray-100" />
                </div>
            </div>
        </div>
    );
}