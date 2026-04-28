import Link from "next/link";
import {
    ChevronRight,
    CreditCard,
    Flag,
    Map,
    MapPin,
    RadioTower,
    Tags,
    Waypoints,
} from "lucide-react";

const masterLinks = [
    {
        href: "/admin/master-data/salutations",
        title: "Salutations",
        icon: Tags,
    },
    {
        href: "/admin/master-data/countries",
        title: "Countries",
        icon: Flag,
    },
    {
        href: "/admin/master-data/states",
        title: "States",
        icon: Map,
    },
    {
        href: "/admin/master-data/districts",
        title: "Districts",
        icon: Waypoints,
    },
    {
        href: "/admin/master-data/pincodes",
        title: "Pincodes",
        icon: MapPin,
    },
    {
        href: "/admin/master-data/sales-channel-types",
        title: "Sales Channel Types",
        icon: RadioTower,
    },
    {
        href: "/admin/master-data/payment-gateways",
        title: "Payment Gateway",
        icon: CreditCard,
    },
];

export default function MasterDataHomePage() {
    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-textPrimary">
                    Master Data
                </h2>
                <p className="mt-1 text-sm text-textSecondary">
                    Manage platform-wide records consumed by onboarding and tenant workflows.
                </p>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {masterLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex min-h-20 items-center justify-between rounded-2xl border border-borderSoft bg-white px-5 py-4 shadow-sm transition hover:border-sidebar hover:shadow-md"
                        >
                            <span className="flex min-w-0 items-center gap-3">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-borderSoft bg-bgSoft text-sidebar transition group-hover:border-sidebar">
                                    <Icon size={20} />
                                </span>
                                <span className="truncate text-base font-semibold text-textPrimary transition group-hover:text-sidebar">
                                    {item.title}
                                </span>
                            </span>
                            <ChevronRight
                                size={18}
                                className="shrink-0 text-textSecondary transition group-hover:translate-x-0.5 group-hover:text-sidebar"
                            />
                        </Link>
                    );
                })}
            </section>
        </div>
    );
}
