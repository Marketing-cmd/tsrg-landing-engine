(function () {
  function runHookCode(code, eventName, params) {
    if (!code) return;

    try {
      const execute = new Function('eventName', 'params', 'site', code);
      execute(eventName, params, window.TSRG_SITE || {});
    } catch (error) {
      console.error('Custom tag hook failed:', error);
    }
  }

  function runConfiguredHooks(eventName, params) {
    const googleTags = (window.TSRG_SITE && window.TSRG_SITE.googleTags) || {};
    const hook = googleTags.eventHooks && googleTags.eventHooks[eventName];
    if (!hook) return;

    if (hook.dataLayerEvent) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: hook.dataLayerEvent }, params || {}, hook.extraParams || {}));
    }

    runHookCode(hook.customJs, eventName, Object.assign({}, params || {}, hook.extraParams || {}));
  }

  function pushEvent(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }

    runConfiguredHooks(eventName, params || {});
  }

  document.addEventListener('DOMContentLoaded', () => {
    const campaignId = document.body.dataset.campaignId;
    const utm = window.UTM ? window.UTM.get() : window.TSRG_UTM || {};

    if (window.TSRG_SITE && window.TSRG_SITE.ga4Id && typeof window.gtag === 'function') {
      window.gtag('js', new Date());
      window.gtag('config', window.TSRG_SITE.ga4Id, {
        campaign_id: campaignId,
        utm_source: utm.source || '',
        utm_medium: utm.medium || '',
        utm_campaign: utm.campaign || '',
        page_location: window.location.href,
        user_intent_segment: document.body.dataset.intentSegment
      });
    }

    document.querySelectorAll('.tsrg-cta-primary, .tsrg-cta-secondary').forEach((cta) => {
      cta.addEventListener('click', () => {
        pushEvent('cta_click', {
          campaign_id: campaignId,
          cta_text: cta.dataset.ctaText || cta.textContent.trim(),
          cta_role: cta.dataset.ctaRole || ''
        });
      });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      link.addEventListener('click', () => {
        pushEvent('phone_click', {
          campaign_id: campaignId,
          link_text: link.textContent.trim()
        });
      });
    });

    let scrolled75 = false;
    window.addEventListener('scroll', () => {
      if (scrolled75) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = window.scrollY / scrollable;
      if (progress >= 0.75) {
        scrolled75 = true;
        pushEvent('scroll_75', { campaign_id: campaignId });
      }
    }, { passive: true });
  });
})();
