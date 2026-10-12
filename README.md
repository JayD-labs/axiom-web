# Axiom 🐸 Web

**YOUR AI. YOUR TOOLS. YOUR DATA.**

[Axiom Web öffnen](https://axiom.jd-schuldt.de) · [GitHub-Repository](https://github.com/JayD-labs/axiom-web)

Axiom Web ist die öffentliche Projektwebsite von **Axiom 🐸**, einem modular gedachten persönlichen KI-Assistenten. Der integrierte **Setup Wizard V1.0** hilft Besucherinnen und Besuchern, aus ihrem ChatGPT-/KI-Zugang, ihrer vorhandenen Hardware, der gewünschten Betriebsart und optionalen Integrationen eine individuelle Einrichtungsanleitung zusammenzustellen.

> **Projektstatus (Oktober 2026):** Website und Wizard sind verfügbar. Ein für alle öffentlich installierbares Axiom-Plugin, ein Axiom-Installer und eine vollständige eigenständige Axiom-KI sind **noch nicht veröffentlicht**. Der Wizard installiert keine Software und stellt keine Verbindungen selbst her.

## Inhaltsverzeichnis

- [Funktionsumfang](#funktionsumfang)
- [Setup Wizard V1.0](#setup-wizard-v10)
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
- Mehrfachauswahl für Integrationen mit eigenen Einrichtungs- und Testhinweisen.
- Regelbasierte Kompatibilitätsprüfung mit Blockaden, Bedingungen und Warnungen.
- Individuelle Anleitung mit Software, Netzwerk, Sicherheit, Testfragen und Hinweisen auf nicht verfügbare Funktionen.
- **Lokaler JSON- und Markdown-Export** nach explizitem Klick.
- Bestehendes dunkles **JD Design System** mit responsiven Auswahlkarten und Fokus-Styling.

## Setup Wizard V1.0

Auf der Website **„Axiom einrichten“** auswählen und die fünf Schritte durchgehen.

### Schritt 1 — KI / ChatGPT

Jeweils **eine** Option:

| Auswahl | Einordnung |
| --- | --- |
| ChatGPT Free | Einstieg über tatsächlich angebotene Apps/Plugins, unter Berücksichtigung von Konto-Limits |
| ChatGPT Plus | ChatGPT-Apps und ggf. unterstützte Remote-Connectoren, soweit freigegeben |
| ChatGPT Pro | Zusätzliche eigene MCP-App-Möglichkeiten im verfügbaren Developer Mode; die Regeln unterscheiden Lese- und Schreibrechte |
| ChatGPT Business | Workspace-kontrollierte Integrationen, Freigaben und ggf. eigene MCP-Apps |
| ChatGPT Enterprise / Edu | Zugriffsrollen, Organisationsrichtlinien und administrative Freigaben |
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

Der Wizard erstellt für **jedes ausgewählte Gerät** eigene Hinweise zu Software, Voraussetzungen, Netzwerk, Serverbetrieb, möglichem lokalem LLM sowie Vorbereitungsschritten und, sofern definiert, Diagnosebefehlen. Die Geräte werden **nicht** automatisch verbunden oder mit Serverrollen belegt.

### Schritt 3 — Betriebsart

| Betriebsart | Technischer Weg | Zusätzliche Voraussetzung |
| --- | --- | --- |
| **Axiom ChatGPT** | ChatGPT als KI-Oberfläche, autorisierte Apps/Plugins | Verfügbare Apps und zugehörige Dienstkonten |
| **Axiom Hybrid** | ChatGPT + eigene Hardware über unterstützten Remote-Connector | Erreichbares Zielgerät, Connector und erlaubte Zugriffe |
| **Eigener MCP-Server** | MCP-fähiger KI-Client nutzt Werkzeuge eines MCP-Servers | Geeigneter Client, Server, Transport und Berechtigungen |

Ein **MCP-Server stellt Werkzeuge bereit, ersetzt aber kein Sprachmodell**. Bei ChatGPT als Modell ist ein lokales LLM nicht erforderlich. Wer unabhängig von ChatGPT sein möchte, benötigt einen eigenen MCP-fähigen KI-Client und eine passende Modellquelle.

### Schritt 4 — Integrationen (Mehrfachauswahl)

Aktuell dokumentierte Optionen:

| Integration | Beispiel | Worauf zu achten ist |
| --- | --- | --- |
| GitHub | Repository, Issues und Commits lesen | Repository-Freigaben; Schreiben gesondert autorisieren |
| Outlook E-Mail | Betreffzeilen oder relevante E-Mails lesen | Microsoft-Berechtigungen; Versand ist eine separate Aktion |
| Kalender | Nächste Termine abrufen | Kalender-Zugriff und Zeitzonen |
| Remote Desktop / Server | Erlaubtes Testsystem lesend prüfen | Erreichbares Gerät, Connector, enge Datei-/Tool-Rechte |

Für jede ausgewählte Integration erscheinen Anleitungen und Testfragen passend zur Betriebsart. Weitere Apps/Plugins sind eine spätere Erweiterung und nicht als bereits verfügbar zu verstehen.

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

## Kompatibilitätsprüfung

Die Regel-Engine `buildGuide(config, catalogue)` in `assets/js/setup-wizard-data.js` bewertet die **Kombination aus allen vier Auswahldimensionen**.

| Interner Status | Anzeige | Bedeutung |
| --- | --- | --- |
| `supported` | Technisch geeignet | Keine den Regeln bekannte Blockade oder zusätzliche Bedingung |
| `conditional` | Unter Voraussetzungen möglich | Zugänge, Berechtigungen, Funktionen oder externe Voraussetzungen müssen geprüft werden |
| `blocked` | Nicht direkt unterstützt | Eine für diese Auswahl bekannte Blockade ist vorhanden |

Beispiele der implementierten Logik:

- **Plus + Raspberry Pi + Hybrid:** Bedingt möglich, wenn ein geeigneter Remote-Connector im Konto verfügbar und autorisiert ist.
- **Pro + eigener MCP-Server:** Developer Mode, erreichbarer Remote-MCP-Zugang und die derzeit vorgesehenen Grenzen für Schreibaktionen beachten.
- **Free/Plus + eigener Remote-MCP-Server über ChatGPT Developer Mode:** Nicht direkt als allgemeine Möglichkeit zusagen; Alternativen prüfen.
- **Business/Enterprise/Edu + eigener MCP-Server:** Workspace-/Admin-Freigaben und gegebenenfalls Rollenrechte erforderlich.
- **Ohne ChatGPT + eigener MCP-Server:** Anderen MCP-fähigen Client und passendes Modell einrichten; Axiom Independent ist noch keine vollständige Distribution.
- **Hybrid + keine eigene Hardware:** Blockiert, da ein Zielgerät fehlt.

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
| `axiom-setup-v1.json` | Auswahl, Kompatibilität, Hardware, Software, Connectoren, Schritte, Sicherheitsmaßnahmen und Tests |
| `axiom-setup-v1.md` | Lesbare Markdown-Anleitung mit denselben thematischen Informationen |

Das aktuelle **JSON-Schema hat `schemaVersion: 2`**. Hardware wird als **Array** gespeichert, um mehrere Geräte zu unterstützen:

```json
{
  "selection": {
    "plan": "plus",
    "hardware": ["pi", "linux", "mac"],
    "mode": "hybrid",
    "integrations": ["github", "remote-desktop"]
  }
}
```

Dies zeigt **nur den Ausschnitt `selection`** und kein vollständiges Exportbeispiel. Die Auswahl enthält keine Zugangsdaten und weist keine Verbindung als erfolgreich aus.

## Projektarchitektur

Axiom Web ist eine **statische Website** ohne erforderliches Backend, Nutzerdatenbank oder Build-Tool.

```text
axiom-web/
├── CNAME
├── index.html
└── assets/
    ├── css/
    │   ├── jd-design-tokens.css
    │   └── styles.css
    └── js/
        ├── setup-content.js
        ├── setup-wizard-data.js
        └── setup.js
```

| Datei | Verantwortung |
| --- | --- |
| `index.html` | Seitenstruktur, Wizard-Stufen, Eingaben und Ergebnisbereiche |
| `assets/css/jd-design-tokens.css` | Gemeinsame JD-Farb-, Fokus- und Design-Tokens |
| `assets/css/styles.css` | Seitendesign, Auswahlkarten, responsive Darstellung |
| `assets/js/setup-content.js` | ChatGPT-Pläne, Betriebsarten, Integrations- und Kombinationstexte (`window.AxiomGuide`) |
| `assets/js/setup-wizard-data.js` | Hardware-Daten, Kompatibilitätsprüfung und Leitfadenerzeugung (`window.AxiomWizardRules`) |
| `assets/js/setup.js` | Lokaler Browser-Zustand, Navigation, Anzeige und Export |
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

Die JavaScript-Dateien müssen in dieser Reihenfolge geladen werden: **`setup-content.js` → `setup-wizard-data.js` → `setup.js`**. Die JD-Design-Tokens bleiben die Grundlage der CSS-Farben.

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
node --check assets/js/setup-wizard-data.js
node --check assets/js/setup.js
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
- Lokaler Export nur bei aktivem Klick.
- Zugangsdaten, Tokens oder Secrets niemals in öffentliches Git oder JSON/Markdown-Exporte eintragen.

Die HTML-Seite setzt eine restriktive **Content Security Policy**, darunter `connect-src 'none'`.

**Transparenz:** Der Hostinganbieter **GitHub Pages** verarbeitet beim Seitenaufruf technisch notwendige Verbindungsdaten. Wer freiwillig ChatGPT, GitHub, Microsoft oder andere externe Apps verwendet, unterliegt zusätzlich deren Bedingungen. Die Website überträgt die Wizard-Auswahl nicht automatisch an diese Dienste.

Für reale Integrationen empfehlen sich **Minimalberechtigungen**, reine Lesetests, getrennte Benutzerkonten, sichere Secret-Verwaltung, Updates und Backups vor Änderungen.

## Tests und Qualitätssicherung

Die folgende Liste dient zum manuellen Gegenprüfen. Sie ist **keine Behauptung über bereits ausgeführte Browser-End-to-End-Tests**.

- [ ] Ein KI-/ChatGPT-Plan kann ausgewählt werden und passt die Hinweise an.
- [ ] **Raspberry Pi + Mini-PC + macOS** können gleichzeitig ausgewählt werden.
- [ ] Ein ausgewähltes Gerät hebt **„Keine eigene Hardware“** auf.
- [ ] **„Keine eigene Hardware“** entfernt die Auswahl anderer Geräte.
- [ ] Beim Abwählen des letzten Geräts wird wieder **„Keine eigene Hardware“** gewählt.
- [ ] Die Anleitung enthält alle ausgewählten Geräte mit eigenen Vorbereitungsschritten.
- [ ] JSON exportiert `selection.hardware` als Array.
- [ ] Markdown listet alle ausgewählten Geräte und deren Anforderungen auf.
- [ ] Hybrid ohne Gerät zeigt eine Blockade.
- [ ] Free/Plus + eigener MCP-Server zeigt die planabhängige Einschränkung.
- [ ] Pro + MCP weist auf Developer Mode und Aktionsrechte hin.
- [ ] Mehrere Integrationen erzeugen passende Hinweise und Tests.
- [ ] Navigation, Tastaturbedienung, Fokus und mobile Darstellung funktionieren.
- [ ] Ohne Exportklick werden keine Konfigurationsdateien heruntergeladen.

**Prüfstand:** Nach dem Hardware-Fix wurden die geänderten Dateien und der Commit erneut auf GitHub geprüft. Ein vollständiger automatisierter Test im echten Browser ist noch offen.

## Projektstatus und Roadmap

**Bereits umgesetzt:** Projektwebsite, Setup Wizard V1.0, Hardware-Mehrfachauswahl, kontextabhängige Kompatibilitätsregeln, vier Integrationskategorien, responsive Gestaltung sowie JSON- und Markdown-Export.

**Noch nicht fertig / öffentlich verfügbar:**

- Öffentlich installierbare vollständige Axiom-Agenten-/Plugin-Distribution.
- Automatische Serverinstallation, MCP-Kopplung oder Berechtigungsfreigabe.
- Vollständiger unabhängiger Axiom-KI-Client mit mitgeliefertem lokalem Modell.
- Automatisierte Browser-End-to-End- und Responsive-Tests.
- Zusätzliche Integrationen und verifizierte Installationsabläufe für weitere Plattformen.

## Mitwirken und Lizenz

Feedback und Bugs bitte über [GitHub Issues](https://github.com/JayD-labs/axiom-web/issues) melden. Änderungen sollten die getrennten HTML-, CSS- und JavaScript-Dateien sowie das **JD Design System** beibehalten. **Keine Zugangsdaten committen.**

**Lizenz:** Zum Zeitpunkt dieser Dokumentation liegt im Repository **keine `LICENSE`-Datei**. Öffentlich einsehbarer Code ist rechtlich nicht automatisch unter einer Open-Source-Lizenz zur Weiterverwendung freigegeben. Eine ausdrückliche Lizenzentscheidung steht noch aus.

---

**Axiom 🐸 — YOUR AI. YOUR TOOLS. YOUR DATA.**
