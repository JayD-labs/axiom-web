# Axiom Web V1.4 – ChatGPT Integration & Release Synchronisation

Datum: 13.10.2026 · Branch: `feat/axiom-web-v1.4-chatgpt-integration` · Plugin-Identität bleibt `plugins_6ac20240c4e8819187df516f832859bd`.

## Lieferumfang

- 14 echte Fach-Agenten-Referenzen aus der privaten Plugin-Release 2.2.0, inkl. Auth, Automation, Career, Project Manager und Research; 30 vollständige Skills (25 exakt, 5 nur Whitespace).
- Deterministisches Routing in Website/Export ohne eigenständige Agentenprozesse; System-Skills sind separat klassifiziert.
- ChatGPT-Onboarding über Plugin Directory / Plugin Creator; private Plugin-Zugriffsberechtigungen und externe App-Autorisierung werden nicht vorgetäuscht.
- Export `axiom-setup-v1.4.json`, `axiom-setup-v1.4.md`, `axiom-setup-v1.4.zip`; ZIP bleibt Dokumentation, kein installierbares Plugin.
- JSON `schemaVersion: 6`, Kompatibilitätsmatrix Free/Plus/Pro; Self-Hosted ist unverbindliche Vorschau.

## Sicherheitsmodell

`selected → installed → connected → authorized → executable → verified` ist **keine automatische Zustandsmaschine**. Die Website kennt nur den Zustand `selected`. Alle übrigen Werte bleiben `unverified`, bis im jeweiligen Konto ein echter lesender Test samt Freigabe vorliegt. Keine Credentials werden exportiert. Read-only-Tests dürfen weder Provider noch lokale Dateien verändern.

## Nachweisgrenzen und Abnahme

- GitHub-Commit, PR, Workflow-Status und Pages-Deployment werden erst nach tatsächlichem Abruf als erfolgreich berichtet.
- Browser-Tests der CI sind abhängig von verfügbarer Browserinstallation. Ein SKIP ist kein PASS für Mobile/Accessibility.
- Das private Plugin ist nicht öffentlich installierbar; Plugin-Creator-Änderung nur nach geprüftem Archiv und identitätserhaltendem Update.
- Die Plugin-/Connector-Verfügbarkeit für fremde Konten sowie UI-Installation kann die statische Website technisch nicht prüfen.

Offizielle Quelle: https://help.openai.com/en/articles/20001256-plugins-in-chatgpt
