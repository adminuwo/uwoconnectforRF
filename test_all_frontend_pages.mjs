import fs from 'fs';
import path from 'path';

const appDir = path.resolve('src/app');

function getPages(dir, baseRoute = '') {
  let pages = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      if (item.name.startsWith('_') || item.name === 'api') continue;
      pages = pages.concat(getPages(path.join(dir, item.name), `${baseRoute}/${item.name}`));
    } else if (item.name === 'page.jsx' || item.name === 'page.js' || item.name === 'page.tsx') {
      let route = baseRoute === '' ? '/' : baseRoute;
      const testRoute = route
        .replace(/\[clientId\]/g, '6a5338debec6daea1165d2b3')
        .replace(/\[productId\]/g, '6aa2454732dedcadbd3ddef9')
        .replace(/\[token\]/g, 'token_test_123')
        .replace(/\[id\]/g, '6a5338debec6daea1165d2b3')
        .replace(/\[slug\]/g, 'getting-started');

      pages.push({
        filePath: path.join(dir, item.name).replace(process.cwd() + '/', ''),
        definedRoute: route,
        testRoute: testRoute,
      });
    }
  }
  return pages;
}

const allPages = getPages(appDir);
console.log(`Auditing all ${allPages.length} frontend pages...`);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function audit() {
  const results = [];
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < allPages.length; i++) {
    const page = allPages[i];
    const url = `http://localhost:3000${page.testRoute}`;
    const startTime = Date.now();

    let attempt = 0;
    let success = false;
    let lastStatus = 0;
    let lastError = null;

    while (attempt < 2 && !success) {
      attempt++;
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'PageAuditor/1.0' },
          redirect: 'follow',
          signal: AbortSignal.timeout(30000)
        });
        const duration = Date.now() - startTime;
        lastStatus = res.status;
        const text = await res.text();
        const hasError = text.includes('Application error: a client-side exception has occurred') || 
                         (lastStatus >= 500);

        if (lastStatus < 400 && !hasError) {
          success = true;
          passed++;
          results.push({
            num: i + 1,
            definedRoute: page.definedRoute,
            testUrl: page.testRoute,
            status: lastStatus,
            ok: true,
            duration: duration
          });
          console.log(`[${i + 1}/${allPages.length}] ✅ ${page.definedRoute} -> HTTP ${lastStatus} (${duration}ms)`);
        } else {
          lastError = hasError ? 'Server Error' : `HTTP ${lastStatus}`;
        }
      } catch (err) {
        lastError = err.message;
        await sleep(500);
      }
    }

    if (!success) {
      failed++;
      results.push({
        num: i + 1,
        definedRoute: page.definedRoute,
        testUrl: page.testRoute,
        status: lastStatus || 'FETCH_ERR',
        ok: false,
        duration: Date.now() - startTime,
        error: lastError
      });
      console.log(`[${i + 1}/${allPages.length}] ❌ ${page.definedRoute} -> ${lastError}`);
    }

    await sleep(150);
  }

  const summary = {
    total: allPages.length,
    passed,
    failed,
    timestamp: new Date().toISOString(),
    results
  };

  fs.writeFileSync('frontend_pages_audit_results.json', JSON.stringify(summary, null, 2));
  console.log(`\n======================================================`);
  console.log(`🎯 FRONTEND AUDIT RESULT: ${passed}/${allPages.length} PAGES PASSED (${Math.round((passed/allPages.length)*100)}%)`);
  console.log(`======================================================`);
}

audit();
