"use client";

import { Bell, Search } from "lucide-react";

const TopNav = () => {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6">

            {/* Left Section */}
            <div className="flex items-center gap-6">
                <h1 className="text-xl font-semibold text-slate-800">
                    Dashboard
                </h1>

                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-slate-100 px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
                    <Search size={16} className="text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="ml-2 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">

                {/* Notification */}
                <button className="relative p-2 rounded-lg hover:bg-slate-100 transition">
                    <Bell size={18} className="text-slate-600" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                </button>

                {/* User Avatar */}
                <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 px-3 py-2 rounded-lg transition">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center font-semibold text-sm">
                        BO
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-700">
                            Brand Owner
                        </p>
                        <p className="text-xs text-slate-500">
                            Admin
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;