# Axiom Web V1.3 – Release- und Architekturentscheidungen

Datum: 13.10.2026  
Branch: `feat/axiom-web-v1.3` → nach bestandener CI nach `main` überführen.

## Funktionsumfang (implementiert)

- Unveränderter, serverloser HTML-/CSS-/Vanilla-JavaScript-Stack im JD-Design.
- Fünf Wizard-Schritte: ChatGPT/KI, Hardware mit primären Rollen, Betriebsart, Verwendungszwecke und optionale Integrationen, Ergebnis.
- Neun Verwendungszwecke; ausgewählte Zwecke priorisieren relevante Optionen in einem **statischen, versionierten Integrationskatalog**. Nichts wird automatisch verbunden oder aktiviert.
- Fünf Integrationsklassen: GitHub, Outlook E-Mail, Outlook Calendar, Remote Desktop Commander, Datei-/Serverintegration.
- Zwölf Agentenrollen im clientseitigen Router. Alle 30 Skill-Hauptdateien und ergänzende Referenzen/Skripte bleiben im ZIP erhalten; der Axiom-Orchestrator wird immer einbezogen, der Onboarding-Agent gehört zur Grundauswahl.
- JSON-Konfiguration V5 mit getrennten Zuständen `selected`, `configured`, `available`, `installed`, `connected`, `authorized`, `executable` und `verified`. Keine App gilt im Wizard als real verbunden.
- Markdown-Leitfaden und Offline-ZIP, das alle elf `agents/agent-*.md`, `axiom-orchestrator.md`, alle 30 Skills, unterstützende Dateien und die persönliche Konfiguration umfasst.

## Architekturentscheidungen

**ADR-01 – Statischer Provider-Katalog statt erfundener Live-Suche.**
GitHub Pages hat keine authentifizierte ChatGPT-Kontoverbindung, und für den Wizard gibt es keine belegte öffentliche Live-Plugin-API. Der Katalog ist bewusst `static-curated`, Stand 2026-10-13. Die verfügbaren Apps und installierte/verbundene Konten müssen im Zielkonto geprüft werden. Eine spätere Erweiterung fügt nur kuratierte Metadaten, Berechtigungen und Prüfschritte hinzu.

**ADR-02 – Rollen, Skills und technische Funktion strikt trennen.**
Agenten sind Zuweisungsregeln, Skills sind versionierte Arbeitsanweisungen, Connectoren sind separat autorisierte Daten-/Aktionszugänge, tatsächlich ausführbare Funktionen erfordern einen erfolgreichen Werkzeugtest. Das bloße Vorhandensein einer Markdown-Datei beweist weder Installation noch Ausführbarkeit.

**ADR-03 – Offline-Paket statt falschem ChatGPT-Installer.**
Das ZIP ist ein sicheres Archiv zur Dokumentation, nicht das offizielle Importformat eines Plugins, keine lauffähige MCP-Distribution und keine App. Als echte Alternativen sind Projektanweisungen/Projektdateien, individuell installierte ChatGPT-Plugins samt Autorisierung oder ein separat betriebener MCP-Server dokumentiert. Keine automatische Softwareinstallation, kein Schreibzugriff auf fremde Rechner.

**ADR-04 – Browserprivacy und ZIP-Sicherheit.**
Keine Cookies, Browser-Persistenz, Drittanbieter-CDNs oder Anwenderkonten; kein Versand des Wizard-Zustands. Beim ausdrücklich ausgelösten ZIP-Export werden öffentliche Quelldateien vom gleichen Ursprung geladen. Manifestpfade werden geprüft; Dateinamens-Eindeutigkeit, Katalogvollständigkeit (30 Skills, 12 Rollen), ZIP-Pfadtraversal und Größenlimits werden geprüft. Der Client gibt keinen unvollständigen Download als Erfolg aus. Der GitHub-Pages-Host kann übliche technische Abrufdaten verarbeiten.

## Prüfplan und reale Grenzen

- `node --test tests/*.test.cjs`: Node-Testmatrix zu Hardware, Rollen, Kombinationen, Verwendungszwecken, Integrationen, JSON/Markdown, ZIP-Dateien und Sicherheitsregeln.
- GitHub Actions: Syntaxprüfungen für Browser-JS und Tests sowie obige Node-Matrix.
- Browser-Smoke: `node tests/browser-smoke.cjs`, falls ein Chrome-/Chromium-Binary vorhanden ist. Führt im echten Browser Klicks durch die fünf Schritte aus, prüft Zuweisungen, mobile Breite, Tastaturfokus und Unterscheidung zwischen Konfiguration und Verbindung.
- Echte manuelle Tests auf weiteren Geräten, Betriebssystemen und assistiven Technologien sowie die Verbindung zu externen Konten sind **nicht** durchgeführt.
- Eine direkte Verifikation, ob die hier versionierten Skilltexte bytegleich zur aktuell installierten privaten Axiom-Plugin-Fassung sind, erfolgt **nicht**: Der Live-Inhalt dieser Plugin-Installation ist über dieses Repository nicht belegbar. Dateistruktur, Katalogreferenzen und ZIP-Vollständigkeit werden unabhängig davon geprüft.
- Die Installation der fünf genannten Plugins, OAuth-Kontoverbindungen, Schreibrechte, Remoteserver und MCP-Tools werden in diesen Tests **nicht** hergestellt oder verifiziert.

## Quellen und Nachprüfung

- [ChatGPT – Plugins](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt)
- [ChatGPT – verbundene Apps](https://help.openai.com/en/articles/11487775-connected-apps-in-chatgpt)
- [ChatGPT – Developer Mode / MCP](https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt)
- [Repository-Workflow](../.github/workflows/ci.yml)

Der Veröffentlichungsstatus wird **nach dem Merge** separat anhand der GitHub-Actions-Läufe, des Main-Branch-SHA und der öffentlichen Website verifiziert. Keine bloße CI-Konfiguration als ausgeführten Test ausgeben.

## Empfehlung für V1.4

Gezielter technischer Installer für **eine konkrete, nachweislich unterstützte Plattform** (z. B. reproduzierbares, signiertes Read-only-MCP-Demo mit gesonderter Freigabe) statt generischer Installationsversprechen. Zusätzlich manuelle Accessibility-Matrix und dokumentierte Tests gegen echte, freiwillig verbundene Integrationen. Keine Pflicht zur Datenübertragung an Drittdienste.
