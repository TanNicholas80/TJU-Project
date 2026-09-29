"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Send, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(8, "Nomor telepon/WhatsApp minimal 8 digit"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface CompanyProfileData {
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  googleMapsIframe?: string | null;
}

interface ContactSectionProps {
  profile: CompanyProfileData;
}

export function ContactSection({ profile }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema) as any,
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate submission / dispatch action
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Contact form submitted:", data);
      toast.success("Pesan Anda berhasil dikirim!", {
        description: "Tim teknis TJU Truss akan segera menghubungi Anda.",
      });
      reset();
    } catch {
      toast.error("Gagal mengirim pesan", {
        description: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FA] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#20449A]">
            <MessageSquare className="h-4 w-4 text-[#F48902]" />
            Konsultasi & Penawaran
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1F24] tracking-tight">
            Hubungi Tim Rekayasa TJU Truss
          </h2>
          <p className="text-base text-[#62636C] leading-relaxed">
            Punya rencana pembangunan atap baru atau renovasi bangunan? Konsultasikan spesifikasi dan estimasi biaya bersama tim ahli kami tanpa biaya awal.
          </p>
        </div>

        {/* Split Layout: Left Info & Maps, Right Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Info & Maps */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1E1F24]">
                Kantor & Workshop Operasional
              </h3>
              <p className="text-sm text-[#62636C] leading-relaxed">
                Kunjungi kantor kami atau hubungi tim customer service untuk penjadwalan survey lokasi langsung oleh tim teknis kami.
              </p>

              {/* Contact Items */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F9F9FB] border border-[#E2E4EB]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#20449A] text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1E1F24]">Alamat Kantor</h4>
                    <p className="text-xs text-[#62636C] mt-1 leading-relaxed">
                      {profile.address ||
                        "Jl. Patimura No.6C, Rejomulyo, Kec. Semarang Tim., Kota Semarang, Jawa Tengah, 50126"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F9F9FB] border border-[#E2E4EB]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#20449A] text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1E1F24]">Telepon / WA</h4>
                      <p className="text-xs text-[#62636C] mt-1">
                        {profile.phone || "(024) 3519 776"}
                      </p>
                      <p className="text-xs text-[#F48902] font-semibold mt-0.5">
                        {profile.whatsapp || "+62 812-3456-7890"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[#F9F9FB] border border-[#E2E4EB]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#20449A] text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1E1F24]">Email Resmi</h4>
                      <p className="text-xs text-[#62636C] mt-1">
                        {profile.email || "admin@tjutruss.com"}
                      </p>
                      <p className="text-[11px] text-[#20449A] mt-0.5">
                        Respons &lt; 24 Jam
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-[#E2E4EB] shadow-md bg-zinc-100 h-64 relative">
              {profile.googleMapsIframe ? (
                <div
                  className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                  dangerouslySetInnerHTML={{ __html: profile.googleMapsIframe }}
                />
              ) : (
                <iframe
                  title="Lokasi Kantor TJU Truss"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2227181056586!2d110.42858347499702!3d-6.983033593017937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708cb92dc0bb53%3A0xe212759e6912301c!2sJl.%20Patimura%20No.6c%2C%20Rejomulyo%2C%20Kec.%20Semarang%20Tim.%2C%20Kota%20Semarang%2C%20Jawa%20Tengah%2050126!5e0!3m2!1sen!2sid!4v1711710000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6 bg-[#F9F9FB] rounded-2xl border border-[#E2E4EB] p-8 sm:p-10 shadow-lg shadow-black/5">
            <h3 className="text-2xl font-bold text-[#1E1F24] mb-2">
              Kirim Pesan atau Request Penawaran
            </h3>
            <p className="text-sm text-[#62636C] mb-8">
              Isi data proyek Anda di bawah ini dan kami akan menyiapkan estimasi volume dan bahan.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Nama */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]"
                >
                  Nama Lengkap / Perusahaan *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Contoh: Budi Santoso / PT. Adhi Bangun"
                  {...register("name")}
                  className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#1E1F24] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
                    errors.name ? "border-red-500" : "border-[#E2E4EB]"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]"
                  >
                    Alamat Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="nama@email.com"
                    {...register("email")}
                    className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#1E1F24] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
                      errors.email ? "border-red-500" : "border-[#E2E4EB]"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]"
                  >
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="0812xxxxxxxx"
                    {...register("phone")}
                    className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#1E1F24] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
                      errors.phone ? "border-red-500" : "border-[#E2E4EB]"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Pesan */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]"
                >
                  Detail Proyek / Pertanyaan *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Sebutkan lokasi proyek, perkiraan luas atap (m²), tipe penutup atap yang diinginkan..."
                  {...register("message")}
                  className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-[#1E1F24] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
                    errors.message ? "border-red-500" : "border-[#E2E4EB]"
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="orange"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-bold shadow-md hover:scale-[1.01] transition-transform"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mengirim Pesan...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Kirim Formulir Konsultasi
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
