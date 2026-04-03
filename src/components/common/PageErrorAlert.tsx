"use client";

/**
 * ---------------------------------------------------------
 * PAGE ERROR ALERT
 * ---------------------------------------------------------
 * Purpose:
 * Shared UI component for rendering a consistent page-level
 * error box across forms, detail pages, and workflow pages.
 * ---------------------------------------------------------
 */

type Props = {
    error?: string | null;
};

export default function PageErrorAlert({ error }: Props) {
    if (!error) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
        </div>
    );
}