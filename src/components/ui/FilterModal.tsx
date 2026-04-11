"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface FilterModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
}

export default function FilterModal({
    open,
    title,
    onClose,
    children,
    footer,
}: FilterModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-overlay px-4 py-6">
            <div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-borderSoft">
                <div className="table-header flex items-center justify-between px-8 py-6">
                    <h2 className="text-2xl font-semibold text-textPrimary">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="interactive-button inline-flex h-11 w-11 items-center justify-center rounded-2xl text-textSecondary hover:bg-cardMuted hover:text-textPrimary"
                        aria-label="Close filters"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8">
                    {children}
                </div>

                {footer ? (
                    <div className="table-footer px-8 py-5">
                        {footer}
                    </div>
                ) : null}
            </div>
        </div>
    );
}