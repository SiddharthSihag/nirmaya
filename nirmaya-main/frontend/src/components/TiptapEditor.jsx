import React, { useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function TiptapEditor({
  initialContent = "<p></p>",
  onChange,
  uploadUrl = "http://localhost:8000/api/v1/blog/upload-image",
}) {
  const fileInputRef = useRef(null);

  // 🧠 Initialize TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: { class: "rounded-lg my-4" },
      }),
      Link.configure({ openOnClick: true }),
    ],
    content: initialContent,
    autofocus: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // 🧠 Handle file selection and upload
  const handleFileChosen = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // must match backend upload.single("file")

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data?.url) {
        // ✅ Insert uploaded image into the editor
        editor.chain().focus().setImage({ src: response.data.url }).run();
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed");
    } finally {
      // Reset input so same file can be re-uploaded later
      e.target.value = "";
    }
  };

  // 📂 Trigger file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  if (!editor) return null;

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-800 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b dark:border-gray-700">
        {/* Formatting Buttons */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          Bold
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          Italic
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          H2
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          • List
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""}
        >
          1. List
        </Button>

        {/* Right-aligned actions */}
        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
          >
            Undo
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
          >
            Redo
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={openFilePicker}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Image
          </Button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChosen}
          />
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[250px] p-3 prose max-w-none dark:prose-invert">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
