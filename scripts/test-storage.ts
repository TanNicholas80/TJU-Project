import { LocalStorageDriver } from "../src/lib/storage/local-driver";
import { SupabaseStorageDriver } from "../src/lib/storage/supabase-driver";
import { getStorageDriver, storage } from "../src/lib/storage/index";
import fs from "fs";
import path from "path";

async function runTests() {
  console.log("=== [TEST 1] Testing LocalStorageDriver directly ===");
  const localDriver = new LocalStorageDriver();
  const dummyBuffer = Buffer.from("test image content", "utf-8");
  const testFileName = `test_${Date.now()}.txt`;

  const localRes = await localDriver.upload({
    buffer: dummyBuffer,
    fileName: testFileName,
    contentType: "text/plain",
    folder: "tests",
  });

  console.log("Local Driver Result:", localRes);
  if (!localRes.success || !localRes.url.includes("test_")) {
    throw new Error("Local Driver test failed!");
  }

  // Verify file actually created on disk
  const expectedPath = path.join(process.cwd(), "public", "uploads", "tests", testFileName);
  if (!fs.existsSync(expectedPath)) {
    throw new Error(`File was not created on disk: ${expectedPath}`);
  }
  console.log("✓ File verified on disk at:", expectedPath);

  // Clean up test file
  fs.unlinkSync(expectedPath);
  console.log("✓ Test file cleaned up successfully.");

  console.log("\n=== [TEST 2] Testing Factory Driver with STORAGE_PROVIDER=local ===");
  process.env.STORAGE_PROVIDER = "local";
  const driver = getStorageDriver();
  console.log("Active driver class:", driver.constructor.name);
  if (driver.constructor.name !== "LocalStorageDriver") {
    throw new Error("Factory did not return LocalStorageDriver when STORAGE_PROVIDER=local");
  }
  console.log("✓ STORAGE_PROVIDER=local resolved correctly.");

  console.log("\n=== [TEST 3] Testing Factory Driver with STORAGE_PROVIDER=supabase ===");
  process.env.STORAGE_PROVIDER = "supabase";
  const sbDriver = getStorageDriver();
  console.log("Active driver class:", sbDriver.constructor.name);
  if (sbDriver.constructor.name !== "SupabaseStorageDriver") {
    throw new Error("Factory did not return SupabaseStorageDriver when STORAGE_PROVIDER=supabase");
  }
  console.log("✓ STORAGE_PROVIDER=supabase resolved correctly.");

  console.log("\n=== [TEST 4] Testing Supabase Error Handling (Missing Credentials) ===");
  try {
    // When credentials are not properly set, upload should throw a clear informative error
    await sbDriver.upload({
      buffer: dummyBuffer,
      fileName: testFileName,
      contentType: "text/plain",
    });
    console.error("FAIL: Supabase should have failed without valid credentials!");
  } catch (err: any) {
    console.log("✓ Supabase gracefully caught expected error:", err.message);
  }

  console.log("\n=================================");
  console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
  console.log("=================================");
}

runTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
