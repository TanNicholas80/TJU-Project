import { createCarousel, getCarouselById, updateCarousel, deleteCarousel, getCarouselsAdmin } from "../src/actions/carousel";

async function testCarouselFlow() {
  console.log("=== [TEST] CAROUSEL ACTIONS & PERSISTENCE TEST ===");

  // 1. Get initial carousels
  const initial = await getCarouselsAdmin();
  console.log(`Initial items count: ${initial.data?.length || 0}`);

  // 2. Test create carousel
  const testTitle = `Test Slide ${Date.now()}`;
  const createRes = await createCarousel({
    imageUrl: "/uploads/test-banner.webp",
    subheaderId: "TEST SUBHEADER",
    titleId: testTitle,
    descriptionId: "Test Deskripsi Hero Slide",
    loadingTitleId: "TestingTab",
    ctaTextId: "Hubungi Sekarang",
    ctaLink: "#contact",
    sortOrder: 99,
    isActive: true,
  });

  console.log("Create result:", createRes);
  if (!createRes.success) {
    throw new Error("Failed to create carousel: " + createRes.message);
  }

  // 3. Find created item
  const afterCreate = await getCarouselsAdmin();
  const createdItem = afterCreate.data?.find((i: any) => i.titleI18n?.id === testTitle);
  if (!createdItem) {
    throw new Error("Created item not found in getCarouselsAdmin!");
  }
  console.log("✓ Created item ID:", createdItem.id);

  // 4. Test getCarouselById
  const getByIdRes = await getCarouselById(createdItem.id);
  console.log("getCarouselById result:", getByIdRes.success);
  if (!getByIdRes.success || !getByIdRes.data) {
    throw new Error("Failed to get carousel by ID");
  }
  console.log("✓ Retrieved title:", getByIdRes.data.titleI18n?.id);

  // 5. Test updateCarousel
  const updateRes = await updateCarousel(createdItem.id, {
    imageUrl: "/uploads/test-banner-updated.webp",
    subheaderId: "UPDATED SUBHEADER",
    titleId: `${testTitle} (Updated)`,
    descriptionId: "Deskripsi yang telah diperbarui",
    loadingTitleId: "UpdatedTab",
    ctaTextId: "Konsultasi Cepat",
    ctaLink: "/contact",
    sortOrder: 100,
    isActive: false,
  });

  console.log("Update result:", updateRes);
  if (!updateRes.success) {
    throw new Error("Failed to update carousel: " + updateRes.message);
  }
  console.log("✓ Carousel successfully updated");

  // 6. Test deleteCarousel
  const deleteRes = await deleteCarousel(createdItem.id);
  console.log("Delete result:", deleteRes);
  if (!deleteRes.success) {
    throw new Error("Failed to delete carousel: " + deleteRes.message);
  }
  console.log("✓ Carousel successfully cleaned up");

  console.log("\n=================================");
  console.log("ALL CAROUSEL TESTS PASSED 100%!");
  console.log("=================================");
}

testCarouselFlow().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
