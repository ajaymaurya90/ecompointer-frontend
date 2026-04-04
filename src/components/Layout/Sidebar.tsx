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
    Settings,
    User,
    MapPin,
    Globe,
    ShoppingCart,
    Receipt,
    ClipboardList,
    Link2,
} from "lucide-react";

const Sidebar = () => {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const isActive = (path: string) => pathname === path;
    const isProductsSectionActive = pathname.startsWith("/dashboard/products");
    const isCustomersSectionActive =
        pathname.startsWith("/dashboard/customers") ||
        pathname.startsWith("/dashboard/customer-groups");
    const isShopOwnersSectionActive = pathname.startsWith("/dashboard/shop-owners");
    const isOrdersSectionActive = pathname.startsWith("/dashboard/orders");
    const isSettingsSectionActive = pathname.startsWith("/dashboard/settings");

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

                    {/* Shop Owners with submenu */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("shopOwners")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`sidebar-nav-item flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium cursor-pointer ${isShopOwnersSectionActive ? "active" : "app-text-sidebar-muted"
                                }`}
                        >
                            <Store size={18} className="shrink-0" />
                            {!collapsed && <span>Shop Owners</span>}
                        </div>

                        {openMenu === "shopOwners" && (
                            <div
                                className={`absolute top-0 z-50 ${collapsed ? "left-full ml-3" : "left-full ml-2"
                                    } w-56 rounded-2xl app-card p-2 space-y-1`}
                            >
                                <Link
                                    href="/dashboard/shop-owners"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/shop-owners")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <Store size={16} />
                                    <span>Shop Owner List</span>
                                </Link>

                                <Link
                                    href="/dashboard/shop-owners/new"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/shop-owners/new")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <UserPlus size={16} />
                                    <span>Add Shop Owner</span>
                                </Link>

                                <Link
                                    href="/dashboard/shop-owners/link-existing"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/shop-owners/link-existing")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <Link2 size={16} />
                                    <span>Link Existing</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Orders with submenu */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("orders")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`sidebar-nav-item flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium cursor-pointer ${isOrdersSectionActive ? "active" : "app-text-sidebar-muted"
                                }`}
                        >
                            <ShoppingCart size={18} className="shrink-0" />
                            {!collapsed && <span>Orders</span>}
                        </div>

                        {openMenu === "orders" && (
                            <div
                                className={`absolute top-0 z-50 ${collapsed ? "left-full ml-3" : "left-full ml-2"
                                    } w-56 rounded-2xl app-card p-2 space-y-1`}
                            >
                                <Link
                                    href="/dashboard/orders"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/orders")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <ClipboardList size={16} />
                                    <span>Order List</span>
                                </Link>

                                <Link
                                    href="/dashboard/orders/new"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/orders/new")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <ShoppingCart size={16} />
                                    <span>Create Order</span>
                                </Link>

                                <Link
                                    href="/dashboard/orders/payments"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/orders/payments")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <Receipt size={16} />
                                    <span>Payments</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Settings with submenu */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("settings")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`sidebar-nav-item flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium cursor-pointer ${isSettingsSectionActive ? "active" : "app-text-sidebar-muted"
                                }`}
                        >
                            <Settings size={18} className="shrink-0" />
                            {!collapsed && <span>Settings</span>}
                        </div>

                        {openMenu === "settings" && (
                            <div
                                className={`absolute top-0 z-50 ${collapsed ? "left-full ml-3" : "left-full ml-2"
                                    } w-56 rounded-2xl app-card p-2 space-y-1`}
                            >
                                <Link
                                    href="/dashboard/settings/profile"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/settings/profile")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <User size={16} />
                                    <span>Profile</span>
                                </Link>

                                <Link
                                    href="/dashboard/settings/location"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/settings/location")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <MapPin size={16} />
                                    <span>Location</span>
                                </Link>

                                <Link
                                    href="/dashboard/settings/language"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/settings/language")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <Globe size={16} />
                                    <span>Language</span>
                                </Link>

                                <Link
                                    href="/dashboard/settings/service-area"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/settings/service-area")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <Globe size={16} />
                                    <span>Service Area</span>
                                </Link>

                                <Link
                                    href="/dashboard/settings/storefront"
                                    className={`submenu-item flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${isActive("/dashboard/settings/storefront")
                                        ? "active"
                                        : "app-text-secondary"
                                        }`}
                                >
                                    <Globe size={16} />
                                    <span>Storefront</span>
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