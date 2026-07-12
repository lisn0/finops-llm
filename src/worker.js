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

// Languages with a full published translation mirror. Order is not significant.
const LANGS = ['es', 'fr', 'de', 'ja'];

// English paths that have a published translation, PER LANGUAGE, so a language
// redirect can never land a visitor on a 404. es/ja carry more translations
// than de/fr, so the sets differ. Keep each set in sync with the files that
// actually exist under src/<lang>/ — list them with:
//   ls src/<lang>/research/*.njk
const CORE = ['/', '/research'];
const DEEP = [
	'/research/finops-for-llm',
	'/research/ai-finops',
	'/research/llm-cost-attribution',
	'/research/openai-cost-attribution',
	'/research/llm-chargeback-showback',
	'/research/anomaly-detection',
];
const EXTENDED = [
	'/research/agent-economics',
	'/research/caching-strategies-compared',
	'/research/cheapest-ai-code-generation',
	'/research/coding-plan-comparison',
	'/research/how-much-does-gpt5-cost',
	'/research/how-to-audit-llm-spend',
	'/research/llm-api-pricing-tracker',
	'/research/llm-cost-calculator',
	'/research/llm-cost-trends-2025-2026',
	'/research/mcp-server-cost-impact',
	'/research/open-source-vs-closed-cost',
	'/research/reasoning-model-cost-guide',
	'/research/token-budget-implementation-guide',
];
const TRANSLATED = {
	es: new Set([...CORE, ...DEEP, ...EXTENDED]),
	ja: new Set([...CORE, ...DEEP, ...EXTENDED]),
	fr: new Set([...CORE, ...DEEP]),
	de: new Set([...CORE, ...DEEP]),
};

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
	const m = url.pathname.match(/^\/(es|fr|de|ja)(\/|$)/);
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

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// 1. www -> apex (301).
		if (url.hostname === 'www.' + APEX) {
			url.hostname = APEX;
			return Response.redirect(url.toString(), 301);
		}

		// 2. Language negotiation (humans only, translated pages only).
		const langHop = languageRedirect(request, url);
		if (langHop) return langHop;

		// 3. Fetch whatever the static host would serve (also applies _redirects/_headers).
		const assetResponse = await env.ASSETS.fetch(request);

		// 4. Only transform GET requests that explicitly negotiate markdown.
		const accept = request.headers.get('Accept') || '';
		if (request.method !== 'GET' || !/text\/markdown/i.test(accept)) {
			return assetResponse;
		}

		// 5. Only transform real HTML pages.
		const contentType = assetResponse.headers.get('Content-Type') || '';
		if (assetResponse.status !== 200 || !contentType.includes('text/html')) {
			return assetResponse;
		}

		const html = await assetResponse.text();
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

	// Already inside a translated tree (/es, /fr, /de, /ja).
	if (/^\/(es|fr|de|ja)(\/|$)/.test(url.pathname)) return null;

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
	const m = c.match(/(?:^|;\s*)lang=(en|es|fr|de|ja)\b/);
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
