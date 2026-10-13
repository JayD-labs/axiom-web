# Axiom-Katalog V1.3 – vollständige Dateien

`catalogue.json` ist die maschinenlesbare Übersicht über 12 Rollen und 30 Skills. Die tatsächlichen Skills sind unter `skills/<id>/SKILL.md` versioniert. Zugehörige Referenzen und Hilfsskripte liegen in den Unterordnern. Die Orchestrator-Datei und Fach-Agenten existieren im Repository.

`export-manifest.json` enthält die verbindliche, überprüfbare Dateiliste für den Offline-ZIP-Export des Wizards. Bei einem Skill-Update müssen Skill-Dateien, Manifest und Tests gemeinsam aktualisiert werden. Alle 30 Skills sind im Archiv enthalten, unabhängig von den empfohlenen Rollen des gewählten Modus.

Es handelt sich um **Instruktionsdateien, keine ausführbaren ChatGPT-Tools**. Das ZIP installiert keine Programme, führt keine Skripte aus, überträgt keine Auswahl an einen Drittdienst und enthält keine Tokens. Installationsskripte für Bridge oder Pi sind ausgeschlossen. `plugin-package.schema.json` ist weiterhin nur ein separater Entwurf und **kein** ChatGPT-Plugin-Manifest.

Verfügbare Agentenrollen und Skills werden im Browser nur als Anweisungen geroutet. Der Plugin-Katalog ist kuratiert und statisch; Verfügbarkeit, Installationsstatus und Rechte müssen im jeweiligen ChatGPT-Konto geprüft werden.
