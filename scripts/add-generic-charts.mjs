// Inserts the config-driven lineCompare and barCompare templates
// (scripts/snippets/generic-charts.js) into src/assets/finops-charts.js,
// wires them into data-finops-chart auto-init, and exports them.
// Idempotent: does nothing if lineCompare already exists.
import fs from 'fs';

const FILE = 'src/assets/finops-charts.js';
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('function lineCompare(')) {
  console.log('lineCompare already present, nothing to do.');
  process.exit(0);
}

const code = fs.readFileSync('scripts/snippets/generic-charts.js', 'utf8');

const AUTO = '  // Auto-init for data-finops-chart attributes';
if (!src.includes(AUTO)) throw new Error('Auto-init marker not found');
src = src.replace(AUTO, code + AUTO);

const DISPATCH = "      else if (type === 'ttl-decay' || type === 'ttlDecay') ttlDecay(el, config);";
if (!src.includes(DISPATCH)) throw new Error('Dispatch marker not found');
src = src.replace(DISPATCH, DISPATCH +
  "\n      else if (type === 'line-compare' || type === 'lineCompare') lineCompare(el, config);" +
  "\n      else if (type === 'bar-compare' || type === 'barCompare') barCompare(el, config);");

const EXPORT = '    ttlDecay,\n    initAll';
if (!src.includes(EXPORT)) throw new Error('Export marker not found');
src = src.replace(EXPORT, '    ttlDecay,\n    lineCompare,\n    barCompare,\n    initAll');

fs.writeFileSync(FILE, src, 'utf8');
console.log('Added lineCompare and barCompare to', FILE);
