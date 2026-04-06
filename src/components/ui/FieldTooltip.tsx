"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Info } from "lucide-react";

interface FieldTooltipProps {
    text: string;
    widthClassName?: string;
}

export default function FieldTooltip({
    text,
    widthClassName = "w-72",
}: FieldTooltipProps) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const tooltipId = useId();

    // Close tooltip when user clicks outside.
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close tooltip on Escape for keyboard users.
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function handleToggle() {
        setOpen((prev) => !prev);
    }

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <div
            ref={wrapperRef}
            className="relative inline-flex items-center"
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
        >
            <button
                type="button"
                aria-label="Show help"
                aria-describedby={open ? tooltipId : undefined}
                aria-expanded={open}
                onClick={handleToggle}
                onFocus={handleOpen}
                onBlur={handleClose}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-textSecondary transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                <Info size={15} />
            </button>

            {open ? (
                <div
                    id={tooltipId}
                    role="tooltip"
                    className={`absolute right-0 top-[calc(100%+10px)] z-50 ${widthClassName} rounded-xl border border-borderColorCustom bg-white p-3 text-xs leading-5 text-textSecondary shadow-xl`}
                >
                    <div className="absolute right-2 top-[-6px] h-3 w-3 rotate-45 border-l border-t border-borderColorCustom bg-white" />
                    {text}
                </div>
            ) : null}
        </div>
    );
}