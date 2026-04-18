"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SettingsNav from "@/modules/settings/components/SettingsNav";

type SettingsLayoutShellProps = {
    children: ReactNode;
};

export default function SettingsLayoutShell({ children }: SettingsLayoutShellProps) {
    const pathname = usePathname();
    const isSalesChannelFlow = pathname.startsWith("/dashboard/settings/sales-channels");
    const isMailTemplateFlow = pathname.startsWith("/dashboard/settings/mail-templates");

    if (isSalesChannelFlow || isMailTemplateFlow) {
        return <div className="space-y-6">{children}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-borderSoft bg-white p-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-sm text-slate-500">
                        Configure your account, business location, and preferences.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
                <div>
                    <SettingsNav />
                </div>

                <div className="min-w-0">{children}</div>
            </div>
        </div>
    );
}
