"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, MapPin, Map, User } from "lucide-react";

const settingsItems = [
    {
        label: "Profile",
        href: "/dashboard/settings/profile",
        icon: User,
        description: "Manage your account and business profile",
    },
    {
        label: "Location",
        href: "/dashboard/settings/location",
        icon: MapPin,
        description: "Set your primary business location",
    },
    {
        label: "Language",
        href: "/dashboard/settings/language",
        icon: Globe,
        description: "Choose your default language preferences",
    },
    {
        label: "Service Area",
        href: "/dashboard/settings/service-area",
        icon: Map,
        description: "Control active states and districts for orders",
    },
];

export default function SettingsNav() {
    const pathname = usePathname();

    return (
        <div className="rounded-3xl border border-borderSoft bg-white p-4">
            <div className="mb-4 px-2">
                <h2 className="text-base font-semibold text-slate-900">Settings</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your account and business preferences.
                </p>
            </div>

            <div className="space-y-2">
                {settingsItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block rounded-2xl border px-4 py-3 transition ${isActive
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-transparent bg-transparent text-slate-700 hover:border-borderSoft hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${isActive
                                        ? "bg-white/10 text-white"
                                        : "bg-slate-100 text-slate-700"
                                        }`}
                                >
                                    <Icon size={18} />
                                </div>

                                <div className="min-w-0">
                                    <div className="text-sm font-semibold">
                                        {item.label}
                                    </div>
                                    <div
                                        className={`mt-1 text-xs ${isActive ? "text-slate-200" : "text-slate-500"
                                            }`}
                                    >
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}