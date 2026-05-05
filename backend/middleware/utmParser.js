const contentConfig = require('../config/contentConfig');

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const COOKIE_NAME = 'tsrg_utm';

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, pair) => {
    const [rawKey, ...rawValue] = pair.trim().split('=');
    if (!rawKey) return cookies;
    cookies[rawKey] = decodeURIComponent(rawValue.join('=') || '');
    return cookies;
  }, {});
}

function readUtmCookie(req) {
  const cookies = parseCookies(req.headers.cookie);
  if (!cookies[COOKIE_NAME]) return {};

  try {
    return JSON.parse(cookies[COOKIE_NAME]);
  } catch (error) {
    return {};
  }
}

function buildUtmObject(source = {}) {
  return UTM_KEYS.reduce((utm, key) => {
    const shortKey = key.replace('utm_', '');
    const value = source[key] || source[shortKey] || '';
    utm[shortKey] = value;
    utm[key] = value;
    return utm;
  }, {});
}

function hasUtm(query) {
  return UTM_KEYS.some((key) => query[key]);
}

function setUtmCookie(res, utm) {
  const maxAge = contentConfig.utmRules.persistDuration * 24 * 60 * 60;
  const serialized = encodeURIComponent(JSON.stringify(buildUtmObject(utm)));
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${serialized}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax`
  ]);
}

function appendQueryParams(url, params) {
  const parsedUrl = new URL(url, 'http://localhost');
  UTM_KEYS.forEach((key) => {
    const shortKey = key.replace('utm_', '');
    if (params[shortKey]) parsedUrl.searchParams.set(key, params[shortKey]);
  });
  parsedUrl.searchParams.set('tsrg_restored', '1');
  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
}

module.exports = function utmParser(req, res, next) {
  const queryHasUtm = hasUtm(req.query);
  const cookieUtm = readUtmCookie(req);
  const activeUtm = queryHasUtm ? buildUtmObject(req.query) : buildUtmObject(cookieUtm);

  if (queryHasUtm) {
    setUtmCookie(res, activeUtm);
  }

  const isPageRequest = req.method === 'GET' && !pathHasExtension(req.path) && !req.path.startsWith('/api');
  const shouldRestoreUrl =
    isPageRequest &&
    !queryHasUtm &&
    req.path !== '/health' &&
    !req.query.tsrg_restored &&
    UTM_KEYS.some((key) => activeUtm[key.replace('utm_', '')]);

  if (shouldRestoreUrl) {
    return res.redirect(302, appendQueryParams(req.originalUrl, activeUtm));
  }

  res.locals.utm = activeUtm;
  res.locals.utmJson = JSON.stringify(activeUtm).replace(/</g, '\\u003c');
  return next();
};

function pathHasExtension(requestPath) {
  return /\.[a-z0-9]+$/i.test(requestPath);
}

module.exports.UTM_KEYS = UTM_KEYS;
module.exports.COOKIE_NAME = COOKIE_NAME;
module.exports.parseCookies = parseCookies;
module.exports.buildUtmObject = buildUtmObject;
