"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as Select from "@radix-ui/react-select";
import { Bell, ChevronDown, Moon, Search, Sun, User } from "lucide-react";

import GlobalSearchDropdown from "@/modules/search/components/GlobalSearchDropdown";
import { useGlobalSearchStore } from "@/modules/search/store/globalSearchStore";
import type { GlobalSearchScope } from "@/modules/search/types/search";

function getPageTitle(pathname: string) {
    if (pathname.startsWith("/dashboard/products")) return "Products";
    if (pathname.startsWith("/dashboard/customers")) return "Customers";
    if (pathname.startsWith("/dashboard/customer-groups")) return "Customer Groups";
    if (pathname.startsWith("/dashboard/shop-owners")) return "Shop Owners";
    if (pathname.startsWith("/dashboard/orders")) return "Orders";
    if (pathname.startsWith("/dashboard/settings")) return "Settings";
    return "Dashboard";
}

const searchOptions: Array<{ label: string; value: GlobalSearchScope }> = [
    { label: "All", value: "all" },
    { label: "Products", value: "products" },
    { label: "Customers", value: "customers" },
    { label: "Orders", value: "orders" },
    { label: "Shop Owners", value: "shopOwners" },
];

const TopNav = () => {
    const pathname = usePathname();
    const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

    const [theme, setTheme] = useState<"light" | "dark">("light");

    const {
        query,
        scope,
        loading,
        results,
        open,
        setQuery,
        setScope,
        setOpen,
        search,
        clear,
    } = useGlobalSearchStore();

    const searchRootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("theme");

        if (stored === "dark") {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRootRef.current &&
                !searchRootRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setOpen]);

    useEffect(() => {
        const trimmed = query.trim();

        if (!trimmed) {
            setOpen(false);
            return;
        }

        const timer = setTimeout(() => {
            void search();
        }, 300);

        return () => clearTimeout(timer);
    }, [query, scope, search, setOpen]);

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

            <div ref={searchRootRef} className="relative flex-1">
                <div className="app-input flex items-center gap-3 rounded-2xl px-2 py-1">
                    <Select.Root
                        value={scope}
                        onValueChange={(value) => {
                            setScope(value as GlobalSearchScope);
                        }}
                    >
                        <Select.Trigger className="flex items-center gap-2 rounded-xl bg-cardMuted px-3 py-2 text-sm text-textPrimary outline-none">
                            <Select.Value />
                            <Select.Icon>
                                <ChevronDown size={16} className="text-textSecondary" />
                            </Select.Icon>
                        </Select.Trigger>

                        <Select.Portal>
                            <Select.Content
                                side="bottom"
                                align="start"
                                sideOffset={6}
                                className="z-[9999] overflow-hidden rounded-xl border border-borderSoft bg-elevated shadow-md"
                            >
                                <Select.Viewport className="p-1">
                                    {searchOptions.map((option) => (
                                        <Select.Item
                                            key={option.value}
                                            value={option.value}
                                            className="cursor-pointer rounded-lg px-4 py-2 text-sm text-textPrimary outline-none transition hover:bg-cardMuted data-[state=checked]:bg-cardMuted"
                                        >
                                            <Select.ItemText>{option.label}</Select.ItemText>
                                        </Select.Item>
                                    ))}
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            if (query.trim()) {
                                setOpen(true);
                            }
                        }}
                        placeholder={`Search in ${scope}...`}
                        className="flex-1 bg-transparent text-sm text-textPrimary outline-none placeholder:text-textSecondary"
                    />

                    {query ? (
                        <button
                            type="button"
                            onClick={clear}
                            className="rounded-lg px-2 py-1 text-xs text-textSecondary transition hover:bg-cardMuted hover:text-textPrimary"
                        >
                            Clear
                        </button>
                    ) : null}

                    <Search size={18} className="text-textSecondary" />
                </div>

                <GlobalSearchDropdown
                    loading={loading}
                    query={query}
                    results={results}
                    open={open}
                    scope={scope}
                />
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
                    <div className="interactive-button app-card relative flex h-11 w-11 items-center justify-center rounded-2xl text-textSecondary">
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