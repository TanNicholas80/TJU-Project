import { pgTable, serial, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export type I18nString = {
  id: string;
  en?: string;
  zh?: string;
};

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  youtube?: string;
};

// ==========================================
// 1. HERO CAROUSELS
// ==========================================
export const heroCarousels = pgTable("hero_carousels", {
  id: serial("id").primaryKey(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  titleI18n: jsonb("title_i18n").$type<I18nString>().notNull(),
  subtitleI18n: jsonb("subtitle_i18n").$type<I18nString>().notNull(),
  ctaTextI18n: jsonb("cta_text_i18n").$type<I18nString>(),
  ctaLink: varchar("cta_link", { length: 255 }),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 2. QUALITY STANDARDS
// ==========================================
export const qualityStandards = pgTable("quality_standards", {
  id: serial("id").primaryKey(),
  iconName: varchar("icon_name", { length: 100 }).notNull(),
  titleI18n: jsonb("title_i18n").$type<I18nString>().notNull(),
  descriptionI18n: jsonb("description_i18n").$type<I18nString>().notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 3. CATEGORIES POST (BLOG)
// ==========================================
export const categoriesPost = pgTable("categories_post", {
  id: serial("id").primaryKey(),
  nameI18n: jsonb("name_i18n").$type<I18nString>().notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 4. CATEGORIES PORTFOLIO
// ==========================================
export const categoriesPortfolio = pgTable("categories_portfolio", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  nameI18n: jsonb("name_i18n").$type<I18nString>().notNull(),
  descriptionI18n: jsonb("description_i18n").$type<I18nString>(),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 4B. PAGE BANNERS (Untuk Banner Header per Halaman)
// ==========================================
export const pageBanners = pgTable("page_banners", {
  id: serial("id").primaryKey(),
  pageSlug: varchar("page_slug", { length: 100 }).notNull().unique(),
  titleI18n: jsonb("title_i18n").$type<I18nString>().notNull(),
  breadcrumbI18n: jsonb("breadcrumb_i18n").$type<I18nString>(),
  backgroundImageUrl: varchar("background_image_url", { length: 500 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// 4C. CERTIFICATIONS (Sertifikasi & Standar Mutu)
// ==========================================
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  titleI18n: jsonb("title_i18n").$type<I18nString>(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==========================================
// 5. POSTS (BLOG)
// ==========================================
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  categoryPostId: integer("category_post_id").references(() => categoriesPost.id, {
    onDelete: "set null",
  }),
  titleI18n: jsonb("title_i18n").$type<I18nString>().notNull(),
  excerptI18n: jsonb("excerpt_i18n").$type<I18nString>(),
  contentHtmlI18n: jsonb("content_html_i18n").$type<I18nString>().notNull(),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  status: varchar("status", { length: 20 }).default("draft").notNull(), // 'published' | 'draft'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// 6. PORTFOLIOS
// ==========================================
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  categoryPortfolioId: integer("category_portfolio_id").references(() => categoriesPortfolio.id, {
    onDelete: "set null",
  }),
  titleI18n: jsonb("title_i18n").$type<I18nString>().notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  coverImageUrl: varchar("cover_image_url", { length: 500 }).notNull(),
  status: varchar("status", { length: 20 }).default("draft").notNull(), // 'published' | 'draft'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// 7. PORTFOLIO IMAGES (One-to-Many with PORTFOLIOS)
// ==========================================
export const portfolioImages = pgTable("portfolio_images", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id")
    .references(() => portfolios.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ==========================================
// 8. COMPANY PROFILE
// ==========================================
export const companyProfile = pgTable("company_profile", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 50 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  email: varchar("email", { length: 150 }),
  address: text("address"),
  googleMapsIframe: text("google_maps_iframe"),
  socialLinks: jsonb("social_links").$type<SocialLinks>(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// BETTER AUTH SCHEMA TABLES
// ==========================================
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
