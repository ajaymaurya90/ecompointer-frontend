import type { ReactNode } from "react";
import SettingsLayoutShell from "@/modules/settings/components/SettingsLayoutShell";

type SettingsLayoutProps = {
    children: ReactNode;
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return <SettingsLayoutShell>{children}</SettingsLayoutShell>;
}
