"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, ShieldAlert, Cpu, Wrench, FileCheck, HardHat, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const expertiseList = [
  {
    title: "Analisis Struktur 3D CAD & Software Rekayasa Terlisensi",
    description:
      "Perhitungan beban dinamis (angin, gempa, beban pekerja) dengan simulasi digital sebelum fabrikasi.",
    icon: Compass,
  },
  {
    title: "Fabrikasi Presisi Profil Baja Ringan Galvalum G550",
    description:
      "Pemotongan dan perakitan profil C-truss dan reng dengan toleransi milimeter dan lapisan anti karat AZ100.",
    icon: Cpu,
  },
  {
    title: "Erection Kuda-Kuda Bentang Lebar Bebas Kolom",
    description:
      "Keahlian perakitan bentang bebas hingga 18+ meter untuk gudang, aula pertemuan, dan gelanggang olahraga.",
    icon: Wrench,
  },
  {
    title: "Pemasangan Aneka Penutup Atap & Sistem Insulasi Termal",
    description:
      "Kompatibel dengan genteng keramik, beton, spandek, bitumen, hingga insulasi glasswool peredam panas.",
    icon: FileCheck,
  },
  {
    title: "Sertifikasi Tenaga Ahli & Kepatuhan Prosedur K3 Konstruksi",
    description:
      "Tim aplikator bersertifikat resmi, wajib APD lengkap, dan pengawasan supervisor berpengalaman di lapangan.",
    icon: HardHat,
  },
  {
    title: "Garansi Pemeliharaan & Sertifikat Garansi Resmi 10 Tahun",
    description:
      "Jaminan tertulis atas integritas struktur dan perlindungan purna jual untuk ketenangan investasi properti Anda.",
    icon: ShieldAlert,
  },
];

export function ExpertiseSection() {
  return (
    <section className="py-24 bg-[#F9F9FB] border-b border-[#E2E4EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Experience Badge & Story */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
                alt="Instalasi Rangka Atap Baja Ringan TJU Truss"
                width={800}
                height={900}
                className="w-full h-[480px] sm:h-[540px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2353]/90 via-[#0F2353]/20 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-white/95 backdrop-blur-md shadow-xl border border-white/40">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#20449A] text-white font-extrabold text-2xl shadow-md">
                    15+
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#1E1F24]">
                      Tahun Pengalaman Rekayasa
                    </h4>
                    <p className="text-xs text-[#62636C] mt-0.5">
                      Telah merampungkan lebih dari 1.200+ proyek gedung publik, komersial & residensial di seluruh Indonesia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#62636C] leading-relaxed italic">
              &quot;Bagi kami di TJU Truss, atap bukan sekadar pelindung dari hujan dan panas, melainkan mahkota struktural yang menjamin keselamatan penghuninya selama puluhan tahun.&quot;
            </p>
          </div>

          {/* Right Column: Expertise Checklist */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FA] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#20449A]">
                <Cpu className="h-4 w-4 text-[#F48902]" />
                Keahlian & Spesialisasi Kami
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1F24] tracking-tight leading-tight">
                Standar Pengerjaan Tanpa Asumsi, Didasarkan Pada Kalkulasi Akurat
              </h2>
              <p className="text-base text-[#62636C] leading-relaxed">
                TJU Truss mengombinasikan material bermutu tinggi dengan kapabilitas software komputasi modern untuk menghadirkan rangka atap dengan ketahanan optimal terhadap gempa dan cuaca ekstrem.
              </p>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {expertiseList.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-white border border-[#E2E4EB] hover:border-[#20449A]/40 transition-all duration-200 hover:shadow-md flex flex-col justify-start gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FA] text-[#20449A]">
                        <Check className="h-5 w-5 text-[#F48902] stroke-[3]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#1E1F24] leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#62636C] leading-relaxed pl-11">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="#contact">
                <Button variant="orange" size="lg" className="font-semibold shadow-md">
                  Diskusikan Rencana Proyek
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="font-semibold">
                  Pelajari Profil Perusahaan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
