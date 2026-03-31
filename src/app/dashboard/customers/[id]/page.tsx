import CustomerDetailPage from "@/modules/customers/pages/CustomerDetailPage";

interface CustomerDetailRouteProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CustomerDetailRoute({
    params,
}: CustomerDetailRouteProps) {
    const { id } = await params;

    return <CustomerDetailPage customerId={id} />;
}