"use client";

type Props = {
    search: string;
    isActive: "true" | "false" | "";
    onSearchChange: (value: string) => void;
    onStatusChange: (value: "true" | "false" | "") => void;
    onReset: () => void;
};

export default function ShopOwnerFilters({
    search,
    isActive,
    onSearchChange,
    onStatusChange,
    onReset,
}: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Search
                    </label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by shop name, owner name, phone, email, shop slug"
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Link Status
                    </label>
                    <select
                        value={isActive}
                        onChange={(e) => onStatusChange(e.target.value as "true" | "false" | "")}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                    >
                        <option value="">All</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    onClick={onReset}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
}