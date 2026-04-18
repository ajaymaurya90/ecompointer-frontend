import MailTemplateFormPage from "@/modules/super-admin/mail-templates/pages/MailTemplateFormPage";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <MailTemplateFormPage templateId={id} />;
}

