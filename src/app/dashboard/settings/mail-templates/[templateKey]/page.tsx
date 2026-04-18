import MailTemplateConfigPage from "@/modules/settings/mail-templates/pages/MailTemplateConfigPage";

export default async function Page({
    params,
}: {
    params: Promise<{ templateKey: string }>;
}) {
    const { templateKey } = await params;
    return <MailTemplateConfigPage templateKey={decodeURIComponent(templateKey)} />;
}

