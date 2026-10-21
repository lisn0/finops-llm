// Self-check that the worker's TRANSLATED allowlist matches what is on disk.
// Run: node scripts/worker-translated.test.mjs
//
// Worth testing because both directions fail silently in production:
//   - path listed but NOT translated -> we redirect a visitor into a 404
//     (this is exactly how the /es/research/ai-coding-economics-2026 404s
//     reached Google), and
//   - path translated but NOT listed -> the translation exists and is simply
//     never served to anyone whose browser asked for that language.
// Neither shows up in a build, a link check, or a smoke test.

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { __TRANSLATED_PATHS } from '../src/worker.js';

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '../src');
const LANGS = ['es', 'fr', 'de', 'ja', 'pt'];
const require = createRequire(import.meta.url);
const dataArticles = require('../src/_data/articles.js')();

// The two non-article pages every mirror has; the rest are research articles.
const NON_ARTICLE = ['/', '/research'];

const listed = [...__TRANSLATED_PATHS].sort();

// Translations can be hand-written locale pages or data-driven article pages.
// The latter are generated from each article's `languages` map, so they have
// no per-locale .njk file to discover on disk.
const articlesOn = (lang) => {
 const staticPages = readdirSync(resolve(SRC, lang, 'research'))
  .filter((f) => f.endsWith('.njk'))
  .map((f) => `/research/${f.slice(0, -4)}`);
 const dataPages = Object.entries(dataArticles)
  .filter(([, article]) => article.languages?.[lang])
  .map(([key, article]) => `/${article.slug || `research/${key}`}`)
  // Keep this contract focused on pages that use automatic language routing.
  // Other translated JSON pages remain reachable through their explicit URL
  // and on-page language links, without broadening this allowlist's scope.
  .filter((page) => listed.includes(page));
 return [...new Set([...staticPages, ...dataPages])].sort();
};

for (const p of NON_ARTICLE) {
	assert.ok(listed.includes(p), `TRANSLATED is missing the ${p} page`);
}

const listedArticles = listed.filter((p) => !NON_ARTICLE.includes(p));

for (const lang of LANGS) {
	const onDisk = articlesOn(lang);

	const wouldFourOhFour = listedArticles.filter((p) => !onDisk.includes(p));
	assert.deepEqual(
		wouldFourOhFour,
		[],
		`${lang}: listed in TRANSLATED but not translated — a ${lang} visitor would be redirected into a 404:\n  ${wouldFourOhFour.join('\n  ')}`
	);

	const unreachable = onDisk.filter((p) => !listedArticles.includes(p));
	assert.deepEqual(
		unreachable,
		[],
		`${lang}: translated but missing from TRANSLATED — these pages exist and are never served to ${lang} visitors:\n  ${unreachable.join('\n  ')}`
	);
}

console.log(`ok — ${listedArticles.length} articles x ${LANGS.length} locales in sync`);
