import { GoogleGenAI } from "@google/genai";
import { cache } from "@/lib/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import crypto from "crypto";

interface TranslationInput {
  [key: string]: string | undefined | null;
}

interface TranslationOutput {
  en: Record<string, string>;
  zh: Record<string, string>;
}

/**
 * Glosarium Istilah Konstruksi & Rekayasa Rangka Atap Baja Ringan TJU Truss
 * Digunakan dalam System Instruction (Context Caching) sesuai PRD.md Section 5.3.5
 * untuk menjamin keseragaman dan akurasi terjemahan teknis.
 */
export const CONSTRUCTION_GLOSSARY = `
TJU TRUSS TECHNICAL CONSTRUCTION GLOSSARY:
- "Baja Ringan" -> "Cold-Formed Light Steel" (EN) | "冷弯薄壁轻钢" (ZH)
- "Rangka Atap" -> "Roof Truss" (EN) | "轻钢屋架" (ZH)
- "Galvalum" / "Zincalume" -> "Galvalume / Zincalume (AZ100 / AZ150)" (EN) | "镀铝锌 (AZ100/AZ150)" (ZH)
- "Mutu Tinggi G550" / "Baja G550" -> "High Tensile G550 Steel" (EN) | "G550高强钢材" (ZH)
- "Kuda-kuda Baja Ringan" -> "Light Steel Roof Truss" (EN) | "轻钢主屋架" (ZH)
- "Reng" / "Batten" -> "Roof Batten" (EN) | "屋面挂瓦条 (副檩)" (ZH)
- "Baut Dynabolt" -> "Dynabolt Expansion Anchor" (EN) | "膨胀螺栓" (ZH)
- "Baut SDS" / "Self-Drilling Screw" -> "Self-Drilling Screw" (EN) | "自攻自钻螺丝" (ZH)
- "Beban Angin" -> "Wind Load" (EN) | "风荷载" (ZH)
- "Beban Gempa" -> "Seismic Load" (EN) | "地震荷载" (ZH)
- "Garansi Struktural 10 Tahun" -> "10-Year Structural Warranty" (EN) | "10年结构质保" (ZH)
- "Aplikator Bersertifikat" -> "Nationally Certified Applicators" (EN) | "国家认证施工团队" (ZH)
- "Standar SNI" -> "Indonesian National Standard (SNI)" (EN) | "印尼国家标准 (SNI)" (ZH)
- "Software Engineering HAKI" -> "HAKI-Certified Structural Engineering Software" (EN) | "HAKI认证工程结构软件" (ZH)
- "Anti Karat" / "Tahan Korosi" -> "Rust-Resistant / Corrosion-Resistant" (EN) | "耐腐蚀防生锈" (ZH)
- "Konsultasi Proyek" -> "Project Consultation" (EN) | "项目咨询" (ZH)
- "Pelajari Sistem TJU" -> "Explore TJU System" (EN) | "了解TJU系统" (ZH)
`;

/**
 * 1. Deterministic SHA-256 Hashing per Text Field (PRD 5.3.2)
 * Formula: hash(text + target_lang)
 */
export function computeTranslationHash(text: string, targetLang: "en" | "zh"): string {
  const normalized = text.trim();
  return crypto
    .createHash("sha256")
    .update(`${normalized}||${targetLang}`)
    .digest("hex");
}

/**
 * 2. Helper untuk mengambil terjemahan tersimpan dari Cache L1 (Redis/Memory)
 * dan Cache L2 (Database PostgreSQL translation_cache table)
 */
async function getCachedTranslations(
  hashes: { key: string; text: string; lang: "en" | "zh"; hash: string }[]
): Promise<Map<string, string>> {
  const resultMap = new Map<string, string>();
  if (hashes.length === 0) return resultMap;

  const missingFromL1: typeof hashes = [];

  // --- Check L1 Cache (Fast Redis / In-Memory) ---
  for (const item of hashes) {
    try {
      const cached = await cache.get<string>(`tr:${item.hash}`);
      if (cached && typeof cached === "string" && cached.trim().length > 0) {
        resultMap.set(item.hash, cached);
      } else {
        missingFromL1.push(item);
      }
    } catch {
      missingFromL1.push(item);
    }
  }

  if (missingFromL1.length === 0) {
    return resultMap;
  }

  // --- Check L2 Cache (Database PostgreSQL translation_cache) ---
  try {
    const missingHashKeys = missingFromL1.map((i) => i.hash);
    const dbRows = await db
      .select()
      .from(schema.translationCache)
      .where(inArray(schema.translationCache.hashKey, missingHashKeys));

    if (dbRows && dbRows.length > 0) {
      for (const row of dbRows) {
        if (row.translatedText) {
          resultMap.set(row.hashKey, row.translatedText);
          // Restore back to L1 Cache (TTL 30 hari)
          cache.set(`tr:${row.hashKey}`, row.translatedText, 60 * 60 * 24 * 30).catch(() => {});
        }
      }
    }
  } catch (dbErr) {
    console.warn("[Translator] L2 DB cache lookup skipped:", dbErr);
  }

  return resultMap;
}

/**
 * 3. Helper untuk menyimpan hasil terjemahan baru ke Cache L1 dan L2 secara persisten
 */
async function persistTranslations(
  records: { hash: string; sourceText: string; lang: "en" | "zh"; translatedText: string }[]
) {
  if (records.length === 0) return;

  // Save to L1
  for (const rec of records) {
    cache.set(`tr:${rec.hash}`, rec.translatedText, 60 * 60 * 24 * 30).catch(() => {});
  }

  // Save to L2 (Database translation_cache)
  try {
    for (const rec of records) {
      await db
        .insert(schema.translationCache)
        .values({
          hashKey: rec.hash,
          sourceText: rec.sourceText,
          sourceLang: "id",
          targetLang: rec.lang,
          translatedText: rec.translatedText,
        })
        .onConflictDoNothing();
    }
  } catch (dbErr) {
    console.warn("[Translator] Persist to DB translation_cache skipped:", dbErr);
  }
}

/**
 * PIPELINE TRANSLASI OPTIMAL (PRD.md Section 5.2 & 5.3):
 * 1. Model: gemini-2.5-flash
 * 2. Deterministic Hashing per field (SHA-256)
 * 3. Multi-tier Cache: L1 (Redis/Memory) -> L2 (DB translation_cache)
 * 4. Structured Batching: Hanya field yang Cache Miss yang dikirim ke Gemini
 * 5. HTML Preservation Heuristics & Construction Technical Glossary
 */
export async function translateContentBatch(
  fields: TranslationInput
): Promise<TranslationOutput> {
  const result: TranslationOutput = {
    en: {},
    zh: {},
  };

  // Filter teks masukan yang valid dan tidak kosong
  const validFields: Record<string, string> = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val && typeof val === "string" && val.trim().length > 0) {
      validFields[key] = val.trim();
    }
  }

  if (Object.keys(validFields).length === 0) {
    return result;
  }

  // Siapkan daftar item hash untuk EN dan ZH
  const lookupQueue: { key: string; text: string; lang: "en" | "zh"; hash: string }[] = [];
  for (const [key, text] of Object.entries(validFields)) {
    lookupQueue.push({ key, text, lang: "en", hash: computeTranslationHash(text, "en") });
    lookupQueue.push({ key, text, lang: "zh", hash: computeTranslationHash(text, "zh") });
  }

  // Ambil data yang sudah ada di Cache L1 dan L2
  const cacheMap = await getCachedTranslations(lookupQueue);

  // Kumpulkan field yang Cache Hit dan kelompokkan yang Cache Miss
  const missForEn: Record<string, string> = {};
  const missForZh: Record<string, string> = {};

  for (const item of lookupQueue) {
    const cachedVal = cacheMap.get(item.hash);
    if (cachedVal) {
      if (item.lang === "en") result.en[item.key] = cachedVal;
      if (item.lang === "zh") result.zh[item.key] = cachedVal;
    } else {
      if (item.lang === "en") missForEn[item.key] = item.text;
      if (item.lang === "zh") missForZh[item.key] = item.text;
    }
  }

  // Jika SEMUA teks sudah ada di cache (Cache Hit 100%), SELESAI TANPA MEMANGGIL GEMINI! (Zero API Cost)
  const hasMisses = Object.keys(missForEn).length > 0 || Object.keys(missForZh).length > 0;
  if (!hasMisses) {
    return result;
  }

  // Jika ada Cache Miss, periksa GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0 || apiKey.startsWith("AIzaSy...")) {
    // Graceful fallback ke teks asli
    for (const [k, v] of Object.entries(missForEn)) result.en[k] = result.en[k] || v;
    for (const [k, v] of Object.entries(missForZh)) result.zh[k] = result.zh[k] || v;
    return result;
  }

  // Gabungkan seluruh teks yang MISS ke dalam satu payload batch request ke Gemini
  const fieldsToTranslate: Record<string, string> = {};
  for (const [k, v] of Object.entries(missForEn)) fieldsToTranslate[k] = v;
  for (const [k, v] of Object.entries(missForZh)) fieldsToTranslate[k] = v;

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are a professional construction, structural engineering, and architectural translation specialist for PT TJU Truss (light steel roof truss manufacturer and contractor).
Your role is to translate Indonesian (ID) technical texts into professional English (EN) and Simplified Chinese (ZH).

Adhere strictly to the following rules:
1. TECHNICAL GLOSSARY ACCURACY:
${CONSTRUCTION_GLOSSARY}

2. HTML PRESERVATION HEURISTICS (PRD Section 5.3.4):
- Preserve ALL HTML tags (<p>, <strong>, <em>, <ul>, <ol>, <li>, <a>, <img>, <blockquote>, <br>, <h1>-<h6>) completely intact.
- Preserve ALL HTML attributes (href, src, alt, class, style) and URLs untouched.
- Translate ONLY the human-readable text contents inside the tags.
- Do NOT escape HTML tags or output markdown wrappers around HTML tags.

3. STRUCTURED BATCH FORMAT:
- Return ONLY valid JSON matching the exact schema:
{
  "en": {
    /* each input key mapped to its English translation */
  },
  "zh": {
    /* each input key mapped to its Simplified Chinese translation */
  }
}`;

    const prompt = `Translate the following Indonesian input fields into English and Simplified Chinese:\n\n${JSON.stringify(
      fieldsToTranslate,
      null,
      2
    )}`;

    // Eksekusi model gemini-2.5-flash dengan structured JSON response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text?.trim() || "";
    if (responseText) {
      const parsed = JSON.parse(responseText);
      const toPersist: { hash: string; sourceText: string; lang: "en" | "zh"; translatedText: string }[] = [];

      if (parsed.en) {
        for (const [key, translated] of Object.entries(parsed.en)) {
          if (typeof translated === "string" && translated.trim().length > 0) {
            result.en[key] = translated.trim();
            const originalText = validFields[key];
            if (originalText) {
              toPersist.push({
                hash: computeTranslationHash(originalText, "en"),
                sourceText: originalText,
                lang: "en",
                translatedText: translated.trim(),
              });
            }
          }
        }
      }

      if (parsed.zh) {
        for (const [key, translated] of Object.entries(parsed.zh)) {
          if (typeof translated === "string" && translated.trim().length > 0) {
            result.zh[key] = translated.trim();
            const originalText = validFields[key];
            if (originalText) {
              toPersist.push({
                hash: computeTranslationHash(originalText, "zh"),
                sourceText: originalText,
                lang: "zh",
                translatedText: translated.trim(),
              });
            }
          }
        }
      }

      // Persist hasil baru ke L1 & L2 di background
      if (toPersist.length > 0) {
        persistTranslations(toPersist).catch((err) => {
          console.warn("[Translator] Error persisting translations:", err);
        });
      }
    }
  } catch (err) {
    console.warn("[Translator] Gemini translation call failed, falling back:", err);
  }

  // Final fallback untuk field yang belum terisi
  for (const [k, v] of Object.entries(validFields)) {
    if (!result.en[k]) result.en[k] = v;
    if (!result.zh[k]) result.zh[k] = v;
  }

  return result;
}
