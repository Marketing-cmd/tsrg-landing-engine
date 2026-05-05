const fs = require('fs');
const path = require('path');

const OVERRIDES_FILE = path.join(__dirname, '../../content-overrides.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function save(overrides) {
  fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(overrides, null, 2));
}

function setSection(campaignId, section, data) {
  const overrides = load();
  if (!overrides[campaignId]) overrides[campaignId] = {};
  overrides[campaignId][section] = data;
  save(overrides);
}

function resetCampaign(campaignId) {
  const overrides = load();
  delete overrides[campaignId];
  save(overrides);
}

module.exports = { load, save, setSection, resetCampaign };
