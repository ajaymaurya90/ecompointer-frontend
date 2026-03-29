"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Bell, Search } from "lucide-react";

const TopNav = () => {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window === "undefined") return "light";
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") return stored;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

    return (
        <header className="h-20 app-topbar flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
                <h1 className="text-[34px] leading-none font-semibold tracking-tight app-text-primary">
                    Dashboard
                </h1>

                <div className="hidden md:flex items-center gap-3 rounded-2xl app-input px-4 py-3 min-w-[260px]">
                    <Search size={18} className="text-textSecondary" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-transparent outline-none text-sm app-text-primary placeholder:text-textSecondary"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleTheme}
                    className="interactive-button flex h-12 w-12 items-center justify-center rounded-2xl app-card text-textSecondary"
                    title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                >
                    {theme === "light" ? <Sun size={19} /> : <Moon size={19} />}
                </button>

                <button className="interactive-button flex h-12 w-12 items-center justify-center rounded-2xl app-card text-textSecondary">
                    <Bell size={19} />
                    <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-primary"></span>
                </button>

                <div className="ml-2 flex items-center gap-3 rounded-2xl px-2 py-2 cursor-pointer">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-white">
                        BO
                    </div>

                    <div className="hidden sm:block pr-1">
                        <p className="text-sm font-semibold leading-5 app-text-primary">
                            Brand Owner
                        </p>
                        <p className="text-xs leading-5 app-text-secondary">
                            Admin
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;