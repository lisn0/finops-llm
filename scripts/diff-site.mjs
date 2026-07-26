import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";

const GOLDEN = "_site.golden";
const CURRENT = "_site";

function walk(dir, base = dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, base, out);
    } else {
      out.push(relative(base, full));
    }
  }
  return out;
}

function hash(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function normalizeWs(s) {
  return s.replace(/\s+/g, " ").trim();
}

function parseTag(tag) {
  // tag is a full string like "<meta name="description" content="..." />"
  const m = tag.match(/^<([a-z0-9]+)([^>]*)>([\s\S]*)<\/\1>$/i);
  if (m) {
    const [, name, attrStr, inner] = m;
    return { name: name.toLowerCase(), attrs: sortAttrs(attrStr), inner: normalizeWs(inner) };
  }
  const self = tag.match(/^<([a-z0-9]+)([^>]*)\/?>$/i);
  if (self) {
    const [, name, attrStr] = self;
    return { name: name.toLowerCase(), attrs: sortAttrs(attrStr), inner: "" };
  }
  return { name: "?", attrs: "", inner: normalizeWs(tag) };
}

function sortAttrs(attrStr) {
  const pairs = [];
  const re = /([a-zA-Z0-9\-:]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = re.exec(attrStr)) !== null) {
    const key = m[1].toLowerCase();
    const val = m[2] ?? m[3] ?? m[4] ?? "";
    pairs.push(`${key}="${val}"`);
  }
  pairs.sort();
  return pairs.join(" ");
}

function headMultiset(headHtml) {
  const tags = [
    ...headHtml.matchAll(/<title[\s\S]*?<\/title>/gi),
    ...headHtml.matchAll(/<meta[^>]*\/?>/gi),
    ...headHtml.matchAll(/<link[^>]*\/?>/gi),
    ...headHtml.matchAll(/<script[\s\S]*?<\/script>/gi),
    ...headHtml.matchAll(/<style[\s\S]*?<\/style>/gi),
  ];
  const map = new Map();
  for (const [raw] of tags) {
    const p = parseTag(raw.trim());
    const key = `<${p.name}${p.attrs ? " " + p.attrs : ""}>${p.inner}</${p.name}>`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

function compareMaps(a, b, label) {
  const issues = [];
  for (const [k, v] of a) {
    const vb = b.get(k) ?? 0;
    if (v !== vb) issues.push(`${label} count mismatch: ${k} (golden=${v}, current=${vb})`);
  }
  for (const [k, v] of b) {
    if (!a.has(k)) issues.push(`${label} extra: ${k} (current=${v})`);
  }
  return issues;
}

function compareHtml(goldenPath, currentPath) {
  const g = readFileSync(goldenPath, "utf8");
  const c = readFileSync(currentPath, "utf8");
  const issues = [];

  const gHtml = g.match(/<html([^>]*)>/i)?.[1] ?? "";
  const cHtml = c.match(/<html([^>]*)>/i)?.[1] ?? "";
  if (normalizeWs(gHtml) !== normalizeWs(cHtml)) {
    issues.push(`<html> attrs differ`);
  }

  const gHead = g.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? "";
  const cHead = c.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? "";
  issues.push(...compareMaps(headMultiset(gHead), headMultiset(cHead), "head"));

  const gBody = g.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? "";
  const cBody = c.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? "";
  if (normalizeWs(gBody) !== normalizeWs(cBody)) {
    issues.push("body content differs");
  }

  return issues;
}

const goldenFiles = walk(GOLDEN).sort();
const currentFiles = new Set(walk(CURRENT));
let errors = 0;

for (const rel of goldenFiles) {
  const gPath = join(GOLDEN, rel);
  const cPath = join(CURRENT, rel);
  if (!existsSync(cPath)) {
    console.log(`MISSING ${rel}`);
    errors++;
    continue;
  }

  if (!rel.endsWith(".html")) {
    if (hash(gPath) !== hash(cPath)) {
      console.log(`BYTES ${rel}`);
      errors++;
    }
    continue;
  }

  const issues = compareHtml(gPath, cPath);
  if (issues.length) {
    console.log(`DIFF ${rel}`);
    for (const issue of issues.slice(0, 3)) console.log(`     ${issue}`);
    if (issues.length > 3) console.log(`     ...and ${issues.length - 3} more`);
    errors++;
  }
}

for (const rel of currentFiles) {
  if (!goldenFiles.includes(rel)) {
    console.log(`EXTRA ${rel}`);
    errors++;
  }
}

if (errors) {
  console.log(`\n${errors} file(s) differ.`);
  process.exit(1);
} else {
  console.log(`All ${goldenFiles.length} files match.`);
}
