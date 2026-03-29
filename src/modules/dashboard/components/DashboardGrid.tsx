import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import ProductCard from "@/modules/products/components/ProductCard";
import ProductSkeleton from "@/modules/products/components/ProductSkeleton";
import StatCard from "@/modules/dashboard/components/StatCard";
import type { Product } from "@/modules/products/types/product";

type DashboardGridProps = {
    products: Product[];
    loading?: boolean;
};

const DashboardGrid = ({ products, loading }: DashboardGridProps) => {
    const totalProducts = products.length;
    const totalRevenue = 5000;

    return (
        <div className="flex h-screen app-shell">
            <Sidebar />

            <div className="flex-1 flex flex-col app-shell">
                <TopNav />

                <div className="p-10 space-y-8 overflow-auto app-shell">
                    <div className="relative rounded-3xl app-card p-8 overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-2 bg-primary"></div>

                        <div className="relative z-10 pl-2">
                            <h2 className="text-4xl font-semibold tracking-tight app-text-primary">
                                Welcome back 👋
                            </h2>

                            <p className="mt-3 text-lg app-text-secondary max-w-2xl">
                                Manage your products, inventory and brand performance from your dashboard.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                        <StatCard title="Total Products" value={totalProducts.toString()} />
                        <StatCard title="Total Categories" value="0" />
                        <StatCard title="Revenue" value={`₹${totalRevenue}`} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading &&
                            Array.from({ length: 6 }).map((_, index) => (
                                <ProductSkeleton key={index} />
                            ))}

                        {!loading && products.length === 0 && (
                            <div className="col-span-full rounded-2xl app-card p-8 text-center">
                                <p className="app-text-secondary">No products found.</p>
                            </div>
                        )}

                        {!loading &&
                            products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardGrid;