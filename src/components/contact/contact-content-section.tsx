"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import { submitContactForm } from "@/actions/contact";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CompanyProfileData {
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  googleMapsIframe?: string | null;
}

interface ContactContentSectionProps {
  profile?: CompanyProfileData;
}

export function ContactContentSection({ profile }: ContactContentSectionProps) {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    projectDetails: "",
    honeypot: "",
  });

  const containerRef = React.useRef<HTMLElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  const phoneDisplay = profile?.phone || "(024) 3519 776";
  const whatsappDisplay = profile?.whatsapp || "+6282135375588";
  const cleanWhatsapp = whatsappDisplay.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    "Halo TJU TRUSS SYSTEM, saya ingin konsultasi mengenai proyek rangka atap baja ringan."
  )}`;
  const emailDisplay = profile?.email || "admin@tjutruss.com";
  const addressDisplay = profile?.address || "Jl. Patimura 6C Semarang";

  // Google Maps embed URL specifically centered on Jl. Patimura 6C Semarang
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2227181056586!2d110.42858347499702!3d-6.983033593017937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708cb92dc0bb53%3A0xe212759e6912301c!2sJl.%20Patimura%20No.6c%2C%20Rejomulyo%2C%20Kec.%20Semarang%20Tim.%2C%20Kota%20Semarang%2C%20Jawa%20Tengah%2050126!5e0!3m2!1sen!2sid!4v1711710000000!5m2!1sen!2sid";

  React.useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Top 3 Cards Stagger Animation
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      // 2. Google Maps Container Slide-in
      if (mapRef.current) {
        gsap.fromTo(
          mapRef.current,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mapRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 3. Send Message Form Container Slide-in
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Mohon masukkan nama Anda.", { id: "contact-validation-error" });
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      toast.error("Mohon masukkan nomor telepon yang valid (min. 8 digit).", {
        id: "contact-validation-error",
      });
      return;
    }
    if (!formData.projectDetails.trim()) {
      toast.error("Mohon tuliskan detail kebutuhan proyek Anda.", {
        id: "contact-validation-error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitContactForm({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        message: formData.projectDetails,
        honeypot: formData.honeypot || undefined,
      });

      if (res.success) {
        toast.success("Pesan Anda berhasil dikirim!", {
          description: "Tim teknis TJU Truss akan segera menghubungi Anda.",
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
        });
        setFormData({
          name: "",
          phone: "",
          email: "",
          projectDetails: "",
          honeypot: "",
        });
      } else {
        toast.error("Gagal mengirim pesan", {
          description: res.message || "Silakan coba kembali nanti.",
        });
      }
    } catch {
      toast.error("Gagal mengirim pesan", {
        description: "Terjadi gangguan koneksi. Silakan coba kembali.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full py-12 sm:py-16 bg-[#F9F9FB]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* 1. Baris 4 Kartu Info Kontak (Email, Telepon, WhatsApp Resmi, Alamat) */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {/* Card 1: Email */}
          <a
            href={`mailto:${emailDisplay}`}
            className="group flex items-center gap-3.5 rounded-2xl bg-white p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#20449A] text-white shadow-xs group-hover:scale-105 transition-transform">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-slate-500">
                {t("homeContact.emailLabel")}
              </span>
              <p className="truncate text-sm sm:text-base font-bold text-[#1E1F24] group-hover:text-[#20449A] transition-colors mt-0.5">
                {emailDisplay}
              </p>
            </div>
          </a>

          {/* Card 2: Telepon Kantor */}
          <a
            href={`tel:${phoneDisplay.replace(/[^0-9]/g, "")}`}
            className="group flex items-center gap-3.5 rounded-2xl bg-white p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#20449A] text-white shadow-xs group-hover:scale-105 transition-transform">
              <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-slate-500">
                {t("homeContact.phoneLabel")}
              </span>
              <p className="truncate text-sm sm:text-base font-bold text-[#1E1F24] group-hover:text-[#20449A] transition-colors mt-0.5">
                {phoneDisplay}
              </p>
            </div>
          </a>

          {/* Card 3: WhatsApp Resmi */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 rounded-2xl bg-white p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#20449A] text-white shadow-xs group-hover:scale-105 transition-transform">
              <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-slate-500">
                {t("homeContact.whatsappLabel") || "WhatsApp"}
              </span>
              <p className="truncate text-sm sm:text-base font-bold text-[#1E1F24] group-hover:text-[#20449A] transition-colors mt-0.5">
                {whatsappDisplay}
              </p>
            </div>
          </a>

          {/* Card 4: Alamat */}
          <a
            href="https://maps.google.com/?q=Jl.+Patimura+No.6C%2C+Rejomulyo%2C+Semarang"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 rounded-2xl bg-white p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#20449A] text-white shadow-xs group-hover:scale-105 transition-transform">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-slate-500">
                {t("homeContact.addressLabel")}
              </span>
              <p className="truncate text-sm sm:text-base font-bold text-[#1E1F24] group-hover:text-[#20449A] transition-colors mt-0.5" title={addressDisplay}>
                {addressDisplay}
              </p>
            </div>
          </a>
        </div>

        {/* 2. Interactive 2-Column Section: Google Maps (Left) & Send Message Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Kolom Kiri: Google Maps Interaktif */}
          <div
            ref={mapRef}
            className="lg:col-span-6 relative w-full min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs"
          >
            <iframe
              src={mapEmbedUrl}
              title="Lokasi CV. TRI JAYA UTAMA TJU TRUSS"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Kolom Kanan: Send Message Form Card (Identik dengan Gambar Referensi) */}
          <div
            ref={formRef}
            className="lg:col-span-6 flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-white p-8 sm:p-10 border border-slate-100 shadow-xs"
          >
            <div>
              {/* Header Form */}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1F24]">
                {t("homeContact.formTitle")}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {t("homeContact.formSubtitle")}
              </p>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-5">
                {/* Honeypot Anti-Spam (hidden from legitimate users) */}
                <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                  <input
                    type="text"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.honeypot}
                    onChange={handleChange}
                  />
                </div>

                {/* Field Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-semibold text-[#1E1F24] mb-2"
                  >
                    {t("homeContact.nameLabel")}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("homeContact.namePlaceholder")}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1E1F24] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20449A]/20 focus:border-[#20449A] transition-all"
                  />
                </div>

                {/* Field Phone Number */}
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-sm font-semibold text-[#1E1F24] mb-2"
                  >
                    {t("homeContact.phoneFieldLabel")}
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("homeContact.phonePlaceholder")}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1E1F24] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20449A]/20 focus:border-[#20449A] transition-all"
                  />
                </div>

                {/* Field Email (Optional) */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-semibold text-[#1E1F24] mb-2"
                  >
                    {t("homeContact.emailLabel")}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1E1F24] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20449A]/20 focus:border-[#20449A] transition-all"
                  />
                </div>

                {/* Field Project Details */}
                <div>
                  <label
                    htmlFor="contact-details"
                    className="block text-sm font-semibold text-[#1E1F24] mb-2"
                  >
                    {t("homeContact.projectDetailsLabel")}
                  </label>
                  <textarea
                    id="contact-details"
                    name="projectDetails"
                    rows={4}
                    value={formData.projectDetails}
                    onChange={handleChange}
                    placeholder={t("homeContact.projectDetailsPlaceholder")}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1E1F24] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#20449A]/20 focus:border-[#20449A] transition-all resize-none"
                  />
                </div>

                {/* Submit Button (Orange Solid di Bagian Kanan Bawah) */}
                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F48902] hover:bg-[#D87700] text-white font-bold px-7 py-3.5 text-sm sm:text-base shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 text-white" />
                        <span>{t("homeContact.sendButton")}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
