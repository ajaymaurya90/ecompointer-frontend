const users = [
    {
        name: "Ajay Maurya",
        email: "admin@ecompointer.test",
        role: "SUPER_ADMIN",
        status: "Active",
        lastSeen: "Today",
    },
    {
        name: "Owner One",
        email: "owner1@test.com",
        role: "BRAND_OWNER",
        status: "Active",
        lastSeen: "Today",
    },
    {
        name: "Shop Operator",
        email: "shop@test.com",
        role: "SHOP_OWNER",
        status: "Active",
        lastSeen: "Yesterday",
    },
    {
        name: "Pending Owner",
        email: "pending@test.com",
        role: "BRAND_OWNER",
        status: "Review",
        lastSeen: "Never",
    },
];

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-borderSoft bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-textPrimary">
                    Users
                </h2>
                <p className="mt-1 text-sm text-textSecondary">
                    Review platform users, roles, and account status.
                </p>
            </section>

            <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {[
                    { label: "Super Admins", value: "3" },
                    { label: "Brand Owners", value: "128" },
                    { label: "Shop Owners", value: "842" },
                ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-borderSoft bg-white p-5 shadow-sm">
                        <p className="text-sm text-textSecondary">{item.label}</p>
                        <div className="mt-2 text-3xl font-semibold text-textPrimary">
                            {item.value}
                        </div>
                    </div>
                ))}
            </section>

            <section className="overflow-hidden rounded-2xl border border-borderSoft bg-white shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="border-b border-borderSoft bg-cardMuted text-left text-textSecondary">
                        <tr>
                            <th className="px-5 py-4 font-medium">User</th>
                            <th className="px-5 py-4 font-medium">Role</th>
                            <th className="px-5 py-4 font-medium">Status</th>
                            <th className="px-5 py-4 font-medium">Last Seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.email} className="border-b border-borderSoft last:border-b-0">
                                <td className="px-5 py-4">
                                    <div className="font-semibold text-textPrimary">{user.name}</div>
                                    <div className="mt-1 text-xs text-textSecondary">{user.email}</div>
                                </td>
                                <td className="px-5 py-4 text-textPrimary">{user.role}</td>
                                <td className="px-5 py-4">
                                    <span className={`rounded-2xl px-3 py-1 text-xs font-semibold ${
                                        user.status === "Active"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-amber-50 text-amber-700"
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-textPrimary">{user.lastSeen}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
