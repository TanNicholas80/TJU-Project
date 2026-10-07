import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  phone: z
    .string()
    .trim()
    .min(8, "Nomor telepon minimal 8 digit")
    .max(20, "Nomor telepon maksimal 20 digit")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid"),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Detail proyek minimal 5 karakter")
    .max(3000, "Pesan maksimal 3000 karakter"),
  honeypot: z.string().optional(),
  turnstileToken: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
