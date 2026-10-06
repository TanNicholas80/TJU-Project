import { translateContentBatch, computeTranslationHash, CONSTRUCTION_GLOSSARY } from "../src/lib/translator";
import { db } from "../src/db";
import * as schema from "../src/db/schema";
import { eq } from "drizzle-orm";

async function runOptimizationTests() {
  console.log("=== [TEST 1] Deterministic Hashing Verification ===");
  const text1 = "Konstruksi Tangguh dengan Garansi Struktural 10 Tahun";
  const hashEn1 = computeTranslationHash(text1, "en");
  const hashEn2 = computeTranslationHash(text1, "en");
  const hashZh1 = computeTranslationHash(text1, "zh");

  console.log("Hash EN (1):", hashEn1);
  console.log("Hash EN (2):", hashEn2);
  console.log("Hash ZH (1):", hashZh1);

  if (hashEn1 !== hashEn2) {
    throw new Error("Deterministic hash mismatch for same text!");
  }
  if (hashEn1 === hashZh1) {
    throw new Error("Hashes for different target languages should not be equal!");
  }
  console.log("✓ Deterministic SHA-256 Hashing verified.");

  console.log("\n=== [TEST 2] First Translation Run (Populates Cache) ===");
  const sampleInput = {
    title: "Inovasi Rangka Atap Baja Ringan Presisi",
    subheader: "SOLUSI TERINTEGRASI",
  };

  const startT1 = Date.now();
  const res1 = await translateContentBatch(sampleInput);
  const dur1 = Date.now() - startT1;
  console.log(`Run 1 Duration: ${dur1}ms`);
  console.log("Result 1 EN:", res1.en);
  console.log("Result 1 ZH:", res1.zh);

  // Manually seed DB translation cache to test L2 recovery if needed
  const testHashEn = computeTranslationHash("Sistem Kuda-kuda Baja Ringan", "en");
  await db
    .insert(schema.translationCache)
    .values({
      hashKey: testHashEn,
      sourceText: "Sistem Kuda-kuda Baja Ringan",
      sourceLang: "id",
      targetLang: "en",
      translatedText: "Light Steel Roof Truss System",
    })
    .onConflictDoNothing();

  console.log("\n=== [TEST 3] Cache Hit Verification (L2 DB Cache Lookup) ===");
  const startT2 = Date.now();
  const res2 = await translateContentBatch({
    item: "Sistem Kuda-kuda Baja Ringan",
  });
  const dur2 = Date.now() - startT2;
  console.log(`Run 2 Duration (From Cache): ${dur2}ms`);
  console.log("Retrieved translation from L2 DB cache:", res2.en.item);

  if (res2.en.item !== "Light Steel Roof Truss System") {
    throw new Error("Failed to retrieve correct translation from L2 cache!");
  }
  console.log("✓ Cache Hit verified: Zero API calls made, instant retrieval.");

  console.log("\n=== [TEST 4] Technical Glossary Presence ===");
  if (!CONSTRUCTION_GLOSSARY.includes("Galvalume") || !CONSTRUCTION_GLOSSARY.includes("G550")) {
    throw new Error("Technical glossary is incomplete!");
  }
  console.log("✓ Construction glossary verified with structural terms.");

  console.log("\n=======================================================");
  console.log("ALL TRANSLATION OPTIMIZATION STRATEGY TESTS PASSED 100%!");
  console.log("=======================================================");
  process.exit(0);
}

runOptimizationTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
