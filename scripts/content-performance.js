const fs = require('fs');
const path = require('path');

async function analyzePerformance() {
  console.log('Running Content Performance Tracker...');
  const site = 'finopsllm.com';
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  let topPages = [];

  if (accountId && apiToken) {
    try {
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`;
      const sql = `
        SELECT blob3 AS path, SUM(_sample_interval) AS hits
        FROM finops_ai_crawler_hits
        WHERE timestamp > NOW() - INTERVAL '30' DAY AND blob2 = 'live'
        GROUP BY path
        ORDER BY hits DESC
        LIMIT 20
      `;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'text/plain' },
        body: sql,
      });
      if (res.ok) {
        const json = await res.json();
        topPages = json.data || [];
      }
    } catch (e) {
      console.warn('Could not query Cloudflare API:', e.message);
    }
  }

  const report = {
    site,
    timestamp: new Date().toISOString(),
    topCitedPagesCount: topPages.length,
    topPages,
  };

  const outputPath = path.join(__dirname, '..', 'content-performance.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`Content performance report written to ${outputPath}`);
}

analyzePerformance();
