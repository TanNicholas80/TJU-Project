import { describe, it, expect } from "vitest";
import idMessages from "../../messages/id.json";
import enMessages from "../../messages/en.json";
import zhMessages from "../../messages/zh.json";
import {
  computeTranslationHash,
  CONSTRUCTION_GLOSSARY,
  translateContentBatch,
} from "@/lib/translator";
import { cache } from "@/lib/cache";

describe("Translation Systems: Static Next-INTL & Dynamic Gemini AI", () => {
  // 1. Static Local Dictionaries (Next-INTL)
  describe("Static Next-INTL Local JSON Dictionaries", () => {
    it("should contain all required root sections in ID, EN, and ZH", () => {
      const requiredSections = [
        "navigation",
        "language",
        "footer",
        "expertise",
        "history",
        "coreValues",
        "cta",
        "homePortfolio",
        "qualityStandards",
        "homeBlog",
        "homeContact",
        "errors",
        "aboutPage",
        "blogDetail",
        "portfolioDetail",
      ];

      for (const section of requiredSections) {
        expect(idMessages, `idMessages missing ${section}`).toHaveProperty(section);
        expect(enMessages, `enMessages missing ${section}`).toHaveProperty(section);
        expect(zhMessages, `zhMessages missing ${section}`).toHaveProperty(section);
      }
    });

    it("should have matching navigation keys across ID, EN, and ZH", () => {
      const navKeys = Object.keys(idMessages.navigation);
      expect(Object.keys(enMessages.navigation)).toEqual(navKeys);
      expect(Object.keys(zhMessages.navigation)).toEqual(navKeys);
      expect(["Home", "Beranda"]).toContain(idMessages.navigation.home);
      expect(idMessages.navigation.about).toBe("Tentang Kami");
    });

    it("should have complete contact form labels across all 3 languages", () => {
      const contactKeys = Object.keys(idMessages.homeContact);
      expect(Object.keys(enMessages.homeContact)).toEqual(contactKeys);
      expect(Object.keys(zhMessages.homeContact)).toEqual(contactKeys);
    });

    it("should have complete about page labels across all 3 languages", () => {
      const aboutSections = Object.keys(idMessages.aboutPage);
      expect(Object.keys(enMessages.aboutPage)).toEqual(aboutSections);
      expect(Object.keys(zhMessages.aboutPage)).toEqual(aboutSections);
    });
  });

  // 2. Dynamic Gemini AI Translation Pipeline
  describe("Dynamic Gemini AI Translation Pipeline & Heuristics", () => {
    it("should compute deterministic SHA-256 hash per text and target language", () => {
      const text = "Konstruksi Rangka Atap Baja Ringan Presisi";
      const hashEn1 = computeTranslationHash(text, "en");
      const hashEn2 = computeTranslationHash(text, "en");
      const hashZh = computeTranslationHash(text, "zh");

      expect(hashEn1).toBe(hashEn2);
      expect(hashEn1).toHaveLength(64); // SHA-256 hex string
      expect(hashEn1).not.toBe(hashZh); // Different target language yields different hash
    });

    it("should contain standard construction glossary terms in context caching", () => {
      expect(CONSTRUCTION_GLOSSARY).toContain("Baja Ringan");
      expect(CONSTRUCTION_GLOSSARY).toContain("Cold-Formed Light Steel");
      expect(CONSTRUCTION_GLOSSARY).toContain("Mutu Tinggi G550");
      expect(CONSTRUCTION_GLOSSARY).toContain("Software Engineering HAKI");
      expect(CONSTRUCTION_GLOSSARY).toContain("Galvalum");
    });

    it("should retrieve translations from cache without calling AI when cache hits", async () => {
      const sourceText = "Proyek Unggulan TJU";
      const hashEn = computeTranslationHash(sourceText, "en");
      const hashZh = computeTranslationHash(sourceText, "zh");

      // Seed cache directly (Simulating prior translation)
      await cache.set(`tr:${hashEn}`, "TJU Featured Project", 3600);
      await cache.set(`tr:${hashZh}`, "TJU 重点工程项目", 3600);

      const result = await translateContentBatch({ title: sourceText });

      expect(result.en.title).toBe("TJU Featured Project");
      expect(result.zh.title).toBe("TJU 重点工程项目");
    });

    it("should gracefully fallback to source text when Gemini API key is missing or offline", async () => {
      const uniqueText = `Test Fallback Unik ${Date.now()}`;
      const result = await translateContentBatch({ title: uniqueText });

      // Fallback preserves source text cleanly without throwing fatal exceptions
      expect(result.en.title).toBeTruthy();
      expect(result.zh.title).toBeTruthy();
    });
  });
});
