"use client";

import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";
import SuperAdminSidebar from "@/modules/super-admin/components/SuperAdminSidebar";
import SuperAdminTopbar from "@/modules/super-admin/components/SuperAdminTopbar";

type Props = {
    children: React.ReactNode;
};

export default function SuperAdminLayout({ children }: Props) {
    return (
        <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <div className="min-h-screen bg-background text-textPrimary">
                <SuperAdminSidebar />

                <div className="ml-72 flex min-h-screen flex-col">
                    <SuperAdminTopbar />

                    <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
                        <div className="mx-auto max-w-7xl">{children}</div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
