import Link from "next/link";
import type { Customer } from "@/modules/customers/types/customer";

interface CustomerListTableProps {
    items: Customer[];
}

function getCustomerName(customer: Customer) {
    return [customer.firstName, customer.lastName].filter(Boolean).join(" ");
}

function getPrimaryBusiness(customer: Customer) {
    return (
        customer.businesses?.find((business) => business.isPrimary)?.businessName || "-"
    );
}

function getStatusBadgeClass(status: Customer["status"]) {
    switch (status) {
        case "ACTIVE":
            return "bg-green-100 text-green-700";
        case "INACTIVE":
            return "bg-gray-100 text-gray-700";
        case "BLOCKED":
            return "bg-red-100 text-red-700";
        case "LEAD":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function CustomerListTable({
    items,
}: CustomerListTableProps) {
    if (!items.length) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
                No customers found.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-600">
                        <tr>
                            <th className="px-4 py-3 font-medium">Code</th>
                            <th className="px-4 py-3 font-medium">Customer</th>
                            <th className="px-4 py-3 font-medium">Type</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Phone</th>
                            <th className="px-4 py-3 font-medium">Primary Business</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                            <th className="px-4 py-3 text-right font-medium">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((customer) => (
                            <tr
                                key={customer.id}
                                className="border-t border-gray-100"
                            >
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {customer.customerCode}
                                </td>

                                <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900">
                                        {getCustomerName(customer)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {customer.email || "-"}
                                    </div>
                                </td>

                                <td className="px-4 py-3">{customer.type}</td>

                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                                            customer.status
                                        )}`}
                                    >
                                        {customer.status}
                                    </span>
                                </td>

                                <td className="px-4 py-3">{customer.phone || "-"}</td>

                                <td className="px-4 py-3">
                                    {getPrimaryBusiness(customer)}
                                </td>

                                <td className="px-4 py-3">
                                    {new Date(customer.createdAt).toLocaleDateString()}
                                </td>

                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/dashboard/customers/${customer.id}`}
                                        className="inline-flex rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}