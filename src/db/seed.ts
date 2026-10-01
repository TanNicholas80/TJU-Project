import { db } from "./index";
import * as schema from "./schema";
import {
  defaultHeroCarousels,
  defaultQualityStandards,
  defaultCategoriesPost,
  defaultCategoriesPortfolio,
  defaultPosts,
  defaultPortfolios,
  defaultCompanyProfile,
  defaultPageBanners,
  defaultCertifications,
} from "../lib/data-defaults";
import { auth } from "../lib/auth";

async function main() {
  console.log("🌱 Starting TJU Truss database seed...");

  try {
    // 1. Hero Carousels
    console.log("Seeding Hero Carousels...");
    for (const item of defaultHeroCarousels) {
      await db
        .insert(schema.heroCarousels)
        .values({
          imageUrl: item.imageUrl,
          titleI18n: item.titleI18n,
          subtitleI18n: item.subtitleI18n,
          ctaTextI18n: item.ctaTextI18n,
          ctaLink: item.ctaLink,
          sortOrder: item.sortOrder,
          isActive: item.isActive,
        })
        .onConflictDoNothing();
    }

    // 2. Quality Standards
    console.log("Seeding Quality Standards...");
    for (const item of defaultQualityStandards) {
      await db
        .insert(schema.qualityStandards)
        .values({
          iconName: item.iconName,
          titleI18n: item.titleI18n,
          descriptionI18n: item.descriptionI18n,
          sortOrder: item.sortOrder,
          isActive: item.isActive,
        })
        .onConflictDoNothing();
    }

    // 3. Categories Post
    console.log("Seeding Post Categories...");
    for (const item of defaultCategoriesPost) {
      await db
        .insert(schema.categoriesPost)
        .values({
          nameI18n: item.nameI18n,
          slug: item.slug,
        })
        .onConflictDoNothing();
    }

    // 4. Categories Portfolio
    console.log("Seeding Portfolio Categories...");
    for (const item of defaultCategoriesPortfolio) {
      await db
        .insert(schema.categoriesPortfolio)
        .values({
          nameI18n: item.nameI18n,
          slug: item.slug,
          descriptionI18n: item.descriptionI18n,
          coverImageUrl: item.coverImageUrl,
        })
        .onConflictDoNothing();
    }

    // 4B. Page Banners
    console.log("Seeding Page Banners...");
    for (const banner of Object.values(defaultPageBanners)) {
      await db
        .insert(schema.pageBanners)
        .values({
          pageSlug: banner.pageSlug,
          titleI18n: banner.titleI18n,
          breadcrumbI18n: banner.breadcrumbI18n,
          backgroundImageUrl: banner.backgroundImageUrl,
        })
        .onConflictDoNothing();
    }

    // 4C. Certifications
    console.log("Seeding Certifications...");
    for (const cert of defaultCertifications) {
      await db
        .insert(schema.certifications)
        .values({
          titleI18n: cert.titleI18n,
          imageUrl: cert.imageUrl,
          sortOrder: cert.sortOrder,
          isActive: cert.isActive,
        })
        .onConflictDoNothing();
    }

    // 5. Posts
    console.log("Seeding Posts...");
    for (const item of defaultPosts) {
      await db
        .insert(schema.posts)
        .values({
          categoryPostId: item.categoryPostId,
          titleI18n: item.titleI18n,
          excerptI18n: item.excerptI18n,
          contentHtmlI18n: item.contentHtmlI18n,
          coverImageUrl: item.coverImageUrl,
          status: item.status,
        })
        .onConflictDoNothing();
    }

    // 6. Portfolios
    console.log("Seeding Portfolios & Images...");
    for (const item of defaultPortfolios) {
      const [inserted] = await db
        .insert(schema.portfolios)
        .values({
          categoryPortfolioId: item.categoryPortfolioId,
          titleI18n: item.titleI18n,
          location: item.location,
          coverImageUrl: item.coverImageUrl,
          status: item.status,
        })
        .returning();

      if (inserted && item.images) {
        for (const img of item.images) {
          await db.insert(schema.portfolioImages).values({
            portfolioId: inserted.id,
            imageUrl: img.imageUrl,
            sortOrder: img.sortOrder,
          });
        }
      }
    }

    // 7. Company Profile
    console.log("Seeding Company Profile...");
    await db
      .insert(schema.companyProfile)
      .values({
        phone: defaultCompanyProfile.phone,
        whatsapp: defaultCompanyProfile.whatsapp,
        email: defaultCompanyProfile.email,
        address: defaultCompanyProfile.address,
        googleMapsIframe: defaultCompanyProfile.googleMapsIframe,
        socialLinks: defaultCompanyProfile.socialLinks,
      })
      .onConflictDoNothing();

    // 8. Bootstrap Admin User in Better Auth
    console.log("Bootstrapping Admin User...");
    const adminEmail = process.env.ADMIN_EMAIL || "admin@tjutruss.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "12345678";
    const adminName = process.env.ADMIN_NAME || "Admin TJU Truss";

    try {
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      });
      console.log(`✅ Admin user created: ${adminEmail}`);
    } catch (e: any) {
      console.log(`ℹ️ Admin user setup info: ${e.message || "User may already exist"}`);
    }

    console.log("✨ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

main();
