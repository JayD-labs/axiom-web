# v2.2 Release Checklist

1. Bestehende Plugin-ID, Scope, Current Release und historische 2.1-Release-ID prüfen.
2. Manifeste und Skill-Frontmatter/agents-Metadata validieren; Registry Basis + Overlay auf Konflikte testen.
3. Bestehende v2.0/v2.1 Contract-Tests plus v2.2 Tests (Policy Deny, Folder/Draft-Dedupe, Notifications, Pfadschutz, Timeout-No-Blind-Retry, Hybrid ohne Bridge) ausführen.
4. Secret-Scan, Python Syntax/pytest, Build ohne Cache-PYC und temp Artefakte.
5. Write-Szenarien nur mocken; **keine** echten Mails versenden oder bestehenden ChatGPT-Routinen verändern.
6. Guarded In-place Update, dann Release-Version/Plugin-ID/Private-Scope prüfen. Separate Runtime-Abnahme ehrlich dokumentieren.
