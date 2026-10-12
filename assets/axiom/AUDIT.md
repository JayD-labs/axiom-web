# Axiom Web V1.2 – Bestandsaufnahme

**Prüfdatum:** 12. Oktober 2026 · **Grundlage:** Repository `main`, Commit `08dfd7743095e6b2f121f5255318893d6504fc37`, danach dieses V1.2-Update.

## Tatsächlicher Ausgangsstand

Das Repository enthielt den Setup Wizard V1.1, dessen Hardware-Rollen sowie lokale JSON-/Markdown-Exporte. Es enthielt **keine** Datei `axiom-orchestrator.md`, keine `agent-*.md` und keine Skill-Definition. Deshalb konnten keine älteren Agententexte wortgetreu geprüft oder „aktualisiert“ werden. Die in V1.2 angelegten Agenten- und Skill-Kataloge sind neue, versionierte Projektartefakte auf Basis des im Axiom-Plugin verfügbaren 30-Skill-Inventars.

## Ergebnis der Prüfung

| Bereich | Ergebnis |
| --- | --- |
| Vorhandene Agenten im Repository vor V1.2 | Keine |
| Vorhandene technische Skills im Repository vor V1.2 | Keine |
| V1.2-Inventar | 12 Rollen, 30 Skills |
| Ausführbare Tools/MCP-Verbindungen | Keine – bewusst nicht behauptet |
| Veraltete Agentendefinitionen | Keine im Repository auffindbar |
| Inhaltliche Überschneidung | Security/Actions/Verification gelten absichtlich querschnittlich; die Zuordnung ist zentral dokumentiert |
| Widerspruch | Die frühere Wizard-Formulierung „private Version“ wird durch die V1.2-Dokumentation präzisiert: Es gibt keinen automatisch installierbaren Export und keine bestätigte ChatGPT-Importdatei |

## Begriffe

- **Agentenrolle:** Fachliche Zuständigkeit und Übergaberegeln.
- **Markdown-Anweisung:** Von Menschen lesbare Arbeitsregeln; sie führt keinen Code aus.
- **Skill:** Wiederverwendbare, versionierte Instruktionsdefinition im Katalog. Erst eine reale Host-Integration kann daraus einen technisch ausführbaren Skill mit Tools machen.

Der JSON-Katalog ist die Quelle für IDs, Zuordnungen und zukünftige Auswahl. Agententexte ergänzen ihn für Menschen; er enthält keine Geheimnisse, Tokens oder Kundendaten.
