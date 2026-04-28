"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Building2,
    ClipboardList,
    Database,
    LayoutDashboard,
    Mail,
    Settings,
    Shield,
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
    },
    {
        href: "/admin/mail-templates",
        label: "Mail Templates",
        icon: <Mail size={18} />,
    },
    {
        href: "/admin/activity-logs",
        label: "Activity Logs",
        icon: <ClipboardList size={18} />,
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
