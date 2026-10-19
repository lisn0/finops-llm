"""Check complete source, built pages, or live pages for the two search articles."""
import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from html import unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
BASE = "https://finopsllm.com"
LOCALES = "en de es fr ja pt it ko zh nl ar ru tr pl id vi".split()
KEYS = ("are-ai-overviews-taking-search-traffic", "google-traffic-dropped-overnight")


class Markup(HTMLParser):
    def __init__(self, value):
        super().__init__(convert_charrefs=True)
        self.events = []
        self.texts = []
        self.links = []
        self.html = {}
        self.canonical = []
        self.alternates = {}
        self.alternate_count = 0
        self.jsonld = []
        self._script = None
        self.feed(value)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.events.append(("start", tag))
        if tag == "a":
            self.links.append(attrs.get("href"))
        if tag == "html":
            self.html = attrs
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs.get("href"))
        if tag == "link" and attrs.get("hreflang"):
            self.alternate_count += 1
            self.alternates[attrs["hreflang"]] = attrs.get("href")
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._script = ""

    def handle_endtag(self, tag):
        self.events.append(("end", tag))
        if tag == "script" and self._script is not None:
            self.jsonld.append(json.loads(self._script))
            self._script = None

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_data(self, text):
        if self._script is not None:
            self._script += text
        if text.strip():
            self.texts.append(text.strip())


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def check_source():
    articles = []
    for key in KEYS:
        article = json.loads((ROOT / "src/_data/articles" / f"{key}.json").read_text())
        require(set(article["languages"]) == set(LOCALES), f"{key}: locale coverage")
        en = article["languages"]["en"]
        original = Markup(en["body"])
        for lang, locale in article["languages"].items():
            label = f"{key}/{lang}"
            require(set(locale) == set(en), f"{label}: fields")
            require(all(locale.get(field) for field in ("title", "titleCore", "description", "body")), f"{label}: empty content")
            require(len(locale["title"] + " · FinOps LLM") <= 70, f"{label}: title too long")
            require(len(locale["description"]) <= 165, f"{label}: description too long")
            parsed = Markup(locale["body"])
            require(parsed.events == original.events, f"{label}: HTML structure changed")
            require(parsed.links == original.links, f"{label}: source links changed")
            require(len(parsed.texts) == len(original.texts), f"{label}: missing text nodes")
            require(len(locale["faq"]) == len(en["faq"]), f"{label}: FAQ count")
            require(all(q.get("question") and q.get("answer") for q in locale["faq"]), f"{label}: empty FAQ")
            require([r["slug"] for r in locale["related"]] == [r["slug"] for r in en["related"]], f"{label}: related links")
            if lang != "en":
                require(locale["body"] != en["body"], f"{label}: English fallback")
                proper_names = {"Pew", "Ahrefs", "Google", "Search Engine Roundtable", "Google Search Status Dashboard", "noindex"}
                unchanged = [
                    t for t, source in zip(parsed.texts, original.texts)
                    if t == source and re.search(r"[A-Za-z]", t) and t not in proper_names
                ]
                require(not unchanged, f"{label}: untranslated sentences: {unchanged}")
                for field in ("title", "titleCore", "description"):
                    require(locale[field] != en[field], f"{label}: untranslated {field}")
                for q, source in zip(locale["faq"], en["faq"]):
                    require(all(q[field] != source[field] for field in ("question", "answer")), f"{label}: untranslated FAQ")
                require(all(r["label"] and r["label"] != source["label"] for r, source in zip(locale["related"], en["related"])), f"{label}: untranslated related label")
        articles.append(article)
    print("SOURCE: 32 article/locales; structure, text-node coverage, links, metadata and FAQ checks pass; no verbatim English prose outside the proper-name allowlist.")
    return articles


def page_url(article, lang):
    prefix = "" if lang == "en" else f"/{lang}"
    return f"{BASE}{prefix}/{article['slug']}"


def check_page(item, live):
    article, lang = item
    url = page_url(article, lang)
    locale = article["languages"][lang]
    if live:
        request = Request(url, headers={"User-Agent": "FinOpsTranslationVerification/1.0", "Accept-Language": lang})
        with urlopen(request, timeout=45) as response:
            require(response.status == 200 and response.url == url, f"{url}: status/redirect")
            value = response.read().decode("utf-8")
    else:
        relative = url.removeprefix(BASE).lstrip("/") + ".html"
        value = (ROOT / "_site" / relative).read_text()
    parsed = Markup(value)
    require(parsed.html.get("lang") == lang, f"{url}: html lang")
    require(lang != "ar" or parsed.html.get("dir") == "rtl", f"{url}: Arabic direction")
    require(parsed.canonical == [url], f"{url}: canonical")
    expected = {code: page_url(article, code) for code in LOCALES}
    expected["x-default"] = page_url(article, "en")
    require(parsed.alternates == expected and parsed.alternate_count == len(expected), f"{url}: hreflang cluster")
    text = " ".join(parsed.texts)
    for chunk in Markup(locale["body"]).texts:
        require(chunk in text, f"{url}: missing translated body/infographic/methodology: {chunk[:80]}")
    require(unescape(locale["titleCore"]) in text, f"{url}: title")
    faq = next((x for x in parsed.jsonld if x.get("@type") == "FAQPage"), None)
    require(faq is not None, f"{url}: FAQ schema missing")
    actual = [(q["name"], q["acceptedAnswer"]["text"]) for q in faq["mainEntity"]]
    require(actual == [(q["question"], q["answer"]) for q in locale["faq"]], f"{url}: FAQ schema content")
    counts = Counter(Markup(locale["body"]).events)
    return f"{lang}: {article['slug']} — canonical, 17 hreflangs, {counts[('start', 'figure')]} figure(s), {counts[('start', 'details')]} methodology panels, full body and FAQ verified"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-only", action="store_true")
    parser.add_argument("--live", action="store_true")
    args = parser.parse_args()
    require(not (args.source_only and args.live), "Choose source-only or live")
    articles = check_source()
    if args.source_only:
        return
    items = [(article, lang) for article in articles for lang in LOCALES]
    with ThreadPoolExecutor(max_workers=4 if args.live else 1) as pool:
        for result in pool.map(lambda item: check_page(item, args.live), items):
            print(result)
    print(f"{'LIVE' if args.live else 'BUILD'}: all 32 pages verified.")


if __name__ == "__main__":
    main()
