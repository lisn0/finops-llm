import fs from 'fs';
import path from 'path';

const htmlPath = path.join('_site', 'research', 'next-concept-modeling-finops-economics.html');
const jsPath = path.join('src', 'assets', 'finops-charts.js');
const cssPath = path.join('src', 'assets', 'editorial.css');

let html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
let css = '';
if (fs.existsSync(cssPath)) {
  css = fs.readFileSync(cssPath, 'utf8');
}

// 1. Inline editorial.css if present
if (css) {
  html = html.replace('<link rel="stylesheet" href="/assets/editorial.css" />', () => `<style>\n${css}\n</style>`);
}

// 2. Remove 404 non-essential scripts for standalone preview
html = html.replace('<script src="/assets/consent.js" defer></script>', '');
html = html.replace('<script src="/assets/attribution.js" defer></script>', '');
html = html.replace('<script src="/assets/lang.js" defer></script>', '');

// 3. Inline finops-charts.js using function replacement to prevent $ pattern corruption
const targetScript = '<script src="/assets/finops-charts.js" defer></script>';
const inlineScript = `<script>\n${js}\nif (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', () => FinOpsCharts.initAll()); } else { FinOpsCharts.initAll(); }\n</script>`;

if (html.includes(targetScript)) {
  html = html.replace(targetScript, () => inlineScript);
} else {
  // If not found in head, place before </body>
  html = html.replace('</body>', () => `${inlineScript}\n</body>`);
}

// 4. Ensure an explicit init is also triggered right before </body> to guarantee rendering in iframes / embeds
const runnerScript = `
<script>
  (function() {
    function run() {
      if (window.FinOpsCharts && typeof window.FinOpsCharts.initAll === 'function') {
        window.FinOpsCharts.initAll();
      }
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(run, 50);
    } else {
      window.addEventListener('DOMContentLoaded', run);
      window.addEventListener('load', run);
    }
  })();
</script>
`;
html = html.replace('</body>', () => `${runnerScript}\n</body>`);

// Write to workspace root
fs.writeFileSync('ncm-article-preview.html', html, 'utf8');

// Write to artifact directory
const artifactDir = 'C:\\Users\\yassi\\.gemini\\antigravity\\brain\\03c82da3-aa45-4c2d-93c1-ec22f04aca49';
if (fs.existsSync(artifactDir)) {
  fs.writeFileSync(path.join(artifactDir, 'ncm_article_preview.html'), html, 'utf8');
}

console.log('Successfully generated standalone preview. Size:', html.length, 'bytes');
