const db = require('./db');

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS leads (
    id              SERIAL PRIMARY KEY,
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    campaign_id     TEXT,
    name            TEXT,
    email           TEXT,
    phone           TEXT,
    lead_score      INTEGER,
    pipeline_stage  TEXT,
    utm_source      TEXT,
    utm_medium      TEXT,
    utm_campaign    TEXT,
    utm_term        TEXT,
    utm_content     TEXT,
    neighborhood    TEXT,
    timeline        TEXT,
    budget          TEXT,
    financing       TEXT,
    property_address TEXT,
    bedrooms        TEXT,
    reason          TEXT,
    situation       TEXT,
    already_listed  TEXT,
    interest        TEXT,
    page_url        TEXT,
    zapier_status   TEXT NOT NULL DEFAULT 'pending',
    raw             JSONB
  )`,

  `CREATE TABLE IF NOT EXISTS content_overrides (
    id          SERIAL PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    section     TEXT NOT NULL,
    data        JSONB NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (campaign_id, section)
  )`,

  `CREATE TABLE IF NOT EXISTS content_history (
    id          SERIAL PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    section     TEXT NOT NULL,
    data        JSONB NOT NULL,
    changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,

  `CREATE INDEX IF NOT EXISTS leads_campaign_id_idx ON leads (campaign_id)`,
  `CREATE INDEX IF NOT EXISTS leads_submitted_at_idx ON leads (submitted_at DESC)`,
];

async function runMigrations() {
  if (!db.isEnabled()) {
    console.log('[db] DATABASE_URL not set — skipping migrations, using file fallback');
    return;
  }
  try {
    for (const sql of MIGRATIONS) {
      await db.query(sql);
    }
    console.log('[db] migrations OK');
  } catch (err) {
    console.error('[db] migration failed:', err.message);
    throw err;
  }
}

module.exports = { runMigrations };
