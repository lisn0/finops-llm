# Search Console robots.txt warning — 2026-10-02

## Finding

The supplied Google Search Console screenshot shows the latest fetched
`https://finopsllm.com/robots.txt` (1,743 bytes, fetched 2026-09-30) with
`Syntax not understood (line 9)`. Line 9 is the nonstandard `Agentmap:`
directive pointing at `/.well-known/ai-catalog.json`.

## Change

Removed `Agentmap:` from `src/robots.txt` so standard robots parsers no longer
report that directive as unknown. The site's `src/_headers` still advertises
`/.well-known/ai-catalog.json` through its `Link` response header with
`rel="ard"`, so the existing catalog discovery path remains available without
putting the extension in robots.txt. `Content-Signal` remains in place as a
separate extension.

## Verification and follow-up

- Source check: `Agentmap:` is absent from `src/robots.txt`; sitemap entries,
  crawler groups, and `Content-Signal` are unchanged.
- No build or deployment was run. This repository deploys through its normal
  git-push-triggered Cloudflare build.
- After deployment, request a fresh robots.txt fetch in Search Console and
  confirm the syntax warning clears. The screenshot's fetched production copy
  still reflects the pre-change file until then.

## References

- Search Console evidence: user-provided screenshot, fetched 2026-09-30.
- [Google robots.txt documentation](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
  notes that crawler support and interpretation of robots.txt syntax varies.
- The [ARD Agentmap entry](https://agenticweb.wiki/terms/agentmap/) describes
  `Agentmap:` as an optional extension outside RFC 9309; consumers are not
  required to understand it.
