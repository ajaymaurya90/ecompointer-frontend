import React from "react";

interface DataPanelProps {
    title?: string;
    description?: string;
    headerContent?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    bodyClassName?: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

/**
 * Standard content panel for list/table driven pages.
 * Structure:
 * - panel header
 * - panel content
 * - panel footer
 */
export default function DataPanel({
    title,
    description,
    headerContent,
    children,
    footer,
    className,
    bodyClassName,
}: DataPanelProps) {
    const hasHeader = title || description || headerContent;

    return (
        <section
            className={cn(
                "overflow-hidden rounded-xl bg-card shadow-card",
                className
            )}
        >
            {hasHeader ? (
                <div className="flex flex-col gap-4 bg-cardMuted px-6 py-5 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        {title ? (
                            <h2 className="text-xl font-semibold text-textPrimary">
                                {title}
                            </h2>
                        ) : null}

                        {description ? (
                            <p className="text-sm text-textSecondary">{description}</p>
                        ) : null}
                    </div>

                    {headerContent ? (
                        <div className="flex flex-wrap items-center gap-3">
                            {headerContent}
                        </div>
                    ) : null}
                </div>
            ) : null}

            <div className={cn("min-w-0", bodyClassName)}>{children}</div>

            {footer ? (
                <div className="table-footer px-6 py-4">{footer}</div>
            ) : null}
        </section>
    );
}