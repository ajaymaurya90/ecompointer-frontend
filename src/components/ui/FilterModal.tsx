"use client";

import { ReactNode, useEffect } from "react";
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
    useEffect(() => {
        if (!open) return;

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-borderColorCustom bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-borderColorCustom px-6 py-4">
                    <h3 className="text-xl font-semibold text-textPrimary">{title}</h3>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-textSecondary transition hover:bg-background hover:text-textPrimary"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-auto px-6 py-6">{children}</div>

                {footer ? (
                    <div className="border-t border-borderColorCustom px-6 py-4">
                        {footer}
                    </div>
                ) : null}
            </div>
        </div>
    );
}