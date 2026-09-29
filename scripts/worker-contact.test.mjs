import assert from 'node:assert/strict';
import worker from '../src/worker.js';

const sent = [];
let rateAllowed = true;
const env = {
	EMAIL: { async send(message) { sent.push(message); return { messageId: 'test-only' }; } },
	CONTACT_LIMIT: { async limit({ key }) { assert.equal(key, '203.0.113.7'); return { success: rateAllowed }; } },
};
const good = { name: 'Ada', email: 'ada@example.com', company: 'Example', topic: 'audit', message: 'Can we discuss our spend?' };
const call = (method, body, headers = {}, boundEnv = env) => worker.fetch(new Request('https://finopsllm.com/api/contact', {
	method,
	headers: { 'CF-Connecting-IP': '203.0.113.7', ...headers },
	...(body === undefined ? {} : { body }),
}), boundEnv);

let response = await call('GET');
assert.equal(response.status, 200);
assert.deepEqual((await response.json()).topics, ['audit', 'telemetry', 'partnership', 'support', 'other']);

response = await call('POST', JSON.stringify(good), { 'Content-Type': 'application/json' });
assert.equal(response.status, 200);
assert.deepEqual(await response.json(), { ok: true });
assert.equal(sent.length, 1);
assert.equal(sent[0].to, 'hello@finopsllm.com');
assert.equal(sent[0].from, 'contact@finopsllm.com');
assert.equal(sent[0].replyTo, good.email);
assert.equal(sent[0].html, undefined);

response = await call('POST', new URLSearchParams(good), { 'Content-Type': 'application/x-www-form-urlencoded' });
assert.equal(response.status, 200);
assert.equal(sent.length, 2);

response = await call('POST', new URLSearchParams(good), { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html', Origin: 'https://finopsllm.com' });
assert.equal(response.status, 303);
assert.equal(response.headers.get('Location'), '/contact/sent');
assert.equal(sent.length, 3);

response = await call('POST', new URLSearchParams({ ...good, company: '' }), { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html', Origin: 'https://finopsllm.com' });
assert.equal(response.status, 400);
assert.match(await response.text(), /We could not send your message/);

response = await call('POST', JSON.stringify(good), { 'Content-Type': 'application/json', Origin: 'https://finopsllm.com' });
assert.equal(response.status, 200);
assert.equal(sent.length, 4);
for (const origin of ['https://evil.example', 'null', 'http://finopsllm.com', 'https://www.finopsllm.com']) {
	response = await call('POST', new URLSearchParams(good), { 'Content-Type': 'application/x-www-form-urlencoded', Origin: origin });
	assert.equal(response.status, 403);
}
response = await call('POST', JSON.stringify(good), { 'Content-Type': 'application/json', 'CF-Connecting-IP': 'not-an-ip' });
assert.equal(response.status, 503);
assert.equal(sent.length, 4);

for (const invalid of [
	{ ...good, topic: 'unknown' },
	{ ...good, email: 'x@example.com\r\nBcc: other@example.com' },
	{ ...good, name: '<script>\n' },
	{ ...good, company: '' },
	{ ...good, message: 'x'.repeat(4001) },
]) {
	response = await call('POST', JSON.stringify(invalid), { 'Content-Type': 'application/json' });
	assert.equal(response.status, 400);
}
assert.equal(sent.length, 4);

response = await call('POST', JSON.stringify({ ...good, website: 'spam.example' }), { 'Content-Type': 'application/json' });
assert.equal(response.status, 200);
assert.equal(sent.length, 4);

response = await call('POST', JSON.stringify(good), { 'Content-Type': 'text/plain' });
assert.equal(response.status, 415);
response = await call('POST', '{', { 'Content-Type': 'application/json' });
assert.equal(response.status, 400);
response = await call('POST', JSON.stringify({ ...good, message: 'x'.repeat(9000) }), { 'Content-Type': 'application/json' });
assert.equal(response.status, 413);

rateAllowed = false;
response = await call('POST', JSON.stringify(good), { 'Content-Type': 'application/json' });
assert.equal(response.status, 429);
rateAllowed = true;

for (const missing of [{ CONTACT_LIMIT: env.CONTACT_LIMIT }, { EMAIL: env.EMAIL }]) {
	response = await call('POST', JSON.stringify(good), { 'Content-Type': 'application/json' }, missing);
	assert.equal(response.status, 503);
}

const recorded = [];
const originalError = console.error;
console.error = (...args) => recorded.push(args);
try {
	const failedEnv = { ...env, EMAIL: { async send() { const error = new Error('private message body'); error.code = 'E_DELIVERY_FAILED'; throw error; } } };
	response = await call('POST', JSON.stringify(good), { 'Content-Type': 'application/json', 'CF-Ray': 'test-ray' }, failedEnv);
	assert.equal(response.status, 503);
	const limiterFailure = { ...env, CONTACT_LIMIT: { async limit() { throw new Error('secret'); } } };
	response = await call('POST', JSON.stringify(good), { 'Content-Type': 'application/json' }, limiterFailure);
	assert.equal(response.status, 503);
} finally { console.error = originalError; }
assert.deepEqual(recorded[0], ['contact_delivery_failure', { stage: 'email', code: 'E_DELIVERY_FAILED', ray: 'test-ray' }]);
assert.deepEqual(recorded[1], ['contact_delivery_failure', { stage: 'rate_limit', code: 'unknown', ray: 'unavailable' }]);
assert.equal(sent.length, 4);
console.log('✅ contact API: JSON/form, validation, size limit, rate limit and delivery failures');
