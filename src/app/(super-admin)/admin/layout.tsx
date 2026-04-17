import SuperAdminLayout from "@/modules/super-admin/components/SuperAdminLayout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SuperAdminLayout>{children}</SuperAdminLayout>;
}
