/**
 * SITE-WIDE SETTINGS
 *
 * 1. Put your GA4 Measurement ID in `.env` as GA4_MEASUREMENT_ID=G-XXXXXXXXXX.
 * 2. Put your Zapier webhook URL in `.env` as ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/...
 * 3. Change the phone number, email, and site URL below when site-wide contact details change.
 * 4. Brand colors here are global fallbacks; campaign colors in contentConfig.js can override them.
 * 5. AgentLocator/Zapier mapping values are sent with every lead so your automation can route properly.
 * 6. Swap the logo by changing `branding.logoPath` to any file in `frontend/public/assets/...`.
 * 7. Add extra styles by editing `frontend/public/css/custom.css` or by changing `customCssFiles`.
 * 8. Add custom Google Tag Manager / tracking snippets in `googleTags.headCode`, `bodyStartCode`, or `bodyEndCode`.
 * 9. Add custom event hooks in `googleTags.eventHooks` to fire extra dataLayer events or custom JS.
 */

module.exports = {
  siteName: 'The Smith Realty Group',
  siteUrl: process.env.SITE_BASE_URL || 'https://lp.tsrg.ca',
  brokerageName: 'The Smith Realty Group',
  branding: {
    logoPath: '/assets/images/shared/smith-realty-group-logo.svg',
    logoAlt: 'Smith Realty Group logo',
    logoHref: '/',
    showWordmarkText: false,
    wordmarkText: 'The Smith Realty Group Inc'
  },
  phone: '416-555-1234',
  phoneHref: 'tel:+14165551234',
  email: 'hello@tsrg.ca',
  ga4Id: process.env.GA4_MEASUREMENT_ID || '',
  customCssFiles: ['/css/template.css', '/css/custom.css'],
  googleTags: {
    headCode: '',
    bodyStartCode: '',
    bodyEndCode: '',
    eventHooks: {
      cta_click: {
        dataLayerEvent: 'tsrg_cta_click',
        extraParams: {
          source: 'landing-engine'
        },
        customJs: ''
      },
      form_submit: {
        dataLayerEvent: 'tsrg_form_submit',
        extraParams: {
          source: 'landing-engine'
        },
        customJs: ''
      }
    }
  },
  zapierWebhook: process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/YOUR_ID/PLACEHOLDER/',
  agentLocatorMapping: {
    leadSource: 'TSRG Landing Page',
    utmCampaignField: 'Tags',
    autoAssignTo: 'Brian Smith'
  },
  compliance: {
    recoNumber: 'RECO #1234567',
    brokerageName: 'The Smith Realty Group Inc., Brokerage',
    brokerageAddress: '1234 Bloor Street West, Toronto, ON M6H 1N3',
    legalDisclaimer: 'Not intended to solicit individuals currently under a listing or buyer representation agreement with another brokerage. All information is believed to be accurate but is not guaranteed.'
  },
  brandColors: {
    primary: '#0f5f5c',
    secondary: '#17202a',
    accent: '#c69c3f',
    text: '#17202a',
    background: '#ffffff'
  }
};
