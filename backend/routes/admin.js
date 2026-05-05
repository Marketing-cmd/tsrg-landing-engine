const contentConfig = require('../config/contentConfig');
const contentOverrides = require('../lib/contentOverrides');

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

  router.get('/', (req, res) => {
    const overrides = contentOverrides.load();
    const allIds = ['default', ...Object.keys(contentConfig.campaigns)];
    const campaigns = {};
    allIds.forEach((id) => {
      campaigns[id] = resolvedContent(id, overrides);
    });
    res.render('admin', { campaigns, overrides, site: siteConfig, campaignIds: allIds });
  });

  router.post('/api/save', (req, res) => {
    const { campaignId, section, data } = req.body;
    if (!campaignId || !section || !data) {
      return res.status(400).json({ success: false, error: 'Missing fields.' });
    }
    try {
      contentOverrides.setSection(campaignId, section, data);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/api/reset', (req, res) => {
    const { campaignId } = req.body;
    if (!campaignId) return res.status(400).json({ success: false, error: 'Missing campaignId.' });
    try {
      contentOverrides.resetCampaign(campaignId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};
