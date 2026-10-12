# Axiom Mail v2.2

Mail-Fachlogik ist providerneutral. Outlook unterstützt je nach Autorisierung Folder Listing, Messages Search/Read, Reply Draft und Move. Optionale lokale Bridge-IMAP-Lösung nutzt TLS und `BODY.PEEK` (kein implizites Gelesen-Flag), Drafts im Drafts-Ordner; keine Provider-OAuth-Consent-Flows fingieren.

Absolute Sicherheitsregel: Axiom darf **niemals** senden, weiterleiten oder löschen (auch nicht über Connector-Aliase, SMTP oder Automation). Jede Mail-Mutation erfordert echten Auftrag, Operation-ID und Read-back. Eine Provider-OAuth-Sendberechtigung kann allein durch diese Policy nicht entfernt werden.
