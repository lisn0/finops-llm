# Claude Code cost & quality hooks

Notes on the Claude Code hooks wired into `~/.claude/settings.json` to (a) capture
per-session LLM cost and (b) protect quality gates. Landed here in the FinOps-LLM
project because the cost-capture half is directly on-theme — it produces the raw
usage log a cost dashboard can read.

> **Context:** these were salvaged from the ECC plugin when it was trimmed down
> (278 skills / 67 agents / 29 hooks → a lean keep-set) to cut ~16k of per-session
> context. The plugin is **disabled, not uninstalled**, so its scripts still live in
> the version-pinned cache at
> `~/.claude/plugins/cache/ecc/ecc/2.0.0/`.

## Key fact: hooks cost 0 context tokens

The ~16k ECC bloat was **skills + agents** (loaded into the context window), not
hooks. `/context` reports `0 tokens` for hooks — they load on demand at tool-call
time. So the decision to keep a hook is **not** a token-budget question. It's:

> **Does anything actually read what the hook writes?**
> A capture hook with no live consumer is just latency filling a log nobody opens.

That test is why we kept exactly two and dropped the other telemetry hooks.

## Hook 1 — cost-tracker (Stop)

Appends a cumulative token/cost snapshot to `~/.claude/metrics/costs.jsonl` once per
response. Its consumer (the `ecc-cost-tracking` skill, kept in `~/.claude/skills/`) is
self-contained and reads that same file — a real closed loop that survives the plugin
being disabled.

```jsonc
// settings.json → hooks.Stop[0].hooks[]
{
  "type": "command",
  "command": "F=/Users/bilelUser/.claude/plugins/cache/ecc/ecc/2.0.0/scripts/hooks/cost-tracker.js; [ -f \"$F\" ] && CLAUDE_PLUGIN_ROOT=/Users/bilelUser/.claude/plugins/cache/ecc/ecc/2.0.0 node \"$F\"; true",
  "timeout": 10,
  "statusMessage": "Logging session cost..."
}
```

- `[ -f "$F" ]` guard → silent no-op if the ECC cache is ever removed (never errors a response).
- `; true` → always exits 0 so a Stop hook can't block.

### `costs.jsonl` schema

Each row is a **cumulative snapshot for that session** (dedupe by `session_id` /
`transcript_path`, keep the latest `timestamp`):

| field | meaning |
|---|---|
| `session_id` | session identifier |
| `transcript_path` | path to the session transcript |
| `timestamp` | snapshot time |
| `model` | model id |
| `input_tokens` / `output_tokens` | usage |
| `cache_write_tokens` / `cache_read_tokens` | prompt-cache counts |
| cost fields | estimated spend (via `scripts/lib/cost-estimate.js`) |

Quick check the log exists:

```bash
node -e 'const fs=require("fs"),os=require("os"),p=require("path");const f=p.join(os.homedir(),".claude","metrics","costs.jsonl");console.log(fs.existsSync(f)?"cost log found":"cost log not found: "+f)'
```

## Hook 2 — config-protection (Write | Edit | MultiEdit)

Blocks edits to linter/formatter/type configs so the agent fixes the *code* instead of
weakening the *rules* (the classic "silence the error by editing the config" antipattern).

Covers: eslint, prettier, biome, tsconfig, pint, phpstan, php-cs-fixer, ruff, flake8.

```jsonc
// settings.json → hooks.PreToolUse[matcher:"Write|Edit|MultiEdit"].hooks[]
{
  "type": "command",
  "command": "jq -r '.tool_input.file_path // \"\"' | { read -r P; [ \"${ECC_CONFIG_PROTECT:-on}\" = \"off\" ] && exit 0; B=$(basename \"$P\"); if echo \"$B\" | grep -qE '^(\\.eslintrc(\\.(c?js|mjs|json|ya?ml))?|eslint\\.config\\.(c?js|mjs|ts)|\\.prettierrc(\\.(c?js|mjs|json|ya?ml|toml))?|prettier\\.config\\.(c?js|mjs)|biome\\.jsonc?|tsconfig(\\.[^/]+)?\\.json|pint\\.json|phpstan\\.neon(\\.dist)?|\\.php-cs-fixer(\\.dist)?\\.php|\\.?ruff\\.toml|\\.flake8)$'; then echo '{\"decision\":\"block\",\"reason\":\"...fix the code instead...\"}'; fi; }",
  "timeout": 5,
  "statusMessage": "Config protection — fix code, not the config..."
}
```

- Escape hatch: `ECC_CONFIG_PROTECT=off` for a session when a config change is genuinely intended.

## Dropped (no live consumer)

Kept off on purpose — their readers left with the plugin:

| hook | why dropped |
|---|---|
| continuous-learning (`observe-runner.js`) | only ECC's pattern-extraction reads it (disabled) — write-only |
| governance-capture | off by default; feeds ECC governance dashboard (gone) |
| metrics-bridge / activity-tracker | feed ECC statusline + context-monitor (gone) |
| context-monitor | runs after *every* tool call + injects tokens; native `/context` already covers exhaustion |
| GateGuard (fact-forcing gate) | high friction; blocks first Write/Edit per file |

## Expansion ideas (FinOps angle)

`costs.jsonl` is the raw material for real cost tooling — this is where to grow it:

- [ ] A `finops-llm` reader that rolls `costs.jsonl` up by day / model / project and renders a trend.
- [ ] Alert threshold: warn when a session or a day crosses a spend budget.
- [ ] Attribute cost to project by mapping `transcript_path` / cwd → repo.
- [ ] Reconcile local estimates against real Anthropic billing to calibrate `cost-estimate.js`.
- [ ] Feed the rollup into the LLM-CFO product as the "your own agent spend" reference dataset.
- [ ] Decide whether to re-implement cost-tracker natively (drop the ECC cache dependency) once the schema is locked.
