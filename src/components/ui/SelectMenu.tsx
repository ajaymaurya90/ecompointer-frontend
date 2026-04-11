"use client";

import * as Select from "@radix-ui/react-select";
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
    triggerClassName?: string;
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
    triggerClassName,
}: SelectMenuProps) {
    return (
        <div className={cn("inline-flex items-center gap-3", className)}>
            {label ? (
                <span className="text-sm font-medium text-textSecondary">
                    {label}
                </span>
            ) : null}

            <Select.Root
                value={String(value)}
                onValueChange={onChange}
            >
                {/* Trigger */}
                <Select.Trigger
                    className={cn(
                        "interactive-button inline-flex h-11 items-center justify-between gap-3 rounded-xl bg-card px-4 text-sm font-medium text-textPrimary ring-1 ring-borderSoft shadow-sm hover:bg-cardMuted",
                        triggerClassName
                    )}
                >
                    <Select.Value />

                    <Select.Icon>
                        <ChevronDown size={16} className="text-textSecondary" />
                    </Select.Icon>
                </Select.Trigger>

                {/* Dropdown */}
                <Select.Portal>
                    <Select.Content
                        side="top" // 👈 opens ABOVE like you wanted
                        align="start"
                        sideOffset={6}
                        className="z-[9999] overflow-hidden rounded-xl border border-borderSoft bg-elevated shadow-md"
                    >
                        <Select.Viewport className="p-1">
                            {options.map((option) => (
                                <Select.Item
                                    key={option.value}
                                    value={String(option.value)}
                                    className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2.5 text-sm text-textPrimary outline-none transition hover:bg-cardMuted data-[state=checked]:bg-cardMuted"
                                >
                                    <Select.ItemText>
                                        {option.label}
                                    </Select.ItemText>

                                    <Select.ItemIndicator>
                                        <Check size={14} className="text-primary" />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
    );
}