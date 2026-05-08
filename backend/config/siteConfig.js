/**
 * SITE-WIDE SETTINGS — code-level config (env vars + brand)
 *
 * ✏️  To edit phone, email, WhatsApp, FAQ, How It Works, and compliance text
 *     edit  site-content.json  at the project root, then run:
 *       docker compose restart landing
 *     No rebuild required.
 *
 * Code-level settings (require a rebuild to change):
 *   1. GA4 Measurement ID      → .env  GA4_MEASUREMENT_ID=G-XXXXXXXXXX
 *   2. Zapier webhook URL       → .env  ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/...
 *   3. Logo                     → branding.logoPath below
 *   4. Brand colors             → brandColors below
 *   5. Custom CSS/JS injection  → googleTags below
 */

module.exports = {
  siteName:      'The Smith Realty Group',
  siteUrl:       process.env.SITE_BASE_URL || 'https://lp.tsrg.ca',
  brokerageName: 'The Smith Realty Group',

  branding: {
    logoPath:        'https://cdn-websites.agentlocator.ca/16023/Menu/Logo.png',
    logoAlt:         'Smith Realty Group logo',
    logoHref:        '/',
    showWordmarkText: false,
    wordmarkText:    'The Smith Realty Group Inc'
  },

  // Defaults — overridden at startup by site-content.json
  phone:    '416-555-1234',
  phoneHref:'tel:+14165551234',
  email:    'hello@tsrg.ca',
  whatsapp: '',

  ga4Id:          process.env.GA4_MEASUREMENT_ID || '',
  customCssFiles: ['/css/template.css', '/css/custom.css'],

  googleTags: {
    headCode:      '',
    bodyStartCode: '',
    bodyEndCode:   '',
    eventHooks: {
      cta_click: {
        dataLayerEvent: 'tsrg_cta_click',
        extraParams: { source: 'landing-engine' },
        customJs: ''
      },
      form_submit: {
        dataLayerEvent: 'tsrg_form_submit',
        extraParams: { source: 'landing-engine' },
        customJs: ''
      }
    }
  },

  zapierWebhook: process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/YOUR_ID/PLACEHOLDER/',

  agentLocatorMapping: {
    leadSource:     'TSRG Landing Page',
    utmCampaignField: 'Tags',
    autoAssignTo:   'Brian Smith'
  },

  // Defaults — overridden at startup by site-content.json
  compliance: {
    recoNumber:       'RECO #XXXXXXX',
    brokerageName:    'The Smith Realty Group Inc., Brokerage',
    brokerageAddress: 'Your Brokerage Address, Toronto, ON',
    legalDisclaimer:  'Not intended to solicit individuals currently under a listing or buyer representation agreement with another brokerage. All information is believed to be accurate but is not guaranteed.'
  },

  // Defaults — overridden at startup by site-content.json
  howItWorks: [],
  faq:        [],

  brandColors: {
    primary:    '#0f5f5c',
    secondary:  '#17202a',
    accent:     '#c69c3f',
    text:       '#17202a',
    background: '#ffffff'
  }
};
