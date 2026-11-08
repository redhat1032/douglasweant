#!/usr/bin/env python3
"""Dependency-free structural smoke checks for the published static site."""
from html.parser import HTMLParser
from pathlib import Path
import unittest

SITE = Path(__file__).resolve().parents[1] / "index.html"
COMPONENTS = ("FlightRecorder", "WarRoom", "DailyChallenge", "SignalBuoys", "Longship", "ContactDeck")

class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []
        self.meta = {}
        self.title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "a":
            self.links.append(attrs)
        if tag == "meta" and "name" in attrs:
            self.meta[attrs["name"]] = attrs.get("content", "")
        if tag == "title":
            self.title = True

class SiteSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = SITE.read_text(encoding="utf-8")
        cls.parsed = SiteParser()
        cls.parsed.feed(cls.source)

    def test_document_structure(self):
        self.assertTrue(self.source.lstrip().lower().startswith("<!doctype html>"))
        self.assertTrue(self.parsed.title)
        self.assertIn("viewport", self.parsed.meta)
        self.assertEqual(self.parsed.ids.count("root"), 1)

    def test_application_mount(self):
        self.assertIn('createRoot(document.getElementById("root"))', self.source)
        for component in COMPONENTS:
            with self.subTest(component=component):
                self.assertIn("window." + component, self.source)

    def test_accessibility_baseline(self):
        self.assertIn("prefers-reduced-motion", self.source)
        self.assertIn('name="description"', self.source)

    def test_external_link_hardening(self):
        self.assertIn('noopener noreferrer', self.source)
        for link in self.parsed.links:
            if link.get("target") == "_blank":
                self.assertIn("noopener", link.get("rel", "").split())

if __name__ == "__main__":
    unittest.main()
