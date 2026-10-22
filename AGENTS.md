# AGENTS.md

<!-- production-compute:client-contract:START -->
For every agent client, follow the shared [compute guidance](COMPUTE.md) for authorized execution, monitoring, recovery, and result verification.
<!-- production-compute:client-contract:END -->

Project instructions are in the project README and other owning documentation. Follow [shared compute guidance](COMPUTE.md) for every agent client.

## Frontier tickets and current handoff

Follow the shared [Frontier skill](../../../../youtube/.agents/skills/frontier/SKILL.md) and query the canonical live tracker with `./tools/frontier` from the workspace root. For ticketed work, inspect the matching live ticket before acting. Read `docs/CURRENT-HANDOFF.md` before ticketed work if that file exists; use it as execution context and reconcile any disagreement against the live ticket and new evidence.

When you find an issue, search the live tracker for an existing ticket first; update it or open a specific ticket with evidence, acceptance criteria, source owner, and next action before moving on. Fix routine authorized issues directly; keep unresolved blockers tracked with their next action. Close a ticket only after its acceptance evidence is verified. Do not create duplicate tickets, restore a separate tracker in a standalone/cloud clone, or automatically close a project. If the skill or canonical tracker is unavailable, report that access blocker instead of using a stale local copy.

## Only deployment route — user directive 2026-10-03

The only deployment route for this site is a push to the verified personal GitHub production branch, which triggers Cloudflare Workers automatic builds and deployment. For authorized website releases, commit the reviewed changes and push through that route. Do not run local Wrangler deployment commands. Do not use Playwright for website work or release checks unless the user explicitly requests it; use builds, tests, SEO/GEO checks, and HTTP checks instead. Carry an authorized release through the push without asking again.

## Article-only publishing — user directive 2026-10-22

For changes limited to article JSON content, use `npm run publish:articles --
--message "Publish article" src/_data/articles/<article>.json`. This performs
source checks, commits selected content, pushes directly to verified GitHub
`main`, waits for the actual content to be live, and submits search discovery.
Cloudflare runs the site build once after the push. Do not run a separate local
or remote site build/test suite, create a release branch, or manually repeat
publication checks for ordinary article-only updates. Source checks and the
normal commit hook still apply. Runtime, template, dependency or publishing-tool
changes require the relevant tests; this shortcut is limited to article content.

## New-article workflow — user directive 2026-10-22

When asked to find opportunities, write new blogs, or publish another batch,
follow [the full content workflow](docs/CONTENT-WORKFLOW.md): discover uncovered
reader intents, research, write and publish through the existing command without
asking for approval at each stage. New articles are the default; refreshes are
not. This is an on-demand workflow, not authorization for scheduled runs.
Do not create or enable a schedule unless the user explicitly asks for one.
