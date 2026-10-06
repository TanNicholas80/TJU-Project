import { pool } from "../src/db";

async function initTranslationCacheTable() {
  const client = await pool.connect();
  try {
    console.log("Checking & initializing translation_cache table in PostgreSQL...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS translation_cache (
        hash_key VARCHAR(64) PRIMARY KEY,
        source_text TEXT NOT NULL,
        source_lang VARCHAR(10) NOT NULL DEFAULT 'id',
        target_lang VARCHAR(10) NOT NULL,
        translated_text TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("✓ Table translation_cache is ready!");
  } catch (err) {
    console.error("Error creating translation_cache table:", err);
  } finally {
    client.release();
    process.exit(0);
  }
}

initTranslationCacheTable();
