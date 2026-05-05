const { parseCookies, buildUtmObject, COOKIE_NAME } = require('../middleware/utmParser');
const demoStore = require('../lib/demoStore');

function readCookieUtm(req) {
  const cookies = parseCookies(req.headers.cookie);
  if (!cookies[COOKIE_NAME]) return {};
  try {
    return buildUtmObject(JSON.parse(cookies[COOKIE_NAME]));
  } catch {
    return {};
  }
}

function sanitize(value, maxLength = 500) {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, maxLength);
}

const rateLimitStore = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 5;
  const entry = rateLimitStore.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
  entry.count += 1;
  rateLimitStore.set(ip, entry);
  if (rateLimitStore.size > 10_000) {
    for (const [key, val] of rateLimitStore) { if (Date.now() > val.resetAt) rateLimitStore.delete(key); }
  }
  return entry.count <= max;
}

function splitName(fullName) {
  const parts = (fullName || '').trim().split(/\s+/);
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' };
}

function calculateLeadScore(body, campaignId) {
  let score = 40;

  const timeline = (body.timeline || body.selling_timeline || '').toLowerCase();
  if (/30 days|60 days|within|1.{1,3}3 month|immediate/.test(timeline)) score += 30;
  else if (timeline && !/research|just |no firm|browsing/.test(timeline)) score += 12;

  const financing = (body.financing || body.pre_approval || '').toLowerCase();
  if (/pre.?approv|cash/.test(financing)) score += 20;
  else if (financing && !/not sure|need to/.test(financing)) score += 8;

  if (body.property_address && body.property_address.trim().length > 5) score += 10;
  if (/google|facebook|meta|instagram/.test((body.utm_source || '').toLowerCase())) score += 8;
  if (/cpc|paid/.test((body.utm_medium || '').toLowerCase())) score += 5;

  return Math.min(score, 100);
}

function getPipelineStage(campaignId) {
  return {
    'foreclosure-access': 'Buyer — Foreclosure',
    'senior-downsizing':  'Seller — Senior Transition',
    'investment-buyers':  'Buyer — Investor',
    'first-time-buyer':   'Buyer — First Time',
    'seller':             'Seller',
    'home-evaluation':    'Seller — Evaluation',
    'default':            'Buyer — Foreclosure',
  }[campaignId] || 'New Lead';
}

function buildNotes(body, campaignId) {
  const et = new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto', hour12: true });
  const lines = [
    `=== TSRG LEAD — ${campaignId.toUpperCase()} ===`,
    `Submitted: ${et} ET`,
    `Source: ${body.utm_source || 'direct'} / ${body.utm_medium || 'organic'} / ${body.utm_campaign || ''}`,
    `Neighbourhood: ${body.neighborhood || body.utm_term || '—'}`,
  ];
  if (body.timeline)          lines.push(`Purchase timeline: ${body.timeline}`);
  if (body.selling_timeline)  lines.push(`Selling timeline: ${body.selling_timeline}`);
  if (body.financing)         lines.push(`Financing: ${body.financing}`);
  if (body.pre_approval)      lines.push(`Pre-approval: ${body.pre_approval}`);
  if (body.budget)            lines.push(`Budget: ${body.budget}`);
  if (body.property_address)  lines.push(`Property address: ${body.property_address}`);
  if (body.bedrooms)          lines.push(`Bedrooms: ${body.bedrooms}`);
  if (body.reason)            lines.push(`Reason for inquiry: ${body.reason}`);
  if (body.situation)         lines.push(`Situation: ${body.situation}`);
  if (body.already_listed)    lines.push(`Currently listed: ${body.already_listed}`);
  if (body.message)           lines.push(`Message: ${body.message}`);
  lines.push(`Page: ${body.page_url || '—'}`);
  return lines.join('\n');
}

module.exports = function leadRoutes(siteConfig) {
  const router = require('express').Router();

  router.post('/lead', async (req, res) => {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

    if (!checkRateLimit(ip)) {
      return res.status(429).json({ success: false, error: 'Too many requests. Please wait a moment and try again.' });
    }

    const cookieUtm = readCookieUtm(req);
    const body     = req.body || {};
    const campaignId = sanitize(body.utm_campaign || cookieUtm.campaign || 'default', 100);
    const leadScore  = calculateLeadScore(body, campaignId);
    const { firstName, lastName } = splitName(body.name);

    const payload = {
      // —— Contact ——
      name:        sanitize(body.name),
      firstName,
      lastName,
      email:       sanitize(body.email, 254),
      phone:       sanitize(body.phone, 30),

      // —— Agent Locator CRM fields ——
      source:        `TSRG Landing Page — ${campaignId}`,
      tags:          [campaignId, body.utm_source, body.utm_medium].filter(Boolean).join(', '),
      pipelineStage: getPipelineStage(campaignId),
      leadScore,
      assignedTo:    siteConfig.agentLocatorMapping.autoAssignTo,
      notes:         buildNotes(body, campaignId),

      // —— Qualifying fields ——
      timeline:         sanitize(body.timeline || body.selling_timeline, 100),
      budget:           sanitize(body.budget, 100),
      financing:        sanitize(body.financing || body.pre_approval, 100),
      propertyAddress:  sanitize(body.property_address, 300),
      bedrooms:         sanitize(body.bedrooms, 20),
      reason:           sanitize(body.reason, 200),
      situation:        sanitize(body.situation, 100),
      alreadyListed:    sanitize(body.already_listed, 100),
      neighborhood:     sanitize(body.neighborhood || cookieUtm.term, 100),
      interest:         sanitize(body.interest, 100),
      message:          sanitize(body.message),
      consent:          body.consent === 'yes' ? 'yes' : '',

      // —— UTM attribution (all formats for CRM compatibility) ——
      utm_source:   sanitize(body.utm_source   || cookieUtm.source,   200),
      utm_medium:   sanitize(body.utm_medium   || cookieUtm.medium,   200),
      utm_campaign: sanitize(body.utm_campaign || cookieUtm.campaign, 200),
      utm_term:     sanitize(body.utm_term     || cookieUtm.term,     200),
      utm_content:  sanitize(body.utm_content  || cookieUtm.content,  200),

      // —— Metadata ——
      page_url:      sanitize(body.page_url || siteConfig.siteUrl, 2000),
      submitted_at:  new Date().toISOString(),
      lead_source:   siteConfig.agentLocatorMapping.leadSource,
      agentlocator_utm_field: siteConfig.agentLocatorMapping.utmCampaignField,
    };

    if (!payload.name || !payload.email || !payload.phone) {
      return res.status(400).json({ success: false, error: 'Name, email, and phone are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    try {
      demoStore.recordLead({
        submittedAt:  payload.submitted_at,
        campaignId,
        neighborhood: payload.neighborhood || '',
        name:         payload.name,
        email:        payload.email,
        phone:        payload.phone,
        interest:     payload.interest || getPipelineStage(campaignId),
        leadScore,
        utm: {
          source:   payload.utm_source,
          medium:   payload.utm_medium,
          campaign: payload.utm_campaign,
          term:     payload.utm_term,
          content:  payload.utm_content,
        },
        status: 'forwarding',
      });

      const response = await fetch(siteConfig.zapierWebhook, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Zapier returned ${response.status}`);

      res.json({ success: true, leadScore });
    } catch (error) {
      console.error('[lead]', error.message);
      res.status(502).json({ success: false, error: 'Submission failed. Please call us directly or try again.' });
    }
  });

  return router;
};
