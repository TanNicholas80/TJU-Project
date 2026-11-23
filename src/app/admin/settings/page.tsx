"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
  Loader2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCompanyProfileAdmin,
  updateCompanyProfile,
  SettingsInput,
} from "@/actions/settings";

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
  standardsColumns: z.coerce.number().min(2).max(4).optional().default(3),
  carouselInterval: z.coerce.number().min(3).max(30).optional().default(6),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema) as any,
  });

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const res = await getCompanyProfileAdmin();
        if (res.success && res.data) {
          const profile = res.data;
          reset({
            phone: profile.phone || "",
            whatsapp: profile.whatsapp || "",
            email: profile.email || "",
            address: profile.address || "",
            googleMapsIframe: profile.googleMapsIframe || "",
            instagram: profile.socialLinks?.instagram || "",
            facebook: profile.socialLinks?.facebook || "",
            tiktok: profile.socialLinks?.tiktok || "",
            linkedin: profile.socialLinks?.linkedin || "",
            standardsColumns: profile.standardsColumns || 3,
            carouselInterval: profile.socialLinks?.carouselInterval || 6,
          });
        }
      } catch {
        toast.error("Gagal memuat pengaturan profil perusahaan");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      const res = await updateCompanyProfile(data as SettingsInput);
      if (res.success) {
        toast.success(res.message || "Berhasil menyimpan pengaturan");
      } else {
        toast.error("Gagal: " + res.message);
      }
    } catch (err: any) {
      toast.error("Gagal menyimpan data: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-[#E2E4EB] bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#20449A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-[#1E1F24]">
          Pengaturan Kontak & Profil Perusahaan
        </h2>
        <p className="text-sm text-[#62636C]">
          Konfigurasi nomor telepon, WhatsApp, email, alamat kantor, dan tautan sosial media yang tampil di footer dan section kontak.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Kontak Utama */}
        <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E4EB]">
            <Phone className="h-5 w-5 text-[#20449A]" />
            <h3 className="text-base font-bold text-[#1E1F24]">
              Kontak Kantor & Layanan Pelanggan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                Telepon Kantor
              </label>
              <input
                type="text"
                placeholder="(024) 3519 776"
                {...register("phone")}
                className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                Nomor WhatsApp Resmi
              </label>
              <input
                type="text"
                placeholder="+62 812-3456-7890"
                {...register("whatsapp")}
                className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                Email Resmi Perusahaan
              </label>
              <input
                type="email"
                placeholder="admin@tjutruss.com"
                {...register("email")}
                className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] ${
                  errors.email ? "border-red-500" : "border-[#E2E4EB]"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
              Alamat Lengkap Workshop / Kantor
            </label>
            <textarea
              rows={2}
              placeholder="Jl. Patimura No.6C, Rejomulyo, Kec. Semarang Tim., Kota Semarang, Jawa Tengah, 50126"
              {...register("address")}
              className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
              Kode Iframe Embed Google Maps
            </label>
            <textarea
              rows={3}
              placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
              {...register("googleMapsIframe")}
              className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 font-mono text-xs text-[#1E1F24]"
            />
          </div>
        </div>

        {/* Sosial Media */}
        <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E4EB]">
            <Share2 className="h-5 w-5 text-[#20449A]" />
            <h3 className="text-base font-bold text-[#1E1F24]">
              Tautan Media Sosial
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                Instagram URL
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/tjutruss"
                {...register("instagram")}
                className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                Facebook URL
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/tjutruss"
                {...register("facebook")}
                className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                TikTok URL
              </label>
              <input
                type="url"
                placeholder="https://tiktok.com/@tjutruss"
                {...register("tiktok")}
                className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                LinkedIn URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/company/tjutruss"
                {...register("linkedin")}
                className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Pengaturan Tata Letak & Grid */}
        <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="h-5 w-5 text-[#20449A]" />
            <h3 className="text-base font-bold text-[#1E1F24]">
              Tata Letak Beranda (Grid Standar Kualitas)
            </h3>
          </div>

          <div className="max-w-md space-y-2">
            <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
              Jumlah Card Standar Kualitas per Baris
            </label>
            <select
              {...register("standardsColumns")}
              className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm font-medium text-[#1E1F24]"
            >
              <option value={2}>2 Card / Baris (Grid 2 Kolom - Cocok untuk 2 atau 4 card bertingkat)</option>
              <option value={3}>3 Card / Baris (Grid 3 Kolom - Klasik TJU Truss)</option>
              <option value={4}>4 Card / Baris (Grid 4 Kolom - Rata 1 Baris jika ada 4 card)</option>
            </select>
            <p className="text-xs text-[#62636C]">
              Mengatur jumlah kolom tampilan pilar kualitas mutu pada halaman utama agar rapi dan tidak menyisakan card gantung.
            </p>
          </div>

          <div className="max-w-md space-y-2 pt-5 border-t border-[#F0F2F6] mt-5">
            <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
              Waktu Jeda Rotasi Slider Carousel (Detik)
            </label>
            <div className="relative">
              <input
                type="number"
                min={3}
                max={30}
                {...register("carouselInterval")}
                className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm font-medium text-[#1E1F24]"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold pointer-events-none">
                detik
              </span>
            </div>
            <p className="text-xs text-[#62636C]">
              Jeda waktu otomatis sebelum slide berpindah ke banner berikutnya pada carousel beranda (Rekomendasi: 6–8 detik).
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="orange"
            size="lg"
            disabled={isSubmitting}
            className="font-bold shadow-md hover:scale-[1.01] transition-transform"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan Perubahan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Semua Pengaturan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
