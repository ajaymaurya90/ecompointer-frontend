import SalesChannelEditorPage from "@/modules/settings/pages/SalesChannelEditorPage";

type Props = {
    params: Promise<{ channelId: string }>;
};

export default async function DashboardEditSalesChannelRoute({ params }: Props) {
    const { channelId } = await params;

    return <SalesChannelEditorPage mode="edit" channelId={channelId} />;
}
