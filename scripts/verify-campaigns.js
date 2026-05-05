const checks = [
  {
    name: 'default',
    path: '/',
    includes: ['Exclusive Access: West Toronto Foreclosure and Distressed Property List', 'campaignId: \'default\'']
  },
  {
    name: 'foreclosure-access',
    path: '/?utm_campaign=foreclosure&utm_term=etobicoke&utm_source=google&utm_medium=cpc',
    includes: ['campaignId: \'foreclosure-access\'', 'smith-realty-group-logo.svg', 'Etobicoke Foreclosure and Distressed Property List']
  },
  {
    name: 'senior-downsizing',
    path: '/?utm_campaign=senior&utm_term=the-kingsway&utm_source=meta',
    includes: ['campaignId: \'senior-downsizing\'', 'smith-realty-group-logo.svg', 'Senior Moves Made Simple in The Kingsway']
  },
  {
    name: 'investment-buyers',
    path: '/?utm_campaign=investment&utm_term=high-park&utm_source=google',
    includes: ['campaignId: \'investment-buyers\'', 'smith-realty-group-logo.svg', 'Get Investor Opportunities']
  },
  {
    name: 'first-time-buyer',
    path: '/?utm_campaign=first-time&utm_term=islington&utm_source=google',
    includes: ['campaignId: \'first-time-buyer\'', 'smith-realty-group-logo.svg', 'Buy Your First Home in Islington With a Clear Plan']
  },
  {
    name: 'seller',
    path: '/?utm_campaign=seller&utm_term=islington',
    includes: ['campaignId: \'seller\'', 'smith-realty-group-logo.svg', 'Sell Your Islington Home With a Sharper Strategy']
  },
  {
    name: 'home-evaluation',
    path: '/?utm_campaign=valuation&utm_term=humber-valley',
    includes: ['campaignId: \'home-evaluation\'', 'smith-realty-group-logo.svg', 'What Is Your Humber Valley Home Worth Right Now?']
  }
];

async function main() {
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
  let failures = 0;

  for (const check of checks) {
    const response = await fetch(`${baseUrl}${check.path}`);
    const html = await response.text();
    const missing = check.includes.filter((value) => !html.includes(value));

    if (missing.length) {
      failures += 1;
      console.error(`FAIL ${check.name}`);
      missing.forEach((value) => console.error(`  missing: ${value}`));
    } else {
      console.log(`PASS ${check.name}`);
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
    return;
  }

  console.log('All UTM campaign checks passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
