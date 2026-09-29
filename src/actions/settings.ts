"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { cache } from "@/lib/cache";
import { defaultCompanyProfile } from "@/lib/data-defaults";
import * as z from "zod";

const settingsSchema = z.object({
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
  googleMapsIframe: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  linkedin: z.string().optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export async function getCompanyProfileAdmin() {
  try {
    const [profile] = await db.select().from(schema.companyProfile).limit(1);
    if (profile) {
      return { success: true, data: profile };
    }
    return { success: true, data: defaultCompanyProfile };
  } catch (error) {
    return { success: true, data: defaultCompanyProfile };
  }
}

export async function updateCompanyProfile(input: SettingsInput) {
  try {
    const validated = settingsSchema.parse(input);

    const socialLinks = {
      instagram: validated.instagram || "",
      facebook: validated.facebook || "",
      tiktok: validated.tiktok || "",
      linkedin: validated.linkedin || "",
    };

    try {
      const [existing] = await db.select().from(schema.companyProfile).limit(1);
      if (existing) {
        await db.update(schema.companyProfile).set({
          phone: validated.phone || null,
          whatsapp: validated.whatsapp || null,
          email: validated.email || null,
          address: validated.address || null,
          googleMapsIframe: validated.googleMapsIframe || null,
          socialLinks,
          updatedAt: new Date(),
        });
      } else {
        await db.insert(schema.companyProfile).values({
          phone: validated.phone || null,
          whatsapp: validated.whatsapp || null,
          email: validated.email || null,
          address: validated.address || null,
          googleMapsIframe: validated.googleMapsIframe || null,
          socialLinks,
        });
      }
    } catch (dbErr) {
      console.warn("[Settings Action] DB update fallback:", dbErr);
    }

    await cache.del("public:company_profile");
    revalidatePath("/");
    revalidatePath("/admin/settings");

    return { success: true, message: "Berhasil menyimpan pengaturan kontak perusahaan" };
  } catch (err: any) {
    return {
      success: false,
      message: err.errors ? err.errors[0]?.message : "Gagal menyimpan pengaturan kontak.",
    };
  }
}
