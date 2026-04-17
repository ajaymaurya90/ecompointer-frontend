const platformStats = [
    { label: "Active Brand Owners", value: "128", change: "+12 this month" },
    { label: "Total Users", value: "1,842", change: "+6.4% growth" },
    { label: "Storefront Domains", value: "74", change: "61 verified" },
    { label: "Open Reviews", value: "9", change: "3 high priority" },
];

const recentActivity = [
    {
        title: "New brand owner approved",
        detail: "Northline Apparel was activated for production access.",
        time: "12 min ago",
    },
    {
        title: "Domain verification pending",
        detail: "ayodoya.local is waiting for platform review.",
        time: "44 min ago",
    },
    {
        title: "User role updated",
        detail: "Support operator access was adjusted by platform admin.",
        time: "2 hours ago",
    },
];

export default function SuperAdminDashboardPage() {
    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium uppercase tracking-wide text-textSecondary">
                        Platform overview
                    </p>
                    <h2 className="text-2xl font-semibold text-textPrimary">
                        Monitor tenants, users, and operational health.
                    </h2>
                    <p className="max-w-3xl text-sm leading-6 text-textSecondary">
                        Review workspace activity, tenant status, and platform-level
                        actions from one controlled Super Admin area.
                    </p>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {platformStats.map((item) => (
                    <div
                        key={item.label}
                        className="rounded-2xl border border-borderSoft bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm text-textSecondary">{item.label}</p>
                        <div className="mt-3 text-3xl font-semibold text-textPrimary">
                            {item.value}
                        </div>
                        <p className="mt-2 text-xs font-medium text-emerald-600">
                            {item.change}
                        </p>
                    </div>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm xl:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-textPrimary">
                                Tenant Health
                            </h3>
                            <p className="mt-1 text-sm text-textSecondary">
                                Current operational status by workspace tier.
                            </p>
                        </div>
                        <span className="rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Stable
                        </span>
                    </div>

                    <div className="space-y-4">
                        {["Enterprise", "Growth", "Starter"].map((tier, index) => (
                            <div key={tier}>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-textPrimary">{tier}</span>
                                    <span className="text-textSecondary">{92 - index * 8}% healthy</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-cardMuted">
                                    <div
                                        className="h-full rounded-full bg-sidebar"
                                        style={{ width: `${92 - index * 8}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-textPrimary">
                        Recent Activity
                    </h3>
                    <div className="mt-5 space-y-4">
                        {recentActivity.map((item) => (
                            <div key={item.title} className="border-b border-borderSoft pb-4 last:border-b-0 last:pb-0">
                                <div className="text-sm font-semibold text-textPrimary">
                                    {item.title}
                                </div>
                                <p className="mt-1 text-sm leading-5 text-textSecondary">
                                    {item.detail}
                                </p>
                                <p className="mt-2 text-xs text-textSecondary">{item.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
