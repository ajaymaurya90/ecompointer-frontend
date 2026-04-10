"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/modules/auth/lib/logout";
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

type MenuKey =
    | "products"
    | "customers"
    | "shopOwners"
    | "orders"
    | "settings"
    | null;

interface FlyoutItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

interface FlyoutMenuProps {
    open: boolean;
    collapsed: boolean;
    items: FlyoutItem[];
    isActive: (path: string) => boolean;
}

function FlyoutMenu({ open, collapsed, items, isActive }: FlyoutMenuProps) {
    if (!open) return null;

    return (
        <div
            className={`absolute top-0 z-[80] ${collapsed ? "left-full ml-3" : "left-full ml-2"
                } w-56 rounded-2xl border border-borderStrong app-sidebar p-2 shadow-lg`}
        >
            <div className="space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive(item.href)
                            ? "bg-sidebarActive app-text-sidebar"
                            : "app-text-sidebar-muted hover:bg-sidebarHover hover:app-text-sidebar"
                            }`}
                    >
                        <span className="shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

const Sidebar = () => {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [openMenu, setOpenMenu] = useState<MenuKey>(null);

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
            className={`${collapsed ? "w-24" : "w-72"
                } app-sidebar flex min-h-screen flex-col transition-all duration-300`}
        >
            <div className="flex-1">
                <div className="flex h-20 items-center justify-between border-b border-borderStrong px-5">
                    {!collapsed && (
                        <h2 className="app-text-sidebar text-[22px] font-bold tracking-tight">
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

                <nav className="space-y-2 px-4 py-6">
                    <Link
                        href="/dashboard"
                        className={`sidebar-nav-item flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium ${isActive("/dashboard") ? "active" : "app-text-sidebar-muted"
                            }`}
                    >
                        <LayoutDashboard size={18} className="shrink-0" />
                        {!collapsed && <span>Dashboard</span>}
                    </Link>

                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("products")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`sidebar-nav-item flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium ${isProductsSectionActive ? "active" : "app-text-sidebar-muted"
                                }`}
                        >
                            <Package size={18} className="shrink-0" />
                            {!collapsed && <span>Products</span>}
                        </div>

                        <FlyoutMenu
                            open={openMenu === "products"}
                            collapsed={collapsed}
                            isActive={isActive}
                            items={[
                                {
                                    href: "/dashboard/products",
                                    label: "Product List",
                                    icon: <Package size={16} />,
                                },
                                {
                                    href: "/dashboard/products/categories",
                                    label: "Categories",
                                    icon: <FolderTree size={16} />,
                                },
                                {
                                    href: "/dashboard/products/brands",
                                    label: "Brands",
                                    icon: <Store size={16} />,
                                },
                            ]}
                        />
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("customers")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`sidebar-nav-item flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium ${isCustomersSectionActive ? "active" : "app-text-sidebar-muted"
                                }`}
                        >
                            <Users size={18} className="shrink-0" />
                            {!collapsed && <span>Customers</span>}
                        </div>

                        <FlyoutMenu
                            open={openMenu === "customers"}
                            collapsed={collapsed}
                            isActive={isActive}
                            items={[
                                {
                                    href: "/dashboard/customers",
                                    label: "Customer List",
                                    icon: <Users size={16} />,
                                },
                                {
                                    href: "/dashboard/customers/new",
                                    label: "Add Customer",
                                    icon: <UserPlus size={16} />,
                                },
                                {
                                    href: "/dashboard/customer-groups",
                                    label: "Customer Groups",
                                    icon: <Layers3 size={16} />,
                                },
                            ]}
                        />
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("shopOwners")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`sidebar-nav-item flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium ${isShopOwnersSectionActive ? "active" : "app-text-sidebar-muted"
                                }`}
                        >
                            <Store size={18} className="shrink-0" />
                            {!collapsed && <span>Shop Owners</span>}
                        </div>

                        <FlyoutMenu
                            open={openMenu === "shopOwners"}
                            collapsed={collapsed}
                            isActive={isActive}
                            items={[
                                {
                                    href: "/dashboard/shop-owners",
                                    label: "Shop Owner List",
                                    icon: <Store size={16} />,
                                },
                                {
                                    href: "/dashboard/shop-owners/new",
                                    label: "Add Shop Owner",
                                    icon: <UserPlus size={16} />,
                                },
                                {
                                    href: "/dashboard/shop-owners/link-existing",
                                    label: "Link Existing",
                                    icon: <Link2 size={16} />,
                                },
                            ]}
                        />
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("orders")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`sidebar-nav-item flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium ${isOrdersSectionActive ? "active" : "app-text-sidebar-muted"
                                }`}
                        >
                            <ShoppingCart size={18} className="shrink-0" />
                            {!collapsed && <span>Orders</span>}
                        </div>

                        <FlyoutMenu
                            open={openMenu === "orders"}
                            collapsed={collapsed}
                            isActive={isActive}
                            items={[
                                {
                                    href: "/dashboard/orders",
                                    label: "Order List",
                                    icon: <ClipboardList size={16} />,
                                },
                                {
                                    href: "/dashboard/orders/new",
                                    label: "Create Order",
                                    icon: <ShoppingCart size={16} />,
                                },
                                {
                                    href: "/dashboard/orders/payments",
                                    label: "Payments",
                                    icon: <Receipt size={16} />,
                                },
                            ]}
                        />
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("settings")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <div
                            className={`sidebar-nav-item flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium ${isSettingsSectionActive ? "active" : "app-text-sidebar-muted"
                                }`}
                        >
                            <Settings size={18} className="shrink-0" />
                            {!collapsed && <span>Settings</span>}
                        </div>

                        <FlyoutMenu
                            open={openMenu === "settings"}
                            collapsed={collapsed}
                            isActive={isActive}
                            items={[
                                {
                                    href: "/dashboard/settings/profile",
                                    label: "Profile",
                                    icon: <User size={16} />,
                                },
                                {
                                    href: "/dashboard/settings/location",
                                    label: "Location",
                                    icon: <MapPin size={16} />,
                                },
                                {
                                    href: "/dashboard/settings/language",
                                    label: "Language",
                                    icon: <Globe size={16} />,
                                },
                                {
                                    href: "/dashboard/settings/service-area",
                                    label: "Service Area",
                                    icon: <Globe size={16} />,
                                },
                                {
                                    href: "/dashboard/settings/storefront",
                                    label: "Storefront",
                                    icon: <Globe size={16} />,
                                },
                            ]}
                        />
                    </div>
                </nav>
            </div>

            <div className="border-t border-borderStrong p-4">
                <button
                    onClick={logout}
                    type="button"
                    className="sidebar-nav-item flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium app-text-sidebar-muted"
                >
                    <div className="app-muted-surface flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-borderStrong">
                        <LogOut size={16} />
                    </div>
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;