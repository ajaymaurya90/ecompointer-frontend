"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/modules/auth/lib/logout";
import { useState } from "react";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Store,
    Users,
    UserPlus,
    Layers3,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const Sidebar = () => {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const isActive = (path: string) => pathname === path;
    const isProductsSectionActive = pathname.startsWith("/dashboard/products");
    const isCustomersSectionActive = pathname.startsWith("/dashboard/customers") || pathname.startsWith("/dashboard/customer-groups");

    return (
        <aside
            className={`${collapsed ? "w-24" : "w-72"} app-sidebar flex flex-col transition-all duration-300`}
        >
            <div className="flex-1">
                {/* Header */}
                <div className="h-20 px-5 flex items-center justify-between border-b border-borderSoft">
                    {!collapsed && (
                        <h2 className="text-[22px] font-bold tracking-tight app-text-sidebar">
                            ECOMPOINTER
                        </h2>
                    )}

                    <button
                        onClick={() => setCollapsed((prev) => !prev)}
                        className="interactive-button flex h-10 w-10 items-center justify-center rounded-xl app-text-sidebar-muted hover:text-textSidebar"
                        type="button"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Nav */}
                <nav className="px-4 py-6 space-y-2">
                    {/* Dashboard */}
                    <Link
                        href="/dashboard"
                        className={`sidebar-nav-item flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium ${isActive("/dashboard") ? "active" : "app-text-sidebar-muted"
                            }`}
                    >
                        <LayoutDashboard size={18} className="shrink-0" />
                        {!collapsed && <span>Dashboard</span>}
                    </Link>

                    {/* Products with submenu */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("products")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`sidebar-nav-item flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium cursor-pointer ${isProductsSectionActive ? "active" : "app-text-sidebar-muted"
                                }`}
                        >
                            <Package size={18} className="shrink-0" />
                            {!collapsed && <span>Products</span>}
                        </div>

                        {openMenu === "products" && (
                            <div
                                className={`absolute top-0 z-50 ${collapsed ? "left-full ml-3" : "left-full ml-2"
                                    } w-52 rounded-2xl app-card p-2 space-y-1`}
                            >
                                <Link
                                    href="/dashboard/products"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/products")
                                            ? "active"
                                            : "app-text-secondary"
                                        }`}
                                >
                                    <Package size={16} />
                                    <span>Product List</span>
                                </Link>

                                <Link
                                    href="/dashboard/products/categories"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/products/categories")
                                            ? "active"
                                            : "app-text-secondary"
                                        }`}
                                >
                                    <FolderTree size={16} />
                                    <span>Categories</span>
                                </Link>

                                <Link
                                    href="/dashboard/products/brands"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/products/brands")
                                            ? "active"
                                            : "app-text-secondary"
                                        }`}
                                >
                                    <Store size={16} />
                                    <span>Brands</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Customers with submenu */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("customers")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`sidebar-nav-item flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium cursor-pointer ${isCustomersSectionActive ? "active" : "app-text-sidebar-muted"
                                }`}
                        >
                            <Users size={18} className="shrink-0" />
                            {!collapsed && <span>Customers</span>}
                        </div>

                        {openMenu === "customers" && (
                            <div
                                className={`absolute top-0 z-50 ${collapsed ? "left-full ml-3" : "left-full ml-2"
                                    } w-56 rounded-2xl app-card p-2 space-y-1`}
                            >
                                <Link
                                    href="/dashboard/customers"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/customers")
                                            ? "active"
                                            : "app-text-secondary"
                                        }`}
                                >
                                    <Users size={16} />
                                    <span>Customer List</span>
                                </Link>

                                <Link
                                    href="/dashboard/customers/new"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/customers/new")
                                            ? "active"
                                            : "app-text-secondary"
                                        }`}
                                >
                                    <UserPlus size={16} />
                                    <span>Add Customer</span>
                                </Link>

                                <Link
                                    href="/dashboard/customer-groups"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/customer-groups")
                                            ? "active"
                                            : "app-text-secondary"
                                        }`}
                                >
                                    <Layers3 size={16} />
                                    <span>Customer Groups</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-borderSoft">
                <button
                    onClick={logout}
                    type="button"
                    className="sidebar-nav-item w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium app-text-sidebar-muted"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-borderSoft app-muted-surface shrink-0">
                        <LogOut size={16} />
                    </div>
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;