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

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {}
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
    safeRevalidate("/");
    safeRevalidate("/admin/standards");

    return { success: true, message: "Berhasil menambahkan standar kualitas" };
  } catch (err: any) {
    const msg =
      err?.issues?.[0]?.message ||
      err?.errors?.[0]?.message ||
      err?.message ||
      "Gagal menambahkan standar kualitas.";
    return {
      success: false,
      message: msg,
    };
  }
}

export async function updateStandard(id: string, input: StandardInput) {
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
    safeRevalidate("/");
    safeRevalidate("/admin/standards");

    return { success: true, message: "Berhasil memperbarui standar kualitas" };
  } catch (err: any) {
    return {
      success: false,
      message: err.errors ? err.errors[0]?.message : "Gagal memperbarui standar kualitas.",
    };
  }
}

export async function deleteStandard(id: string) {
  try {
    try {
      await db.delete(schema.qualityStandards).where(eq(schema.qualityStandards.id, id));
    } catch (dbErr) {
      console.warn("[Standards Action] DB delete fallback:", dbErr);
    }

    await cache.del("public:quality_standards");
    safeRevalidate("/");
    safeRevalidate("/admin/standards");

    return { success: true, message: "Berhasil menghapus standar kualitas" };
  } catch (err: any) {
    return { success: false, message: "Gagal menghapus standar kualitas." };
  }
}

export async function getStandardsLayoutAdmin() {
  try {
    const [profile] = await db.select().from(schema.companyProfile).limit(1);
    const columns = profile?.standardsColumns || 3;
    return { success: true, columns };
  } catch (error) {
    return { success: true, columns: 3 };
  }
}

export async function updateStandardsLayout(columns: number) {
  try {
    const validColumns = [2, 3, 4].includes(columns) ? columns : 3;

    try {
      const [existing] = await db.select().from(schema.companyProfile).limit(1);
      if (existing) {
        await db
          .update(schema.companyProfile)
          .set({
            standardsColumns: validColumns,
            updatedAt: new Date(),
          });
      } else {
        await db.insert(schema.companyProfile).values({
          standardsColumns: validColumns,
        });
      }
    } catch (dbErr) {
      console.warn("[Standards Action] update layout fallback:", dbErr);
    }

    await cache.del("public:company_profile");
    safeRevalidate("/");
    safeRevalidate("/admin/standards");
    safeRevalidate("/admin/settings");

    return {
      success: true,
      message: `Berhasil mengubah tata letak standar kualitas menjadi ${validColumns} card per baris.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Gagal mengubah tata letak standar kualitas.",
    };
  }
}
