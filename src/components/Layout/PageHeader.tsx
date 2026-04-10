import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

/**
 * Standard page header for management screens.
 * Keeps title / description / actions consistent across pages.
 */
export default function PageHeader({
    title,
    description,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <section
            className={cn(
                "flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between",
                className
            )}
        >
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-textPrimary">
                    {title}
                </h1>

                {description ? (
                    <p className="max-w-3xl text-sm leading-6 text-textSecondary">
                        {description}
                    </p>
                ) : null}
            </div>

            {actions ? (
                <div className="flex flex-wrap items-center gap-3">{actions}</div>
            ) : null}
        </section>
    );
}