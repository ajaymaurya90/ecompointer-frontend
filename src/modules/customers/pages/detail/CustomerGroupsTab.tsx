import type { Customer } from "@/modules/customers/types/customer";

interface CustomerGroupsTabProps {
    customer: Customer;
}

export default function CustomerGroupsTab({
    customer,
}: CustomerGroupsTabProps) {
    const groups = customer.groupMembers || [];

    if (!groups.length) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
                Customer is not assigned to any group.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {groups.map((item) => (
                <div
                    key={item.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                    <h3 className="text-base font-semibold text-gray-900">
                        {item.customerGroup.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        {item.customerGroup.description || "No description available."}
                    </p>
                </div>
            ))}
        </div>
    );
}