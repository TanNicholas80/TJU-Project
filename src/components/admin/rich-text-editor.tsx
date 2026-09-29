"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis konten artikel di sini...",
  className,
}: RichTextEditorProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ImageExtension.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4 shadow-sm",
        },
      }),
    ],
    content: content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] w-full p-4 focus:outline-none prose prose-zinc max-w-none text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync when props change externally
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "", { emitUpdate: false });
    }
  }, [content, editor]);

  if (!mounted || !editor) {
    return (
      <div className="h-52 w-full rounded-md border border-[#E2E4EB] bg-[#F9F9FB] animate-pulse" />
    );
  }

  const addImage = () => {
    const url = window.prompt("Masukkan URL Gambar:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-[#E2E4EB] bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#20449A]/30 focus-within:border-[#20449A]",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E2E4EB] bg-[#F9F9FB] p-2 text-[#1E1F24]">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-1.5 rounded hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors",
            editor.isActive("bold") ? "bg-[#EEF2FA] text-[#20449A] font-bold" : "text-[#62636C]"
          )}
          title="Tebal (Bold)"
        >
          <Bold className="h-4 w-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-1.5 rounded hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors",
            editor.isActive("italic") ? "bg-[#EEF2FA] text-[#20449A]" : "text-[#62636C]"
          )}
          title="Miring (Italic)"
        >
          <Italic className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-[#E2E4EB] mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "p-1.5 rounded hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors",
            editor.isActive("heading", { level: 1 }) ? "bg-[#EEF2FA] text-[#20449A] font-bold" : "text-[#62636C]"
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "p-1.5 rounded hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors",
            editor.isActive("heading", { level: 2 }) ? "bg-[#EEF2FA] text-[#20449A] font-bold" : "text-[#62636C]"
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "p-1.5 rounded hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors",
            editor.isActive("heading", { level: 3 }) ? "bg-[#EEF2FA] text-[#20449A] font-bold" : "text-[#62636C]"
          )}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-[#E2E4EB] mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-1.5 rounded hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors",
            editor.isActive("bulletList") ? "bg-[#EEF2FA] text-[#20449A]" : "text-[#62636C]"
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-1.5 rounded hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors",
            editor.isActive("orderedList") ? "bg-[#EEF2FA] text-[#20449A]" : "text-[#62636C]"
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "p-1.5 rounded hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors",
            editor.isActive("blockquote") ? "bg-[#EEF2FA] text-[#20449A]" : "text-[#62636C]"
          )}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-[#E2E4EB] mx-1" />

        {/* Image insertion */}
        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-[#EEF2FA] hover:text-[#20449A] text-[#62636C] transition-colors"
          title="Sisipkan Gambar (URL)"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded text-[#62636C] hover:bg-[#EEF2FA] disabled:opacity-40"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded text-[#62636C] hover:bg-[#EEF2FA] disabled:opacity-40"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
