#!/usr/bin/env python3
"""Offline static/security audit for Axiom Web. No network or dependencies."""
import html.parser
import json
import pathlib
import re
import sys
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
ERRORS = []
WARNINGS = []

def check(condition, message):
    if not condition:
        ERRORS.append(message)

def warn(message):
    WARNINGS.append(message)

def inside(path, directory):
    try:
        path.resolve(strict=False).relative_to(directory.resolve())
        return True
    except ValueError:
        return False

class References(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.ids = set()
        self.inline_handlers = []
        self.external_targets = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            if a["id"] in self.ids:
                ERRORS.append("Duplicate HTML id: " + a["id"])
            self.ids.add(a["id"])
        for k, v in attrs:
            if k.startswith("on"):
                self.inline_handlers.append(k)
        if tag in ("script", "link", "a", "img"):
            attr = "src" if tag in ("script", "img") else "href"
            if a.get(attr):
                self.refs.append((tag, a[attr]))
        if tag == "a" and a.get("target") == "_blank":
            self.external_targets.append(a)
        if tag == "script" and "src" not in a:
            ERRORS.append("Inline script is not permitted under CSP")

def run():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    refs = References()
    refs.feed(html)
    check(not refs.inline_handlers, "Inline event handlers: " + str(refs.inline_handlers))
    check("Content-Security-Policy" in html, "CSP meta tag missing")
    check("default-src 'none'" in html, "CSP must default to none")
    check("script-src 'self'" in html, "Scripts must be same origin")
    check("connect-src 'self'" in html, "ZIP fetch needs same-origin restriction")
    check("form-action 'none'" in html, "CSP form-action needs none")
    for tag, link in refs.refs:
        if link.startswith("#"):
            check(link[1:] in refs.ids, "Broken anchor: " + link)
        elif link.startswith(("https://", "mailto:", "tel:")):
            pass
        elif re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", link) or link.startswith("//"):
            ERRORS.append("Unapproved URL scheme: " + link)
        else:
            f = (ROOT / link.split("#")[0].split("?")[0]).resolve()
            check(inside(f, ROOT) and f.is_file(), "Missing/untrusted HTML asset: " + link)
    for a in refs.external_targets:
        check({"noopener", "noreferrer"}.issubset(set((a.get("rel") or "").split())),
              "target=_blank must include noopener noreferrer")
    icon_rel = re.search(r'<link\s+rel="icon"\s+type="image/svg\+xml"\s+href="\.\/assets\/favicon\.svg"', html)
    check(bool(icon_rel), "Favicon link must be registered in HTML head")
    icon_file = ROOT / "assets/favicon.svg"
    check(icon_file.is_file(), "Missing SVG favicon")
    if icon_file.exists():
        icon = icon_file.read_text(encoding="utf-8")
        try:
            e = ET.fromstring(icon)
            check(e.tag.endswith("svg"), "Favicon must be an SVG")
            check(e.get("viewBox") == "0 0 128 128", "Favicon viewBox unexpectedly changed")
            tags = [el.tag.split("}")[-1] for el in e.iter()]
            check(not set(tags).intersection({"script", "foreignObject", "image", "iframe", "use"}),
                  "Favicon contains unsafe linked/executable elements")
            check(not re.search(r"(?:https?:|javascript:|data:)", icon, flags=re.I),
                  "Favicon references remote/executable resource")
        except ET.ParseError as ex:
            ERRORS.append("Invalid favicon SVG: " + str(ex))
    catalogue = json.loads((ROOT / "assets/axiom/catalogue.json").read_text(encoding="utf-8"))
    manifest = json.loads((ROOT / "assets/axiom/export-manifest.json").read_text(encoding="utf-8"))
    check(len(catalogue.get("skills", [])) == 30, "Expected exactly 30 skills")
    check(len(catalogue.get("agents", [])) == 12, "Expected exactly 12 agent roles")
    files = manifest["files"]
    check(len(files) > 60, "Manifest too small for complete offline package")
    seen_src, seen_dest = set(), set()
    for item in files:
        source = item["source"]
        dest = item["target"]
        check(source not in seen_src, "Duplicate manifest source: " + source)
        check(dest not in seen_dest, "Duplicate ZIP destination: " + dest)
        seen_src.add(source)
        seen_dest.add(dest)
        check(re.fullmatch(r"[A-Za-z0-9._/-]+", source) is not None and
              all(part not in ("", ".", "..") for part in source.split("/")),
              "Unsafe manifest path: " + source)
        check(re.fullmatch(r"[A-Za-z0-9._/-]+", dest) is not None and
              all(part not in ("", ".", "..") for part in dest.split("/")),
              "Unsafe ZIP target: " + dest)
        p = (ROOT / source).resolve()
        check(inside(p, ROOT) and p.is_file(), "Missing or outside manifest source: " + source)
    for skill in catalogue["skills"]:
        p = "skills/" + skill["id"] + "/SKILL.md"
        check(p in seen_dest, "Unexported skill: " + p)
        fp = ROOT / "assets/axiom" / p
        check(fp.exists(), "Missing SKILL.md: " + p)
        if fp.exists():
            check(fp.read_text(encoding="utf-8").startswith("---\nname: axiom-"),
                  "Invalid skill frontmatter: " + p)
    for agent in catalogue["agents"]:
        definition = agent["definition"].lstrip("/")
        check((ROOT / definition).is_file(), "Missing agent: " + definition)
        check(definition in seen_src, "Unexported agent: " + definition)
    check(catalogue["pluginPackage"]["chatgptImportSupported"] is False,
          "Offline ZIP incorrectly claims direct ChatGPT install support")
    js = list((ROOT / "assets/js").glob("*.js"))
    check(bool(js), "Missing JavaScript files")
    for f in js:
        content = f.read_text(encoding="utf-8")
        for forbidden in (r"\beval\s*\(", r"\bnew\s+Function\s*\(", r"\.innerHTML\s*=",
                          r"\b(?:localStorage|sessionStorage|document\.cookie|sendBeacon)\b"):
            check(not re.search(forbidden, content), "Risky browser primitive in " + f.name + ": " + forbidden)
        check(not re.search(r"\bfetch\s*\(\s*['\"']https?://", content),
              "Off-origin fetch found: " + f.name)
    secret_patterns = {
        "GitHub token": r"\b(?:ghp_|gho_|ghu_|ghs_|github_pat_)[A-Za-z0-9_]{25,}\b",
        "AWS access key": r"\bAKIA[0-9A-Z]{16}\b",
        "OpenAI token": r"\bsk-[A-Za-z0-9]{28,}\b",
        "PEM private key": r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
    }
    for f in [ROOT / "index.html", ROOT / "axiom-orchestrator.md", *js]:
        data = f.read_text(encoding="utf-8")
        for name, pattern in secret_patterns.items():
            check(not re.search(pattern, data), name + " in " + f.relative_to(ROOT).as_posix())
    css = (ROOT / "assets/css/styles.css").read_text(encoding="utf-8")
    check("@media(max-width:760px)" in css, "Responsive breakpoint missing")
    check(not re.search(r"@import\s+url\s*\(\s*['\"]?https?://", css),
          "Remote CSS import breaks local-first")
    print("Static checks: assets, links, anchors, favicon XML, CSP, plan-agnostic manifest, 30 skills, 12 agents, path traversal patterns, JS sinks and secret signatures")
    for message in WARNINGS:
        print("WARN: " + message)
    for message in ERRORS:
        print("FAIL: " + message)
    if ERRORS:
        print("STATIC AUDIT FAILED:", len(ERRORS), "finding(s)")
        return 1
    print("STATIC AUDIT PASS")
    return 0

if __name__ == "__main__":
    sys.exit(run())
