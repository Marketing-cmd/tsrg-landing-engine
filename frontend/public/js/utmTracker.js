(function () {
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const COOKIE_NAME = 'tsrg_utm_client';
  const DAYS = 30;

  function getUrlUtm() {
    const params = new URLSearchParams(window.location.search);
    return UTM_KEYS.reduce((utm, key) => {
      if (params.get(key)) {
        utm[key.replace('utm_', '')] = params.get(key);
        utm[key] = params.get(key);
      }
      return utm;
    }, {});
  }

  function getStoredUtm() {
    try {
      return JSON.parse(window.sessionStorage.getItem('tsrg_utm') || '{}');
    } catch (error) {
      return {};
    }
  }

  function saveUtm(utm) {
    if (!Object.keys(utm).length) return;
    window.sessionStorage.setItem('tsrg_utm', JSON.stringify(utm));
    const expires = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(utm))}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function activeUtm() {
    return Object.assign({}, window.TSRG_UTM || {}, getStoredUtm(), getUrlUtm());
  }

  function isInternalLink(link) {
    if (!link.href || link.href.startsWith('tel:') || link.href.startsWith('mailto:')) return false;
    const url = new URL(link.href, window.location.origin);
    return url.hostname === window.location.hostname || url.hostname.endsWith('tsrg.ca');
  }

  function appendUtmToLinks(utm) {
    document.querySelectorAll('a[href]').forEach((link) => {
      if (!isInternalLink(link)) return;
      const url = new URL(link.href, window.location.origin);
      UTM_KEYS.forEach((key) => {
        const value = utm[key.replace('utm_', '')] || utm[key];
        if (value) url.searchParams.set(key, value);
      });
      link.href = url.toString();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const utm = activeUtm();
    saveUtm(utm);
    appendUtmToLinks(utm);
  });

  window.UTM = {
    get: activeUtm
  };
})();
