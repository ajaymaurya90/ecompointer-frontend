import CustomerEditPage from "@/modules/customers/pages/CustomerEditPage";

interface CustomerEditRouteProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CustomerEditRoute({
    params,
}: CustomerEditRouteProps) {
    const { id } = await params;

    return <CustomerEditPage customerId={id} />;
}