const settings = [
    {
        title: "Tenant Approvals",
        description: "Require manual review before a new Brand Owner goes live.",
        enabled: true,
    },
    {
        title: "Domain Verification",
        description: "Keep storefront custom domains in pending state until verified.",
        enabled: true,
    },
    {
        title: "Maintenance Banner",
        description: "Show a platform-wide notice during scheduled work.",
        enabled: false,
    },
];

export default function PlatformSettingsPage() {
    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-textPrimary">
                    Platform Settings
                </h2>
                <p className="mt-1 text-sm text-textSecondary">
                    Configure global controls for tenant operations and platform safety.
                </p>
            </section>

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {settings.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-borderSoft bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-textPrimary">{item.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-textSecondary">
                                    {item.description}
                                </p>
                            </div>
                            <span className={`rounded-2xl px-3 py-1 text-xs font-semibold ${
                                item.enabled
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-600"
                            }`}>
                                {item.enabled ? "On" : "Off"}
                            </span>
                        </div>
                    </div>
                ))}
            </section>

            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-textPrimary">
                    Environment
                </h3>
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {[
                        ["API Region", "India Primary"],
                        ["Default Currency", "INR"],
                        ["Data Mode", "Production"],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-borderSoft bg-cardMuted p-4">
                            <div className="text-xs font-medium uppercase tracking-wide text-textSecondary">
                                {label}
                            </div>
                            <div className="mt-2 font-semibold text-textPrimary">{value}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
