#!/usr/bin/env python3
"""Dependency-free structural smoke checks for the published static site.

Retargeted for the multi-page static redesign (PR #21): the homepage is
real HTML now, and the interactive pieces live on their own pages.
Merge order: this belongs on top of the redesign, not the old React app.
"""
from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

PAGES = (
    "index.html",
    "about/index.html",
    "projects/index.html",
    "weantech/index.html",
    "wow/index.html",
    "challenge/index.html",
    "contact/index.html",
    "blog/index.html",
    "explore/index.html",
    "explore/log/index.html",
    "explore/worktable/index.html",
    "explore/signals/index.html",
    "explore/longship/index.html",
    "wgu-showcase/index.html",
)

PAGE_URLS = (
    "https://douglasweant.com/",
    "https://douglasweant.com/about/",
    "https://douglasweant.com/projects/",
    "https://douglasweant.com/weantech/",
    "https://douglasweant.com/wow/",
    "https://douglasweant.com/challenge/",
    "https://douglasweant.com/contact/",
    "https://douglasweant.com/blog/",
    "https://douglasweant.com/explore/log/",
    "https://douglasweant.com/explore/worktable/",
    "https://douglasweant.com/explore/signals/",
    "https://douglasweant.com/explore/longship/",
    "https://douglasweant.com/wgu-showcase/",
)


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.title = False
        self.canonical = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and "name" in attrs:
            self.meta[attrs["name"]] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = True
        if tag == "title":
            self.title = True


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


class SiteSmokeTests(unittest.TestCase):
    def test_pages_exist_with_document_basics(self):
        for rel in PAGES:
            with self.subTest(page=rel):
                source = read(rel)
                self.assertTrue(source.lstrip().lower().startswith("<!doctype html>"))
                parsed = PageParser()
                parsed.feed(source)
                self.assertTrue(parsed.title)
                self.assertIn("viewport", parsed.meta)
                self.assertIn("description", parsed.meta)
                self.assertTrue(parsed.canonical)

    def test_homepage_is_real_content_not_a_js_shell(self):
        source = read("index.html")
        self.assertNotIn("createRoot", source)
        self.assertIn("Cybersecurity, human behavior", source)
        self.assertIn("Spot the Intruder", source)
        self.assertIn("Douglas Weant", source)

    def test_legacy_hash_routes_survive(self):
        source = read("index.html")
        for target in ("/challenge/", "/explore/log/", "/explore/worktable/",
                       "/explore/signals/", "/explore/longship/", "/contact/"):
            with self.subTest(target=target):
                self.assertIn(target, source)

    def test_interactive_pieces_are_wired(self):
        self.assertIn("daily-challenge.js", read("challenge/index.html"))
        self.assertIn("signal-buoys.js", read("explore/signals/index.html"))
        self.assertIn("longship.js", read("explore/longship/index.html"))

    def test_sitemap_covers_the_pages(self):
        sitemap = read("sitemap.xml")
        for url in PAGE_URLS:
            with self.subTest(url=url):
                self.assertIn(url, sitemap)

    def test_external_link_hardening_logic(self):
        site_js = read("site.js")
        self.assertIn("noopener", site_js)
        self.assertIn("noreferrer", site_js)


if __name__ == "__main__":
    unittest.main()
