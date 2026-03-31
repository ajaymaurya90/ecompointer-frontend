import type { Customer } from "@/modules/customers/types/customer";

interface CustomerOverviewTabProps {
    customer: Customer;
}

function getCustomerName(customer: Customer) {
    return [customer.firstName, customer.lastName].filter(Boolean).join(" ");
}

export default function CustomerOverviewTab({
    customer,
}: CustomerOverviewTabProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Customer Overview
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Customer Code
                    </div>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                        {customer.customerCode}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Full Name
                    </div>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                        {getCustomerName(customer) || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Type
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                        {customer.type}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Status
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                        {customer.status}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Source
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                        {customer.source}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Email
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                        {customer.email || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Phone
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                        {customer.phone || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Alternate Phone
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                        {customer.alternatePhone || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Date of Birth
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                        {customer.dateOfBirth
                            ? new Date(customer.dateOfBirth).toLocaleDateString()
                            : "-"}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Created At
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                        {new Date(customer.createdAt).toLocaleString()}
                    </div>
                </div>

                <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Updated At
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                        {new Date(customer.updatedAt).toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Notes
                </div>
                <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                    {customer.notes || "No notes available."}
                </div>
            </div>
        </div>
    );
}