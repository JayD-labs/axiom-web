# Axiom 🐸 Web

**YOUR AI. YOUR TOOLS. YOUR DATA.**

[Axiom Web öffnen](https://axiom.jd-schuldt.de) · [GitHub-Repository](https://github.com/JayD-labs/axiom-web)

Axiom Web ist die öffentliche Projektwebsite von **Axiom 🐸**, einem modular gedachten persönlichen KI-Assistenten. Der integrierte **Setup Wizard V1.3** hilft Besucherinnen und Besuchern, aus ihrem ChatGPT-/KI-Zugang, ihrer vorhandenen Hardware, der gewünschten Betriebsart und dem gewünschten Verwendungszweck passende, bewusst separat zu autorisierende Integrationen sowie eine individuelle Einrichtungsanleitung zusammenzustellen.

> **Projektstatus (Oktober 2026):** Website und Wizard sind verfügbar. Ein für alle öffentlich installierbares Axiom-Plugin, ein Axiom-Installer und eine vollständige eigenständige Axiom-KI sind **noch nicht veröffentlicht**. Der Wizard installiert keine Software und stellt keine Verbindungen selbst her.

## Inhaltsverzeichnis

- [Funktionsumfang](#funktionsumfang)
- [Setup Wizard V1.3](#setup-wizard-v13)
- [Axiom Agents & Skills V1.3](#axiom-agents--skills-v13)
- [Kompatibilitätsprüfung](#kompatibilitätsprüfung)
- [Ergebnis und Export](#ergebnis-und-export)
- [Projektarchitektur](#projektarchitektur)
- [Lokal starten](#lokal-starten)
- [Datenschutz und Sicherheit](#datenschutz-und-sicherheit)
- [Tests und Qualitätssicherung](#tests-und-qualitätssicherung)
- [Projektstatus und Roadmap](#projektstatus-und-roadmap)
- [Mitwirken und Lizenz](#mitwirken-und-lizenz)

## Funktionsumfang

- Statische, responsive Projektwebsite auf Basis von HTML, CSS und Vanilla JavaScript.
- Fünfstufiger Setup Wizard mit Fortschrittsanzeige und Zurück-/Weiter-Navigation.
- Kontextabhängige Erklärungen zu KI-Plan, Hardware und Betriebsart.
- **Hardware-Mehrfachauswahl**, einschließlich gerätebezogener Voraussetzungen und Schritte.
- Bedarfsorientierte Verwendungszwecke mit kuratierten Integrationsvorschlägen (kein Live-App-Verzeichnis).
- Mehrfachauswahl für Integrationen mit Berechtigungen, Datenschutzfolgen und Read-only-Tests.
- Regelbasierte Kompatibilitätsprüfung mit Blockaden, Bedingungen und Warnungen.
- Individuelle Anleitung mit Software, Netzwerk, Sicherheit, Testfragen und Hinweisen auf nicht verfügbare Funktionen.
- **Lokaler JSON- und Markdown-Export** nach explizitem Klick.
- Bestehendes dunkles **JD Design System** mit responsiven Auswahlkarten und Fokus-Styling.

## Setup Wizard V1.3

Auf der Website **„Axiom einrichten“** auswählen und die fünf Schritte durchgehen.

### Schritt 1 — KI / ChatGPT

Jeweils **eine** Option:

| Auswahl | Einordnung |
| --- | --- |
| ChatGPT Free | Einstieg über tatsächlich angebotene Apps/Plugins, unter Berücksichtigung von Konto-Limits |
| ChatGPT Plus | ChatGPT-Apps und ggf. unterstützte Remote-Connectoren, soweit freigegeben |
| ChatGPT Pro | Zusätzliche eigene MCP-App-Möglichkeiten im verfügbaren Developer Mode; die Regeln unterscheiden Lese- und Schreibrechte |
| Self-Hosted (Preview) | Lokales LLM auf eigener Hardware, separater KI-Client und optionale MCP-Tools; noch kein Installer |

| Ohne ChatGPT | Eigener MCP-fähiger KI-Client mit lokalem oder externem Modell |

**Wichtig:** Der konkrete Funktionsumfang hängt vom tatsächlich angebotenen Konto-/Workspace-Zugang ab. Ein Abonnement allein garantiert keine bestimmte App oder Verbindung.

### Schritt 2 — Hardware (Mehrfachauswahl)

Verfügbare Geräte können **gleichzeitig** ausgewählt werden:

- Keine eigene Hardware
- Raspberry Pi
- Mini-PC / Linux-Server
- NAS / Heimserver
- Windows-PC
- macOS
- Andere Infrastruktur

Beispiel: **Raspberry Pi + Mini-PC / Linux-Server + macOS**.

**Sonderregel:** „Keine eigene Hardware“ ist exklusiv. Bei Auswahl eines konkreten Geräts wird „Keine eigene Hardware“ abgewählt. Bei Auswahl von „Keine eigene Hardware“ werden andere Geräte abgewählt. Wird das letzte konkrete Gerät abgewählt, gilt wieder „Keine eigene Hardware“.

Der Wizard erstellt für **jedes ausgewählte Gerät** eigene Hinweise zu Software, Voraussetzungen, Netzwerk, Serverbetrieb, möglichem lokalem LLM sowie Vorbereitungsschritten und, sofern definiert, Diagnosebefehlen. Für **jedes Gerät** wird genau **eine primäre Geräterolle** benötigt. Ohne Rolle erscheint eine Blockade und der Wizard verhindert das Weitergehen. Rollen erzeugen individuelle Voraussetzungen, Anleitungen und Tests; sie stellen keine automatische Verbindung her.

| Rolle | Voraussetzungen |
| --- | --- |
| Remote-Ziel / Connector | Erreichbares Gerät, kompatibler Connector, Testpfad, Minimalrechte |
| Eigener MCP-Server | Passende Runtime/Architektur und geschützter Transport |
| KI-Client / lokales Modell | MCP-fähiger Client, Modellquelle, ggf. RAM/VRAM |
| Dateien / NAS / Backup | Datentrennung, Wiederherstellungstest, Freigaberechte |
| Entwicklung / Verwaltung | Authentifizierter Adminzugang, SSH/VPN, Updates |
| Sonstige Aufgabe | Zweck und Zugriffsgrenzen individuell prüfen |

Beispiel: Raspberry Pi → MCP-Server; Mini-PC → Backup; macOS → Entwicklung.

### Schritt 3 — Betriebsart

| Betriebsart | Technischer Weg | Zusätzliche Voraussetzung |
| --- | --- | --- |
| **Axiom ChatGPT** | ChatGPT als KI-Oberfläche, autorisierte Apps/Plugins | Verfügbare Apps und zugehörige Dienstkonten |
| **Axiom Hybrid** | ChatGPT + eigene Hardware über unterstützten Remote-Connector | Erreichbares Zielgerät, Connector und erlaubte Zugriffe |
| **Eigener MCP-Server** | MCP-fähiger KI-Client nutzt Werkzeuge eines MCP-Servers | Geeigneter Client, Server, Transport und Berechtigungen |

Ein **MCP-Server stellt Werkzeuge bereit, ersetzt aber kein Sprachmodell**. Bei ChatGPT als Modell ist ein lokales LLM nicht erforderlich. Wer unabhängig von ChatGPT sein möchte, benötigt einen eigenen MCP-fähigen KI-Client und eine passende Modellquelle.

### Schritt 4 — Verwendungszwecke und ChatGPT-Apps/Plugins (Mehrfachauswahl)

Zunächst einen oder mehrere Aufgabenbereiche auswählen, z. B. Code, E-Mail, Kalender, Server, Dateien, Finanzen, Lernen, Design oder Recherche. Daraus entstehen **markierte Empfehlungen**, keine automatisch verbundenen Apps. Manuelle Mehrfachauswahl und Abwahl bleiben möglich.

Aktuell dokumentierte Optionen (statischer Katalog `2026-10-13`, **keine Live-Suche**):

| Integration | Beispiel | Worauf zu achten ist |
| --- | --- | --- |
| GitHub | Repository, Issues und Commits lesen | Repository-Freigaben; Schreiben gesondert autorisieren |
| Outlook E-Mail | Betreffzeilen oder relevante E-Mails lesen | Microsoft-Berechtigungen; Versand ist eine separate Aktion |
| Kalender | Nächste Termine abrufen | Kalender-Zugriff und Zeitzonen |
| Remote Desktop Commander / Server | Erlaubtes Testsystem lesend prüfen | Erreichbares Gerät, Connector, enge Datei-/Tool-Rechte |
| Datei- und Serverintegration | Freigegebenen Testordner lesen | Eigener MCP-Dateiserver oder tatsächlich verfügbare App, Path-Whitelist und Read-only-Zugriff |

Für jede ausgewählte App erscheinen Anleitungen und Testfragen passend zur Betriebsart. Die Auswahl bedeutet nicht, dass eine App installiert, im Konto verfügbar oder verbunden ist. Remote Desktop Commander bleibt als typische Hybrid-Option enthalten, aber nur soweit es für Konto und Zielsystem tatsächlich angeboten wird.

### Schritt 5 — Individuelle Anleitung

Das Ergebnis enthält:

1. Zusammenfassung der gewählten KI, **aller ausgewählten Geräte**, Betriebsart und Integrationen.
2. Kompatibilitätsstatus samt Bedingungen, Blockaden und Warnungen.
3. Hardware-, Netzwerk- und Software-Voraussetzungen.
4. Benötigte Apps/Connectoren bzw. MCP-Bausteine.
5. Nummerierte Einrichtungsschritte, **pro Hardware-Gerät separat**.
6. Berechtigungshinweise, Sicherheitsmaßnahmen und möglichst ungefährliche Lesetests.
7. Noch nicht öffentlich verfügbare Axiom-Funktionen.
8. Links zu weiterführender Dokumentation und lokale Export-Schaltflächen.

Zusätzlich ermittelt V1.3 aus Betriebsart, Verwendungszweck und App-Auswahl passende Axiom-Rollen und Skills. Der Onboarding-Agent gehört als Basisrolle zum Setup. Über alle Verwendungszwecke sind die **12** Rollen erreichbar. Diese Auswahl ist eine lokale, exportierbare Konfigurationsgrundlage und erstellt keine Tools oder Berechtigungen.

## Kompatibilitätsprüfung

Die Regel-Engine `buildGuide(config, catalogue)` in `assets/js/setup-wizard-data.js` bewertet die **Kombination aus sechs Dimensionen (Plan, Hardware, Geräterollen, Betriebsart, Verwendungszwecke, Integrationen)**.

| Interner Status | Anzeige | Bedeutung |
| --- | --- | --- |
| `supported` | Technisch geeignet | Keine den Regeln bekannte Blockade oder zusätzliche Bedingung |
| `conditional` | Unter Voraussetzungen möglich | Zugänge, Berechtigungen, Funktionen oder externe Voraussetzungen müssen geprüft werden |
| `blocked` | Nicht direkt unterstützt | Eine für diese Auswahl bekannte Blockade ist vorhanden |

Beispiele der implementierten Logik:

- **Plus + Raspberry Pi + Hybrid:** Bedingt möglich, wenn ein geeigneter Remote-Connector im Konto verfügbar und autorisiert ist.
- **Pro + eigener MCP-Server:** Developer Mode, erreichbarer Remote-MCP-Zugang und die derzeit vorgesehenen Grenzen für Schreibaktionen beachten.
- **Free/Plus + eigener Remote-MCP-Server über ChatGPT Developer Mode:** Nicht direkt als allgemeine Möglichkeit zusagen; Alternativen prüfen.
- **Business/Enterprise/Edu sowie eigener KI-Client:** im Wizard vorerst nicht auswählbar. Diese Varianten können später mit separater Prüfung ergänzt werden.
- **Ohne ChatGPT + eigener MCP-Server:** Anderen MCP-fähigen Client und passendes Modell einrichten; Axiom Independent ist noch keine vollständige Distribution.
- **Hybrid + keine eigene Hardware:** Blockiert, da ein Zielgerät fehlt.
- **Hybrid ohne Remote-Ziel-Rolle:** Blockiert, Rolle zuweisen.
- **Fehlende Geräterollen:** Blockiert und namentlich angezeigt.
- **MCP auf NAS / anderer Plattform:** Nur nach Prüfung von Runtime und Transport.

**Keine Erfolgsgarantie:** Ein Status „technisch geeignet“ bestätigt weder die Verfügbarkeit einer bestimmten App noch eine erfolgreiche Installation, Verbindung oder Freigabe. Externe Produktanforderungen können sich ändern.

### Wichtige technische Unterscheidungen

- **ChatGPT-Apps/Plugins** sind autorisierte externe Dienste bzw. Integrationen mit ihrem jeweils eigenen Berechtigungsmodell.
- **Remote-Connectoren** ermöglichen einen Zugriff auf unterstützte Zielsysteme, sind aber nicht automatisch identisch mit selbst erstellten MCP-Apps.
- **Developer Mode / eigene MCP-Apps** hängen von Plan, Workspace, Freigaben und unterstützten Aktionen ab.
- **Ein eigener MCP-Server** liefert Werkzeuge bzw. Ressourcen; ein Modell oder ein Client muss zusätzlich vorhanden sein.
- **Ein lokales LLM** ist nur nötig, wenn das Modell wirklich lokal betrieben werden soll, nicht für einen ChatGPT-basierten Hybrid-Zugriff.

## Ergebnis und Export

Der Wizard berechnet die Anleitung im Browser und lädt **nur auf ausdrücklichen Klick** eine Datei herunter:

| Dateiname | Inhalt |
| --- | --- |
| `axiom-setup-v1.3.json` | Auswahl, Kompatibilität, Hardware, Software, Connectoren, Rollen, Skills, Schritte, Sicherheitsmaßnahmen und Tests |
| `axiom-setup-v1.3.md` | Lesbare Markdown-Anleitung mit denselben thematischen Informationen |

Das aktuelle **JSON-Schema hat `schemaVersion: 5`**. Hardware wird als **Array** gespeichert, um mehrere Geräte zu unterstützen. Neu ist `agentPackage`: die lokal berechnete Rollen-/Skill-Auswahl.

```json
{
  "selection": {
    "plan": "plus",
    "hardware": ["pi", "linux", "mac"],
    "hardwareRoles": {"pi":"mcp","linux":"storage","mac":"admin"},
    "mode": "hybrid",
    "purposes": ["code", "server"],
    "integrations": ["github", "remote-desktop"]
  }
}
```

Geräterollen-IDs: `remote`, `mcp`, `client`, `storage`, `admin`, `other`. `selection.hardwareRoles` bildet Hardware-ID auf Rollen-ID ab. `hardware.assignments` enthält auch lesbare Namen. Anforderungen, Schritte und Kompatibilität berücksichtigen die Rollen. Alte V1.0-Schema-Exporte (2) besitzen keine Geräterollen.

Dies zeigt **nur den Ausschnitt `selection`** und kein vollständiges Exportbeispiel. Die Auswahl enthält keine Zugangsdaten und weist keine Verbindung als erfolgreich aus. `integrationRequirements` unterscheidet `selected`, `configured`, `available`, `installed`, `connected`, `authorized`, `executable` und `verified`. Eine Auswahl setzt nur `selected: true`; alle weiteren Schritte bleiben unbestätigt. `installation.chatgptZipImportSupported` ist immer `false`.

## Axiom Agents & Skills V1.3

| Begriff | Bedeutung in Axiom Web |
| --- | --- |
| Agentenrolle | Zuständigkeit, Übergaben und Grenzen für einen Aufgabenbereich |
| Markdown-Anweisung | Lesbare Arbeitsregel; führt selbst keinen Code aus |
| Skill | Versionierte, wiederverwendbare Instruktion mit Aktivierung und Sicherheitsgrenzen |
| MCP-Tool / Connector | Technische Fähigkeit eines externen, tatsächlich verbundenen Systems; nicht Teil dieses Exports |

Der zentrale Katalog [`assets/axiom/catalogue.json`](assets/axiom/catalogue.json) enthält **12 Agentenrollen** und das vollständige **30-Skill-Inventar** des Axiom-Plugins. Der Browser verwendet nur die deterministischen Auswahlregeln in `assets/js/agent-catalogue.js`; er lädt keine Katalogdaten nach und verbindet nichts.

| Agent | Verwendete Skills |
| --- | --- |
| Axiom Orchestrator | Orchestrator, Actions, Capabilities, Runtime, Settings, State, Verification, Workflows |
| Brain | Brain, Documents, Contacts |
| Code | Code, Project Manager, Research |
| Security | Security, Auth, Connectors, Connect |
| Design | Design |
| Mail | Mail, Notifications |
| Calendar | Calendar, Automation |
| Finance | Finance |
| Infrastructure | Infrastructure, Maintenance |
| Learning | Learning, Career |
| Health | Health |
| Onboarding | Onboarding |

Die Skillmatrix steht in [`assets/axiom/skills.md`](assets/axiom/skills.md), die Agentendefinitionen in `assets/axiom/agents/` und die dauerhafte Hauptchat-/Arbeitschat-Regel in [`axiom-orchestrator.md`](axiom-orchestrator.md).

### Neuen Agenten oder Skill ergänzen

1. Eindeutige, kleingeschriebene ID im Katalog anlegen (`axiom-…` für Skills).
2. Zweck, Aktivierung, Sicherheitsgrenzen und Ausführungsmodell dokumentieren.
3. Bei Agenten eine Markdown-Definition ergänzen und nur bekannte Skill-IDs zuordnen.
4. Für eine automatische Wizard-Auswahl die Regel in `assets/js/agent-catalogue.js` ergänzen.
5. Tests aktualisieren und ausführen. Keine Tool-, Connector- oder Installationsbehauptung ohne reale Integration hinzufügen.

### Vollständiger Offline-ZIP-Export

Im fünften Wizard-Schritt kann man **`axiom-setup-v1.3.zip`** herunterladen. Das Paket enthält tatsächlich:
- **30 originale Skill-Hauptdateien** (`skills/axiom-*/SKILL.md`) aus dem Axiom-Plugin.
- **12 Agentendefinitionen** (Orchestrator plus 11 Fach-Agenten).
- Die Referenz-Markdown-Dateien des Orchestrators, Capability-/Action-Policies und kleine Hilfsskripte aus den Skills.
- `setup.md`, `setup.json` und `package-files.json` sowie einen Paket-README.

Quelle: `assets/axiom/export-manifest.json` listet jede erlaubte öffentliche Datei und ihren ZIP-Zielpfad. Der Wizard lädt diese Dateien **erst beim ZIP-Klick über dieselbe Website** und erstellt ohne CDN und ohne externen ZIP-Service ein UTF-8-ZIP mit CRC32 lokal im Browser. Fehlende Dateien brechen den Export vollständig ab. Die Auswahl bleibt im lokalen Arbeitsspeicher, sie wird nicht hochgeladen.

Alle 30 Skills sind bewusst enthalten, auch wenn für die gewählte Betriebsart im Konfigurationsleitfaden nur bestimmte Rollen vorgeschlagen werden. Fachrollen sind Anweisungen, keine unabhängigen Agentenprozesse; Referenzskripte werden nicht automatisch ausgeführt. Installationsskripte für Pi/Bridge werden bewusst **nicht** eingepackt.

**Wichtig:** Dies ist ein Axiom-eigenes Offline-Paket, kein direkt installierbares ChatGPT-App- oder Plugin-Manifest. Es richtet keine Drittanbieter-Connectoren, MCP-Server, OAuth-Verbindungen oder Rechte ein. `plugin-package.schema.json` dokumentiert weiterhin einen gesonderten, nicht implementierten Importentwurf.


### Installation ≠ Konfiguration (V1.3)

Der Offline-Export ist **kein** ChatGPT-Plugin-Installer. Er enthält 30 versionierte Skill-Anweisungen, 12 Rollendefinitionen mit Orchestrator, Referenzen, Beispielskripte sowie `setup.json` und `setup.md`. Für die tatsächliche Verwendung sind getrennte manuelle Schritte nötig:

1. **Anweisungen:** Eine ChatGPT-Projektanweisung übernehmen und die relevanten Quelldateien entsprechend Upload-Limits bereitstellen. Dies ist keine Plugin-Installation; vorhandene Skills werden nicht automatisch als ausführbare ChatGPT-Skills registriert.
2. **Plugin/App:** Im ChatGPT-Plugin-Verzeichnis oder unter **Einstellungen → Plugins** nach einer offiziell angebotenen App suchen. Nur beim konkret verfügbaren Angebot Installieren/Verbinden auswählen und die angefragten Rechte prüfen.
3. **Eigenes MCP:** Falls der gewählte Plan es erlaubt, einen separaten MCP-Server sicher betreiben und als Custom App registrieren. Das ZIP enthält keinen lauffähigen MCP-Server, Tunnel oder Credentials.
4. **Verifikation:** Im Zielkonto lesenden Test ausführen. Erst danach `connected/authorized/verified` belegen – der Wizard aktualisiert keinen Live-Status und speichert die Auswahl nicht.

Es gibt **keine öffentliche, authentifizierte Plugin-Verzeichnis-API für dieses statische GitHub-Pages-Portal**. Der Katalog enthält nur manuell kuratierte Optionen; deren Installation, Verfügbarkeit, Fähigkeiten und Datenschutz müssen im jeweiligen Konto und beim Anbieter geprüft werden. Der Katalog kann später durch geprüfte, versionierte Ergänzungen erweitert werden. Ein Backend oder API-Schlüssel wäre erst für eine bewusst neu entworfene Live-Abfrage zu rechtfertigen.

**Quellen (13.10.2026):** [OpenAI – Plugins in ChatGPT](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt), [verbundene Apps](https://help.openai.com/en/articles/11487775-connected-apps-in-chatgpt), [Developer Mode / eigene MCP-Apps](https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt).

**Datenschutz:** Die Wizard-Auswahl verbleibt im flüchtigen Browserzustand. Erst ein vom Nutzer geklickter ZIP-Export lädt versionierte Dateien von der *gleichen Herkunft* nach. Keine Datenübertragung an einen Drittanbieter durch den Wizard. GitHub Pages selbst verarbeitet technische Abrufdaten; gewählte spätere Connectoren können eigene Datenflüsse verursachen. Keine Tokens, Secrets, OAuth-Verbindungen oder Datenquellen im Export.

## Browser-Favicon und Einsteiger-Scope

Das eigenständige, dunkelgrüne **Frosch-Favicon** liegt unter [`assets/favicon.svg`](assets/favicon.svg) und ist im `<head>` von `index.html` als SVG-Favicon registriert. Der Browser braucht keine externe Icon-Bibliothek und keinen CDN-Abruf. Falls vorher die graue Weltkugel im Browser-Tab stand, die Seite nach dem Release einmal hart neu laden bzw. den Favicon-Cache leeren.

Der Wizard bietet **Free, Plus, Pro und Self-Hosted (lokales LLM, Vorschau)** als vier KI-Optionen an. Business, Enterprise und Edu bleiben zurückgestellt. Self-Hosted benötigt zwingend eigene Hardware und verwendet den Weg „Eigener MCP-Server“, keine ChatGPT-Plugins. Es gibt noch keinen Axiom-Installer für LLM, Runtime, Client oder Server. Die drei Betriebsarten ChatGPT, Hybrid und eigener MCP-Server bleiben grundsätzlich erhalten, wobei Free/Plus bei eigener MCP-Anbindung explizite Kompatibilitätsgrenzen anzeigen.

## Vollständiger Repository-Audit (lokal und optional live)

Das vollständige Audit unter [`scripts/full-audit.sh`](scripts/full-audit.sh) startet **ohne zusätzliche Installation**:
- Syntaxchecks für JavaScript/CJS und Python-Skripte.
- Node-Tests für Wizard, Hardware, Pläne, Rollen, Skills, ZIP, Export, fehlerhafte und bösartige Eingaben.
- Statische Prüfung von HTML-Links, Ankern, CSP, SVG-Favicon, ZIP-Manifestpfaden, Assets, 30 Skills, 12 Rollen, dynamischen JS-Sinks und häufigen Secret-Signaturen.
- Falls Chrome/Chromium vorhanden: echter Headless-Browser-Smoke inklusive Favicon, Fünf-Schritt-Navigation, 375px-Layout und Tastaturfokus.
- Falls installiert: ShellCheck und Gitleaks als zusätzliche Scanner.
- Nur mit `--live`: ein paar **passive** HTTPS-Anfragen ausschließlich an die Axiom-Website und Abgleich des ausgerollten Favicons.
- Nur mit `--zap`: optionale **passive** OWASP-ZAP-Baseline, **ausschließlich wenn das Docker-Image bereits lokal vorliegt**. Kein Docker-Pull, kein aggressiver Scan, keine automatische Installation.

```bash
git clone --depth 1 https://github.com/JayD-labs/axiom-web.git
cd axiom-web
bash scripts/full-audit.sh --live
```

Ergebnis: PASS / FAIL / SKIP pro Prüfung sowie detaillierte Logs im ausgegebenen temporären Verzeichnis. Ein übersprungener Scanner ist ausdrücklich **nicht** als bestanden zu interpretieren. Dies ersetzt **kein** professionelles Pentest-Mandat und führt keine Angriffstests gegen GitHub, ChatGPT oder andere Drittanbieter durch.

## Projektarchitektur

Axiom Web ist eine **statische Website** ohne erforderliches Backend, Nutzerdatenbank oder Build-Tool.

```text
axiom-web/
├── CNAME
├── index.html
└── assets/
    ├── axiom/
    │   ├── agents/              # Versionierte Rollenbeschreibungen
    │   ├── catalogue.json       # Maschinenlesbare 12 Rollen / 30 Skills
    │   ├── skills.md            # Lesbare Skillmatrix
    │   ├── skills/              # 30 SKILL.md + Referenzen/Skripte
    │   ├── export-manifest.json # 92 öffentliche Paketdateien
    │   └── plugin-package.schema.json
    ├── css/
    │   ├── jd-design-tokens.css
    │   └── styles.css
    └── js/
        ├── setup-content.js
        ├── agent-catalogue.js   # Lokale Rollen-/Skill-Auswahl
        ├── setup-wizard-data.js
        ├── setup-export.js
        └── setup.js
├── tests/
│   ├── agent-catalogue.test.cjs
│   └── wizard.test.cjs
├── axiom-orchestrator.md
└── .github/workflows/
    └── ci.yml
```

| Datei | Verantwortung |
| --- | --- |
| `index.html` | Seitenstruktur, Wizard-Stufen, Eingaben und Ergebnisbereiche |
| `assets/css/jd-design-tokens.css` | Gemeinsame JD-Farb-, Fokus- und Design-Tokens |
| `assets/css/styles.css` | Seitendesign, Auswahlkarten, responsive Darstellung |
| `assets/js/setup-content.js` | ChatGPT-Pläne, Betriebsarten, Integrations- und Kombinationstexte (`window.AxiomGuide`) |
| `assets/js/agent-catalogue.js` | Lokale Regelauflösung Betriebsart/App → Rollen und Skills |
| `assets/js/setup-wizard-data.js` | Hardware-Daten, Kompatibilitätsprüfung und Leitfadenerzeugung (`window.AxiomWizardRules`) |
| `assets/js/setup-export.js` | Lokaler JSON-, Markdown- und vollständiger ZIP-Export (CRC32, ohne externe Bibliothek) |
| `assets/js/setup.js` | Browserzustand, Geräterollen, Navigation und Download |
| `assets/axiom/catalogue.json` | Versioniertes, maschinenlesbares Agenten-/Skill-Inventar |
| `CNAME` | Custom Domain für GitHub Pages |

**Datenfluss:**

```text
Auswahl im Wizard
       ↓
Lokaler Zustand in setup.js
       ↓
buildGuide(config, catalogue)
       ↓
Kompatibilitätsprüfung + Anleitung
       ↓
Anzeige im Browser
       ↓ (optional, erst nach Klick)
JSON- / Markdown-Download
```

Die JavaScript-Dateien müssen in dieser Reihenfolge geladen werden: **`setup-content.js` → `agent-catalogue.js` → `setup-wizard-data.js` → `setup-export.js` → `setup.js`**. Die JD-Design-Tokens bleiben die Grundlage der CSS-Farben.

## Lokal starten

Erforderlich sind Git und ein aktueller Browser. Python 3 ist ein einfacher optionaler Weg, einen lokalen Webserver zu starten:

```bash
git clone https://github.com/JayD-labs/axiom-web.git
cd axiom-web
python3 -m http.server 8000
```

Danach im Browser **http://127.0.0.1:8000** öffnen; mit `Ctrl+C` beenden.

Es gibt **keinen npm-Installationsschritt, keine notwendigen API-Schlüssel und keine fremden CDNs**. Die öffentliche Seite wird per GitHub Pages unter der eigenen Domain bereitgestellt.

Für eine optionale JavaScript-Syntaxprüfung, falls Node.js vorhanden ist:

```bash
node --check assets/js/setup-content.js
node --check assets/js/agent-catalogue.js
node --check assets/js/setup-wizard-data.js
node --check assets/js/setup-export.js
node --check assets/js/setup.js
node --test tests/*.test.cjs
```

## Datenschutz und Sicherheit

Der Setup Wizard folgt einem **Local-first-Prinzip**:

- Keine Axiom-Web-Registrierung und keine Axiom-Nutzerdatenbank.
- Keine Analytics, Tracking-Skripte oder Cookies für die Auswahl.
- Keine Speicherung der Auswahl in `localStorage` oder `sessionStorage`.
- Keine Übertragung von Wizard-Eingaben an Axiom oder andere Server.
- Berechnung und Anzeige erfolgen im lokalen JavaScript.
- Keine fremden CDNs; CSS und JavaScript werden aus der Website ausgeliefert.
- Kein automatisches Verbinden von Apps, keine Ausführung von Installationen und kein verdeckter Schreibzugriff.
- Agenten-/Skill-Auswahl rein lokal; keine Profile, Prompts oder Konfigurationen an Axiom übertragen.
- Lokaler Export nur bei aktivem Klick.
- Zugangsdaten, Tokens oder Secrets niemals in öffentliches Git oder JSON/Markdown-Exporte eintragen.

Die HTML-Seite setzt eine restriktive **Content Security Policy**, darunter `connect-src 'self'` für beim ZIP-Klick angeforderte gleichherkunftige Dateien.

**Transparenz:** Der Hostinganbieter **GitHub Pages** verarbeitet beim Seitenaufruf technisch notwendige Verbindungsdaten. Wer freiwillig ChatGPT, GitHub, Microsoft oder andere externe Apps verwendet, unterliegt zusätzlich deren Bedingungen. Die Website überträgt die Wizard-Auswahl nicht automatisch an diese Dienste.

Für reale Integrationen empfehlen sich **Minimalberechtigungen**, reine Lesetests, getrennte Benutzerkonten, sichere Secret-Verwaltung, Updates und Backups vor Änderungen.

## Tests und Qualitätssicherung

### Automatisiert ohne npm-Dependencies

Node.js 22, ausschließlich eingebaute Module `node:test`, `node:vm`, `node:assert` und `node:fs`.

```bash
node --check assets/js/setup-content.js
node --check assets/js/agent-catalogue.js
node --check assets/js/setup-wizard-data.js
node --check assets/js/setup-export.js
node --check assets/js/setup.js
node --check tests/wizard.test.cjs
node --test tests/*.test.cjs
```

Die Tests prüfen die drei unterstützten ChatGPT-Pläne, alle 64 gültigen Hardwareauswahlen (inklusive `none`), jede der sechs Rollen für alle sechs konkreten Geräte, fehlende Rollen, ungültige Eingaben, nicht unterstützte Konfigurationen, JSON/Markdown, Sicherheitsbedingungen und statische HTML/CSS-/Fokusanbindungen. Zusätzlich prüfen sie das vollständige 30-Skill-Inventar, eindeutige IDs, Agent-zu-Skill-Zuordnungen, fehlende Agentendateien, ungültige Rollenauflösung und die secret-freie, ausdrücklich nicht importierbare Paketgrundlage.
**Matrix:** 24.576 Kombinationen = 64 Hardwareauswahlen × 4 KI-Optionen × 3 Betriebsarten × 32 Integrationsauswahlen. Verwendungszwecke und Lebenszykluszustände werden separat getestet.

**Regressionstest für die Exporte:** `tests/wizard-export-ui.test.cjs` simuliert DOM-Eingaben, Zurück-/Weiter-Navigation und die echten JSON-/Markdown-Download-Handler für Plus + Raspberry Pi + macOS + Hybrid + GitHub. Sichtbare Zusammenfassung und Status werden mit beiden exportierten Dateien verglichen. Zusätzlich wird die exklusive Hardwareauswahl `none` geprüft. Der Test nutzt eine kleine DOM-Simulation, **keinen echten Browser**.

### GitHub Actions

`.github/workflows/ci.yml` läuft bei **Push und Pull Request** mit `ubuntu-latest`, Node.js 22 sowie `actions/checkout` und `actions/setup-node`. Geprüft werden Syntax, Regelwerk, Rollen, Exporte und Hardwarematrix. Keine Secrets oder externen Laufzeitbibliotheken.

### Browser- und Accessibility-Prüfung

Der Headless-Chromium-Smoke wurde in CI ausgeführt; er prüft Navigation, 375px-Layout, Tastaturfokus und Favicon. **Weitere echte Browser-/Screenreader- und Kontrastmessungen auf verschiedenen Geräten stehen noch aus.**

- [ ] Desktop (ca. 1440px), Tablet (768px) und Smartphone (375px) ohne horizontales Überlaufen.
- [ ] Tab/Shift+Tab erreicht Karten, Rollenauswahl, Navigation und Exportbuttons.
- [ ] Fehlende Rolle: gut sichtbare Live-Meldung, `aria-invalid`, Fokus auf dem ersten offenen Rollenfeld.
- [ ] Labels und Hinweise der Selects sind eindeutig; Status/Progress (1 bis 5) und Fokus nach Weiter/Zurück korrekt.
- [ ] Exklusivität von „Keine eigene Hardware“, Entfernen alter Rollen und Beibehalten vorhandener Rollen prüfen.
- [ ] JSON- und Markdown-Dateien sind per Klick herunterladbar; kein automatischer Download.

**Grenzen:** Der Wizard prüft keine echten Workspace-Berechtigungen, laufende Systeme, Kontoangebote oder RAM/VRAM. Verfügbarkeit einzelner Apps und Plattformpakete ist nachzuprüfen. Es wird keine Installation oder Verbindung durchgeführt oder bestätigt.

## Projektstatus und Roadmap

**Bereits umgesetzt:** Projektwebsite, Setup Wizard V1.3, Hardware-Mehrfachauswahl mit Geräterollen, Node-Testmatrix und GitHub Actions, kontextabhängige Kompatibilitätsregeln, fünf auswählbare ChatGPT-App-/Connector-Kategorien, lokale Rollen-/Skill-Auswahl, responsive Gestaltung sowie JSON-, Markdown- und Offline-ZIP-Export.

**Noch nicht fertig / öffentlich verfügbar:**

- **Kein direkt installierbarer Plugin-ZIP-Import:** Der Offline-ZIP-Generator ist umgesetzt, gehört aber nicht zum Importformat des ChatGPT-Plugin-Verzeichnisses. Ein künftiger Import setzt ein separates, dafür unterstütztes Paket- und Freigabeverfahren voraus.
- Automatische Serverinstallation, MCP-Kopplung oder Berechtigungsfreigabe.
- Vollständiger unabhängiger Axiom-KI-Client mit mitgeliefertem lokalem Modell.
- Automatisierte Browser-End-to-End- und visuelle Responsive-Tests.
- Zusätzliche Integrationen und verifizierte Installationsabläufe für weitere Plattformen.

## Mitwirken und Lizenz

Feedback und Bugs bitte über [GitHub Issues](https://github.com/JayD-labs/axiom-web/issues) melden. Änderungen sollten die getrennten HTML-, CSS- und JavaScript-Dateien sowie das **JD Design System** beibehalten. **Keine Zugangsdaten committen.**

**Lizenz:** Zum Zeitpunkt dieser Dokumentation liegt im Repository **keine `LICENSE`-Datei**. Öffentlich einsehbarer Code ist rechtlich nicht automatisch unter einer Open-Source-Lizenz zur Weiterverwendung freigegeben. Eine ausdrückliche Lizenzentscheidung steht noch aus.

---

**Axiom 🐸 — YOUR AI. YOUR TOOLS. YOUR DATA.**

## Next: ChatGPT als tatsächlich nutzbare Axiom-Installation

Der Wizard ist ein lokales Konfigurations- und Exportportal, **kein Nachweis einer verbundenen ChatGPT-Installation**. Vor einer allgemeinen Installationsfreigabe werden folgende Punkte benötigt:

1. Ein offizielles, validierbares **ChatGPT-Plugin-Paket** mit Orchestrator- und Skill-Manifest gemäß unterstützter Plugin-Creator-Schnittstelle, getrennt vom Offline-ZIP des Wizards.
2. Ein erstes echtes ChatGPT-Setup mit dem Plugin-Verzeichnis/Plugin Creator; verfügbare Pläne und App-Verbindungen im jeweiligen Konto prüfen. Der Browser darf niemals automatisch ein fremdes Konto verbinden oder Credential-Dateien erzeugen.
3. **ChatGPT-E2E-Abnahme:** Axiom-Plugin starten, Onboarding ausführen, Rolle & Skill auslösen, echte Capability-Anzeigen gegen laufende Tools prüfen. Für jeden Connector erst eine lesende Aktion erfolgreich ausführen; „selected“, „installed“, „connected“ und „verified“ getrennt dokumentieren.
4. Eine tatsächlich mit dem Plugin kompatible Export- oder Installer-Strecke erst dann als „Installieren“ anbieten, wenn der Importweg nachgewiesen ist. Solange bleibt der ZIP-Export eine Anleitungs-/Quelldatei-Sammlung.
5. Optional Self-Hosted später: Hardware-Benchmark, modellbezogene Lizenz-/RAM-Prüfung, lokale Runtime, Client, Read-only-MCP; keine Schein-Installation und keine implizite Cloud-Abhängigkeit.

Referenz: [OpenAI – Plugins in ChatGPT](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt) und [MCP/Developer Mode](https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt). Verfügbarkeit kann sich nach Tarif, Region und Workspace unterscheiden.
