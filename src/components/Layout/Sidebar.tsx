"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth";
import { useState } from "react";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Store,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const Sidebar = () => {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const isActive = (path: string) => pathname === path;

    return (
        <aside
            className={`h-screen 
                        ${collapsed ? "w-20" : "w-64"}
                        transition-all duration-300
                        bg-gradient-to-b 
                        from-slate-900 via-blue-950 to-slate-950
                        text-slate-200 
                        flex flex-col justify-between`}
        >
            {/* Top Section */}
            <div className="p-4">

                {/* Logo + Toggle */}
                <div className="flex items-center justify-between mb-8">
                    {!collapsed && (
                        <h2 className="text-lg font-semibold tracking-wide text-white">
                            ECOMPOINTER
                        </h2>
                    )}

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1 rounded-md hover:bg-white/10 transition"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="space-y-2">

                    {/* Dashboard */}
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                            ${isActive("/dashboard")
                                ? "bg-blue-600/20 text-white border border-blue-500/30"
                                : "hover:bg-white/5 hover:text-white text-slate-300"
                            }`}
                    >
                        <LayoutDashboard size={18} />
                        {!collapsed && <span>Dashboard</span>}
                    </Link>

                    {/* Products with Submenu */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("products")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition
                                ${pathname.startsWith("/dashboard/products")
                                    ? "bg-blue-600/20 text-white border border-blue-500/30"
                                    : "hover:bg-white/5 hover:text-white text-slate-300"
                                }`}
                        >
                            <Package size={18} />
                            {!collapsed && <span>Products</span>}
                        </div>

                        {/* Flyout submenu */}
                        {openMenu === "products" && (
                            <div
                                className={`absolute top-0 
                                            ${collapsed ? "left-full ml-3" : "left-full ml-2"}
                                            w-48
                                            bg-slate-900 border border-slate-800
                                            rounded-lg shadow-lg p-2 space-y-1`}
                            >
                                <Link
                                    href="/dashboard/products"
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm
                                               text-slate-300 hover:bg-white/5 hover:text-white transition"
                                >
                                    <Package size={16} />
                                    Product List
                                </Link>

                                <Link
                                    href="/dashboard/products/categories"
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm
                                               text-slate-300 hover:bg-white/5 hover:text-white transition"
                                >
                                    <FolderTree size={16} />
                                    Categories
                                </Link>

                                <Link
                                    href="/dashboard/products/brands"
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm
                                               text-slate-300 hover:bg-white/5 hover:text-white transition"
                                >
                                    <Store size={16} />
                                    Brands
                                </Link>
                            </div>
                        )}
                    </div>

                </nav>
            </div>

            {/* Bottom Section */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm
                               bg-slate-800 text-slate-200
                               hover:bg-slate-700 transition"
                >
                    <LogOut size={18} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;