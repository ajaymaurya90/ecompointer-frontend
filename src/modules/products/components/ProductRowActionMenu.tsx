"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

    const rootRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useLayoutEffect(() => {
        if (!open || !buttonRef.current || !menuRef.current) return;

        const buttonRect = buttonRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current.offsetHeight;
        const menuWidth = menuRef.current.offsetWidth;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const gap = 8;

        let top = buttonRect.bottom + gap;
        let left = buttonRect.right - menuWidth;

        if (top + menuHeight > viewportHeight - 8) {
            top = buttonRect.top - menuHeight - gap;
        }

        if (left < 8) {
            left = 8;
        }

        if (left + menuWidth > viewportWidth - 8) {
            left = viewportWidth - menuWidth - 8;
        }

        setMenuStyle({
            position: "fixed",
            top,
            left,
            zIndex: 9999,
        });
    }, [open]);

    const handleAction = (callback: () => void) => {
        setOpen(false);
        callback();
    };

    return (
        <div ref={rootRef} className="relative inline-block text-left">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="interactive-button inline-flex h-9 w-9 items-center justify-center rounded-xl text-textSecondary transition hover:bg-cardMuted hover:text-textPrimary"
                aria-label="Open product actions"
            >
                <MoreVertical size={18} />
            </button>

            {open ? (
                <div
                    ref={menuRef}
                    style={menuStyle}
                    className="w-48 overflow-hidden rounded-xl border border-borderSoft bg-card shadow-md"
                >
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