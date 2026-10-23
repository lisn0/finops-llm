import FinOpsCharts from '../src/assets/finops-charts.js';

// Simple mock DOM environment
function createMockElement(id) {
  const listeners = {};
  return {
    id,
    innerHTML: '',
    attributes: {},
    getAttribute(name) { return this.attributes[name]; },
    setAttribute(name, val) { this.attributes[name] = val; },
    removeAttribute(name) { delete this.attributes[name]; },
    querySelector(sel) {
      // Find element in generated innerHTML
      if (sel.startsWith('.')) {
        const cls = sel.slice(1);
        if (this.innerHTML.includes(`class="${cls}"`)) return createMockElement(cls);
      }
      if (sel.startsWith('#')) {
        const selId = sel.slice(1);
        if (this.innerHTML.includes(`id="${selId}"`)) return createMockElement(selId);
      }
      return createMockElement('el');
    },
    querySelectorAll(sel) {
      return [createMockElement('el-1'), createMockElement('el-2')];
    },
    addEventListener(evt, fn) {
      listeners[evt] = fn;
    },
    style: {}
  };
}

global.document = {
  querySelector(sel) { return createMockElement(sel); },
  querySelectorAll(sel) { return [createMockElement('target')]; }
};

const testLangs = ['en', 'de', 'es', 'fr', 'ja', 'ar', 'ru', 'tr', 'nl', 'it', 'zh'];
console.log('Testing 9 charts across', testLangs.length, 'languages...');

let totalTests = 0;
let passedTests = 0;

testLangs.forEach(lang => {
  const charts = [
    { name: 'groupedBar', fn: () => FinOpsCharts.groupedBar(createMockElement('c1'), { lang }) },
    { name: 'breakEven', fn: () => FinOpsCharts.breakEven(createMockElement('c2'), { lang, ptuFixed: 7440, onDemandRate: 10, ptuMarginal: 1.5, maxX: 2000, maxY: 23000 }) },
    { name: 'tokenDonut', fn: () => FinOpsCharts.tokenDonut(createMockElement('c3'), { lang }) },
    { name: 'horizontalDelta', fn: () => FinOpsCharts.horizontalDelta(createMockElement('c4'), { lang }) },
    { name: 'waterfall', fn: () => FinOpsCharts.waterfall(createMockElement('c5'), { lang }) },
    { name: 'paretoFrontier', fn: () => FinOpsCharts.paretoFrontier(createMockElement('c6'), { lang }) },
    { name: 'cascadeFunnel', fn: () => FinOpsCharts.cascadeFunnel(createMockElement('c7'), { lang }) },
    { name: 'marginErosion', fn: () => FinOpsCharts.marginErosion(createMockElement('c8'), { lang }) },
    { name: 'ttlDecay', fn: () => FinOpsCharts.ttlDecay(createMockElement('c9'), { lang }) },
    { name: 'lineCompare', fn: () => FinOpsCharts.lineCompare(createMockElement('c10'), { lang, title: 'Test Line', series: [{ label: 'S1', points: [[0, 1], [10, 5]] }, { label: 'S2', points: [[0, 2], [10, 8]] }] }) },
    { name: 'barCompare', fn: () => FinOpsCharts.barCompare(createMockElement('c11'), { lang, title: 'Test Bar', items: [{ label: 'B1', value: 10 }, { label: 'B2', value: 20 }] }) }
  ];

  charts.forEach(c => {
    totalTests++;
    try {
      c.fn();
      passedTests++;
    } catch (e) {
      console.error(`FAILED: ${c.name} in lang "${lang}":`, e);
    }
  });
});

console.log(`Completed: ${passedTests}/${totalTests} tests passed cleanly!`);
