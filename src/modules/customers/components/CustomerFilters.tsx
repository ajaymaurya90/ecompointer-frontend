import type {
    CustomerSource,
    CustomerStatus,
    CustomerType,
} from "@/modules/customers/types/customer";

interface CustomerFiltersProps {
    search: string;
    type: CustomerType | "";
    status: CustomerStatus | "";
    source: CustomerSource | "";
    onSearchChange: (value: string) => void;
    onTypeChange: (value: CustomerType | "") => void;
    onStatusChange: (value: CustomerStatus | "") => void;
    onSourceChange: (value: CustomerSource | "") => void;
    onReset: () => void;
}

export default function CustomerFilters({
    search,
    type,
    status,
    source,
    onSearchChange,
    onTypeChange,
    onStatusChange,
    onSourceChange,
    onReset,
}: CustomerFiltersProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by name, email, phone, code"
                    className="h-11 rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                />

                <select
                    value={type}
                    onChange={(e) => onTypeChange(e.target.value as CustomerType | "")}
                    className="h-11 rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                >
                    <option value="">All Types</option>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="BUSINESS">Business</option>
                    <option value="BOTH">Both</option>
                </select>

                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value as CustomerStatus | "")}
                    className="h-11 rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                >
                    <option value="">All Statuses</option>
                    <option value="LEAD">Lead</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="BLOCKED">Blocked</option>
                </select>

                <select
                    value={source}
                    onChange={(e) => onSourceChange(e.target.value as CustomerSource | "")}
                    className="h-11 rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                >
                    <option value="">All Sources</option>
                    <option value="WEBSITE">Website</option>
                    <option value="MOBILE_APP">Mobile App</option>
                    <option value="MANUAL">Manual</option>
                    <option value="SHOP_REFERRAL">Shop Referral</option>
                    <option value="IMPORT">Import</option>
                    <option value="MARKETPLACE">Marketplace</option>
                    <option value="OTHER">Other</option>
                </select>

                <button
                    type="button"
                    onClick={onReset}
                    className="h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}