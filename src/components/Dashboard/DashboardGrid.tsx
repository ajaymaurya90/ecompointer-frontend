import Sidebar from "@/components/Layout/Sidebar";
import TopNav from "@/components/Layout/TopNav";
import ProductCard from "@/components/Product/ProductCard";
import ProductSkeleton from "@/components/Product/ProductSkeleton";
import StatCard from "@/components/Dashboard/StatCard";
import { Product } from "@/types";

type DashboardGridProps = {
    products: Product[];
    loading?: boolean;
};

const DashboardGrid = ({ products, loading }: DashboardGridProps) => {
    const totalProducts = products.length;
    /*const totalRevenue = products.reduce(
        (sum, product) => sum + product.price,
        0
    );*/
    const totalRevenue = 5000; // temporary mock data

    const totalOrders = 128; // temporary mock data

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <TopNav />

                <div className="p-6 space-y-6 overflow-auto">

                    {/* 🔥 Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Products" value={totalProducts.toString()} />
                        <StatCard title="Revenue" value={`$${totalRevenue}`} />
                        <StatCard title="Orders" value={totalOrders.toString()} />
                    </div>
                    {/* 🔥 Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading &&
                            Array.from({ length: 6 }).map((_, index) => (
                                <ProductSkeleton key={index} />
                            ))}

                        {!loading && products.length === 0 && (
                            <p className="text-gray-500">No products found.</p>
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