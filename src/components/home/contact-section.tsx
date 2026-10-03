"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(8, "Nomor telepon minimal 8 digit"),
  message: z.string().min(5, "Detail proyek minimal 5 karakter"),
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
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const lineRef = React.useRef<HTMLDivElement>(null);
  const leftCardsRef = React.useRef<HTMLDivElement>(null);
  const formCardRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Orange underline
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.7,
            delay: 0.15,
            ease: "power2.out",
            transformOrigin: "center center",
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Left info cards stagger
      if (leftCardsRef.current) {
        gsap.fromTo(
          leftCardsRef.current.children,
          { opacity: 0, x: -25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftCardsRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }

      // Right contact form card
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formCardRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }

      // Map container
      if (mapRef.current) {
        gsap.fromTo(
          mapRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: mapRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
    <section ref={sectionRef} id="contact" className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-4xl mx-auto mb-14 sm:mb-16 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tight text-[#1E1F24]">
            {t("homeContact.title")}
          </h2>
          {/* Underline Orange Responsive (Serasi dengan Quality Standards & Blog) */}
          <div ref={lineRef} className="mt-4 h-1.5 w-44 sm:w-56 md:w-64 lg:w-72 rounded-full bg-[#F48902]" />
        </div>

        {/* Top Grid: Left Contact Info Cards & Right Contact Form Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3 Contact Info Cards */}
          <div ref={leftCardsRef} className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
            {/* 1. Email Card */}
            <div className="flex items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl bg-[#F9F9FB] border border-slate-100 shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-[#20449A] text-white shadow-sm">
                <Mail className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  {t("homeContact.emailLabel")}
                </p>
                <h4 className="text-sm sm:text-base font-bold text-[#1E1F24] truncate mt-0.5">
                  {profile.email || "admin@tjutruss.com"}
                </h4>
              </div>
            </div>

            {/* 2. Telepon Card */}
            <div className="flex items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl bg-[#F9F9FB] border border-slate-100 shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-[#20449A] text-white shadow-sm">
                <Phone className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  {t("homeContact.phoneLabel")}
                </p>
                <h4 className="text-sm sm:text-base font-bold text-[#1E1F24] truncate mt-0.5">
                  {profile.phone || "(024) 3519 776"}
                </h4>
              </div>
            </div>

            {/* 3. Alamat Card */}
            <div className="flex items-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl bg-[#F9F9FB] border border-slate-100 shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-[#20449A] text-white shadow-sm mt-0.5">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  {t("homeContact.addressLabel")}
                </p>
                <h4 className="text-sm sm:text-base font-bold text-[#1E1F24] leading-snug mt-1">
                  {profile.address ||
                    "Jl. Patimura No.6C, Rejomulyo, Kec. Semarang Tim., Kota Semarang, Jawa Tengah, 50126"}
                </h4>
              </div>
            </div>
          </div>

          {/* Right Column: Send Message Card */}
          <div ref={formCardRef} className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 md:p-10 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1E1F24]">
              {t("homeContact.formTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
              {t("homeContact.formSubtitle")}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="block text-xs sm:text-sm font-semibold text-slate-700"
                >
                  {t("homeContact.nameLabel")}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder={t("homeContact.namePlaceholder")}
                  {...register("name")}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1E1F24] placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#20449A]/30 focus:border-[#20449A] ${
                    errors.name ? "border-red-400" : "border-slate-200"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-phone"
                  className="block text-xs sm:text-sm font-semibold text-slate-700"
                >
                  {t("homeContact.phoneFieldLabel")}
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder={t("homeContact.phonePlaceholder")}
                  {...register("phone")}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1E1F24] placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#20449A]/30 focus:border-[#20449A] ${
                    errors.phone ? "border-red-400" : "border-slate-200"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Project Details Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-message"
                  className="block text-xs sm:text-sm font-semibold text-slate-700"
                >
                  {t("homeContact.projectDetailsLabel")}
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder={t("homeContact.projectDetailsPlaceholder")}
                  {...register("message")}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1E1F24] placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#20449A]/30 focus:border-[#20449A] ${
                    errors.message ? "border-red-400" : "border-slate-200"
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Send Button (Orange Solid Button right-aligned as in design) */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#F48902] px-6 sm:px-7 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#d97702] hover:shadow-md hover:scale-[1.02] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>{t("homeContact.sendButton")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Full-Width Map Card */}
        <div ref={mapRef} className="mt-10 sm:mt-12 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm bg-slate-100 h-64 sm:h-80 md:h-96 relative w-full">
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
    </section>
  );
}
