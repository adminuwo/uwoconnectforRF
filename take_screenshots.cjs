const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.join(__dirname, 'public', 'dashboard');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const routes = [
  { name: 'dashboard_main.png', url: 'http://localhost:3000/client' },
  { name: 'dashboard_crm.png', url: 'http://localhost:3000/client/crm' },
  { name: 'dashboard_automation.png', url: 'http://localhost:3000/client/automations' },
  { name: 'dashboard_automations.png', url: 'http://localhost:3000/client/automations' },
  { name: 'dashboard_inbox.png', url: 'http://localhost:3000/client/inbox' },
  { name: 'dashboard_channels.png', url: 'http://localhost:3000/client/channels' },
  { name: 'dashboard_connectors.png', url: 'http://localhost:3000/client/catalog' },
  { name: 'dashboard_analytics.png', url: 'http://localhost:3000/client/reports' },
  { name: 'dashboard_workflows.png', url: 'http://localhost:3000/client/workflows' },
  { name: 'dashboard_billing.png', url: 'http://localhost:3000/client/billing' },
  { name: 'dashboard_quotations.png', url: 'http://localhost:3000/client/quotations' }
];

(async () => {
  console.log('Launching Chrome with mock auth state...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('uwo_token', 'mock_jwt_token_for_screenshots');
    localStorage.setItem('token', 'mock_jwt_token_for_screenshots');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      name: 'UWO Admin',
      email: 'admin@uwoconnect.com',
      role: 'CLIENT',
      plan: 'Advanced Enterprise'
    }));
  });

  for (const r of routes) {
    const filePath = path.join(OUT_DIR, r.name);
    console.log(`Navigating to ${r.url} -> ${r.name}`);
    try {
      await page.goto(r.url, { waitUntil: 'networkidle2', timeout: 15000 });
      // Extra wait for animations / framer-motion / hydration
      await new Promise(res => setTimeout(res, 3000));
      await page.screenshot({ path: filePath, type: 'png' });
      const stats = fs.statSync(filePath);
      console.log(`Successfully saved ${r.name} (${stats.size} bytes)`);
    } catch (err) {
      console.error(`Failed to capture ${r.url}:`, err.message);
    }
  }

  await browser.close();
  console.log('Done capturing all screenshots!');
})();
