"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, ShieldCheck } from "lucide-react";

function getTitle(pathname: string) {
    if (pathname.startsWith("/admin/brand-owners")) return "Brand Owners";
    if (pathname.startsWith("/admin/master-data")) return "Master Data";
    if (pathname.startsWith("/admin/users")) return "Users";
    if (pathname.startsWith("/admin/settings")) return "Platform Settings";
    return "Super Admin Dashboard";
}

export default function SuperAdminTopbar() {
    const pathname = usePathname();
    const title = useMemo(() => getTitle(pathname), [pathname]);

    return (
        <header className="app-topbar flex h-20 items-center gap-6 px-6">
            <div className="min-w-[260px]">
                <h1 className="text-2xl font-semibold tracking-tight text-textPrimary">
                    {title}
                </h1>
                <p className="mt-1 text-xs text-textSecondary">
                    Platform operations and tenant oversight
                </p>
            </div>

            <div className="app-input flex flex-1 items-center gap-3 rounded-2xl px-4 py-3">
                <Search size={18} className="text-textSecondary" />
                <input
                    type="text"
                    placeholder="Search platform resources..."
                    className="flex-1 bg-transparent text-sm text-textPrimary outline-none placeholder:text-textSecondary"
                />
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="interactive-button app-card relative flex h-11 w-11 items-center justify-center rounded-2xl text-textSecondary"
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                </button>

                <div className="flex items-center gap-3 pl-2">
                    <div className="interactive-button app-card flex h-11 w-11 items-center justify-center rounded-2xl text-textSecondary">
                        <ShieldCheck size={17} />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-textPrimary">
                            Super Admin
                        </p>
                        <p className="text-xs text-textSecondary">Platform</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
