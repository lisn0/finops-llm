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
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { __TRANSLATED_PATHS } from '../src/worker.js';

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '../src');
const LANGS = ['es', 'fr', 'de', 'ja', 'pt'];

// The two non-article pages every mirror has; the rest are research articles.
const NON_ARTICLE = ['/', '/research'];

const articlesOn = (lang) =>
	readdirSync(resolve(SRC, lang, 'research'))
		.filter((f) => f.endsWith('.njk'))
		.map((f) => `/research/${f.slice(0, -4)}`)
		.sort();

const listed = [...__TRANSLATED_PATHS].sort();

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
