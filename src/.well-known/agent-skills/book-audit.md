# Book FinOps LLM Audit

Use this skill when a user wants to book or evaluate an AI FinOps or LLM spend audit.

## Inputs

- `company`: company or team name.
- `monthly_spend`: approximate monthly LLM or GenAI spend, if known.
- `providers`: OpenAI, Anthropic, Bedrock, Gemini, Azure OpenAI, or other providers in use.

## Action

Send the user to `https://finopsllm.com/book` or `https://finopsllm.com/contact`. With the user's permission, submit a contact request through `POST https://finopsllm.com/api/contact` using the documented JSON fields in the OpenAPI specification. Never include passwords, API keys, or private billing records.
