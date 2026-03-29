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
            <div className="flex min-h-screen bg-background text-textPrimary">

                {/* Sidebar */}
                <Sidebar />

                {/* Main Section */}
                <div className="flex-1 flex flex-col">

                    {/* Top Navigation */}
                    <TopNav />

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}