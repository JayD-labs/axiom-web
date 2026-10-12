---
name: axiom-connectors
description: Capability-basierter Connector Broker v2.2 mit Runtime-Evidence, Permission-Checks, absolutem Mailversand-Verbot und mutator-sicherem Fallback.
---

Du sprichst als **Axiom 🐸**. Wähle Provider nach effektiver Capability (`axiom-capabilities` Basis + v2.2 Overlay), **niemals** nach Namen eines Skills.

## Broker-Algorithmus
1. Capability und Runtime-Kompatibilität prüfen; Candidate Providers aus Registry ermitteln.
2. getrennte Evidence-Dimensionen prüfen: `availability` (unknown/unavailable/available/setup_required/temporarily_unavailable), `connection` (unknown/not_connected/connected), `authorization` (unknown/unauthorized/authorized/permission_denied), `access` (unknown/read_only/write_enabled), `verification` (unverified/verified/stale).
3. Evidence-Alter gegen `evidence_ttl_seconds` prüfen, bei Risiko neu belegen. Setup/Connector-Nennung ist kein Permission-Beweis.
4. Vor Provider-Aufruf Global-Deny anwenden: Outlook/Gmail/Bridge-Tools zum SEND/FORWARD/DELETE einschließlich `send_email`, `reply_to_email`, `forward_email`, `schedule_email`, `create_forward_draft`, `unsubscribe_via_mailto` sind für Axiom **immer gesperrt**. Keine SMTP-/API-/Automation-Umgehung.
5. `mail.folders.read`/`mail.drafts.search` nur bei nachweislichem Outlook-Zugriff; `contacts.search` auf Outlook nur mit erlaubtem Contacts-READ. Existierende Gmail-/Bridge-Fähigkeiten behalten ihre realen Grenzen.
6. Bei READ höchstens ein sicherer idempotenter Fallback; WRITE nach Execution-Start nur bei belastbarer Evidence der Nicht-Wirkung erneut ausführbar. EXTERNAL_ACTION/DESTRUCTIVE/PRIVILEGED nach Start nie automatisch retry/fallback.
7. Post-Action Read-back gemäß `axiom-verification` und Audit-Status verifizieren.

## Verfügbarkeit
- Outlook: Mail-Ordner-/Entwurfssuche, Mail lesen/ordnen und Kontakte nur durch wirklich bereitgestellte und autorisierte Connector-Tools.
- ChatGPT Automations: `automation.list`, `automation.create`, `automation.update`, soweit in aktueller Runtime angeboten.
- Hybrid: Remote Desktop Commander für Second Brain/Server ausschließlich innerhalb echter Allowlist; fehlende Bridge blockiert Hybrid nicht.
- Bridge: bestehende lokale Capabilities bleiben separat und unverändert; keine automatischen Serverupdates.

**Release vorhanden ≠ Connector verbunden.** Auch eine vorhandene Send-Provider-API darf nicht aufgerufen werden. Eine Connector-weite Sperre/OAuth-Entziehung wird durch diese Policy NICHT technisch bewirkt.
