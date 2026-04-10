"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

interface ProductRowActionMenuProps {
    onEdit: () => void;
    onDuplicate: () => void;
    onShowVariants: () => void;
    onDelete: () => void;
}

export default function ProductRowActionMenu({
    onEdit,
    onDuplicate,
    onShowVariants,
    onDelete,
}: ProductRowActionMenuProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAction = (callback: () => void) => {
        setOpen(false);
        callback();
    };

    return (
        <div ref={rootRef} className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="interactive-button inline-flex h-9 w-9 items-center justify-center rounded-xl text-textSecondary transition hover:bg-cardMuted hover:text-textPrimary"
                aria-label="Open product actions"
            >
                <MoreVertical size={18} />
            </button>

            {open ? (
                <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-borderSoft bg-card shadow-md">
                    <button
                        type="button"
                        onClick={() => handleAction(onEdit)}
                        className="block w-full px-4 py-3 text-left text-sm text-textPrimary transition hover:bg-cardMuted"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => handleAction(onDuplicate)}
                        className="block w-full px-4 py-3 text-left text-sm text-textPrimary transition hover:bg-cardMuted"
                    >
                        Duplicate
                    </button>

                    <button
                        type="button"
                        onClick={() => handleAction(onShowVariants)}
                        className="block w-full px-4 py-3 text-left text-sm text-textPrimary transition hover:bg-cardMuted"
                    >
                        Show Variants
                    </button>

                    <div className="border-t border-borderSoft" />

                    <button
                        type="button"
                        onClick={() => handleAction(onDelete)}
                        className="block w-full px-4 py-3 text-left text-sm text-danger transition hover:bg-dangerSoft"
                    >
                        Delete
                    </button>
                </div>
            ) : null}
        </div>
    );
}