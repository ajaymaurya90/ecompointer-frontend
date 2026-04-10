import React from "react";

interface PageShellProps {
    children: React.ReactNode;
    className?: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

/**
 * Standard page wrapper for all dashboard/admin pages.
 * Controls page spacing and vertical rhythm.
 */
export default function PageShell({ children, className }: PageShellProps) {
    return (
        <div
            className={cn(
                "app-shell min-h-full px-2 py-2 md:px-2 md:py-2",
                className
            )}
        >
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
                {children}
            </div>
        </div>
    );
}