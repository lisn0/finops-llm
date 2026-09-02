/**
 * FinOps LLM — static-assets Worker with Markdown for Agents + language routing.
 *
 * Runs in front of the static assets (assets.run_worker_first = true). For
 * normal browser/crawler traffic it transparently proxies to env.ASSETS. When
 * a client negotiates `Accept: text/markdown` (typically an AI agent), it
 * converts the page's <main> HTML to Markdown at the edge.
 *
 * Free-plan equivalent of Cloudflare's paid "Markdown for Agents". Crucially it
 * preserves the AI-training opt-out (Content-Signal: ai-train=no) rather than
 * Cloudflare's native ai-train=yes default.
 *
 * Also performs:
 *   - the www -> apex redirect (Workers static-assets _redirects matches on
 *     path only and cannot see the request hostname);
 *   - Accept-Language routing: humans whose top preference is a translated
 *     language (es/fr/de/ja) are sent to that language mirror, but ONLY for
 *     pages that have a published translation, NEVER for crawlers (hreflang +
 *     indexing depend on stable URLs), and always overridable via the on-page
 *     language switcher (the `lang` cookie).
 */

const APEX = 'finopsllm.com';
const DEFAULT_TITLE = 'FinOps LLM';
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=no';

/* ------------------------------------------------------------------ */
/* A/B test: English homepage variant (control vs v2 mockup)          */
/* ------------------------------------------------------------------ */

const AB_COOKIE = 'ab_test';
const AB_PATHS = new Set(['/', '/index.html']);

// Only real browser UAs get experimented on. Anything unrecognised (curl, a new
// AI crawler not yet in the list, empty UA) falls through to control.
const BROWSER_RE = /Mozilla\/5\.0 .*(Chrome|Safari|Firefox|Edg|OPR)\//i;

function isBotForAb(request) {
	const ua = request.headers.get('User-Agent') || '';
	return (
		/bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|quora|pinterest|whatsapp|telegram|googlebot|bingbot|duckduckbot|yandex|baidu|applebot|amazonbot|gptbot|claudebot|claude-|oai-searchbot|chatgpt-user|perplexity|mistralai|meta-externalagent|google-extended|preview|lighthouse/i.test(ua) ||
		!BROWSER_RE.test(ua)
	);
}

function abCookieValue(request) {
	const c = request.headers.get('Cookie') || '';
	const m = c.match(/(?:^|;\s*)ab_test=(control|v2)\b/);
	return m ? m[1] : null;
}

function pickVariant(request) {
	const existing = abCookieValue(request);
	if (existing) return existing;
	return Math.random() < 0.5 ? 'control' : 'v2';
}

function abTargetUrl(url, variant) {
	if (variant === 'v2') {
		const u = new URL(url.toString());
		u.pathname = '/index-v2.html';
		return u;
	}
	return url;
}

function abCookieHeader(variant) {
	const maxAge = 60 * 60 * 24 * 30;
	return `ab_test=${variant}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`;
}

// Languages with a full published translation mirror. Order is not significant.
const LANGS = ['es', 'fr', 'de', 'ja', 'pt'];

// English paths that have a published translation, so a language redirect can
// never land a visitor on a 404. All five mirrors are at parity — every locale
// carries all 22 articles — so this is one list, not per-language sets.
//
// This is the ONLY thing standing between a new untranslated article and a
// redirect into a 404, so it must stay in sync with what exists on disk. Adding
// an English-only article? Leave it out. Verify with:
//   scripts/worker-translated.test.mjs
const TRANSLATED_PATHS = [
	'/',
	'/research',
	'/research/agent-economics',
	'/research/ai-finops',
	'/research/anomaly-detection',
	'/research/caching-strategies-compared',
	'/research/cheapest-ai-code-generation',
	'/research/coding-plan-comparison',
	'/research/finops-for-llm',
	'/research/gpt-5-6-pricing-tier-guide',
	'/research/how-much-does-gpt5-cost',
	'/research/how-to-audit-llm-spend',
	'/research/llm-api-pricing-tracker',
	'/research/llm-chargeback-showback',
	'/research/llm-cost-attribution',
	'/research/llm-cost-calculator',
	'/research/llm-cost-trends-2025-2026',
	'/research/mcp-server-cost-impact',
	'/research/open-source-vs-closed-cost',
	'/research/openai-cost-attribution',
	'/research/openai-fine-tuning-sunset-economics',
	'/research/reasoning-model-cost-guide',
	'/research/sonnet-5-intro-pricing-deadline',
	'/research/token-budget-implementation-guide',
];
const TRANSLATED = Object.fromEntries(LANGS.map((l) => [l, new Set(TRANSLATED_PATHS)]));

// Derived from LANGS, never hand-written: a hardcoded (es|fr|de|ja) list silently
// desyncs the moment a locale is added, and the failure is invisible — the new
// locale just never matches.
const LANG_PREFIX_RE = new RegExp(`^/(${LANGS.join('|')})(/|$)`);
const LANG_COOKIE_RE = new RegExp(`(?:^|;\\s*)lang=(en|${LANGS.join('|')})\\b`);
export const __TRANSLATED_PATHS = TRANSLATED_PATHS; // for the sync test

// Map an English path to its translated equivalent: '/' -> '/es/', '/research'
// -> '/fr/research', etc. Mirrors the structure built by the i18n clone script.
function targetFor(lang, path) {
	return path === '/' ? `/${lang}/` : `/${lang}${path}`;
}

// For the requested URL, return the language being served and — when the page
// belongs to a translated cluster — the hreflang alternates for every locale.
// Lets the markdown-for-agents response declare its Content-Language and
// advertise the other-language URLs, so an agent can fetch and cite the version
// matching its user's language. Non-translated pages just report their language.
function langInfo(url) {
	const m = url.pathname.match(LANG_PREFIX_RE);
	const lang = m ? m[1] : 'en';
	const base = normalizePath(m ? url.pathname.slice(lang.length + 1) || '/' : url.pathname);
	const langsWithPage = LANGS.filter((l) => TRANSLATED[l].has(base));
	if (!langsWithPage.length) return { lang, alternates: [] };
	const alternates = [{ lang: 'en', href: url.origin + base }];
	for (const l of langsWithPage) alternates.push({ lang: l, href: url.origin + targetFor(l, base) });
	return { lang, alternates };
}

// Crawlers, AI agents, and link unfurlers must always see the URL they asked
// for — never auto-redirect them, or hreflang clusters break.
const BOT_RE = /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|quora|pinterest|whatsapp|telegram|googlebot|bingbot|duckduckbot|yandex|baidu|applebot|amazonbot|gptbot|claudebot|claude-|oai-searchbot|chatgpt-user|perplexity|mistralai|meta-externalagent|google-extended/i;

/* ------------------------------------------------------------------ */
/* AI crawler logging (GEO analytics)                                  */
/* ------------------------------------------------------------------ */

// AI crawlers self-identify in the User-Agent — they WANT to be found — so
// detection is a lookup table, not bot-scoring. Cloudflare's botScore is for
// catching bots that lie; it costs money and answers a question we don't have.
//
// `kind` is the part that matters commercially:
//   live  — a human asked the assistant something and it fetched this page NOW.
//           The strongest available evidence of an actual citation.
//   search— indexing for the assistant's answer engine (citation-eligible).
//   train — corpus collection for model training. No citation value.
//
// Longest/most specific token first: 'chatgpt-user' must win before any
// substring of it could match something broader.
const AI_CRAWLERS = [
	{ token: 'chatgpt-user', name: 'ChatGPT-User', kind: 'live' },
	{ token: 'oai-searchbot', name: 'OAI-SearchBot', kind: 'search' },
	{ token: 'gptbot', name: 'GPTBot', kind: 'train' },
	{ token: 'claude-searchbot', name: 'Claude-SearchBot', kind: 'search' },
	{ token: 'claude-user', name: 'Claude-User', kind: 'live' },
	{ token: 'claudebot', name: 'ClaudeBot', kind: 'train' },
	{ token: 'perplexity-user', name: 'Perplexity-User', kind: 'live' },
	{ token: 'perplexitybot', name: 'PerplexityBot', kind: 'search' },
	{ token: 'google-extended', name: 'Google-Extended', kind: 'train' },
	{ token: 'bingbot', name: 'Bingbot', kind: 'search' },
	{ token: 'duckassistbot', name: 'DuckAssistBot', kind: 'search' },
	{ token: 'meta-externalagent', name: 'Meta-ExternalAgent', kind: 'train' },
	{ token: 'mistralai-user', name: 'MistralAI-User', kind: 'live' },
	{ token: 'bytespider', name: 'Bytespider', kind: 'train' },
	{ token: 'amazonbot', name: 'Amazonbot', kind: 'search' },
	{ token: 'applebot-extended', name: 'Applebot-Extended', kind: 'train' },
	{ token: 'youbot', name: 'YouBot', kind: 'search' },
	{ token: 'ccbot', name: 'CCBot', kind: 'train' },
	{ token: 'cohere-ai', name: 'Cohere', kind: 'train' },
];

// Returns the matching crawler descriptor, or null for humans and non-AI bots.
export function detectAiCrawler(userAgent) {
	const ua = (userAgent || '').toLowerCase();
	if (!ua) return null;
	return AI_CRAWLERS.find((c) => ua.includes(c.token)) || null;
}

// Fire-and-forget write to Workers Analytics Engine. Deliberately never throws:
// a logging fault must not take down page serving. Note AE itself also fails
// SILENTLY on malformed data — `npx wrangler tail` is the only way to see that,
// so detectAiCrawler carries a self-check (scripts/worker-crawlers.test.mjs).
function logAiCrawler(request, env, url) {
	if (!env || !env.AI_HITS) return; // binding absent in local dev — fine.
	const hit = detectAiCrawler(request.headers.get('User-Agent'));
	if (!hit) return;
	try {
		env.AI_HITS.writeDataPoint({
			// Path is attacker-controlled and unbounded; AE drops the whole data
			// point (silently) past ~5KB, so cap it. Real paths are well under 200.
			blobs: [hit.name, hit.kind, normalizePath(url.pathname).slice(0, 200), url.hostname],
			doubles: [1],
			indexes: [hit.name],
		});
	} catch (e) {
		// Swallowed on purpose: analytics must never break the response.
	}
}


/* ------------------------------------------------------------------ */
/* Live pricing (/api/pricing)                                          */
/* ------------------------------------------------------------------ */

/**
 * Baseline shipped with the build. It is the fallback served when the live
 * fetch fails AND the yardstick every scraped refresh is measured against: a parse that
 * loses a model or moves a price by more than PRICE_DRIFT_MAX is rejected
 * outright rather than published. A wrong price on a pricing tracker is worse
 * than an old one, so the failure mode here is "serve the baseline", never
 * "serve a guess".
 */
const PRICING_BASELINE = {
	updated: '2026-09-02',
	source: 'https://platform.claude.com/docs/en/about-claude/pricing',
	anthropic: [
		{ id: 'fable-5-1', model: 'Claude Fable 5.1', input: 10, output: 50, cacheRead: 0.25, cacheWrite5m: 12.5, cacheWrite1h: 20, context: 1000000 },
		{ id: 'fable-5', model: 'Claude Fable 5', input: 10, output: 50, cacheRead: 1, cacheWrite5m: 12.5, cacheWrite1h: 20, context: 1000000 },
		{ id: 'opus-5', model: 'Claude Opus 5', input: 5, output: 25, cacheRead: 0.5, cacheWrite5m: 6.25, cacheWrite1h: 10, context: 1000000 },
		{ id: 'sonnet-5', model: 'Claude Sonnet 5', input: 2, output: 10, cacheRead: 0.2, cacheWrite5m: 2.5, cacheWrite1h: 4, context: 1000000 },
		{ id: 'sonnet-4-6', model: 'Claude Sonnet 4.6', input: 3, output: 15, cacheRead: 0.3, cacheWrite5m: 3.75, cacheWrite1h: 6, context: 1000000 },
		{ id: 'haiku-4-5', model: 'Claude Haiku 4.5', input: 1, output: 5, cacheRead: 0.1, cacheWrite5m: 1.25, cacheWrite1h: 2, context: 200000 },
	],
};

const PRICING_DOC_URL = PRICING_BASELINE.source;
// A real price change is a step, not a leap. Anything outside this band is a
// parser fault far more often than it is Anthropic repricing 4x overnight.
const PRICE_DRIFT_MAX = 3;

/**
 * Read the live page, parse it, serve it. No storage: the upstream fetch is
 * edge-cached for 6h by Cloudflare, so this costs one real request per colo
 * per 6h and everything else is a cache hit. Anything that fails — network,
 * page reshuffle, implausible number — falls back to the baseline.
 */
async function servePricing() {
	let payload = PRICING_BASELINE;
	try {
		const res = await fetch(PRICING_DOC_URL, {
			headers: { 'User-Agent': 'finopsllm-pricing-bot' },
			cf: { cacheTtl: 21600, cacheEverything: true },
		});
		if (res.ok) {
			const parsed = parsePricingDoc(await res.text());
			if (validatePricing(parsed)) payload = parsed;
		}
	} catch {
		// Upstream unreachable — the baseline is still a correct answer.
	}
	return new Response(JSON.stringify(payload), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
			'Access-Control-Allow-Origin': '*',
		},
	});
}

/** True only if every baseline model is present, priced, and plausibly close. */
function validatePricing(data) {
	if (!data || !Array.isArray(data.anthropic)) return false;
	if (data.anthropic.length !== PRICING_BASELINE.anthropic.length) return false;
	return PRICING_BASELINE.anthropic.every((base) => {
		const found = data.anthropic.find((m) => m && m.id === base.id);
		if (!found) return false;
		return ['input', 'output', 'cacheRead', 'cacheWrite5m'].every((f) => {
			const v = found[f];
			if (typeof v !== 'number' || !isFinite(v) || v <= 0) return false;
			return v <= base[f] * PRICE_DRIFT_MAX && v >= base[f] / PRICE_DRIFT_MAX;
		});
	});
}

/**
 * Pull the published pricing table and read each model's row. Deliberately
 * dumb: find the model name where it is followed by a full price row —
 * "$input $cacheWrite5m $cacheWrite1h $cacheRead $output / MTok" — and take
 * those five figures. Skips the sidebar nav and the shorter batch/legacy
 * tables, which do not carry five prices. If the page shape changes this
 * returns null and the baseline is served, which is the intended outcome.
 */
function parsePricingDoc(html) {
	const text = html.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ');
	const models = PRICING_BASELINE.anthropic.map((base) => {
		for (let at = text.indexOf(base.model); at !== -1; at = text.indexOf(base.model, at + 1)) {
			// "Claude Fable 5" must not match inside "Claude Fable 5.1".
			if (/[.0-9]/.test(text[at + base.model.length] || '')) continue;
			const nums = (text.slice(at, at + 200).match(/\$\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*MTok/g) || [])
				.map((n) => parseFloat(n.replace(/[^0-9.]/g, '')));
			if (nums.length < 5) continue;
			const [input, cacheWrite5m, cacheWrite1h, cacheRead, output] = nums;
			return { ...base, input, cacheWrite5m, cacheWrite1h, cacheRead, output };
		}
		return null;
	});
	if (models.some((m) => m === null)) return null;
	return { ...PRICING_BASELINE, updated: new Date().toISOString().slice(0, 10), anthropic: models };
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// Live pricing feed for the tracker pages. Served before anything else
		// so no redirect or language rule can touch it.
		if (url.pathname === '/api/pricing') return servePricing();

		// 0. Record AI crawler hits before any redirect, so a bot that lands on
		//    www or a translated path is still counted against the URL it asked
		//    for. Non-blocking and never throws.
		logAiCrawler(request, env, url);

		// 1. www -> apex (301).
		if (url.hostname === 'www.' + APEX) {
			url.hostname = APEX;
			return Response.redirect(url.toString(), 301);
		}

		// 2. Language negotiation (humans only, translated pages only).
		const langHop = languageRedirect(request, url);
		if (langHop) return langHop;

		// 3. English homepage A/B test: humans only, crawlers always see control.
		let abVariant = null;
		let abRequest = request;
		if (!isBotForAb(request) && request.method === 'GET' && AB_PATHS.has(url.pathname)) {
			abVariant = pickVariant(request);
			const targetUrl = abTargetUrl(url, abVariant);
			if (targetUrl.toString() !== url.toString()) {
				abRequest = new Request(targetUrl, request);
			}
		}

		// 4. Fetch whatever the static host would serve (also applies _redirects/_headers).
		const assetResponse = await env.ASSETS.fetch(abRequest);

		// 5. Attach A/B cookie/headers if we ran the experiment on this request.
		let response = assetResponse;
		if (abVariant) {
			const headers = new Headers(assetResponse.headers);
			headers.set('X-AB-Variant', abVariant);
			// Response body depends on the ab_test cookie — without this the CDN
			// can serve one variant's cached HTML to the other bucket.
			headers.append('Vary', 'Cookie');
			if (!abCookieValue(request)) {
				headers.append('Set-Cookie', abCookieHeader(abVariant));
			}
			response = new Response(assetResponse.body, {
				status: assetResponse.status,
				statusText: assetResponse.statusText,
				headers,
			});
		}

		// 6. Only transform GET requests that explicitly negotiate markdown.
		const accept = request.headers.get('Accept') || '';
		if (request.method !== 'GET' || !/text\/markdown/i.test(accept)) {
			return response;
		}

		// 7. Only transform real HTML pages.
		const contentType = assetResponse.headers.get('Content-Type') || '';
		if (assetResponse.status !== 200 || !contentType.includes('text/html')) {
			return response;
		}

		// Read from `response`: when an A/B wrapper exists it owns the body stream.
		const html = await response.text();
		const info = langInfo(url);
		const markdown = htmlToMarkdown(html, url, DEFAULT_TITLE, info);

		const headers = {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Content-Signal': CONTENT_SIGNAL,
			'Content-Language': info.lang,
			'X-Content-Type-Options': 'nosniff',
			'Cache-Control': 'public, max-age=0, must-revalidate',
			'Vary': 'Accept',
		};
		if (info.alternates.length) {
			headers.Link = info.alternates
				.map((a) => `<${a.href}>; rel="alternate"; hreflang="${a.lang}"`)
				.join(', ');
		}
		return new Response(markdown, { status: 200, headers });
	},
};

/* ------------------------------------------------------------------ */
/* Language routing                                                    */
/* ------------------------------------------------------------------ */

function languageRedirect(request, url) {
	if (request.method !== 'GET') return null;

	// Only navigational HTML requests; skip assets and markdown-for-agents.
	const accept = request.headers.get('Accept') || '';
	if (!accept.includes('text/html')) return null;

	// Never bounce crawlers/agents.
	if (BOT_RE.test(request.headers.get('User-Agent') || '')) return null;

	// Already inside a translated tree (/es, /fr, /de, /ja, /pt).
	if (LANG_PREFIX_RE.test(url.pathname)) return null;

	const path = normalizePath(url.pathname);

	const choice = langCookie(request);
	if (choice === 'en') return null; // user explicitly chose English
	const lang = choice && choice !== 'en' ? choice : preferredLang(request);
	if (!lang || !LANGS.includes(lang)) return null;
	if (!TRANSLATED[lang].has(path)) return null; // no translation in this language -> serve English

	const dest = new URL(url.toString());
	dest.pathname = targetFor(lang, path);
	return new Response(null, {
		status: 302,
		headers: {
			Location: dest.toString(),
			'Cache-Control': 'no-store',
			Vary: 'Accept-Language, Cookie',
		},
	});
}

function normalizePath(p) {
	if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
	if (p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length) || '/';
	else if (p.endsWith('.html')) p = p.slice(0, -'.html'.length);
	return p || '/';
}

function langCookie(request) {
	const c = request.headers.get('Cookie') || '';
	const m = c.match(LANG_COOKIE_RE);
	return m ? m[1] : null;
}

// Pick the visitor's preferred translated language from Accept-Language, or null
// to stay on English. A translated language must beat (or tie) English to win;
// among translated languages the highest q wins, ties broken by header order.
function preferredLang(request) {
	const al = request.headers.get('Accept-Language') || '';
	if (!al) return null;
	let bestEn = 0;
	let bestLang = null;
	let bestLangQ = -1;
	for (const part of al.split(',')) {
		const segs = part.trim().split(';');
		const base = segs[0].toLowerCase().split('-')[0];
		let q = 1;
		for (let i = 1; i < segs.length; i++) {
			const mm = segs[i].trim().match(/^q=([0-9.]+)$/);
			if (mm) q = parseFloat(mm[1]);
		}
		if (base === 'en') bestEn = Math.max(bestEn, q);
		else if (LANGS.includes(base) && q > bestLangQ) {
			bestLangQ = q;
			bestLang = base;
		}
	}
	return bestLang && bestLangQ > 0 && bestLangQ >= bestEn ? bestLang : null;
}

/* ------------------------------------------------------------------ */
/* HTML -> Markdown (heuristic, no dependencies)                       */
/* ------------------------------------------------------------------ */

function htmlToMarkdown(html, url, defaultTitle, info) {
	const title = extractTitle(html, defaultTitle);
	let body = extractMain(html);

	body = body
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?<\/style>/gi, '')
		.replace(/<svg[\s\S]*?<\/svg>/gi, '')
		.replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
		.replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
		.replace(/<form[\s\S]*?<\/form>/gi, '')
		.replace(/<!--[\s\S]*?-->/g, '');

	body = body.replace(/<a\b[^>]*?href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi, (m, q, href, text) => {
		const label = stripTags(text).trim();
		if (!label) return '';
		const target = absolutize(href, url);
		if (!target || target.startsWith('#') || target.startsWith('javascript:')) return label;
		return `[${label}](${target})`;
	});
	body = body.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (m, _t, inner) => `**${stripTags(inner).trim()}**`);
	body = body.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (m, _t, inner) => `*${stripTags(inner).trim()}*`);
	body = body.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (m, inner) => `\n\n\`\`\`\n${decode(stripTags(inner)).trim()}\n\`\`\`\n\n`);
	body = body.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (m, inner) => `\`${stripTags(inner).trim()}\``);
	body = body.replace(/<br\s*\/?>/gi, '\n');

	body = body.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (m, level, inner) => {
		const text = stripTags(inner).trim();
		return text ? `\n\n${'#'.repeat(Number(level))} ${text}\n\n` : '';
	});

	body = body.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (m, inner) => `\n- ${stripTags(inner).replace(/\s+/g, ' ').trim()}`);

	body = body
		.replace(/<\/(p|div|section|article|ul|ol|header|footer|main|figure|blockquote|table|tr)>/gi, '\n\n')
		.replace(/<(p|div|section|article|ul|ol|header|footer|figure|blockquote|table|tr)\b[^>]*>/gi, '\n\n');

	body = decode(stripTags(body));

	body = body
		.replace(/\r/g, '')
		.replace(/[ \t]+\n/g, '\n')
		.replace(/[ \t]{2,}/g, ' ')
		.replace(/\n{3,}/g, '\n\n')
		.trim();

	const header = `# ${title}\n\n> Source: ${url.origin}${url.pathname}\n\n`;
	let footer = '';
	if (info && info.alternates && info.alternates.length) {
		const links = info.alternates.map((a) => `[${a.lang}](${a.href})`).join(' · ');
		footer = `\n\n---\n\nAvailable languages: ${links}\n`;
	}
	return `${header}${body}\n${footer}`;
}

function extractTitle(html, defaultTitle) {
	const t = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
	return t ? decode(stripTags(t[1])).trim() : defaultTitle;
}

function extractMain(html) {
	const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
	if (main) return main[1];
	const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
	return body ? body[1] : html;
}

function stripTags(s) {
	return s.replace(/<[^>]+>/g, '');
}

function absolutize(href, url) {
	try {
		return new URL(href, url).toString();
	} catch (e) {
		return href;
	}
}

function decode(s) {
	const named = {
		'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
		'&apos;': "'", '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–',
		'&hellip;': '…', '&rsquo;': '’', '&lsquo;': '‘',
		'&ldquo;': '“', '&rdquo;': '”', '&copy;': '©',
		'&reg;': '®', '&trade;': '™', '&times;': '×', '&euro;': '€',
	};
	return s
		.replace(/&[a-zA-Z]+;/g, (m) => (m in named ? named[m] : m))
		.replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n)))
		.replace(/&#x([0-9a-fA-F]+);/g, (m, n) => String.fromCodePoint(parseInt(n, 16)));
}
