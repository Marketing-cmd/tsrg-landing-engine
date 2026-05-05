require('dotenv').config();

const path = require('path');
const express = require('express');
const siteConfig = require('./backend/config/siteConfig');
const utmParser = require('./backend/middleware/utmParser');
const contentResolver = require('./backend/middleware/contentResolver');
const landingRoutes = require('./backend/routes/landing');
const leadRoutes = require('./backend/routes/leads');
const demoRoutes = require('./backend/routes/demo');
const adminRoutes = require('./backend/routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend', 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

app.use(utmParser);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', demoRoutes(siteConfig));
app.use('/admin', adminRoutes(siteConfig));
app.use('/', landingRoutes(contentResolver));
app.use('/api', leadRoutes(siteConfig));

app.use((req, res) => {
  res.redirect(302, '/');
});

app.listen(PORT, () => {
  console.log(`TSRG landing engine running on http://localhost:${PORT}`);
});
