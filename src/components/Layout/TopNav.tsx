"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Moon, Search, Sun, User } from "lucide-react";

function getPageTitle(pathname: string) {
    if (pathname.startsWith("/dashboard/products")) return "Products";
    if (pathname.startsWith("/dashboard/customers")) return "Customers";
    if (pathname.startsWith("/dashboard/customer-groups")) return "Customer Groups";
    if (pathname.startsWith("/dashboard/shop-owners")) return "Shop Owners";
    if (pathname.startsWith("/dashboard/orders")) return "Orders";
    if (pathname.startsWith("/dashboard/settings")) return "Settings";
    return "Dashboard";
}

const TopNav = () => {
    const pathname = usePathname();

    const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const stored = localStorage.getItem("theme");

        if (stored === "dark") {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;

        if (theme === "light") {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setTheme("dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setTheme("light");
        }
    };

    return (
        <header className="app-topbar flex h-20 items-center gap-6 px-6">
            <div className="min-w-[160px]">
                <h1 className="text-2xl font-semibold tracking-tight text-textPrimary">
                    {pageTitle}
                </h1>
            </div>

            <div className="flex-1">
                <div className="app-input flex items-center gap-3 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 rounded-xl bg-cardMuted px-3 py-2 text-sm text-textPrimary">
                        <span>All</span>
                        <ChevronDown size={16} className="text-textSecondary" />
                    </div>

                    <input
                        placeholder="Find products, customers, orders..."
                        className="flex-1 bg-transparent text-sm text-textPrimary outline-none placeholder:text-textSecondary"
                    />

                    <Search size={18} className="text-textSecondary" />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleTheme}
                    type="button"
                    className="interactive-button app-card flex h-11 w-11 items-center justify-center rounded-2xl text-textSecondary"
                    aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                >
                    {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button
                    type="button"
                    className="interactive-button app-card relative flex h-11 w-11 items-center justify-center rounded-2xl text-textSecondary"
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                </button>

                <div className="flex items-center gap-3 pl-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cardMuted text-textSecondary">
                        <User size={16} />
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-textPrimary">
                            Brand Owner
                        </p>
                        <p className="text-xs text-textSecondary">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;