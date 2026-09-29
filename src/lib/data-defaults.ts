import { I18nString } from "@/db/schema";

export const defaultHeroCarousels = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1920&q=80",
    titleI18n: {
      id: "Solusi Rangka Atap Baja Ringan Presisi & Terpercaya",
      en: "Precision & Reliable Light Steel Roof Truss Solutions",
      zh: "高精度、值得信赖的轻钢屋架解决方案",
    },
    subtitleI18n: {
      id: "Spesialis fabrikasi dan konstruksi rangka atap berstandar SNI dan software engineering bersertifikat HAKI untuk keamanan bangunan Anda.",
      en: "Specialist in fabrication and construction of SNI-standard roof trusses with HAKI-certified engineering software for structural safety.",
      zh: "专业从事符合SNI标准并采用HAKI认证工程软件的轻钢屋架制造与施工，保障建筑安全。",
    },
    ctaTextI18n: {
      id: "Konsultasi Proyek",
      en: "Project Consultation",
      zh: "项目咨询",
    },
    ctaLink: "#contact",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80",
    titleI18n: {
      id: "Konstruksi Tangguh dengan Garansi Struktural 10 Tahun",
      en: "Durable Construction with 10-Year Structural Warranty",
      zh: "坚固耐用，提供10年结构质保",
    },
    subtitleI18n: {
      id: "Didukung tim aplikator bersertifikat nasional dan material baja Galvalum Zincalume G550 mutu tinggi anti-karat.",
      en: "Supported by nationally certified applicators and high-grade rust-resistant G550 Galvalume Zincalume steel.",
      zh: "拥有国家认证施工团队，采用高品质防锈G550镀铝锌钢材。",
    },
    ctaTextI18n: {
      id: "Lihat Portofolio",
      en: "View Portfolio",
      zh: "查看案例",
    },
    ctaLink: "#portfolio",
    sortOrder: 2,
    isActive: true,
  },
];

export const defaultQualityStandards = [
  {
    id: 1,
    iconName: "ShieldCheck",
    titleI18n: {
      id: "Standar Baja Cold-Formed G550",
      en: "Cold-Formed G550 Steel Standard",
      zh: "冷弯G550钢材标准",
    },
    descriptionI18n: {
      id: "Menggunakan material baja ringan mutu tinggi G550 dengan kuat tarik minimum 5500 kg/cm² dan lapisan pelindung anti karat AZ100.",
      en: "Using high tensile strength G550 light steel with minimum 5500 kg/cm² yield strength and AZ100 anti-corrosion coating.",
      zh: "采用屈服强度达5500 kg/cm²的高强度G550冷弯轻钢及AZ100防腐保护涂层。",
    },
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    iconName: "Calculator",
    titleI18n: {
      id: "Analisis Software HAKI Bersertifikat",
      en: "HAKI Certified Software Analysis",
      zh: "HAKI认证结构软件精密分析",
    },
    descriptionI18n: {
      id: "Desain struktur dihitung secara presisi menggunakan software rekayasa atap terakreditasi untuk ketahanan beban angin dan gempa.",
      en: "Structural designs precisely calculated using accredited roof engineering software for wind and seismic loads.",
      zh: "采用专业认证的屋架结构计算软件，精确模拟风载荷与抗震承重。",
    },
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    iconName: "Award",
    titleI18n: {
      id: "Garansi Resmi 10 Tahun & K3",
      en: "Official 10-Year Warranty & Safety",
      zh: "10年官方质保与K3施工安全",
    },
    descriptionI18n: {
      id: "Memberikan sertifikat garansi struktur resmi hingga 10 tahun didukung teknisi profesional yang patuh standar K3 konstruksi.",
      en: "Providing an official structural warranty certificate up to 10 years, supported by certified technicians complying with K3 safety.",
      zh: "提供长达10年的官方结构质保书，全员遵循严格的施工安全生产（K3）规范。",
    },
    sortOrder: 3,
    isActive: true,
  },
];

export const defaultCategoriesPortfolio = [
  { id: 1, slug: "pendidikan-publik", nameI18n: { id: "Fasilitas Pendidikan & Publik", en: "Educational & Public Facilities", zh: "教育与公共设施" } },
  { id: 2, slug: "komersial", nameI18n: { id: "Gedung Komersial", en: "Commercial Buildings", zh: "商业大厦" } },
  { id: 3, slug: "residensial", nameI18n: { id: "Residensial Mewah", en: "Luxury Residential", zh: "高端住宅" } },
  { id: 4, slug: "kanopi-spesial", nameI18n: { id: "Kanopi & Struktur Khusus", en: "Canopy & Special Structures", zh: "雨棚与特种构件" } },
];

export const defaultPortfolios = [
  {
    id: 1,
    categoryPortfolioId: 1,
    categoryName: "Fasilitas Pendidikan & Publik",
    titleI18n: {
      id: "Universitas Negeri Semarang (UNNES)",
      en: "Semarang State University (UNNES)",
      zh: "三宝垄国立大学 (UNNES)",
    },
    location: "Semarang, Jawa Tengah",
    coverImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: new Date("2026-03-15"),
    images: [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", sortOrder: 2 },
      { id: 3, imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", sortOrder: 3 },
      { id: 4, imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", sortOrder: 4 },
    ],
  },
  {
    id: 2,
    categoryPortfolioId: 2,
    categoryName: "Gedung Komersial",
    titleI18n: {
      id: "Kawasan Industri Kendal (KIK) Warehouse",
      en: "Kendal Industrial Park Warehouse",
      zh: "肯德尔工业园物流厂房",
    },
    location: "Kendal, Jawa Tengah",
    coverImageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: new Date("2026-02-10"),
    images: [
      { id: 5, imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
    ],
  },
  {
    id: 3,
    categoryPortfolioId: 3,
    categoryName: "Residensial Mewah",
    titleI18n: {
      id: "Cluster Graha Estetika Residensial",
      en: "Graha Estetika Residential Cluster",
      zh: "Graha Estetika 豪华住宅群",
    },
    location: "Banyumanik, Semarang",
    coverImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: new Date("2026-01-20"),
    images: [
      { id: 6, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
    ],
  },
  {
    id: 4,
    categoryPortfolioId: 4,
    categoryName: "Kanopi & Struktur Khusus",
    titleI18n: {
      id: "Kanopi Bentang Lebar RSUD Tugurejo",
      en: "Wide-Span Canopy Tugurejo Hospital",
      zh: "图古雷霍医院大跨度阳光雨棚",
    },
    location: "Semarang Barat, Jawa Tengah",
    coverImageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: new Date("2026-01-05"),
    images: [
      { id: 7, imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
    ],
  },
];

export const defaultCategoriesPost = [
  { id: 1, slug: "engineering", nameI18n: { id: "Engineering", en: "Engineering", zh: "工程技术" } },
  { id: 2, slug: "edukasi", nameI18n: { id: "Edukasi & Tips", en: "Education & Tips", zh: "建筑常识" } },
  { id: 3, slug: "berita", nameI18n: { id: "Berita & Proyek", en: "News & Projects", zh: "公司动态" } },
];

export const defaultPosts = [
  {
    id: 1,
    categoryPostId: 1,
    categoryName: "Engineering",
    titleI18n: {
      id: "Mengenal Perhitungan Software HAKI pada Desain Rangka Atap",
      en: "Understanding HAKI Software Calculation on Roof Truss Design",
      zh: "了解HAKI认证结构计算软件在屋架设计中的关键作用",
    },
    excerptI18n: {
      id: "Kekuatan rangka atap baja ringan tidak ditentukan oleh kerapian semata, namun perhitungan akurasi beban struktural secara digital.",
      en: "The strength of light steel roof trusses is not just about neatness, but precise digital structural load calculations.",
      zh: "轻钢屋架的安全不仅取决于安装工艺，更核心在于精密数字载荷分析与力学模拟。",
    },
    contentHtmlI18n: {
      id: "<p>Kekuatan rangka atap baja ringan tidak ditentukan oleh kerapian pemasangan semata. Keamanan struktur sepenuhnya bergantung pada akurasi perhitungan beban dan desain kuda-kuda. Di sinilah pentingnya penggunaan software engineering bersertifikasi HAKI.</p><h3>Apa Itu Software Bersertifikasi HAKI?</h3><p>Dalam industri baja ringan, sertifikasi HAKI menandakan bahwa software perhitungan struktur yang digunakan telah diuji, divalidasi, dan diakui kelayakannya secara legal.</p>",
      en: "<p>The strength of light steel roof trusses is not determined by assembly neatness alone. Structural safety depends on accurate load calculation.</p>",
      zh: "<p>轻钢屋架的结构安全性取决于准确的荷载计算与力学验算。</p>",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: new Date("2026-03-20"),
  },
  {
    id: 2,
    categoryPostId: 2,
    categoryName: "Edukasi & Tips",
    titleI18n: {
      id: "Panduan Memilih Ketebalan Baja Ringan untuk Rumah 2 Lantai",
      en: "Guide to Choosing Light Steel Thickness for 2-Story Houses",
      zh: "两层住宅轻钢龙骨厚度选型指南",
    },
    excerptI18n: {
      id: "Ketahui standar ketebalan profil C75 dan reng untuk memastikan atap rumah Anda kokoh menahan genteng berat seperti keramik atau beton.",
      en: "Learn C75 profile and batten thickness standards to ensure your roof withstands heavy tile loads like ceramic or concrete.",
      zh: "详解C75型钢与挂瓦条厚度规格，确保屋顶承载重型陶瓦或混凝土瓦的安全稳固。",
    },
    contentHtmlI18n: {
      id: "<p>Memilih profil baja ringan yang tepat sangat krusial untuk bangunan bertingkat. Ketebalan minimum profil C75 yang disarankan adalah 0.75 mm TCT.</p>",
      en: "<p>Choosing the right light steel profile is crucial for multi-story buildings.</p>",
      zh: "<p>为多层建筑选择合适的轻钢型材至关重要。</p>",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: new Date("2026-03-12"),
  },
  {
    id: 3,
    categoryPostId: 3,
    categoryName: "Berita & Proyek",
    titleI18n: {
      id: "Inovasi Fabrikasi Rangka Atap Bentang Lebar Bebas Kolom",
      en: "Column-Free Wide Span Roof Truss Fabrication Innovation",
      zh: "无柱大跨度屋架精密预制技术创新",
    },
    excerptI18n: {
      id: "Teknologi perakitan truss bentang lebar hingga 18 meter tanpa tiang tengah untuk kebutuhan aula pertemuan dan fasilitas olahraga.",
      en: "Truss assembly technology for spans up to 18 meters without central columns for multipurpose halls and sport facilities.",
      zh: "针对礼堂与体育场馆设计的长达18米无中间柱大跨度屋架组装技术。",
    },
    contentHtmlI18n: {
      id: "<p>Rangka atap bentang lebar memerlukan perhitungan momen inersia yang presisi untuk mencegah lendutan (defleksi) pada bentang tengah.</p>",
      en: "<p>Wide span roof trusses require precise moment of inertia calculation to prevent deflection.</p>",
      zh: "<p>大跨度屋架需要精确的转动惯量与挠度验算，以防止中间跨度下垂。</p>",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    createdAt: new Date("2026-03-01"),
  },
];

export const defaultCompanyProfile = {
  id: 1,
  phone: "(024) 3519 776",
  whatsapp: "+62 812-3456-7890",
  email: "admin@tjutruss.com",
  address: "Jl. Patimura No.6C, Rejomulyo, Kec. Semarang Tim., Kota Semarang, Jawa Tengah, 50126",
  googleMapsIframe:
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2227181056586!2d110.42858347499702!3d-6.983033593017937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708cb92dc0bb53%3A0xe212759e6912301c!2sJl.%20Patimura%20No.6c%2C%20Rejomulyo%2C%20Kec.%20Semarang%20Tim.%2C%20Kota%20Semarang%2C%20Jawa%20Tengah%2050126!5e0!3m2!1sen!2sid!4v1711710000000!5m2!1sen!2sid" width="100%" height="320" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  socialLinks: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
    linkedin: "https://linkedin.com",
  },
};
