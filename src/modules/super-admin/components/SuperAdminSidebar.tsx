"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Building2,
    Database,
    LayoutDashboard,
    Map,
    MapPin,
    RadioTower,
    Settings,
    Shield,
    Tags,
    Users,
} from "lucide-react";
import { logout } from "@/modules/auth/lib/logout";

const navItems = [
    {
        href: "/admin",
        label: "Dashboard",
        icon: <LayoutDashboard size={18} />,
    },
    {
        href: "/admin/brand-owners",
        label: "Brand Owners",
        icon: <Building2 size={18} />,
    },
    {
        href: "/admin/master-data",
        label: "Master Data",
        icon: <Database size={18} />,
        children: [
            {
                href: "/admin/master-data/salutations",
                label: "Salutations",
                icon: <Tags size={16} />,
            },
            {
                href: "/admin/master-data/countries",
                label: "Countries",
                icon: <Map size={16} />,
            },
            {
                href: "/admin/master-data/states",
                label: "States",
                icon: <MapPin size={16} />,
            },
            {
                href: "/admin/master-data/districts",
                label: "Districts",
                icon: <MapPin size={16} />,
            },
            {
                href: "/admin/master-data/pincodes",
                label: "Pincodes",
                icon: <MapPin size={16} />,
            },
            {
                href: "/admin/master-data/sales-channel-types",
                label: "Sales Channel Types",
                icon: <RadioTower size={16} />,
            },
        ],
    },
    {
        href: "/admin/users",
        label: "Users",
        icon: <Users size={18} />,
    },
    {
        href: "/admin/settings",
        label: "Platform Settings",
        icon: <Settings size={18} />,
    },
];

export default function SuperAdminSidebar() {
    const pathname = usePathname();

    function isActive(href: string) {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname.startsWith(href);
    }

    return (
        <aside className="app-sidebar fixed left-0 top-0 z-40 flex h-screen w-72 flex-col">
            <div className="flex h-20 items-center gap-3 border-b border-borderStrong px-5">
                <div className="app-muted-surface flex h-11 w-11 items-center justify-center rounded-2xl border border-borderStrong">
                    <Shield size={20} className="app-text-sidebar" />
                </div>
                <div>
                    <div className="app-text-sidebar text-[21px] font-bold tracking-tight">
                        ECOMPOINTER
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wide app-text-sidebar-muted">
                        Super Admin
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-6">
                {navItems.map((item) => (
                    <div key={item.href}>
                        <Link
                            href={item.href}
                            className={`sidebar-nav-item flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium ${
                                isActive(item.href) ? "active" : "app-text-sidebar-muted"
                            }`}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                        {item.children && isActive(item.href) ? (
                            <div className="mt-2 space-y-1 pl-4">
                                {item.children.map((child) => (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className={`sidebar-nav-item flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-medium ${
                                            isActive(child.href)
                                                ? "active"
                                                : "app-text-sidebar-muted"
                                        }`}
                                    >
                                        <span className="shrink-0">{child.icon}</span>
                                        <span>{child.label}</span>
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ))}
            </nav>

            <div className="border-t border-borderStrong p-4">
                <button
                    type="button"
                    onClick={logout}
                    className="sidebar-nav-item flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium app-text-sidebar-muted"
                >
                    Sign out
                </button>
            </div>
        </aside>
    );
}
