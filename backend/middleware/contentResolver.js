const fs = require('fs');
const path = require('path');
const contentConfig = require('../config/contentConfig');
const siteConfig = require('../config/siteConfig');
const contentOverrides = require('../lib/contentOverrides');

const IMAGE_FIELDS = new Set(['heroImage', 'agentPhoto', 'ogImage', 'image']);
const PLACEHOLDER_IMAGE = '/assets/images/shared/placeholder.svg';

function deepMerge(base, override = {}) {
  if (Array.isArray(base) || Array.isArray(override)) {
    return override === undefined ? base : override;
  }

  const merged = { ...base };
  Object.keys(override || {}).forEach((key) => {
    const baseValue = base ? base[key] : undefined;
    const overrideValue = override[key];

    if (
      baseValue &&
      overrideValue &&
      typeof baseValue === 'object' &&
      typeof overrideValue === 'object' &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue)
    ) {
      merged[key] = deepMerge(baseValue, overrideValue);
    } else if (overrideValue !== undefined) {
      merged[key] = overrideValue;
    }
  });

  return merged;
}

function findCampaignId(utm = {}) {
  const candidates = contentConfig.utmRules.priority
    .map((key) => utm[key.replace('utm_', '')] || utm[key])
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  for (const candidate of candidates) {
    for (const [campaignId, campaign] of Object.entries(contentConfig.campaigns)) {
      const aliases = [campaignId, ...(campaign.utmMatch || [])].map((value) => String(value).toLowerCase());
      if (aliases.some((alias) => candidate === alias || candidate.includes(alias) || alias.includes(candidate))) {
        return campaignId;
      }
    }
  }

  return contentConfig.defaultCampaign;
}

function getInjectionTerm(utm = {}) {
  const term = utm.term || utm.utm_term;
  if (term) {
    return String(term)
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return contentConfig.neighborhoodFallbacks[0] || 'West Toronto';
}

function injectTerm(value, term) {
  if (typeof value === 'string') {
    return value.replace(/\{\{term\}\}/g, term);
  }

  if (Array.isArray(value)) {
    return value.map((item) => injectTerm(item, term));
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((result, key) => {
      result[key] = injectTerm(value[key], term);
      return result;
    }, {});
  }

  return value;
}

function resolveImage(filename, campaignId) {
  if (!filename || /^https?:\/\//.test(filename) || filename.startsWith('/')) {
    return filename || PLACEHOLDER_IMAGE;
  }

  const campaignPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'assets', 'images', 'campaigns', campaignId, filename);
  if (fs.existsSync(campaignPath)) {
    return `/assets/images/campaigns/${campaignId}/${filename}`;
  }

  const sharedPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'assets', 'images', 'shared', filename);
  if (fs.existsSync(sharedPath)) {
    return `/assets/images/shared/${filename}`;
  }

  return PLACEHOLDER_IMAGE;
}

function resolveImages(content, campaignId) {
  if (Array.isArray(content)) {
    return content.map((item) => resolveImages(item, campaignId));
  }

  if (content && typeof content === 'object') {
    return Object.keys(content).reduce((result, key) => {
      result[key] = IMAGE_FIELDS.has(key) ? resolveImage(content[key], campaignId) : resolveImages(content[key], campaignId);
      return result;
    }, {});
  }

  return content;
}

function cssVariables(colors = {}) {
  const source = { ...siteConfig.brandColors, ...colors };
  return `
    :root {
      --color-primary: ${source.primary};
      --color-secondary: ${source.secondary};
      --color-accent: ${source.accent};
      --color-text: ${source.text};
      --color-background: ${source.background};
    }
  `;
}

module.exports = async function contentResolver(req, res, next) {
  const campaignId = findCampaignId(res.locals.utm);
  const campaign = contentConfig.campaigns[campaignId] || {};
  let content = deepMerge(contentConfig.default, campaign);

  if (campaign.dynamicInject) {
    content.hero = deepMerge(content.hero, campaign.dynamicInject);
  }

  const overrides = await contentOverrides.load();
  const defaultOverrides = overrides['default'] || {};
  const campaignOverrides = overrides[campaignId] || {};
  content = deepMerge(content, deepMerge(defaultOverrides, campaignOverrides));

  const injectionTerm = contentConfig.utmRules.neighborhoodInjection ? getInjectionTerm(res.locals.utm) : '';
  content = injectTerm(content, injectionTerm);
  content = resolveImages(content, campaignId);
  content.cssVariables = cssVariables(content.colors);
  content.campaignId = campaignId;
  content.neighborhood = injectionTerm;

  res.locals.content = content;
  res.locals.campaignId = campaignId;
  res.locals.site = siteConfig;
  next();
};
