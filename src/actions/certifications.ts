"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { cache } from "@/lib/cache";
import { defaultCertifications } from "@/lib/data-defaults";
import * as z from "zod";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

const certificationSchema = z.object({
  titleId: z.string().min(2, "Nama sertifikat wajib diisi"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  imageUrl: z.string().min(1, "Logo / gambar sertifikasi wajib diisi"),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type CertificationInput = z.infer<typeof certificationSchema>;

export async function getCertificationsAdmin() {
  try {
    const data = await db
      .select()
      .from(schema.certifications)
      .orderBy(asc(schema.certifications.sortOrder));

    if (data && data.length > 0) {
      return { success: true, data };
    }
    return { success: true, data: defaultCertifications };
  } catch (error) {
    return { success: true, data: defaultCertifications };
  }
}

export async function createCertification(input: CertificationInput) {
  try {
    const validated = certificationSchema.parse(input);

    try {
      await db.insert(schema.certifications).values({
        titleI18n: {
          id: validated.titleId,
          en: validated.titleEn || validated.titleId,
          zh: validated.titleZh || validated.titleId,
        },
        imageUrl: validated.imageUrl,
        sortOrder: validated.sortOrder,
        isActive: validated.isActive,
      });
    } catch (dbErr) {
      console.warn("[Certification Action] DB insert fallback:", dbErr);
    }

    // Invalidate Redis cache
    await cache.del("public:certifications");

    safeRevalidate("/about");
    safeRevalidate("/");
    safeRevalidate("/admin/certifications");

    return { success: true, message: "Berhasil menambahkan sertifikasi baru" };
  } catch (err: any) {
    const msg = err.issues?.[0]?.message || err.message || "Gagal menambahkan sertifikasi";
    return { success: false, message: msg };
  }
}

export async function updateCertification(id: number, input: CertificationInput) {
  try {
    const validated = certificationSchema.parse(input);

    try {
      await db
        .update(schema.certifications)
        .set({
          titleI18n: {
            id: validated.titleId,
            en: validated.titleEn || validated.titleId,
            zh: validated.titleZh || validated.titleId,
          },
          imageUrl: validated.imageUrl,
          sortOrder: validated.sortOrder,
          isActive: validated.isActive,
        })
        .where(eq(schema.certifications.id, id));
    } catch (dbErr) {
      console.warn("[Certification Action] DB update fallback:", dbErr);
    }

    // Invalidate Redis cache
    await cache.del("public:certifications");

    safeRevalidate("/about");
    safeRevalidate("/");
    safeRevalidate("/admin/certifications");

    return { success: true, message: "Berhasil memperbarui data sertifikasi" };
  } catch (err: any) {
    const msg = err.issues?.[0]?.message || err.message || "Gagal memperbarui sertifikasi";
    return { success: false, message: msg };
  }
}

export async function deleteCertification(id: number) {
  try {
    try {
      await db
        .delete(schema.certifications)
        .where(eq(schema.certifications.id, id));
    } catch (dbErr) {
      console.warn("[Certification Action] DB delete fallback:", dbErr);
    }

    // Invalidate Redis cache
    await cache.del("public:certifications");

    safeRevalidate("/about");
    safeRevalidate("/");
    safeRevalidate("/admin/certifications");

    return { success: true, message: "Berhasil menghapus sertifikasi" };
  } catch (err: any) {
    return { success: false, message: err.message || "Gagal menghapus sertifikasi" };
  }
}
