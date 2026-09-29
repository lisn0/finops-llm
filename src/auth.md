# FinOps LLM Auth.md — API access for agents

## Who can use this API

The FinOps LLM public API is designed for AI agents, search engines, and integrations that need structured access to FinOps LLM content and service status.

## Authentication

No API key is required for public discovery or contact endpoints. An agent must have the user's permission before sending a contact request. Contact submissions are rate-limited per visitor IP and require a name, work email, company, topic, and message. This website does not issue Tidal login credentials.

## Available endpoints

- `GET /health.json` — Service health status
- `GET /.well-known/api-catalog` — RFC 9727 API catalog
- `GET /.well-known/ai-catalog.json` — Public agent resource manifest
- `GET /openapi.json` — OpenAPI 3.1 specification
- `GET /llms.txt` — Curated markdown index for AI agents
- `GET /llms-full.txt` — Full concatenated markdown of public pages
- `GET /api/contact` — Contact endpoint metadata and required fields
- `POST /api/contact` — Submit a JSON or form-encoded contact request; JSON clients receive `{ "ok": true }` when accepted and JSON `error` codes on failure. Browser form posts receive a fixed confirmation page on success or a fixed HTML error. Cross-origin browser submissions are rejected.

## Tidal Telemetry login

Existing Tidal users sign in at https://openlit.llmcfo.com/login. New company access is moving to issued, expiring enrollment or invitation links; request access through `/contact` or book a call. The marketing site cannot create accounts or grant roles. Company governance controls are being prepared and should not be assumed live until the Tidal rollout is confirmed.

Tidal's separate MCP endpoint is `https://otlp.llmcfo.com/mcp`. Use only credentials and tool permissions currently granted by Tidal. Delegated company access is part of the pending governance rollout. This marketing site's public API has no MCP tool endpoint or OAuth authorization server.

## Content usage policy

Content-Signal: search=yes, ai-input=yes, ai-train=no

## Contact

For partnership, bulk access, or questions: https://finopsllm.com/contact. You can also try hello@finopsllm.com.
