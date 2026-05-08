const fs   = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../../site-content.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  } catch (err) {
    console.warn('[site-content] Could not read site-content.json:', err.message);
    return {};
  }
}

// Merge editable site-content.json values into a siteConfig object.
// Called once at startup — restart container to pick up changes.
function applyToConfig(siteConfig) {
  const content = load();

  if (content.contact) {
    const { phone, email, whatsapp } = content.contact;
    if (phone)    { siteConfig.phone     = phone;  siteConfig.phoneHref = 'tel:+1' + phone.replace(/\D/g, ''); }
    if (email)    siteConfig.email    = email;
    if (whatsapp !== undefined) siteConfig.whatsapp = whatsapp;
  }

  if (content.compliance)  siteConfig.compliance  = { ...siteConfig.compliance,  ...content.compliance };
  if (content.howItWorks)  siteConfig.howItWorks  = content.howItWorks;
  if (content.faq)         siteConfig.faq         = content.faq;

  return siteConfig;
}

module.exports = { load, applyToConfig };
