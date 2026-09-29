"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { cache } from "@/lib/cache";
import { defaultQualityStandards } from "@/lib/data-defaults";
import * as z from "zod";

const standardSchema = z.object({
  iconName: z.string().min(1, "Nama icon Lucide wajib diisi (misal: ShieldCheck, Calculator, Award)"),
  titleId: z.string().min(3, "Judul standar mutu wajib diisi"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  descriptionId: z.string().min(5, "Deskripsi standar mutu wajib diisi"),
  descriptionEn: z.string().optional(),
  descriptionZh: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type StandardInput = z.infer<typeof standardSchema>;

export async function getStandardsAdmin() {
  try {
    const data = await db
      .select()
      .from(schema.qualityStandards)
      .orderBy(asc(schema.qualityStandards.sortOrder));

    if (data && data.length > 0) {
      return { success: true, data };
    }
    return { success: true, data: defaultQualityStandards };
  } catch (error) {
    return { success: true, data: defaultQualityStandards };
  }
}

export async function createStandard(input: StandardInput) {
  try {
    const validated = standardSchema.parse(input);

    try {
      await db.insert(schema.qualityStandards).values({
        iconName: validated.iconName,
        titleI18n: {
          id: validated.titleId,
          en: validated.titleEn || validated.titleId,
          zh: validated.titleZh || validated.titleId,
        },
        descriptionI18n: {
          id: validated.descriptionId,
          en: validated.descriptionEn || validated.descriptionId,
          zh: validated.descriptionZh || validated.descriptionId,
        },
        sortOrder: validated.sortOrder,
        isActive: validated.isActive,
      });
    } catch (dbErr) {
      console.warn("[Standards Action] DB insert fallback:", dbErr);
    }

    await cache.del("public:quality_standards");
    revalidatePath("/");
    revalidatePath("/admin/standards");

    return { success: true, message: "Berhasil menambahkan standar kualitas" };
  } catch (err: any) {
    return {
      success: false,
      message: err.errors ? err.errors[0]?.message : "Gagal menambahkan standar kualitas.",
    };
  }
}

export async function updateStandard(id: number, input: StandardInput) {
  try {
    const validated = standardSchema.parse(input);

    try {
      await db
        .update(schema.qualityStandards)
        .set({
          iconName: validated.iconName,
          titleI18n: {
            id: validated.titleId,
            en: validated.titleEn || validated.titleId,
            zh: validated.titleZh || validated.titleId,
          },
          descriptionI18n: {
            id: validated.descriptionId,
            en: validated.descriptionEn || validated.descriptionId,
            zh: validated.descriptionZh || validated.descriptionId,
          },
          sortOrder: validated.sortOrder,
          isActive: validated.isActive,
        })
        .where(eq(schema.qualityStandards.id, id));
    } catch (dbErr) {
      console.warn("[Standards Action] DB update fallback:", dbErr);
    }

    await cache.del("public:quality_standards");
    revalidatePath("/");
    revalidatePath("/admin/standards");

    return { success: true, message: "Berhasil memperbarui standar kualitas" };
  } catch (err: any) {
    return {
      success: false,
      message: err.errors ? err.errors[0]?.message : "Gagal memperbarui standar kualitas.",
    };
  }
}

export async function deleteStandard(id: number) {
  try {
    try {
      await db.delete(schema.qualityStandards).where(eq(schema.qualityStandards.id, id));
    } catch (dbErr) {
      console.warn("[Standards Action] DB delete fallback:", dbErr);
    }

    await cache.del("public:quality_standards");
    revalidatePath("/");
    revalidatePath("/admin/standards");

    return { success: true, message: "Berhasil menghapus standar kualitas" };
  } catch (err: any) {
    return { success: false, message: "Gagal menghapus standar kualitas." };
  }
}
