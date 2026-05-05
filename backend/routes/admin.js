const contentConfig   = require('../config/contentConfig');
const contentOverrides = require('../lib/contentOverrides');
const db              = require('../lib/db');

function deepMerge(base, override = {}) {
  if (Array.isArray(base) || Array.isArray(override)) {
    return override === undefined ? base : override;
  }
  const merged = { ...base };
  Object.keys(override || {}).forEach((key) => {
    const b = base ? base[key] : undefined;
    const o = override[key];
    if (b && o && typeof b === 'object' && typeof o === 'object' && !Array.isArray(b) && !Array.isArray(o)) {
      merged[key] = deepMerge(b, o);
    } else if (o !== undefined) {
      merged[key] = o;
    }
  });
  return merged;
}

function basicAuth(req, res, next) {
  const password = process.env.ADMIN_PASSWORD || 'admin';
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="TSRG Admin"');
    return res.status(401).send('Login required.');
  }
  const decoded = Buffer.from(auth.slice(6), 'base64').toString();
  const pwd = decoded.slice(decoded.indexOf(':') + 1);
  if (pwd !== password) {
    res.set('WWW-Authenticate', 'Basic realm="TSRG Admin"');
    return res.status(401).send('Invalid password.');
  }
  next();
}

function resolvedContent(campaignId, overrides) {
  const base = campaignId === 'default'
    ? contentConfig.default
    : deepMerge(contentConfig.default, contentConfig.campaigns[campaignId] || {});
  return deepMerge(base, deepMerge(overrides['default'] || {}, overrides[campaignId] || {}));
}

module.exports = function adminRoutes(siteConfig) {
  const router = require('express').Router();

  router.use(basicAuth);

  // ── Content editor ─────────────────────────────────────────────────────────
  router.get('/', async (req, res) => {
    const overrides = await contentOverrides.load();
    const allIds = ['default', ...Object.keys(contentConfig.campaigns)];
    const campaigns = {};
    allIds.forEach((id) => { campaigns[id] = resolvedContent(id, overrides); });
    res.render('admin', { campaigns, overrides, site: siteConfig, campaignIds: allIds, dbEnabled: db.isEnabled() });
  });

  router.post('/api/save', async (req, res) => {
    const { campaignId, section, data } = req.body;
    if (!campaignId || !section || !data) {
      return res.status(400).json({ success: false, error: 'Missing fields.' });
    }
    try {
      await contentOverrides.setSection(campaignId, section, data);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/api/reset', async (req, res) => {
    const { campaignId } = req.body;
    if (!campaignId) return res.status(400).json({ success: false, error: 'Missing campaignId.' });
    try {
      await contentOverrides.resetCampaign(campaignId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.get('/api/history', async (req, res) => {
    const { campaignId } = req.query;
    if (!campaignId) return res.status(400).json({ success: false, error: 'Missing campaignId.' });
    try {
      const rows = await contentOverrides.history(campaignId, 30);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ── Leads API ──────────────────────────────────────────────────────────────
  router.get('/api/leads', async (req, res) => {
    if (!db.isEnabled()) return res.json({ leads: [], dbEnabled: false });
    try {
      const { campaign, score, limit = 200 } = req.query;
      let sql = `SELECT id, submitted_at, campaign_id, name, email, phone,
                        lead_score, pipeline_stage, neighborhood,
                        utm_source, utm_medium, utm_campaign, utm_term,
                        timeline, budget, financing, property_address,
                        already_listed, zapier_status
                 FROM leads WHERE 1=1`;
      const params = [];
      if (campaign) { params.push(campaign); sql += ` AND campaign_id = $${params.length}`; }
      if (score)    { params.push(Number(score)); sql += ` AND lead_score >= $${params.length}`; }
      params.push(Math.min(Number(limit), 500));
      sql += ` ORDER BY submitted_at DESC LIMIT $${params.length}`;
      const { rows } = await db.query(sql, params);
      const { rows: [{ count }] } = await db.query('SELECT COUNT(*) FROM leads');
      res.json({ leads: rows, total: Number(count), dbEnabled: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.get('/api/leads/export', async (req, res) => {
    if (!db.isEnabled()) return res.status(503).send('Database not enabled.');
    const { rows } = await db.query(
      `SELECT submitted_at,campaign_id,name,email,phone,lead_score,pipeline_stage,
              utm_source,utm_medium,utm_campaign,utm_term,neighborhood,
              timeline,budget,financing,property_address,already_listed,zapier_status
       FROM leads ORDER BY submitted_at DESC LIMIT 5000`
    );
    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')),
    ].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="tsrg-leads.csv"');
    res.send(csv);
  });

  return router;
};
