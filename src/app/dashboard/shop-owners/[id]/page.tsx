import ShopOwnerDetailPage from "@/modules/shop-owners/pages/ShopOwnerDetailPage";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <ShopOwnerDetailPage shopOwnerId={id} />;
}