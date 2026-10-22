import assert from 'node:assert/strict';
import worker, { detectAiReferrer } from '../src/worker.js';

for (const host of ['bing.com', 'www.bing.com', 'openai.com', 'anthropic.com', 'mistral.ai']) {
	assert.equal(detectAiReferrer(`https://${host}/`, new URL('https://finopsllm.com/')), null, `${host} is not an answer-surface referral`);
}
assert.equal(
	detectAiReferrer('https://copilot.microsoft.com/', new URL('https://finopsllm.com/'))?.name,
	'Copilot',
);
assert.equal(
	detectAiReferrer(null, new URL('https://finopsllm.com/?utm_source=bing.com')),
	null,
	'generic search UTM must not count as an answer-surface referral',
);

for (const scenario of [
	{
		name: 'www redirect',
		url: 'https://www.finopsllm.com/?utm_source=chatgpt.com',
		headers: { Accept: 'text/html', 'User-Agent': 'Mozilla/5.0' },
		redirectStatus: 301,
	},
	{
		name: 'language redirect',
		url: 'https://finopsllm.com/?utm_source=chatgpt.com',
		headers: { Accept: 'text/html', 'Accept-Language': 'es', 'User-Agent': 'Mozilla/5.0' },
		redirectStatus: 302,
	},
]) {
	const points = [];
	const env = {
		AI_HITS: { writeDataPoint: (point) => points.push(point) },
		ASSETS: { fetch: async () => new Response('<html></html>', { headers: { 'Content-Type': 'text/html' } }) },
	};

	const firstResponse = await worker.fetch(new Request(scenario.url, { headers: scenario.headers }), env);
	assert.equal(firstResponse.status, scenario.redirectStatus, `${scenario.name} should redirect first`);
	assert.equal(points.length, 0, `${scenario.name} redirect should not record a referral`);

	const finalResponse = await worker.fetch(
		new Request(firstResponse.headers.get('Location'), { headers: scenario.headers }),
		env,
	);
	assert.equal(finalResponse.status, 200, `${scenario.name} destination should serve the page`);
	assert.equal(points.length, 1, `${scenario.name} landing should record exactly one referral`);
	assert.equal(points[0].blobs[0], 'ChatGPT');
	assert.equal(points[0].blobs[1], 'referral');
}

console.log('ok — www and language redirects record one AI referral on the final page only');
