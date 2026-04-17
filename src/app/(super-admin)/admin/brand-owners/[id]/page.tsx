import BrandOwnerDetailPage from "@/modules/super-admin/pages/BrandOwnerDetailPage";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function AdminBrandOwnerDetailRoute({ params }: Props) {
    const { id } = await params;
    return <BrandOwnerDetailPage id={id} />;
}
