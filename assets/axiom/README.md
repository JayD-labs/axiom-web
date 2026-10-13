# Axiom Web V1.4 – nachprüfbarer Plugin-Katalog

Die **14** Agenten-Referenzen unter `agents/` wurden aus `skills/axiom-orchestrator/references/agents/` des privaten Axiom-Plugins (Quellstand 2.2.0) übernommen. System-Skills `axiom-orchestrator`, `axiom-onboarding` und `axiom-health` sind **keine weiteren Agentendefinitionen**. Der Wizard routet Fachrollen als Anweisungen, nicht als Prozesse.

Alle **30** `skills/<id>/SKILL.md` wurden inhaltlich mit dem Plugin verglichen: 25 bytegleich, 5 mit ausschließlich abschließenden Whitespace-Unterschieden. Kein Skill wurde auf eine reine ID reduziert. Die exportierte Datei `catalogue.json` und das `export-manifest.json` enthalten die zugehörigen Dateipfade.

Das ZIP ist ein lokales Offline-Dokumentationspaket, **kein importierbares ChatGPT-Plugin**. Die echte Installation geht über ChatGPT → Plugins / Plugin Creator und gegebenenfalls die gesonderte Connector-Autorisierung. Lies `CHATGPT-INSTALL.md`.
