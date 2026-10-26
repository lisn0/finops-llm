import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const source = readFileSync(new URL('../src/assets/attribution.js', import.meta.url), 'utf8');

function browser({ consent = false, referrer = '', search = '', links = [], height = 2000, viewport = 1000 } = {}) {
  const listeners = new Map();
  const events = [];
  const storage = new Map();
  const document = {
    readyState: 'complete', referrer, body: { scrollHeight: height },
    documentElement: { scrollHeight: height },
    querySelectorAll: () => links,
    addEventListener(name, fn, options) {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push({ fn, options: options && JSON.parse(JSON.stringify(options)) });
    },
  };
  const window = {
    analyticsConsent: consent, innerHeight: viewport, scrollY: 0,
    addEventListener: document.addEventListener.bind(document),
    zaraz: { track: (...args) => events.push(JSON.parse(JSON.stringify(args))) },
  };
  const location = { href: `https://finopsllm.com/page${search}`, origin: 'https://finopsllm.com', hostname: 'finopsllm.com', pathname: '/page', search };
  const context = {
    window, document, location, URL, URLSearchParams,
    sessionStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
  };
  function evaluate() { vm.runInNewContext(source, context); }
  function dispatch(name, event = {}) {
    for (const { fn } of listeners.get(name) || []) fn(event);
  }
  function click(href) {
    const anchor = {
      href: new URL(href, location.href).href,
      getAttribute: () => href,
    };
    dispatch('click', { target: { closest: () => anchor } });
  }
  evaluate();
  return { window, document, location, events, storage, listeners, evaluate, dispatch, click };
}

test('waits for consent before touching attribution or listening for events', () => {
  const b = browser({ consent: false, referrer: 'https://google.com/' });
  assert.equal(b.storage.size, 0);
  assert.equal(b.listeners.has('click'), false);
  assert.equal(b.listeners.has('scroll'), false);
  b.click('https://outside.example/path');
  b.dispatch('scroll');
  assert.deepEqual(b.events, []);
});

test('rejection after initialization suppresses click and scroll events', () => {
  const b = browser({ consent: true, referrer: 'https://google.com/' });
  b.window.analyticsConsent = false;
  b.click('https://outside.example/path');
  b.window.scrollY = 1000;
  b.dispatch('scroll');
  assert.deepEqual(b.events, []);
});

test('tracks one 90% scroll event only on pages taller than the viewport', () => {
  const b = browser({ consent: true });
  assert.equal(b.listeners.get('scroll').length, 1);
  assert.deepEqual(b.listeners.get('scroll')[0].options, { passive: true });
  b.window.scrollY = 700;
  b.dispatch('scroll');
  assert.deepEqual(b.events, []);
  b.window.scrollY = 800;
  b.dispatch('scroll');
  b.dispatch('scroll');
  assert.deepEqual(b.events, [['scroll', { percent_scrolled: 90 }]]);

  const short = browser({ consent: true, height: 900, viewport: 1000 });
  short.window.scrollY = 1000;
  short.dispatch('scroll');
  assert.deepEqual(short.events, []);
});

test('tracks sanitized outbound HTTP links, skips internal and non-HTTP links', () => {
  const b = browser({ consent: true });
  b.click('https://outside.example/path?q=secret#fragment');
  b.click('https://finopsllm.com/internal?q=secret');
  b.click('mailto:hello@example.com');
  b.click('javascript:void(0)');
  assert.deepEqual(b.events, [['click', {
    link_url: 'https://outside.example/path', link_domain: 'outside.example', outbound: true,
  }]]);
});

test('late acceptance on an internal page counts booking with unknown original source', () => {
  const b = browser({ consent: false, referrer: 'https://finopsllm.com/previous' });
  b.window.analyticsConsent = true;
  b.dispatch('analyticsconsent');
  b.click('/book');
  assert.deepEqual(b.events, [['book_click', {
    book_source: 'unknown', book_medium: 'unknown', landing_page: '',
  }]]);
  assert.equal(b.storage.has('fa_first_touch'), false);
});

test('re-evaluation does not register duplicate analytics listeners', () => {
  const b = browser({ consent: true });
  b.evaluate();
  assert.equal(b.listeners.get('click').length, 1);
  assert.equal(b.listeners.get('scroll').length, 1);
  assert.equal(b.listeners.get('analyticsconsent').length, 1);
});
