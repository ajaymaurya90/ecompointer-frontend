"use client";

import type { ReactNode } from "react";

export default function MasterDataModal({
    title,
    children,
    onClose,
}: {
    title: string;
    children: ReactNode;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-borderSoft bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-textPrimary">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-borderSoft px-3 py-2 text-sm font-medium text-textPrimary hover:bg-cardMuted"
                    >
                        Close
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
