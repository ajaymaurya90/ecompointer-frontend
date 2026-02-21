"use client";

import Link from "next/link";
import { logout } from "@/lib/auth";

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white shadow flex flex-col justify-between">
            <div className="p-6">
                <h2 className="text-lg font-bold mb-6">
                    EcomPointer
                </h2>

                <nav className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="block text-gray-700 hover:text-blue-600"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/dashboard/products"
                        className="block text-gray-700 hover:text-blue-600"
                    >
                        Products
                    </Link>
                </nav>
            </div>

            <div className="p-6 border-t">
                <button
                    onClick={logout}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;