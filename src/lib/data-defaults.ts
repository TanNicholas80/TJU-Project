import { I18nString } from "@/db/schema";

export const defaultHeroCarousels = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80",
    subheaderI18n: {
      id: "REKAYASA STRUKTURAL",
      en: "STRUCTURAL ENGINEERING",
      zh: "结构工程",
    },
    titleI18n: {
      id: "Konstruksi Tangguh dengan Garansi Struktural 10 Tahun",
      en: "Durable Construction with 10-Year Structural Warranty",
      zh: "坚固耐用，提供10年结构质保",
    },
    descriptionI18n: {
      id: "Didukung tim aplikator bersertifikat nasional dan material baja Galvalum Zincalume G550 mutu tinggi anti-karat.",
      en: "Supported by nationally certified applicators and high-grade rust-resistant G550 Galvalume Zincalume steel.",
      zh: "拥有国家认证施工团队，采用高品质防锈G550镀铝锌钢材。",
    },
    subtitleI18n: {
      id: "Didukung tim aplikator bersertifikat nasional dan material baja Galvalum Zincalume G550 mutu tinggi anti-karat.",
      en: "Supported by nationally certified applicators and high-grade rust-resistant G550 Galvalume Zincalume steel.",
      zh: "拥有国家认证施工团队，采用高品质防锈G550镀铝锌钢材。",
    },
    loadingTitleI18n: {
      id: "Kekuatan",
      en: "Strength",
      zh: "强度",
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
    imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1920&q=80",
    subheaderI18n: {
      id: "PRESISI TINGGI",
      en: "HIGH PRECISION",
      zh: "高精度系统",
    },
    titleI18n: {
      id: "Solusi Rangka Atap Baja Ringan Presisi & Terpercaya",
      en: "Precision & Reliable Light Steel Roof Truss Solutions",
      zh: "高精度、值得信赖的轻钢屋架解决方案",
    },
    descriptionI18n: {
      id: "Spesialis fabrikasi dan konstruksi rangka atap berstandar SNI dan software engineering bersertifikat HAKI untuk keamanan bangunan Anda.",
      en: "Specialist in fabrication and construction of SNI-standard roof trusses with HAKI-certified engineering software for structural safety.",
      zh: "专业从事符合SNI标准并采用HAKI认证工程软件的轻钢屋架制造与施工，保障建筑安全。",
    },
    subtitleI18n: {
      id: "Spesialis fabrikasi dan konstruksi rangka atap berstandar SNI dan software engineering bersertifikat HAKI untuk keamanan bangunan Anda.",
      en: "Specialist in fabrication and construction of SNI-standard roof trusses with HAKI-certified engineering software for structural safety.",
      zh: "专业从事符合SNI标准并采用HAKI认证工程软件的轻钢屋架制造与施工，保障建筑安全。",
    },
    loadingTitleI18n: {
      id: "Struktur",
      en: "Structure",
      zh: "结构",
    },
    ctaTextI18n: {
      id: "Konsultasi Proyek",
      en: "Project Consultation",
      zh: "项目咨询",
    },
    ctaLink: "#contact",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80",
    subheaderI18n: {
      id: "SOLUSI TERINTEGRASI",
      en: "INTEGRATED SOLUTIONS",
      zh: "集成解决方案",
    },
    titleI18n: {
      id: "Solusi Optimal. Efisiensi & Estetika.",
      en: "Optimal Solution. Efficiency & Aesthetics.",
      zh: "优化方案，高效与美观兼备",
    },
    descriptionI18n: {
      id: "Menyeimbangkan efisiensi biaya, kecepatan pemasangan, dan keindahan arsitektural. Mitra solusi terpercaya untuk keamanan bangunan residensial dan industrial Anda.",
      en: "Balancing cost efficiency, installation speed, and architectural beauty. Your trusted partner for residential and industrial safety.",
      zh: "兼顾成本效益、安装速度与建筑美学，是您住宅及工业建筑安全的信赖之选。",
    },
    subtitleI18n: {
      id: "Menyeimbangkan efisiensi biaya, kecepatan pemasangan, dan keindahan arsitektural. Mitra solusi terpercaya untuk keamanan bangunan residensial dan industrial Anda.",
      en: "Balancing cost efficiency, installation speed, and architectural beauty. Your trusted partner for residential and industrial safety.",
      zh: "兼顾成本效益、安装速度与建筑美学，是您住宅及工业建筑安全的信赖之选。",
    },
    loadingTitleI18n: {
      id: "Keseimbangan",
      en: "Balance",
      zh: "平衡",
    },
    ctaTextI18n: {
      id: "Konsultasi Proyek",
      en: "Project Consultation",
      zh: "项目咨询",
    },
    ctaLink: "#contact",
    sortOrder: 3,
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
  {
    id: 1,
    slug: "komersial",
    nameI18n: { id: "Komersial", en: "Commercial", zh: "商业建筑" },
    descriptionI18n: {
      id: "Pusat Perbelanjaan, Ruko Modern, Gedung Perkantoran, Bandara, Rumah Sakit",
      en: "Shopping Centers, Modern Shophouses, Office Buildings, Airports, Hospitals",
      zh: "商业中心、现代商铺、办公大楼、机场、医院",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    slug: "industrial",
    nameI18n: { id: "Industrial", en: "Industrial", zh: "工业设施" },
    descriptionI18n: {
      id: "Pabrik, Gudang, Fasilitas Produksi Skala Besar",
      en: "Factories, Warehouses, Large Scale Production Facilities",
      zh: "厂房、仓库、大型生产设施",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    slug: "residensial",
    nameI18n: { id: "Residensial", en: "Residential", zh: "高端住宅" },
    descriptionI18n: {
      id: "Kompleks Perumahan, Real Estate, Villa Eksklusif",
      en: "Housing Estates, Real Estate, Exclusive Villas",
      zh: "住宅小区、房地产、独栋别墅",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
];

export const defaultPageBanners: Record<
  string,
  {
    id: string | number;
    pageSlug: string;
    titleI18n: I18nString;
    breadcrumbI18n: I18nString;
    backgroundImageUrl: string;
  }
> = {
  "about-us": {
    id: 1,
    pageSlug: "about-us",
    titleI18n: {
      id: "About Us",
      en: "About Us",
      zh: "关于我们",
    },
    breadcrumbI18n: {
      id: "Home > About US",
      en: "Home > About US",
      zh: "首页 > 关于我们",
    },
    backgroundImageUrl: "/images/core_background.png",
  },
  "blog": {
    id: 2,
    pageSlug: "blog",
    titleI18n: {
      id: "Blog & Artikel",
      en: "Blog & Articles",
      zh: "博客与文章",
    },
    breadcrumbI18n: {
      id: "Home > Blog",
      en: "Home > Blog",
      zh: "首页 > 博客",
    },
    backgroundImageUrl: "/images/core_background.png",
  },
  "portofolio": {
    id: 3,
    pageSlug: "portofolio",
    titleI18n: {
      id: "Rekam Jejak TJU TRUSS",
      en: "TJU TRUSS Track Record",
      zh: "TJU TRUSS 经典业绩",
    },
    breadcrumbI18n: {
      id: "Home > Portofolio",
      en: "Home > Portfolio",
      zh: "首页 > 业绩案例",
    },
    backgroundImageUrl: "/images/core_background.png",
  },
  "portfolio": {
    id: 4,
    pageSlug: "portfolio",
    titleI18n: {
      id: "Rekam Jejak TJU TRUSS",
      en: "TJU TRUSS Track Record",
      zh: "TJU TRUSS 经典业绩",
    },
    breadcrumbI18n: {
      id: "Home > Portofolio",
      en: "Home > Portfolio",
      zh: "首页 > 业绩案例",
    },
    backgroundImageUrl: "/images/core_background.png",
  },
  "contact": {
    id: 5,
    pageSlug: "contact",
    titleI18n: {
      id: "Hubungi Kami",
      en: "Contact Us",
      zh: "联系我们",
    },
    breadcrumbI18n: {
      id: "Home > Kontak",
      en: "Home > Contact",
      zh: "首页 > 联系我们",
    },
    backgroundImageUrl: "/images/core_background.png",
  },
};

export const defaultCertifications = [
  {
    id: 1,
    titleI18n: {
      id: "Sertifikasi Software Rekayasa Struktur HAKI",
      en: "HAKI Structural Engineering Software Certification",
      zh: "HAKI结构工程软件认证",
    },
    imageUrl: "/images/certifications/logo_haki.png",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    titleI18n: {
      id: "Sistem Manajemen Mutu ISO 9001:2015",
      en: "ISO 9001:2015 Quality Management System",
      zh: "ISO 9001:2015 质量管理体系",
    },
    imageUrl: "/images/certifications/logo_iso.png",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    titleI18n: {
      id: "Standar Nasional Indonesia SNI 8399:2017",
      en: "Indonesian National Standard SNI 8399:2017",
      zh: "印度尼西亚国家标准 SNI 8399:2017",
    },
    imageUrl: "/images/certifications/logo_sni.png",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    titleI18n: {
      id: "Tingkat Komponen Dalam Negeri (TKDN) Kemenperin",
      en: "Ministry of Industry Domestic Component Level (TKDN)",
      zh: "工业部本土成分含量认证 (TKDN)",
    },
    imageUrl: "/images/certifications/logo_tkdn.png",
    sortOrder: 4,
    isActive: true,
  },
];

export const defaultPortfolios = [
  {
    id: 1,
    categoryPortfolioId: 1,
    categoryName: "KOMERSIAL",
    titleI18n: {
      id: "Bandara NYIA",
      en: "NYIA Airport Terminal",
      zh: "日惹国际机场 (NYIA)",
    },
    location: "Kulon Progo, D.I. Yogyakarta",
    coverImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80",
    views: 42,
    status: "published",
    createdAt: new Date("2026-09-08"),
    images: [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
    ],
  },
  {
    id: 2,
    categoryPortfolioId: 1,
    categoryName: "KOMERSIAL",
    titleI18n: {
      id: "Universitas Negeri Semarang (UNNES)",
      en: "Semarang State University (UNNES)",
      zh: "三宝垄国立大学 (UNNES)",
    },
    location: "Semarang, Jawa Tengah",
    coverImageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    views: 36,
    status: "published",
    createdAt: new Date("2026-09-08"),
    images: [
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
      { id: 3, imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", sortOrder: 2 },
      { id: 4, imageUrl: "/images/gambar_1.JPG", sortOrder: 3 },
      { id: 5, imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80", sortOrder: 4 },
    ],
  },
  {
    id: 3,
    categoryPortfolioId: 1,
    categoryName: "KOMERSIAL",
    titleI18n: {
      id: "RSIA MITRA PERMATA HUSADA",
      en: "Mitra Permata Husada Mother & Child Hospital",
      zh: "Mitra Permata Husada 妇幼医院",
    },
    location: "Kendal, Jawa Tengah",
    coverImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    views: 30,
    status: "published",
    createdAt: new Date("2026-09-08"),
    images: [
      { id: 4, imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
    ],
  },
  {
    id: 4,
    categoryPortfolioId: 1,
    categoryName: "KOMERSIAL",
    titleI18n: {
      id: "RS RANDU DONGKAL",
      en: "Randu Dongkal Regional Hospital",
      zh: "Randu Dongkal 医院",
    },
    location: "Pemalang, Jawa Tengah",
    coverImageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    views: 25,
    status: "published",
    createdAt: new Date("2026-09-08"),
    images: [
      { id: 5, imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
    ],
  },
  {
    id: 5,
    categoryPortfolioId: 2,
    categoryName: "INDUSTRIAL",
    titleI18n: {
      id: "Kawasan Industri Kendal (KIK) Warehouse",
      en: "Kendal Industrial Park Warehouse",
      zh: "肯德尔工业园物流厂房",
    },
    location: "Kendal, Jawa Tengah",
    coverImageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    views: 20,
    status: "published",
    createdAt: new Date("2026-07-21"),
    images: [
      { id: 6, imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
    ],
  },
  {
    id: 6,
    categoryPortfolioId: 3,
    categoryName: "RESIDENSIAL",
    titleI18n: {
      id: "Cluster Graha Estetika Residensial",
      en: "Graha Estetika Residential Cluster",
      zh: "Graha Estetika 豪华住宅群",
    },
    location: "Banyumanik, Semarang",
    coverImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    views: 16,
    status: "published",
    createdAt: new Date("2026-06-15"),
    images: [
      { id: 7, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
    ],
  },
  {
    id: 7,
    categoryPortfolioId: 2,
    categoryName: "INDUSTRIAL",
    titleI18n: {
      id: "Gudang Logistik Modern Pelabuhan Tanjung Emas",
      en: "Tanjung Emas Port Modern Logistic Warehouse",
      zh: "丹绒马斯港现代化物流仓库",
    },
    location: "Semarang Utara, Jawa Tengah",
    coverImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    views: 13,
    status: "published",
    createdAt: new Date("2026-05-10"),
    images: [
      { id: 8, imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
    ],
  },
  {
    id: 8,
    categoryPortfolioId: 3,
    categoryName: "RESIDENSIAL",
    titleI18n: {
      id: "Villa Mewah Bukit Semarang Baru (BSB)",
      en: "BSB City Exclusive Luxury Villa",
      zh: "BSB City 独栋奢华别墅",
    },
    location: "Mijen, Semarang",
    coverImageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    views: 9,
    status: "published",
    createdAt: new Date("2026-04-02"),
    images: [
      { id: 9, imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
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
      id: "Jangan pertaruhkan keselamatan bangunan dengan 'ilmu kira-kira'. Mari pelajari bagaimana software tersertifikasi membagi beban struktur atap secara presisi dan aman.",
      en: "Do not compromise building safety with guesswork. Learn how certified software distributes roof structural loads accurately and safely.",
      zh: "请勿凭借猜测评估建筑安全。了解专业认证软件如何精确合理地分配屋架结构载荷。",
    },
    contentHtmlI18n: {
      id: `<p class="mb-5 leading-relaxed text-slate-700">Kekuatan rangka atap baja ringan tidak ditentukan oleh kerapian pemasangan semata. Keamanan struktur sepenuhnya bergantung pada akurasi perhitungan beban dan desain kuda-kuda. Di sinilah pentingnya penggunaan software engineering bersertifikasi HAKI.</p>

<h3 class="text-xl sm:text-2xl font-bold text-[#1E1F24] mt-8 mb-3">Apa Itu Software Bersertifikasi HAKI?</h3>
<p class="mb-5 leading-relaxed text-slate-700">Dalam industri baja ringan, sertifikasi HAKI (Hak Kekayaan Intelektual) menandakan bahwa software perhitungan struktur yang digunakan telah diuji, divalidasi, dan diakui kelayakannya secara legal. Perangkat lunak ini dirancang khusus untuk mensimulasikan dan menganalisis kekuatan rangka baja ringan sebelum proses perakitan dilakukan.</p>

<h3 class="text-xl sm:text-2xl font-bold text-[#1E1F24] mt-8 mb-3">Mengapa Perhitungan Software Sangat Vital?</h3>
<p class="mb-4 leading-relaxed text-slate-700">Membangun atap tanpa perhitungan software sama dengan menggunakan "ilmu kira-kira". Berikut alasan mengapa perhitungan presisi bersifat mutlak:</p>

<p class="mb-4 leading-relaxed text-slate-700"><strong>1. Akurasi Distribusi Beban</strong> Software menghitung seluruh gaya yang bekerja pada atap secara detail. Ini mencakup beban mati (berat material baja dan genteng), beban hidup (pekerja saat pemeliharaan), hingga beban cuaca (kecepatan angin dan curah hujan).</p>

<p class="mb-4 leading-relaxed text-slate-700"><strong>2. Optimalisasi Titik Sambungan</strong> Setiap sambungan (simpul) pada baja ringan memiliki batas toleransi tegangan. Perhitungan digital memastikan posisi sekrup dan ketebalan material (seperti baja AS100) mampu menahan gaya tarik dan tekan secara maksimal.</p>

<p class="mb-5 leading-relaxed text-slate-700"><strong>3. Mencegah Kegagalan Struktural</strong> Analisis software mengidentifikasi titik lemah pada desain sebelum rangka dipasang. Hal ini mengeliminasi risiko atap melendut atau ambruk di kemudian hari.</p>

<h3 class="text-xl sm:text-2xl font-bold text-[#1E1F24] mt-8 mb-3">Standar Keamanan TJU TRUSS</h3>
<p class="mb-4 leading-relaxed text-slate-700">TJU TRUSS menolak segala bentuk kompromi terkait keselamatan bangunan. Sebagai bagian dari pilar Structure, kami wajib menggunakan software perhitungan yang telah diverifikasi oleh HAKI dan memiliki sertifikat layak pakai.</p>
<p class="mb-4 leading-relaxed text-slate-700">Kami memastikan setiap desain rangka atap Anda didasarkan pada ilmu pasti dan standar engineering yang ketat, bukan sekadar asumsi lapangan.</p>
<p class="mb-5 leading-relaxed text-slate-700">Pastikan keamanan aset Anda terjamin. Diskusikan kebutuhan struktur atap Anda bersama tim ahli TJU TRUSS hari ini.</p>`,
      en: "<p>Construction strength requires engineering precision and load accuracy.</p>",
      zh: "<p>建筑结构强度取决于工程精密度与荷载计算准确性。</p>",
    },
    coverImageUrl: "/images/gambar_1.JPG",
    views: 24,
    status: "published",
    createdAt: new Date("2026-09-30"),
  },
  {
    id: 2,
    categoryPostId: 1,
    categoryName: "Engineering",
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
      zh: "<p>为多层建筑选择合适的轻钢型材至载至关重要。</p>",
    },
    coverImageUrl: "/images/gambar_1.JPG",
    views: 20,
    status: "published",
    createdAt: new Date("2026-09-16"),
  },
  {
    id: 3,
    categoryPostId: 2,
    categoryName: "Edukasi & Tips",
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
    coverImageUrl: "/images/gambar_1.JPG",
    views: 18,
    status: "published",
    createdAt: new Date("2026-08-07"),
  },
  {
    id: 4,
    categoryPostId: 3,
    categoryName: "Berita & Proyek",
    titleI18n: {
      id: "Penyelesaian Pemasangan Struktur Rangka Baja Bandara NYIA",
      en: "Completion of Steel Truss Installation for NYIA Airport Project",
      zh: "日惹国际机场屋架钢结构工程顺利完工",
    },
    excerptI18n: {
      id: "TJU TRUSS berhasil menyelesaikan instalasi struktur bentang khusus pada fasilitas pendukung bandara dengan pengawasan mutu ketat.",
      en: "TJU TRUSS successfully completed special-span structural installation with strict quality supervision.",
      zh: "TJU TRUSS顺利完成机场配套设施大跨度屋架结构安装，全程严控工程品质。",
    },
    contentHtmlI18n: {
      id: "<p>Proyek konstruksi fasilitas pendukung bandara membutuhkan kecepatan dan akurasi tinggi. Seluruh modul truss dirakit secara presisi.</p>",
      en: "<p>Airport facility construction requires speed, safety, and utmost precision.</p>",
      zh: "<p>机场配套设施施工对工期效率与工程精度要求极高。</p>",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    views: 15,
    status: "published",
    createdAt: new Date("2026-07-03"),
  },
  {
    id: 5,
    categoryPostId: 1,
    categoryName: "Engineering",
    titleI18n: {
      id: "Standar SNI Profil C75 dan Reng Asimetris G550",
      en: "SNI Standard for C75 Profile and G550 Asymmetric Batten",
      zh: "C75型钢与G550不对称挂瓦条SNI标准规范",
    },
    excerptI18n: {
      id: "Pelajari bagaimana standar SNI 8399:2017 menjamin komposisi lapisan pelindung anti-karat AZ100 tahan terhadap cuaca ekstrem.",
      en: "Learn how SNI 8399:2017 standard guarantees AZ100 anti-rust coating durability against extreme weather.",
      zh: "了解SNI 8399:2017国家标准如何保障AZ100防锈镀层在极端天气下的耐用性。",
    },
    contentHtmlI18n: {
      id: "<p>Baja ringan bermutu tinggi menggunakan bahan dasar cold-formed high tensile steel G550 dengan kuat tarik leleh 550 MPa.</p>",
      en: "<p>High grade light steel utilizes cold-formed high tensile steel G550 with yield strength of 550 MPa.</p>",
      zh: "<p>优质轻钢采用冷弯高抗拉强度G550钢材，屈服强度达到550 MPa。</p>",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    views: 13,
    status: "published",
    createdAt: new Date("2026-07-03"),
  },
  {
    id: 6,
    categoryPostId: 1,
    categoryName: "Engineering",
    titleI18n: {
      id: "Keunggulan Baja Galvalum Zincalume G550 Anti-Karat",
      en: "Advantages of Rust-Resistant Galvalume Zincalume G550 Steel",
      zh: "高抗腐蚀G550镀铝锌钢材的核心优势解析",
    },
    excerptI18n: {
      id: "Komposisi paduan 55% aluminium, 43.5% seng, dan 1.5% silikon memberikan perlindungan korosi hingga 4 kali lebih baik dari galvanis biasa.",
      en: "Alloy composition of 55% aluminum provides up to 4x better corrosion resistance than standard galvanized steel.",
      zh: "55%铝合金配方提供比普通镀锌高出4倍的耐腐蚀防护性能。",
    },
    contentHtmlI18n: {
      id: "<p>Lapisan pelindung AZ100 aktif memperbaiki permukaan secara alami jika terjadi goresan saat fabrikasi dan pemasangan.</p>",
      en: "<p>AZ100 coating provides active self-healing protection against scratch damage.</p>",
      zh: "<p>AZ100涂层具有优异的自愈保护特性，防止加工划伤后发生锈蚀。</p>",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80",
    views: 10,
    status: "published",
    createdAt: new Date("2026-06-20"),
  },
  {
    id: 7,
    categoryPostId: 2,
    categoryName: "Edukasi & Tips",
    titleI18n: {
      id: "Tips Mencegah Kebocoran dan Lendutan pada Atap Bentang Panjang",
      en: "Tips to Prevent Leaks and Deflection on Long Span Roofs",
      zh: "预防大跨度屋顶漏水与下沉挠度的技术要点",
    },
    excerptI18n: {
      id: "Kunci utama terletak pada kemiringan atap minimum dan kerapatan jarak ikatan angin (wind bracing) yang sesuai standar.",
      en: "Key factors lie in minimum roof pitch and proper wind bracing spacing.",
      zh: "核心在于合理的最小屋面坡度与符合规范的抗风支撑间距。",
    },
    contentHtmlI18n: {
      id: "<p>Kemiringan atap harus disesuaikan dengan jenis penutup genteng yang dipilih untuk menghindari tampias saat hujan lebat.</p>",
      en: "<p>Roof pitch must match selected tile materials to prevent backflow during storms.</p>",
      zh: "<p>屋面坡度必须与所选瓦片类型精准匹配，防止暴雨时回水渗漏。</p>",
    },
    coverImageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    views: 0,
    status: "published",
    createdAt: new Date("2026-05-15"),
  },
  {
    id: 8,
    categoryPostId: 1,
    categoryName: "Engineering",
    titleI18n: {
      id: "Perbandingan Rangka Baja Ringan vs Kayu untuk Bangunan Komersial",
      en: "Light Steel vs Timber Roof Truss Comparison for Commercial Buildings",
      zh: "商业建筑中轻钢屋架与传统木结构的综合对比",
    },
    excerptI18n: {
      id: "Analisis komparatif efisiensi biaya, kecepatan instalasi, ketahanan rayap, dan nilai jangka panjang bangunan.",
      en: "Comparative analysis of cost efficiency, installation speed, termite resistance, and long-term value.",
      zh: "成本效益、施工速度、防白蚁性能与长期投资价值的全面对比分析。",
    },
    contentHtmlI18n: {
      id: "<p>Baja ringan tidak membebani pondasi bangunan, anti rayap seumur hidup, dan tidak mengalami muai-susut akibat kelembaban.</p>",
      en: "<p>Light steel does not overload foundations and eliminates termite risks completely.</p>",
      zh: "<p>轻钢减轻地基承重负荷，终身杜绝白蚁隐患，不会因潮湿发生热胀冷缩变形。</p>",
    },
    coverImageUrl: "/images/gambar_1.JPG",
    views: 0,
    status: "published",
    createdAt: new Date("2026-04-10"),
  },
];

export const defaultProducts = [
  {
    id: 1,
    name: "Kaca Tempered Riben",
    category: "Solar Control",
    views: 18,
    createdAt: new Date("2026-07-15"),
  },
  {
    id: 2,
    name: "Kaca Tempered Sandblast (Buram)",
    category: "Decorative Glass",
    views: 16,
    createdAt: new Date("2026-07-15"),
  },
  {
    id: 3,
    name: "Kaca Tempered Clear (Bening)",
    category: "Tempered Glass",
    views: 15,
    createdAt: new Date("2026-07-15"),
  },
  {
    id: 4,
    name: "Kaca Laminated",
    category: "Safety Glass",
    views: 12,
    createdAt: new Date("2026-06-29"),
  },
  {
    id: 5,
    name: "Kaca Tempered Laminated",
    category: "High Safety",
    views: 10,
    createdAt: new Date("2026-06-29"),
  },
  {
    id: 6,
    name: "Profil C75 Baja Ringan G550",
    category: "Rangka Atap",
    views: 9,
    createdAt: new Date("2026-06-10"),
  },
  {
    id: 7,
    name: "Reng Asimetris AZ100",
    category: "Batten",
    views: 7,
    createdAt: new Date("2026-05-20"),
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
