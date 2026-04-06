"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Eraser,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxCharacters?: number;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    label: string;
    children: React.ReactNode;
}

function ToolbarButton({
    onClick,
    isActive = false,
    label,
    children,
}: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            aria-label={label}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${isActive
                ? "border-primary bg-blue-50 text-primary"
                : "border-transparent text-textSecondary hover:border-borderColorCustom hover:bg-background hover:text-textPrimary"
                }`}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Write something...",
    maxCharacters = 5000,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
            }),
            Placeholder.configure({
                placeholder,
            }),
            CharacterCount.configure({
                limit: maxCharacters,
            }),
        ],
        content: value || "",
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class:
                    "min-h-[220px] px-4 py-3 outline-none prose prose-sm max-w-none text-textPrimary",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Keep editor content in sync when external form state changes.
    useEffect(() => {
        if (!editor) return;

        const currentHtml = editor.getHTML();
        const nextHtml = value || "";

        if (currentHtml !== nextHtml) {
            editor.commands.setContent(nextHtml, {
                emitUpdate: false,
            });
        }
    }, [editor, value]);

    if (!editor) {
        return (
            <div className="rounded-lg border border-borderColorCustom bg-white">
                <div className="min-h-[220px] px-4 py-3 text-sm text-textSecondary">
                    Loading editor...
                </div>
            </div>
        );
    }

    const characterCount = editor.storage.characterCount.characters();

    function handleSetLink() {
        if (!editor) {
            return;
        }

        const attributes = editor.getAttributes("link") as { href?: string };
        const previousUrl = attributes.href || "";
        const url = window.prompt("Enter URL", previousUrl);

        if (url === null) {
            return;
        }

        if (url.trim() === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url.trim() })
            .run();
    }

    return (
        <div className="overflow-hidden rounded-lg border border-borderColorCustom bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-borderColorCustom px-3 py-2">
                <ToolbarButton
                    label="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                >
                    <Bold size={16} />
                </ToolbarButton>

                <ToolbarButton
                    label="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                >
                    <Italic size={16} />
                </ToolbarButton>

                <ToolbarButton
                    label="Underline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                >
                    <UnderlineIcon size={16} />
                </ToolbarButton>

                <ToolbarButton
                    label="Heading 1"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 1 })}
                >
                    <Heading1 size={16} />
                </ToolbarButton>

                <ToolbarButton
                    label="Heading 2"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 2 })}
                >
                    <Heading2 size={16} />
                </ToolbarButton>

                <ToolbarButton
                    label="Bullet List"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                >
                    <List size={16} />
                </ToolbarButton>

                <ToolbarButton
                    label="Ordered List"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                >
                    <ListOrdered size={16} />
                </ToolbarButton>

                <ToolbarButton
                    label="Link"
                    onClick={handleSetLink}
                    isActive={editor.isActive("link")}
                >
                    <LinkIcon size={16} />
                </ToolbarButton>

                <ToolbarButton
                    label="Clear Formatting"
                    onClick={() =>
                        editor.chain().focus().unsetAllMarks().clearNodes().run()
                    }
                >
                    <Eraser size={16} />
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} />

            <div className="flex items-center justify-end border-t border-borderColorCustom px-4 py-2 text-xs text-textSecondary">
                {characterCount} / {maxCharacters} characters
            </div>
        </div>
    );
}