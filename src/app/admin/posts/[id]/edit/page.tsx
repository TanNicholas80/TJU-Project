import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/posts/post-form";
import { getPostByIdAdmin } from "@/actions/posts";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPostPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Artikel #${id} | Admin TJU TRUSS`,
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const res = await getPostByIdAdmin(id);
  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="w-full">
      <PostForm initialData={res.data} postId={id} isEdit={true} />
    </div>
  );
}
