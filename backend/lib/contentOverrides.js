const fs   = require('fs');
const path = require('path');
const db   = require('./db');

const FILE_PATH = path.join(__dirname, '../../content-overrides.json');

// ── File fallback (no DATABASE_URL) ──────────────────────────────────────────

function fileLoad() {
  try { return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8')); } catch { return {}; }
}

function fileSave(overrides) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(overrides, null, 2));
}

// ── DB implementation ─────────────────────────────────────────────────────────

async function dbLoad() {
  const { rows } = await db.query(
    'SELECT campaign_id, section, data FROM content_overrides'
  );
  const result = {};
  for (const row of rows) {
    if (!result[row.campaign_id]) result[row.campaign_id] = {};
    Object.assign(result[row.campaign_id], row.data);
  }
  return result;
}

async function dbSetSection(campaignId, section, data) {
  await db.query(
    `INSERT INTO content_overrides (campaign_id, section, data)
     VALUES ($1, $2, $3)
     ON CONFLICT (campaign_id, section)
     DO UPDATE SET data = $3, updated_at = NOW()`,
    [campaignId, section, data]
  );
  await db.query(
    `INSERT INTO content_history (campaign_id, section, data) VALUES ($1, $2, $3)`,
    [campaignId, section, data]
  );
}

async function dbResetCampaign(campaignId) {
  await db.query('DELETE FROM content_overrides WHERE campaign_id = $1', [campaignId]);
}

async function dbHistory(campaignId, limit = 20) {
  const { rows } = await db.query(
    `SELECT section, changed_at FROM content_history
     WHERE campaign_id = $1 ORDER BY changed_at DESC LIMIT $2`,
    [campaignId, limit]
  );
  return rows;
}

// ── Public API (always async) ─────────────────────────────────────────────────

async function load() {
  return db.isEnabled() ? dbLoad() : fileLoad();
}

async function setSection(campaignId, section, data) {
  if (db.isEnabled()) return dbSetSection(campaignId, section, data);
  const overrides = fileLoad();
  if (!overrides[campaignId]) overrides[campaignId] = {};
  overrides[campaignId][section] = data;
  fileSave(overrides);
}

async function resetCampaign(campaignId) {
  if (db.isEnabled()) return dbResetCampaign(campaignId);
  const overrides = fileLoad();
  delete overrides[campaignId];
  fileSave(overrides);
}

async function history(campaignId, limit) {
  return db.isEnabled() ? dbHistory(campaignId, limit) : [];
}

module.exports = { load, setSection, resetCampaign, history };
