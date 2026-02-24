"use client";

import Sidebar from "@/components/Layout/Sidebar";
import TopNav from "@/components/Layout/TopNav";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["BRAND_OWNER"]}>
            <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40">

                {/* Sidebar */}
                <Sidebar />

                {/* Main Section */}
                <div className="flex-1 flex flex-col">

                    {/* Top Navigation */}
                    <TopNav />

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}