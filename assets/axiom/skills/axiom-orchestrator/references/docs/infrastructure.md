# Infrastructure

Read-only scope: system status, allowed-root disk usage, Restic snapshot metadata, Docker list and bounded logs. The main Bridge has no Docker socket. A separate internal observer holds the socket and has no mutating HTTP methods/tools. There are no restart, exec, update, deploy or remove tools in v1.2.

`infrastructure_system_status` kennzeichnet seine OS-/Memory-Sicht ausdrücklich als Container-Sicht und liefert für echte Host-Dateisysteme die gemounteten Second-Brain-/Backup-Datenträger separat. Docker-Logs werden vor Ausgabe best-effort auf typische Token/Password/API-Key-Muster redigiert; Logs können trotzdem sensible Anwendungsdaten enthalten und werden nur auf konkreten Auftrag gelesen.
