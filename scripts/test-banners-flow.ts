import { getAllBannersAdmin, getBannerById, createBanner, updateBanner, deleteBanner } from "../src/actions/banners";

async function testBannersFlow() {
  console.log("=== [TEST] BANNERS SERVER ACTIONS FLOW ===");

  // 1. Get All Banners
  const allBanners = await getAllBannersAdmin();
  console.log("Total banners retrieved:", allBanners.data?.length);
  if (!allBanners.success || !allBanners.data) {
    throw new Error("Failed to get all banners!");
  }

  // 2. Test Create Banner (Custom Page Slug)
  const testSlug = `test-page-${Date.now()}`;
  const createRes = await createBanner({
    pageSlug: testSlug,
    titleId: "Halaman Garansi & Mutu Teknis",
    breadcrumbId: "Home > Garansi Teknis",
    backgroundImageUrl: "/images/core_background.png",
  });

  console.log("Create Banner result:", createRes.success, createRes.message);
  if (!createRes.success || !createRes.data) {
    throw new Error("Failed to create banner: " + createRes.message);
  }
  const createdId = createRes.data.id;
  console.log("✓ Created Banner ID:", createdId);

  // 3. Test Get Banner By ID
  const getByIdRes = await getBannerById(createdId);
  console.log("Get By ID result:", getByIdRes.success);
  if (!getByIdRes.success || !getByIdRes.data) {
    throw new Error("Failed to get banner by ID!");
  }
  console.log("✓ Title retrieved:", getByIdRes.data.titleI18n?.id);
  console.log("✓ Auto-translated EN title:", getByIdRes.data.titleI18n?.en);
  console.log("✓ Auto-translated ZH title:", getByIdRes.data.titleI18n?.zh);

  // 4. Test Update Banner
  const updateRes = await updateBanner(createdId, {
    pageSlug: testSlug,
    titleId: "Halaman Garansi & Mutu Teknis (Diperbarui)",
    breadcrumbId: "Home > Garansi Diperbarui",
    backgroundImageUrl: "/images/core_background.png",
  });
  console.log("Update result:", updateRes.success, updateRes.message);
  if (!updateRes.success) {
    throw new Error("Failed to update banner!");
  }

  // 5. Test Delete Banner
  const deleteRes = await deleteBanner(createdId);
  console.log("Delete result:", deleteRes.success, deleteRes.message);
  if (!deleteRes.success) {
    throw new Error("Failed to delete banner!");
  }

  console.log("\n=================================");
  console.log("ALL BANNERS TESTS PASSED 100%!");
  console.log("=================================");
  process.exit(0);
}

testBannersFlow().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
