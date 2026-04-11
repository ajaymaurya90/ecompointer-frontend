"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";

interface ProductRowActionMenuProps {
    onEdit: () => void;
    onDuplicate: () => void;
    onShowVariants: () => void;
    onDelete: () => void;
}

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function ProductRowActionMenu({
    onEdit,
    onDuplicate,
    onShowVariants,
    onDelete,
}: ProductRowActionMenuProps) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    className="interactive-button inline-flex h-9 w-9 items-center justify-center rounded-xl text-textSecondary transition hover:bg-cardMuted hover:text-textPrimary"
                    aria-label="Open product actions"
                >
                    <MoreVertical size={18} />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={6}
                    collisionPadding={8}
                    className="z-[9999] min-w-[192px] overflow-hidden rounded-xl border border-borderSoft bg-card shadow-md"
                >
                    <DropdownMenu.Item
                        onSelect={onEdit}
                        className={cn(
                            "cursor-pointer px-4 py-3 text-sm text-textPrimary outline-none transition",
                            "hover:bg-cardMuted focus:bg-cardMuted"
                        )}
                    >
                        Edit
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        onSelect={onDuplicate}
                        className={cn(
                            "cursor-pointer px-4 py-3 text-sm text-textPrimary outline-none transition",
                            "hover:bg-cardMuted focus:bg-cardMuted"
                        )}
                    >
                        Duplicate
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        onSelect={onShowVariants}
                        className={cn(
                            "cursor-pointer px-4 py-3 text-sm text-textPrimary outline-none transition",
                            "hover:bg-cardMuted focus:bg-cardMuted"
                        )}
                    >
                        Show Variants
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-borderSoft" />

                    <DropdownMenu.Item
                        onSelect={onDelete}
                        className={cn(
                            "cursor-pointer px-4 py-3 text-sm text-danger outline-none transition",
                            "hover:bg-dangerSoft focus:bg-dangerSoft"
                        )}
                    >
                        Delete
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}