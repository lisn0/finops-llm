import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";

const args = process.argv.slice(2);

function findFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith("_") || entry === ".well-known") continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) findFiles(full, out);
    else if (full.endsWith(".njk")) out.push(full);
  }
  return out;
}

function attr(tag, name) {
  const double = new RegExp(`${name}="([^"]*)"`, "i");
  const mD = tag.match(double);
  if (mD) return mD[1];
  const single = new RegExp(`${name}='([^']*)'`, "i");
  const mS = tag.match(single);
  return mS ? mS[1] : undefined;
}

function hasAttr(tag, name) {
  return new RegExp(`\\b${name}\\b`, "i").test(tag);
}

function parseHead(headHtml) {
  const head = {
    title: undefined,
    description: undefined,
    robots: undefined,
    keywords: undefined,
    themeColor: undefined,
    verification: undefined,
    canonical: undefined,
    hreflang: [],
    openGraph: [],
    twitter: [],
    links: [],
    fontStylesheet: undefined,
    style: undefined,
    scripts: [],
    jsonLd: [],
  };

  // title
  const titleMatch = headHtml.match(/<title>([\s\S]*?)<\/title>/i);
  if (titleMatch) head.title = titleMatch[1].trim();

  // meta tags
  for (const tag of headHtml.matchAll(/<meta[^>]*\/?>/gi)) {
    const t = tag[0];
    const name = attr(t, "name");
    const property = attr(t, "property");
    const content = attr(t, "content");
    if (name === "description") head.description = content;
    else if (name === "robots") head.robots = content;
    else if (name === "keywords") head.keywords = content;
    else if (name === "theme-color") head.themeColor = content;
    else if (name === "msvalidate.01") head.verification = content;
    else if (property && property.startsWith("og:")) head.openGraph.push({ property, content });
    else if (name && name.startsWith("twitter:")) head.twitter.push({ name, content });
  }

  // links
  for (const tag of headHtml.matchAll(/<link[^>]*\/?>/gi)) {
    const t = tag[0];
    const rel = attr(t, "rel");
    const href = attr(t, "href");
    if (!rel || !href) continue;
    if (rel === "canonical") {
      head.canonical = href;
      continue;
    }
    if (rel === "alternate") {
      const lang = attr(t, "hreflang");
      if (lang) head.hreflang.push({ lang, href });
      continue;
    }
    if (rel === "stylesheet" && href.includes("fonts.googleapis.com")) {
      head.fontStylesheet = href;
      continue;
    }
    const link = { rel, href };
    const type = attr(t, "type");
    if (type) link.type = type;
    const sizes = attr(t, "sizes");
    if (sizes) link.sizes = sizes;
    const title = attr(t, "title");
    if (title) link.title = title;
    if (hasAttr(t, "crossorigin")) link.crossorigin = true;
    head.links.push(link);
  }

  // scripts
  for (const tag of headHtml.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
    const t = tag[0];
    const src = attr(t, "src");
    if (src) {
      const s = { src };
      if (hasAttr(t, "defer")) s.defer = true;
      head.scripts.push(s);
    } else if (attr(t, "type") === "application/ld+json") {
      head.jsonLd.push(tag[1].trim());
    }
  }

  // style
  const styleMatch = headHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (styleMatch) head.style = styleMatch[1].trim();

  // drop undefined empty arrays
  for (const key of Object.keys(head)) {
    if (head[key] === undefined || (Array.isArray(head[key]) && head[key].length === 0)) {
      delete head[key];
    }
  }
  return head;
}

function convertFile(filePath) {
  const src = readFileSync(filePath, "utf8");

  const fmMatch = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) throw new Error(`${filePath}: no front matter`);
  const frontMatter = fmMatch[1];
  const template = src.slice(fmMatch[0].length);

  const permalinkMatch = frontMatter.match(/permalink:\s*["']([^"']+)["']/);
  const permalink = permalinkMatch ? permalinkMatch[1] : undefined;
  if (!permalink) throw new Error(`${filePath}: no permalink in front matter`);

  const blockRe = /\{%\s*block\s+prefix\s*%\}([\s\S]*?)\{%\s*endblock\s*%\}\{%\s*block\s+body\s*%\}([\s\S]*?)\{%\s*endblock\s*%\}\{%\s*block\s+suffix\s*%\}([\s\S]*?)\{%\s*endblock\s*%\}/;
  const blocks = template.match(blockRe);
  if (!blocks) throw new Error(`${filePath}: could not match prefix/body/suffix blocks`);
  const prefix = blocks[1];
  const body = blocks[2];

  const langMatch = prefix.match(/<html\s+lang=["']([^"']+)["']/i);
  const lang = langMatch ? langMatch[1] : "en";

  const headMatch = prefix.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) throw new Error(`${filePath}: no <head> in prefix`);
  const headHtml = headMatch[1];

  const head = parseHead(headHtml);

  const out = {
    permalink,
    lang,
    head,
  };

  const newFile = `---json\n${JSON.stringify(out, null, 2)}\n---\n{% extends "shell.njk" %}{% block body %}${body}{% endblock %}\n`;
  writeFileSync(filePath, newFile);
  console.log("converted", filePath);
}

const files = args.length ? args : findFiles("src");
let errors = 0;
for (const f of files) {
  try {
    convertFile(f);
  } catch (e) {
    console.error("ERROR", f, e.message);
    errors++;
  }
}
if (errors) process.exit(1);
