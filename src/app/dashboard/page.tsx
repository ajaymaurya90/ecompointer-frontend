export default function DashboardHome() {
    return (
        <div className="space-y-6">

            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-2xl font-semibold text-slate-800">
                    Welcome back 👋
                </h2>

                <p className="mt-2 text-slate-600">
                    Manage your products, inventory and brand performance from your dashboard.
                </p>
            </div>

            {/* Placeholder for Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <p className="text-sm text-slate-500">Total Products</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-800">
                        0
                    </h3>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <p className="text-sm text-slate-500">Total Categories</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-800">
                        0
                    </h3>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <p className="text-sm text-slate-500">Revenue</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-800">
                        ₹0
                    </h3>
                </div>

            </div>
        </div>
    );
}