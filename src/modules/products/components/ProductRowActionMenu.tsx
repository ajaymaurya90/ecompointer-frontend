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
            if (
                rootRef.current &&
                !rootRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={rootRef} className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="rounded-lg p-2 text-textSecondary transition hover:bg-background hover:text-textPrimary"
                aria-label="Open product actions"
            >
                <MoreVertical size={18} />
            </button>

            {open ? (
                <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-borderColorCustom bg-white shadow-lg">
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onEdit();
                        }}
                        className="block w-full px-4 py-3 text-left text-sm text-textPrimary transition hover:bg-background"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onDuplicate();
                        }}
                        className="block w-full px-4 py-3 text-left text-sm text-textPrimary transition hover:bg-background"
                    >
                        Duplicate
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onShowVariants();
                        }}
                        className="block w-full px-4 py-3 text-left text-sm text-textPrimary transition hover:bg-background"
                    >
                        Show Variants
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onDelete();
                        }}
                        className="block w-full px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                        Delete
                    </button>
                </div>
            ) : null}
        </div>
    );
}