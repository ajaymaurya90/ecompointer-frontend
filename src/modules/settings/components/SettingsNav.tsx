"use client";

/**
 * ---------------------------------------------------------
 * SETTINGS NAV
 * ---------------------------------------------------------
 * Purpose:
 * Shared navigation card for all settings pages.
 * It shows the available settings sections and highlights
 * the currently active one.
 * ---------------------------------------------------------
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    MapPin,
    Globe,
    Mail,
    Map,
    RadioTower,
    Store,
} from "lucide-react";

const items = [
    {
        href: "/dashboard/settings/profile",
        title: "Profile",
        description: "Manage your account and business profile",
        icon: User,
    },
    {
        href: "/dashboard/settings/location",
        title: "Location",
        description: "Set your primary business location",
        icon: MapPin,
    },
    {
        href: "/dashboard/settings/language",
        title: "Language",
        description: "Choose your default language preferences",
        icon: Globe,
    },
    {
        href: "/dashboard/settings/service-area",
        title: "Service Area",
        description: "Control active states and districts for orders",
        icon: Map,
    },
    {
        href: "/dashboard/settings/sales-channels",
        title: "Sales Channels",
        description: "Manage website channel, domains, and delivery settings",
        icon: RadioTower,
    },
    {
        href: "/dashboard/settings/mail-templates",
        title: "Mail Templates",
        description: "Customize transactional email templates",
        icon: Mail,
    },
    {
        href: "/dashboard/settings/storefront",
        title: "Storefront",
        description: "Manage storefront branding and customer-facing settings",
        icon: Store,
    },
];

export default function SettingsNav() {
    const pathname = usePathname();

    return (
        <div className="rounded-3xl border border-borderSoft bg-white p-7">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                <p className="mt-2 text-sm text-slate-500">
                    Manage your account and business preferences.
                </p>
            </div>

            <div className="space-y-3">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        (item.href === "/dashboard/settings/sales-channels" &&
                            pathname.startsWith(`${item.href}/`)) ||
                        (item.href === "/dashboard/settings/mail-templates" &&
                            pathname.startsWith(`${item.href}/`));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-start gap-4 rounded-2xl px-3 py-3 transition ${isActive
                                    ? "bg-slate-100"
                                    : "hover:bg-slate-50"
                                }`}
                        >
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isActive
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                            >
                                <Icon size={20} />
                            </div>

                            <div>
                                <div className="text-lg font-semibold text-slate-900">
                                    {item.title}
                                </div>
                                <div className="mt-1 text-sm leading-5 text-slate-500">
                                    {item.description}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
