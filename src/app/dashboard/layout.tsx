"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["BRAND_OWNER"]}>
            <div className="min-h-screen bg-background text-textPrimary">
                <Sidebar />

                <div className="ml-72 flex min-h-screen flex-col">
                    <TopNav />

                    <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}