const contentConfig = require('../config/contentConfig');
const demoStore = require('../lib/demoStore');

function sampleUrls(siteUrl = 'http://localhost:3000') {
  return [
    {
      label: 'Default',
      url: `${siteUrl}/`
    },
    {
      label: 'Foreclosure',
      url: `${siteUrl}/?utm_campaign=foreclosure&utm_term=etobicoke&utm_source=google&utm_medium=cpc`
    },
    {
      label: 'Senior Downsizing',
      url: `${siteUrl}/?utm_campaign=senior&utm_term=the-kingsway&utm_source=meta`
    },
    {
      label: 'Investment Buyers',
      url: `${siteUrl}/?utm_campaign=investment&utm_term=high-park&utm_source=google`
    },
    {
      label: 'First-Time Buyer',
      url: `${siteUrl}/?utm_campaign=first-time&utm_term=islington&utm_source=google`
    },
    {
      label: 'Seller',
      url: `${siteUrl}/?utm_campaign=seller&utm_term=humber-valley&utm_source=google`
    },
    {
      label: 'Home Evaluation',
      url: `${siteUrl}/?utm_campaign=valuation&utm_term=humber-valley&utm_source=google`
    }
  ];
}

module.exports = function demoRoutes(siteConfig) {
  const router = require('express').Router();

  router.get('/demo', (req, res) => {
    res.render('layouts/main', {
      page: 'demo',
      content: {
        meta: {
          title: 'TSRG Demo Dashboard',
          description: 'Live campaign routing demo dashboard.'
        },
        colors: siteConfig.brandColors,
        cssVariables: '',
        intentSegment: 'demo'
      },
      campaignId: 'demo-dashboard',
      utm: res.locals.utm || {},
      utmJson: JSON.stringify(res.locals.utm || {}),
      site: {
        ...siteConfig,
        demoDashboard: {
          sampleUrls: sampleUrls(siteConfig.siteUrl || 'http://localhost:3000'),
          campaigns: Object.keys(contentConfig.campaigns)
        }
      },
      demoData: demoStore.snapshot()
    });
  });

  router.get('/api/demo-data', (req, res) => {
    res.json({
      sampleUrls: sampleUrls(siteConfig.siteUrl || 'http://localhost:3000'),
      campaigns: Object.keys(contentConfig.campaigns),
      ...demoStore.snapshot()
    });
  });

  return router;
};
