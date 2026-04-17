import Link from "next/link";

const masters = [
    {
        href: "/admin/master-data/salutations",
        title: "Salutations",
        description: "Manage prefixes used in onboarding and profile forms.",
    },
    {
        href: "/admin/master-data/countries",
        title: "Countries",
        description: "Control platform countries, phone codes, and currencies.",
    },
    {
        href: "/admin/master-data/states",
        title: "States",
        description: "Maintain states linked to countries.",
    },
    {
        href: "/admin/master-data/districts",
        title: "Districts",
        description: "Maintain districts linked to states.",
    },
    {
        href: "/admin/master-data/pincodes",
        title: "Pincodes",
        description: "Maintain serviceable pincode masters linked to districts.",
    },
    {
        href: "/admin/master-data/sales-channel-types",
        title: "Sales Channel Types",
        description: "Manage sales channel options available to Brand Owners.",
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

            <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {masters.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm transition hover:border-sidebar"
                    >
                        <h3 className="text-lg font-semibold text-textPrimary">
                            {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-textSecondary">
                            {item.description}
                        </p>
                    </Link>
                ))}
            </section>
        </div>
    );
}
