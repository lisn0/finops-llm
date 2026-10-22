import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArticle, matchesPublishedArticle } from './publish-articles.mjs';

const fixture = () => ({
  slug: 'research/example-guide',
  datePublished: '2026-10-22',
  dateModified: '2026-10-22',
  languages: {
    en: {
      title: 'Example guide',
      titleCore: 'Example guide for platform teams',
      description: 'A practical guide with a worked example.',
      body: '<p>The current article body, with a concrete example.</p>',
      faq: [{ question: 'What does this cover?', answer: 'A concrete example.' }],
    },
  },
});

const expected = () => validateArticle(fixture(), 'src/_data/articles/example-guide.json')[0];
const liveHtml = (entry, changes = {}) => {
  const item = { ...entry, ...changes };
  return `<!doctype html><html><head>
<link rel="canonical" href="${item.url}" />
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'TechArticle',
  url: item.url, dateModified: item.dateModified,
})}</script></head><body><h1>${item.title}</h1>${item.body}</body></html>`;
};

test('source validation derives every declared locale URL', () => {
  const article = fixture();
  article.languages.es = { ...article.languages.en, title: 'Guía práctica', titleCore: 'Guía práctica' };
  const entries = validateArticle(article, 'src/_data/articles/example-guide.json');
  assert.deepEqual(entries.map(({ url }) => url), [
    'https://finopsllm.com/research/example-guide',
    'https://finopsllm.com/es/research/example-guide',
  ]);
  assert.equal(entries[0].title, article.languages.en.titleCore);
  assert.equal(entries[0].body, article.languages.en.body);
  assert.equal(entries[0].dateModified, article.dateModified);
});

test('source validation rejects incomplete locale content', () => {
  for (const field of ['title', 'titleCore', 'description', 'body']) {
    const article = fixture();
    article.languages.en[field] = '';
    assert.throws(() => validateArticle(article, 'example.json'), undefined, field);
  }
});

test('source validation rejects metadata that cannot pass the source hook', () => {
  const article = fixture();
  article.languages.en.title = 'x'.repeat(71);
  assert.throws(() => validateArticle(article, 'example.json'));
  article.languages.en.title = 'Example';
  article.languages.en.description = 'x'.repeat(166);
  assert.throws(() => validateArticle(article, 'example.json'));
});

test('source validation rejects unsafe slugs and incomplete FAQ answers', () => {
  for (const slug of ['../outside', 'research/../../outside', 'https://other.example/a']) {
    assert.throws(() => validateArticle({ ...fixture(), slug }, 'example.json'));
  }
  const article = fixture();
  article.languages.en.faq = [{ question: 'Question', answer: '' }];
  assert.throws(() => validateArticle(article, 'example.json'));
});

test('source validation requires article dates and declared languages', () => {
  for (const field of ['datePublished', 'dateModified']) {
    const article = fixture();
    delete article[field];
    assert.throws(() => validateArticle(article, 'example.json'));
  }
  assert.throws(() => validateArticle({ ...fixture(), languages: {} }, 'example.json'));
});

test('live verification accepts the current published article', () => {
  const entry = expected();
  assert.equal(matchesPublishedArticle(liveHtml(entry), entry), true);
});

test('an existing URL with the same title and date but old body is still pending', () => {
  const entry = expected();
  assert.equal(matchesPublishedArticle(liveHtml(entry, { body: '<p>The old content.</p>' }), entry), false);
});

test('live verification rejects the wrong canonical, date or title', () => {
  const entry = expected();
  for (const change of [
    { url: 'https://finopsllm.com/research/wrong-page' },
    { dateModified: '2026-10-21' },
    { title: 'Previous article title' },
  ]) {
    assert.equal(matchesPublishedArticle(liveHtml(entry, change), entry), false);
  }
});

test('visible date normalization follows the article template', () => {
  const article = fixture();
  article.languages.en.body = '<p class="updated">Updated · September 1, 2026</p><p>Body.</p>';
  assert.match(validateArticle(article)[0].body, /Updated · October 22, 2026/);
});

test('encoded titles match the rendered heading', () => {
  const article = fixture();
  article.languages.en.titleCore = 'Input &amp; output';
  const entry = validateArticle(article)[0];
  assert.equal(matchesPublishedArticle(liveHtml(entry), entry), true);
});

// CLI tests replace Git, HTTP and the search runner. They never publish or use credentials.
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const selectedPath = 'src/_data/articles/agent-workflow-architecture-cost-controls.json';

function runFakePublication(mode = 'new', extraEnv = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'finops-publish-test-'));
  const gitLog = join(dir, 'git.log');
  const searchLog = join(dir, 'search.json');
  const searchRunner = join(dir, 'search.mjs');
  const preload = join(dir, 'http.mjs');
  writeFileSync(searchRunner, `import {writeFileSync} from 'node:fs'; writeFileSync(process.env.FAKE_SEARCH_LOG, JSON.stringify(process.argv.slice(2))); process.exitCode=Number(process.env.FAKE_SEARCH_EXIT || 0);`);
  writeFileSync(preload, `import {readFileSync} from 'node:fs'; const a=JSON.parse(readFileSync(process.env.FAKE_ARTICLE)); globalThis.fetch=async(url)=>{const locale=a.languages.en; return {ok:true,status:200,text:async()=>'<link rel="canonical" href="'+url+'"><script type="application/ld+json">'+JSON.stringify({dateModified:a.dateModified})+'</script><h1>'+locale.titleCore+'</h1>'+locale.body};};`);
  writeFileSync(join(dir, 'git'), `#!/bin/sh
[ "$1" = "-C" ] || exit 97
shift 2
command=$1
shift
printf '%s %s\\n' "$command" "$*" >> "$FAKE_GIT_LOG"
case "$command" in
 branch) echo main ;;
 remote) echo git@github.com:lisn0/finops-llm.git ;;
 rev-parse)
  case "$*" in
   *--abbrev-ref*) echo origin/main ;;
   HEAD) if [ -f "$FAKE_STATE" ]; then echo new; else echo old; fi ;;
   *) echo old ;;
  esac ;;
 diff)
  case "$*" in
   '--cached --name-only')
    if [ "$FAKE_MODE" = staged ]; then echo src/worker.js; elif [ -f "$FAKE_ADDED" ]; then echo "$FAKE_SELECTED"; fi ;;
   '--cached --name-only HEAD') if [ -f "$FAKE_ADDED" ]; then echo "$FAKE_SELECTED"; fi ;;
  esac ;;
 ls-files) if [ "$FAKE_MODE" = new ]; then echo "$FAKE_SELECTED"; fi ;;
 log) if [ "$FAKE_MODE" = history ]; then echo src/worker.js; elif [ -f "$FAKE_STATE" ]; then echo "$FAKE_SELECTED"; fi ;;
 add) touch "$FAKE_ADDED" ;;
 commit) touch "$FAKE_STATE" ;;
 show) cat "$FAKE_ARTICLE" ;;
 fetch|merge-base|push) : ;;
 *) exit 98 ;;
esac
`, { mode: 0o755 });
  const env = {
    ...process.env, PATH: `${dir}:${process.env.PATH}`,
    FAKE_MODE: mode, FAKE_GIT_LOG: gitLog, FAKE_SEARCH_LOG: searchLog,
    FAKE_STATE: join(dir, 'committed'), FAKE_ADDED: join(dir, 'added'),
    FAKE_SELECTED: selectedPath, FAKE_ARTICLE: resolve(repoRoot, selectedPath),
    SEARCH_PUBLISH_RUNNER: searchRunner, SEARCH_PUBLISH_WAIT_SECONDS: '1',
    SEARCH_PUBLISH_POLL_SECONDS: '0.01', ...extraEnv,
  };
  const result = spawnSync(process.execPath, [
    '--import', preload, resolve(repoRoot, 'scripts/publish-articles.mjs'),
    '--message', 'Publish a new article', selectedPath,
  ], { env, encoding: 'utf8', timeout: 10000 });
  const calls = (() => { try { return readFileSync(gitLog, 'utf8'); } catch { return ''; } })();
  const searchArgs = (() => { try { return JSON.parse(readFileSync(searchLog, 'utf8')); } catch { return null; } })();
  return { ...result, calls, searchArgs };
}

test('CLI stages a new untracked article, commits and pushes without running a build', () => {
  const result = runFakePublication();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.calls, /add -- src\/_data\/articles\/agent-workflow-architecture-cost-controls\.json/);
  assert.match(result.calls, /commit -m Publish a new article/);
  assert.match(result.calls, /push origin HEAD:refs\/heads\/main/);
  assert.deepEqual(result.searchArgs, ['--site', 'finops-llm', 'https://finopsllm.com/research/agent-workflow-architecture-cost-controls']);
});

test('CLI resumes an already-pushed article without a second commit or push', () => {
  const result = runFakePublication('resume');
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.calls, /^(add|commit|push) /m);
  assert.equal(result.searchArgs[0], '--site');
});

test('CLI leaves unrelated staged work untouched', () => {
  const result = runFakePublication('staged');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unrelated staged/);
  assert.doesNotMatch(result.calls, /^(add|commit|push) /m);
  assert.equal(result.searchArgs, null);
});

test('CLI rejects unrelated paths even in reverted outgoing commits', () => {
  const result = runFakePublication('history');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unselected paths/);
  assert.match(result.calls, /log --format= --name-only origin\/main\.\.HEAD/);
  assert.doesNotMatch(result.calls, /^(add|commit|push) /m);
});

test('CLI reports search submission failure after publication', () => {
  const result = runFakePublication('resume', { FAKE_SEARCH_EXIT: '7' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /search submission runner failed/);
});
