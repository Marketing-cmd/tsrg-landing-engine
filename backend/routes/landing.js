const demoStore = require('../lib/demoStore');

module.exports = function landingRoutes(contentResolver) {
  const router = require('express').Router();

  router.get('/', contentResolver, (req, res) => {
    demoStore.recordVisit({
      visitedAt: new Date().toISOString(),
      path: req.originalUrl,
      campaignId: res.locals.campaignId,
      intentSegment: res.locals.content.intentSegment || 'general',
      neighborhood: res.locals.content.neighborhood || '',
      utm: res.locals.utm,
      resolvedTitle: res.locals.content.meta.title
    });

    res.render('layouts/main', {
      page: 'landing',
      content: res.locals.content,
      campaignId: res.locals.campaignId,
      utm: res.locals.utm,
      utmJson: res.locals.utmJson,
      site: res.locals.site,
      demoData: null
    });
  });

  return router;
};
