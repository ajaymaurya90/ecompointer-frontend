export default function DashboardHome() {
    return (
        <div className="space-y-6">

            {/* Welcome Section */}
            <div className="bg-card rounded-2xl border border-borderColorCustom p-6">
                <h2 className="text-2xl font-semibold text-textPrimary">
                    Welcome back 👋
                </h2>

                <p className="mt-2 text-textSecondary">
                    Manage your products, inventory and brand performance from your dashboard.
                </p>
            </div>

            {/* Placeholder for Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-card rounded-2xl border border-borderColorCustom p-6">
                    <p className="text-sm text-textSecondary">Total Products</p>
                    <h3 className="mt-2 text-2xl font-semibold text-textPrimary">
                        0
                    </h3>
                </div>

                <div className="bg-card rounded-2xl border border-borderColorCustom p-6">
                    <p className="text-sm text-textSecondary">Total Categories</p>
                    <h3 className="mt-2 text-2xl font-semibold text-textPrimary">
                        0
                    </h3>
                </div>

                <div className="bg-card rounded-2xl border border-borderColorCustom p-6">
                    <p className="text-sm text-textSecondary">Revenue</p>
                    <h3 className="mt-2 text-2xl font-semibold text-textPrimary">
                        ₹0
                    </h3>
                </div>

            </div>
        </div>
    );
}