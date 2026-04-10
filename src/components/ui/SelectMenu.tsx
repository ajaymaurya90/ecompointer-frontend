"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectMenuProps {
    value: string | number;
    options: SelectOption[];
    onChange: (value: string) => void;
    label?: string;
    className?: string;
    buttonClassName?: string;
    menuWidthClassName?: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function SelectMenu({
    value,
    options,
    onChange,
    label,
    className,
    buttonClassName,
    menuWidthClassName = "w-28",
}: SelectMenuProps) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isPositioned, setIsPositioned] = useState(false);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({
        position: "fixed",
        top: 0,
        left: 0,
        visibility: "hidden",
        zIndex: 9999,
    });

    const rootRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.value === value)
    );

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        setMounted(true);
    }, []);

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
        const menuRect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const optionHeight = 42;
        const selectedOffset = selectedIndex * optionHeight;

        let top = buttonRect.top - selectedOffset;
        let left = buttonRect.left;

        if (left + menuRect.width > viewportWidth - 8) {
            left = viewportWidth - menuRect.width - 8;
        }

        if (left < 8) {
            left = 8;
        }

        if (top + menuRect.height > viewportHeight - 8) {
            top = viewportHeight - menuRect.height - 8;
        }

        if (top < 8) {
            top = 8;
        }

        setMenuStyle({
            position: "fixed",
            top,
            left,
            minWidth: buttonRect.width,
            zIndex: 9999,
            visibility: "visible",
        });

        setIsPositioned(true);
    }, [open, selectedIndex]);

    const handleToggle = () => {
        if (!open) {
            setIsPositioned(false);
            setMenuStyle({
                position: "fixed",
                top: 0,
                left: 0,
                visibility: "hidden",
                zIndex: 9999,
            });
        }

        setOpen((prev) => !prev);
    };

    const menu = open ? (
        <div
            ref={menuRef}
            style={menuStyle}
            className={cn(
                "overflow-hidden rounded-xl border border-borderSoft bg-elevated shadow-md",
                menuWidthClassName,
                isPositioned ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            role="listbox"
        >
            {options.map((option) => {
                const isSelected = option.value === value;

                return (
                    <button
                        key={String(option.value)}
                        type="button"
                        onClick={() => {
                            onChange(String(option.value));
                            setOpen(false);
                        }}
                        className={cn(
                            "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition",
                            isSelected
                                ? "bg-cardMuted text-textPrimary"
                                : "text-textPrimary hover:bg-cardMuted"
                        )}
                        role="option"
                        aria-selected={isSelected}
                    >
                        <span>{option.label}</span>
                        {isSelected ? (
                            <Check size={14} className="text-primary" />
                        ) : null}
                    </button>
                );
            })}
        </div>
    ) : null;

    return (
        <div ref={rootRef} className={cn("relative inline-flex items-center gap-3", className)}>
            {label ? (
                <span className="text-sm font-medium text-textSecondary">{label}</span>
            ) : null}

            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className={cn(
                    "interactive-button inline-flex h-11 items-center justify-between gap-3 rounded-xl bg-card px-4 text-sm font-medium text-textPrimary ring-1 ring-borderSoft shadow-sm hover:bg-cardMuted",
                    buttonClassName
                )}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span>{selectedOption?.label ?? value}</span>
                <ChevronDown size={16} className="text-textSecondary" />
            </button>

            {mounted && menu ? createPortal(menu, document.body) : null}
        </div>
    );
}