import { Metadata } from "next";
import { PostForm } from "@/components/admin/posts/post-form";

export const metadata: Metadata = {
  title: "Tulis Artikel Blog Baru | Admin TJU TRUSS",
};

export default function CreatePostPage() {
  return <PostForm />;
}
