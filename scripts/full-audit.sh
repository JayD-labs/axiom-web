#!/usr/bin/env bash
# AXIOM 🐸 – Full repository audit (macOS / Linux / WSL / Git Bash)
# Pure local by default. --live makes a handful of passive HTTPS GET/HEAD requests
# only to the owner's Axiom website. --zap is optional passive ZAP baseline.
set -Eeuo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LIVE=0
ZAP=0
for arg in "$@"; do
  case "$arg" in
    --live) LIVE=1 ;;
    --zap) LIVE=1; ZAP=1 ;;
    --help|-h)
      printf '%s\n' "Usage: bash scripts/full-audit.sh [--live] [--zap]" \
        "Local: static security, links, manifest, favicon, unit/regression, Chrome, syntax." \
        "--live: only passive requests to https://axiom.jd-schuldt.de" \
        "--zap: optional ZAP baseline if its Docker image is ALREADY cached; not an active attack."
      exit 0 ;;
    *) printf 'Unknown option: %s\n' "$arg" >&2; exit 2 ;;
  esac
done

command -v git >/dev/null || { echo "ERROR: git missing"; exit 2; }
command -v node >/dev/null || { echo "ERROR: Node.js 22+ required"; exit 2; }
command -v python3 >/dev/null || { echo "ERROR: python3 missing"; exit 2; }
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 22 ]; then echo "ERROR: Node.js >=22 required"; exit 2; fi

LOG_DIR="$(mktemp -d)"
PASS=0
FAIL=0
SKIP=0
INDEX=0
SUMMARY="$LOG_DIR/summary.txt"
: > "$SUMMARY"
printf '\n🐸 Axiom Web comprehensive audit\n'
printf 'Repository: %s\n' "$(git remote get-url origin 2>/dev/null || echo 'unknown')"
printf 'Commit: %s\n' "$(git rev-parse HEAD)"
printf 'Branch: %s\n' "$(git branch --show-current)"
printf 'Logs: %s\n\n' "$LOG_DIR"

run() {
  label="$1"; shift
  INDEX=$((INDEX+1))
  log="$LOG_DIR/$(printf '%02d' "$INDEX").log"
  printf '▶ %s\n' "$label"
  if "$@" > "$log" 2>&1; then
    PASS=$((PASS+1))
    printf '  PASS: %s\n' "$label"
    printf 'PASS  %s\n' "$label" >> "$SUMMARY"
    tail -n 3 "$log" | sed 's/^/    /'
  else
    FAIL=$((FAIL+1))
    printf '  FAIL: %s (details: %s)\n' "$label" "$log"
    printf 'FAIL  %s\n' "$label" >> "$SUMMARY"
    tail -n 15 "$log" | sed 's/^/    /'
  fi
}
skip() {
  SKIP=$((SKIP+1))
  printf '  SKIP: %s\n' "$1"
  printf 'SKIP  %s\n' "$1" >> "$SUMMARY"
}
run "Syntax: all JS/CJS" bash -c '
  set -euo pipefail
  while IFS= read -r -d "" file; do node --check "$file"; done < <(find assets/js tests -type f \( -name "*.js" -o -name "*.cjs" \) -print0)
'
run "Python syntax: all skill scripts and audit" python3 -c '
import pathlib
for item in list(pathlib.Path("assets/axiom/skills").rglob("*.py")) + list(pathlib.Path("scripts").glob("*.py")):
    compile(item.read_bytes(),str(item),"exec")
print("Python syntax OK")
'
run "Static security, dependencies, links, favicon and 30/12 manifest" python3 scripts/static-audit.py
run "All unit, compatibility, export and malicious-input tests" node --test tests/wizard.test.cjs tests/wizard-export-ui.test.cjs tests/agent-catalogue.test.cjs tests/zip-package.test.cjs tests/security-audit.test.cjs

if command -v google-chrome >/dev/null || command -v chromium >/dev/null ||
   command -v chromium-browser >/dev/null || { [ -n "$CHROME_BIN" ] && command -v "$CHROME_BIN" >/dev/null; }; then
  run "Real Chromium: five-step wizard, mobile viewport, focus, favicon" node tests/browser-smoke.cjs
else
  skip "Real Chromium browser test (no local Chrome/Chromium binary)"
fi

if command -v shellcheck >/dev/null; then
  run "ShellCheck: audit Bash script" shellcheck scripts/full-audit.sh
else
  skip "ShellCheck (not installed; no auto-install)"
fi

if command -v gitleaks >/dev/null; then
  run "Gitleaks: redact current working tree" gitleaks dir --redact --no-banner .
else
  skip "Gitleaks deeper secrets scan (not installed; built-in signatures were checked)"
fi

if [ "$LIVE" -eq 1 ]; then
  if ! command -v curl >/dev/null; then
    skip "Passive live HTTPS check (curl missing)"
  else
    run "Public HTTPS document (passive, Axiom domain only)" \
      curl --proto '=https' --max-redirs 0 -fsS --max-time 20 \
        -D "$LOG_DIR/live-headers.txt" -o "$LOG_DIR/live-index.html" \
        https://axiom.jd-schuldt.de/
    run "Public favicon HTTPS document (passive, Axiom domain only)" \
      curl --proto '=https' --max-redirs 0 -fsS --max-time 20 \
        -o "$LOG_DIR/live-favicon.svg" \
        https://axiom.jd-schuldt.de/assets/favicon.svg
    if [ -s "$LOG_DIR/live-index.html" ]; then
      run "Live HTML favicon reference" grep -F 'rel="icon" type="image/svg+xml"' "$LOG_DIR/live-index.html"
      run "Live HTML matches Free/Plus/Pro wizard scope" grep -F 'ChatGPT Free, Plus und Pro' "$LOG_DIR/live-index.html"
    fi
    if [ -s "$LOG_DIR/live-favicon.svg" ]; then
      run "Deployed favicon matches local Git revision" cmp assets/favicon.svg "$LOG_DIR/live-favicon.svg"
    fi
    if [ -s "$LOG_DIR/live-headers.txt" ]; then
      echo "  INFO: Public response headers saved (CSP may be declared in HTML meta)."
      for header in strict-transport-security x-content-type-options referrer-policy; do
        if ! grep -iq "^$header:" "$LOG_DIR/live-headers.txt"; then
          echo "  INFO: HTTP header '$header' not observed; GitHub Pages response headers may be outside repository control."
        fi
      done
    fi
  fi
else
  skip "Passive public HTTPS / favicon deployment check (enable with --live)"
fi

if [ "$ZAP" -eq 1 ]; then
  if command -v docker >/dev/null && docker image inspect ghcr.io/zaproxy/zaproxy:stable >/dev/null 2>&1; then
    echo "  Passive ZAP baseline only; no active scan or exploit payloads."
    run "OWASP ZAP passive baseline on the authorized Axiom site" \
      docker run --rm --pull=never --user "$(id -u):$(id -g)" \
        -v "$LOG_DIR:/zap/wrk:rw" ghcr.io/zaproxy/zaproxy:stable \
        zap-baseline.py -t https://axiom.jd-schuldt.de -m 1 -r zap.html -J zap.json
  else
    skip "OWASP ZAP (Docker not available or ZAP image not already cached; no auto-pull)"
  fi
fi
printf '\n================ AXIOM AUDIT REPORT ================\n'
cat "$SUMMARY"
printf 'PASS=%d  FAIL=%d  SKIP=%d\n' "$PASS" "$FAIL" "$SKIP"
printf 'Full audit logs: %s\n' "$LOG_DIR"
if [ "$FAIL" -gt 0 ]; then
  printf 'RESULT: FAIL — see logs, do not call release verified.\n'
  exit 1
fi
printf 'RESULT: PASS FOR EXECUTED CHECKS (skipped checks were NOT verified).\n'
