/* Axiom Setup Wizard V1.0 – ausschließlich lokale, deterministische Regeln.
 * Offizielle Produktvorgaben: siehe documentation; Verfügbarkeit immer im Konto prüfen.
 */
(function () {
  "use strict";
  const hardware = {
    none: {
      label: "Keine eigene Hardware",
      summary: "Nur ChatGPT bzw. ein externer KI-/Hostingdienst. Kein eigener Server erforderlich.",
      software: ["Aktueller Browser für ChatGPT bzw. den gewählten KI-Client"],
      prerequisites: ["Internet und Zugang zum gewählten KI-Dienst"],
      network: "Kein eingehender Port erforderlich. Externe Dienste verarbeiten Daten nach ihren eigenen Bedingungen.",
      server: "Kein eigener Server. Für eigenes MCP ist ein zusätzliches Hostingziel nötig.",
      commands: [],
      steps: ["Wenn du ChatGPT-Apps verwendest, installiere lokal keinen Server.", "Für eigenes MCP zuerst einen vertrauenswürdigen Hostingort auswählen und dessen Kosten und Datenschutz prüfen."],
      llm: "Kein lokales LLM nötig; ohne ChatGPT ist ein anderer modellgestützter KI-Dienst oder eigene Hardware notwendig."
    },
    pi: {
      label: "Raspberry Pi",
      summary: "Kompakter Linux-Rechner für Dateien, kleine Dienste und einen MCP-Server; nicht automatisch eine leistungsfähige lokale KI.",
      software: ["Aktuelles Raspberry Pi OS oder Debian", "SSH (optional, mit Schlüssel)", "Passende Connector- oder MCP-Server-Software nur bei tatsächlichem Bedarf"],
      prerequisites: ["Aktuelles 64-Bit-System, regelmäßige Updates, freier Speicher, stabiler Netzwerkzugriff", "Backup und separater Nutzer ohne Root-Rechte"],
      network: "Private IP / LAN, optional VPN; keine ungeprüften Portfreigaben. ChatGPT-MCP benötigt einen unterstützten Remote-Zugang.",
      server: "Für dauerhafte Erreichbarkeit muss der Pi eingeschaltet sein; kein 24/7-Zwang bei gelegentlicher Nutzung.",
      commands: ["uname -a", "id", "python3 --version"],
      steps: ["System aktualisieren und einen separaten, eingeschränkten Benutzer vorsehen.", "Optional SSH-Schlüssel oder VPN für eigene Administration einrichten.", "Nur benötigte Connector-Dienste oder MCP-Werkzeuge starten; keinen Root-Zugang vergeben."],
      llm: "Für ChatGPT oder Remote-MCP kein lokales LLM. Lokale Modelle auf einem Pi sind stark von Modell und RAM abhängig."
    },
    linux: {
      label: "Mini-PC / Linux-Server",
      summary: "Flexibler Host für Container, Dateien, Integrationen und eigene MCP-Dienste.",
      software: ["Aktuelles Linux (z. B. Debian/Ubuntu)", "SSH mit Schlüsseln", "Container-Runtime oder Python nur falls der gewählte MCP-Server sie benötigt"],
      prerequisites: ["Sicherheitsupdates, ausreichend RAM/CPU/Speicher für deine Dienste", "Backups, Dienstkonto und Firewall"],
      network: "LAN oder VPN bevorzugen. Remote-MCP aus ChatGPT nur über genehmigten Remote-Endpunkt oder unterstützten Tunnel.",
      server: "Dienste laufen nur, während die Maschine erreichbar ist.",
      commands: ["uname -a", "id", "python3 --version"],
      steps: ["Linux aktualisieren, Benutzer und Firewall konfigurieren.", "Projekt in einem eigenen Verzeichnis mit minimalen Dateirechten ablegen.", "Connector oder MCP-Server nach dessen offizieller Anleitung betreiben; Logs und Backups prüfen."],
      llm: "LLM nicht nötig, wenn ChatGPT die KI übernimmt. Für lokale KI RAM/VRAM und Modellgröße individuell prüfen."
    },
    nas: {
      label: "NAS / Heimserver",
      summary: "Speicher- und Dienstplattform, abhängig von NAS-Modell, Betriebssystem und Apps.",
      software: ["Aktuelle NAS-Firmware", "Unterstützte Container-/Paketfunktion nur falls vorhanden", "Geeignete Connector-/MCP-Software nach Gerätekompatibilität"],
      prerequisites: ["Unterstützte CPU-Architektur, Ressourcen und Paketrechte prüfen", "Separate Freigabe, Snapshots oder Backups, geringste Berechtigungen"],
      network: "Über LAN/VPN verwalten. Keine öffentliche NAS-Verwaltungsoberfläche oder ungeschützte Dateifreigaben.",
      server: "Für Zugriff bei Bedarf eingeschaltet und erreichbar; Docker-Unterstützung nicht voraussetzen.",
      commands: [],
      steps: ["NAS-Modell und Pakete auf Kompatibilität kontrollieren.", "Testfreigabe mit Leserechten und Backup erstellen.", "Nur geprüfte Pakete/Container für die gewünschte Verbindung installieren."],
      llm: "Kein lokales LLM erforderlich. Viele NAS-Geräte sind für große lokale Modelle ungeeignet."
    },
    windows: {
      label: "Windows-PC",
      summary: "Eigener Computer als zeitweiliges Connector-Ziel oder Entwicklungsrechner.",
      software: ["Aktuelles Windows", "PowerShell", "Nur bei Bedarf geeignete MCP-/Connector-Software; WSL ist optional"],
      prerequisites: ["Updates, Standardbenutzer, Firewall und Laufwerksrechte", "PC muss beim Zugriff eingeschaltet sein"],
      network: "Lokale oder VPN-Verbindung; keine offene RDP-/SMB-Freigabe ins Internet.",
      server: "Temporärer Betrieb möglich. Die Verfügbarkeit endet beim Herunterfahren.",
      commands: ["$PSVersionTable.PSVersion", "whoami", "Get-Command ssh -ErrorAction SilentlyContinue"],
      steps: ["Updates, Firewall und Benutzerrechte prüfen.", "Connector nur nach Windows-kompatibler Anleitung installieren.", "Einen ungefährlichen Testordner für reinen Lesezugriff einrichten."],
      llm: "ChatGPT benötigt kein lokales Modell. Für lokale KI GPU/VRAM und Modellformat vorab prüfen."
    },
    mac: {
      label: "macOS",
      summary: "Mac als persönliches Connector-Ziel oder lokaler MCP-Client-/Server-Rechner.",
      software: ["Aktuelles macOS", "Terminal", "Nur bei Bedarf kompatibler MCP-Client/Connector"],
      prerequisites: ["Systemupdates, Dateiberechtigungen, eingeschränkter Benutzer", "Zugriffsfreigaben nur für ausdrücklich gewählte Verzeichnisse"],
      network: "LAN/VPN bevorzugen; keine ungeschützten Freigaben über das Internet.",
      server: "Der Mac muss für Remotezugriffe eingeschaltet und erreichbar bleiben.",
      commands: ["sw_vers", "uname -m", "whoami"],
      steps: ["Aktuelle macOS-Version und Sicherheitsberechtigungen prüfen.", "Nur ausdrücklich benötigte Ordner freigeben.", "Connector oder lokale MCP-Entwicklungsumgebung separat und kontrolliert testen."],
      llm: "ChatGPT braucht kein lokales LLM. Lokaler Modellbetrieb ist abhängig von Arbeitsspeicher und Modell."
    },
    other: {
      label: "Andere Infrastruktur",
      summary: "VM, Cloud-Host oder anderes Betriebssystem – Eignung hängt von der tatsächlichen Plattform ab.",
      software: ["Unterstütztes Betriebssystem", "Passender MCP-Client oder Connector", "Aktuelle Laufzeit laut Installationsdokumentation"],
      prerequisites: ["Architektur, Rechte und Erreichbarkeit individuell prüfen", "Absicherung, Updates und Backups festlegen"],
      network: "Möglichst keine öffentliche Exposition; HTTPS/OAuth bzw. ein unterstützter Tunnel nur wenn benötigt.",
      server: "Verfügbarkeit und Kosten werden durch die gewählte Infrastruktur bestimmt.",
      commands: [],
      steps: ["Betriebssystem, CPU-Architektur und Zugriffsmodell dokumentieren.", "Kompatible Connector-/MCP-Version prüfen.", "Zuerst isolierten Read-only-Test durchführen."],
      llm: "Ein lokales Modell wird nur benötigt, wenn kein externer Modelldienst verwendet wird; Ressourcen vorher planen."
    }
  };
  const documentation = [
    {title: "Plugins in ChatGPT", url: "https://help.openai.com/en/articles/20001256-plugins-in-chatgpt"},
    {title: "Developer Mode & eigene MCP-Apps", url: "https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt"},
    {title: "Secure MCP Tunnel", url: "https://developers.openai.com/api/docs/guides/secure-mcp-tunnels"},
    {title: "MCP-Server (OpenAI)", url: "https://developers.openai.com/api/docs/guides/tools-connectors-mcp"}
  ];
  const special = {
    github: {
      software: "GitHub-Konto; App/Plugin oder begrenzte GitHub-API-Integration",
      permission: "Nur ausgewählte Repositories; möglichst zunächst lesend. Ein Push braucht eigene Schreibrechte.",
      check: "Zeige die letzten drei Commits eines freigegebenen Test-Repositories, ohne etwas zu ändern."
    },
    outlook: {
      software: "Microsoft-Konto und freigegebene Outlook-Anbindung",
      permission: "Für einen Lesetest Mail.Read; Entwürfe/Versand nur mit zusätzlichen, ausdrücklich genehmigten Rechten.",
      check: "Lies nur die Betreffzeilen der drei neuesten E-Mails. Versende nichts."
    },
    calendar: {
      software: "Freigegebenes Kalenderkonto, z. B. Outlook oder CalDAV",
      permission: "Kalender-Leserechte bevorzugen; Änderungen verlangen gesonderte Rechte und Einverständnis.",
      check: "Welche drei Termine stehen als Nächstes an? Zeige die Zeitzone."
    },
    "remote-desktop": {
      software: "Ein für Konto, Betriebssystem und Berechtigungen freigegebener Remote-Connector oder eigene MCP-Tools",
      permission: "Auf einen Testordner und reine Lesefunktionen begrenzen; keine pauschalen Shell-/Root-Rechte.",
      check: "Zeige den Benutzernamen und den Inhalt eines freigegebenen Testordners. Verändere nichts."
    }
  };
  function unique(items) { return Array.from(new Set(items)); }
  function buildGuide(config, catalogue) {
    const p = catalogue.plans[config.plan];
    const m = catalogue.modes[config.mode];
    if (!p || !m) throw new Error("Ungültige Auswahl");
    const requestedHardware = Array.isArray(config.hardware) ? config.hardware : [config.hardware];
    const hardwareIds = unique(requestedHardware.filter(function (id) { return Object.hasOwn(hardware, id); }));
    if (hardwareIds.length === 0) hardwareIds.push("none");
    if (hardwareIds.length > 1 && hardwareIds.includes("none")) hardwareIds.splice(hardwareIds.indexOf("none"), 1);
    const devices = hardwareIds.map(function (id) { return hardware[id]; });
    const h = {
      label: devices.map(function (device) { return device.label; }).join(" + "),
      software: unique(devices.flatMap(function (device) { return device.software.map(function (item) { return device.label + ": " + item; }); })),
      prerequisites: unique(devices.flatMap(function (device) { return device.prerequisites.map(function (item) { return device.label + ": " + item; }); })),
      server: devices.map(function (device) { return device.label + ": " + device.server; }).join(" "),
      network: devices.map(function (device) { return device.label + ": " + device.network; }).join(" "),
      llm: devices.map(function (device) { return device.label + ": " + device.llm; }).join(" ")
    };
    const ids = unique((config.integrations || []).filter(function (id) { return Object.hasOwn(special, id); }));
    const blockers = [], conditions = [], warnings = [];
    const steps = [], tests = [], needed = [], connectors = [], security = [
      "Nur vertrauenswürdige Plugins/Apps/Server verbinden und jede Berechtigung vor Freigabe prüfen.",
      "Tokens, Kennwörter, OAuth-Secrets und private Daten niemals in Repositories, Konfigurationsdatei-Exports oder Wizard-Eingaben ablegen.",
      "Vor schreibenden Aktionen Backup, ausdrückliche Bestätigung und getrennte Minimalrechte vorsehen.",
      "Server aktualisieren, Logs auf sensible Inhalte prüfen und Zugriffe jederzeit widerrufen können."
    ];
    const add = function (title, detail) { steps.push({title: title, detail: detail}); };
    const usesChatGPT = config.plan !== "none";
    const isMcp = config.mode === "bridge";
    if (!usesChatGPT && config.mode !== "bridge") blockers.push("Ohne ChatGPT funktionieren die Betriebsarten „Axiom ChatGPT“ und „Axiom Hybrid“ nicht. Wähle „Eigener MCP-Server“ mit einem anderen KI-Client.");
    if (config.mode === "hybrid" && hardwareIds.includes("none")) blockers.push("Hybrid benötigt ein erreichbares eigenes Gerät. Wähle Hardware oder wechsle zur reinen ChatGPT-Betriebsart.");
    if (isMcp && usesChatGPT && (config.plan === "free" || config.plan === "plus")) blockers.push("Der direkte eigene Remote-MCP-Zugang über ChatGPT Developer Mode ist für diesen Plan nicht allgemein freigegeben. Alternative: unterstützte Apps oder ein separater MCP-fähiger Client; lokale MCP-Apps über ChatGPT-Desktop-Plugins sind ein eigener, geräteabhängiger Weg.");
    if (isMcp && config.plan === "pro") conditions.push("Pro-Developer-Mode: eigene Remote-MCP-Apps derzeit nur für Lesen/Abrufen. Keine allgemeinen Schreib-/Änderungsrechte versprechen.");
    if (isMcp && (config.plan === "business" || config.plan === "enterprise")) conditions.push("Eigene MCP-Apps und Schreibfunktionen sind Beta und abhängig von Admin-/Owner-Freigabe; Enterprise/Edu zusätzlich RBAC und zulässige Tool-Aktionen.");
    if (isMcp && config.plan === "none") conditions.push("Ein anderer MCP-fähiger KI-Client und ein kompatibles Modell müssen separat gewählt und eingerichtet werden; die eigenständige Axiom-KI ist noch nicht veröffentlicht.");
    if (isMcp && hardwareIds.includes("none")) conditions.push("Kein eigener Rechner gewählt: eigener MCP-Server nur über gesondert bereitgestellten Host/Cloud möglich; die Website stellt keinen Server bereit.");
    if (config.mode === "hybrid") conditions.push("Hybrid funktioniert nur, wenn ein geeigneter Remote-Connector für dein Konto und das Zielsystem tatsächlich verfügbar und autorisiert ist.");
    if (config.mode === "chatgpt" && !hardwareIds.includes("none")) warnings.push("Die gewählte Hardware ist im reinen ChatGPT-Modus optional und wird nicht automatisch angebunden.");
    if (usesChatGPT) conditions.push("Plugin-/App-Verfügbarkeit, Konto-Limits und Workspace-Policies müssen im konkreten ChatGPT-Konto geprüft werden.");
    if (ids.includes("remote-desktop") && hardwareIds.includes("none")) {
      conditions.push("Remote Desktop / Server ohne eigenes Zielgerät lässt sich nicht testen. Für diesen Teil wird Hardware benötigt.");
    }
    if (ids.includes("remote-desktop") && config.mode === "chatgpt") conditions.push("Remote Desktop / Server benötigt zusätzlich einen autorisierten Remote-Connector und ein Zielgerät; dafür den Hybrid-Modus wählen.");
    add("Verfügbarkeit prüfen", usesChatGPT
      ? "ChatGPT öffnen und unter Plugins bzw. Apps die für Plan, Gerät und Workspace tatsächlich angebotenen Integrationen prüfen. Axiom selbst ist noch nicht allgemein veröffentlicht."
      : "Einen MCP-fähigen KI-Client und die Modellquelle auswählen; prüfen, ob Tool-Aufrufe und der gewünschte MCP-Transport unterstützt werden.");
    devices.forEach(function (device) {
      add("Hardware vorbereiten: " + device.label, device.steps.join(" "));
    });
    if (config.mode === "chatgpt") {
      needed.push("ChatGPT-Web/App", "Ausgewählte freigegebene Plugins/Apps");
      add("Axiom als Arbeitsweise nutzen", "Axiom ist öffentlich noch nicht als fertiges Plugin installierbar. Bis dahin passende vorhandene ChatGPT-Apps einzeln installieren bzw. verbinden und den Assistenten mit eigenen Anweisungen organisieren.");
      add("Rechte prüfen", "Im Plugin-Verzeichnis Details, erlaubte Aktionen und ggf. separate Provider-Verbindung prüfen. Workspace-Sperren niemals umgehen.");
    } else if (config.mode === "hybrid") {
      needed.push("ChatGPT", "Unterstützter Remote-Connector auf Zielsystem");
      connectors.push("Remote-Connector (z. B. Remote Desktop Commander, falls für Konto/Zielgerät verfügbar)");
      add("Remote-Connector auswählen", "Nur einen für deinen Plan und dein Betriebssystem tatsächlich angebotenen Connector verwenden. Dessen offizielle Installations- und Kopplungsanleitung prüfen; kein allgemeines Installationskommando behaupten.");
      add("Zielsystem absichern", "Connector auf benötigte Pfade und Read-only-Aufgaben einschränken. Netzverbindung und erlaubte Verzeichnisse prüfen.");
      add("Connector autorisieren und testen", "Im ChatGPT-Konto Verbindung ausdrücklich herstellen und den Testauftrag ausführen. Eine bloße Installation beweist keinen erfolgreichen Zugriff.");
    } else {
      needed.push("MCP-fähiger KI-Client", "MCP-Server-Implementierung", "Passende Runtime für deinen Server");
      connectors.push(usesChatGPT ? "Eigene Remote-MCP-App im zugelassenen Developer Mode (planabhängig)" : "MCP-Verbindung des gewählten KI-Clients");
      add("MCP-Tools abgrenzen", "Zunächst nur ein Status- oder Datei-Lesetool definieren. Keine freien Shell-Befehle oder Zugriff auf das gesamte Dateisystem.");
      add("MCP-Server installieren", "Die Dokumentation der konkret ausgewählten MCP-Server-Implementierung befolgen. Runtime, Transport (z. B. Streamable HTTP oder lokal stdio) und Berechtigungen prüfen.");
      add("MCP-Verbindung herstellen", usesChatGPT
        ? "ChatGPT verbindet eigene Remote-MCP-Apps nur über einen unterstützten erreichbaren Endpunkt bzw. Secure MCP Tunnel. Developer Mode und Berechtigungen prüfen; ein lokaler localhost-Endpunkt allein ist nicht ausreichend."
        : "Den MCP-Server nach den Vorgaben deines Clients verbinden. Bei lokalem Client ist stdio oder eine lokale MCP-Verbindung möglich, sofern unterstützt.");
      add("Berechtigungen und Tools prüfen", usesChatGPT
        ? "In Business/Enterprise/Edu passende Workspace-Genehmigung und Tool-Freigaben einholen. Bei Pro nur Lesetools einplanen."
        : "Im Client die angebotenen Tools inspizieren und zuerst eine Leseaktion auf ungefährlichen Testdaten ausführen.");
      if (config.plan === "pro") needed.push("Aktivierter Developer Mode (Read/Fetch)");
      if (config.plan === "business" || config.plan === "enterprise") needed.push("Developer Mode, Admin-/Owner-Freigabe und erlaubte Tool-Aktionen");
      if (config.plan === "none") needed.push("Eigene Modellquelle (lokales LLM oder externer Modellanbieter)");
      if (usesChatGPT) security.push("Ein eigener MCP-Server hinter NAT ist nicht automatisch erreichbar. Secure MCP Tunnel nur mit erforderlichem OpenAI-Platform-/Workspace-Zugang prüfen; niemals geheime Tunnel-Schlüssel veröffentlichen.");
    }
    for (const id of ids) {
      const info = catalogue.integrations[id], extra = special[id], detail = info[config.mode];
      needed.push(extra.software);
      connectors.push(info.name + (isMcp ? " (eigener MCP-Toolzugriff; separat zu implementieren)" : " (nur wenn als Plugin/App freigegeben)"));
      add(info.name + " einrichten", detail.steps.join(" ") + " Berechtigungen: " + extra.permission);
      tests.push(info.name + ": " + extra.check);
      security.push(info.name + ": " + extra.permission);
    }
    tests.unshift(config.mode === "chatgpt"
      ? "ChatGPT: „Welche deiner verbundenen Apps darfst du aktuell verwenden? Führe keine schreibende Aktion aus.“"
      : config.mode === "hybrid"
        ? "Hybrid: „Zeige nur lesend den Status des ausdrücklich freigegebenen Testsystems.“"
        : "MCP: „Liste die verfügbaren Tools auf und rufe nur das vereinbarte Status-Lesetool auf.“");
    if (config.mode !== "chatgpt") devices.forEach(function (device) {
      if (device.commands.length) tests.push("Lokale, harmlose Diagnosebefehle (" + device.label + "): " + device.commands.join(" | "));
    });
    const availability = [
      "Der öffentliche Axiom-Plugin-/Agenten-Installer ist noch nicht verfügbar; eine private Installation ist kein öffentliches Produkt.",
      "Der Wizard installiert keine Programme, verbindet keine Konten und bestätigt keine erfolgreichen Tests.",
      "Axiom Independent mit mitgeliefertem KI-Modell, vollständiger MCP-Server-Distribution und automatischem Deployment ist noch nicht veröffentlicht."
    ];
    const compatibility = blockers.length ? "blocked" : conditions.length ? "conditional" : "supported";
    return {
      schemaVersion: 2,
      selection: {plan: config.plan, hardware: hardwareIds, mode: config.mode, integrations: ids},
      labels: {plan: p.name, hardware: devices.map(function (device) { return device.label; }), mode: m.name, integrations: ids.map(function (id) {return catalogue.integrations[id].name;})},
      compatibility: {status: compatibility, blockers: blockers, conditions: conditions, warnings: warnings},
      summary: p.name + " · " + h.label + " · " + m.name,
      plan: {requirements: p.needs, limits: p.limits, description: p.intro},
      hardware: {selected: hardwareIds, software: h.software, prerequisites: h.prerequisites, network: h.network, server: h.server, llm: h.llm},
      software: unique(needed.concat(h.software)),
      connectors: unique(connectors),
      steps: steps,
      security: unique(security),
      tests: tests,
      unavailable: availability,
      docs: documentation,
      notice: "Konfigurationsleitfaden, keine erfolgreiche Installation, Freigabe oder Verbindung bestätigt. Stand: Oktober 2026."
    };
  }
  window.AxiomWizardRules = Object.freeze({hardware: hardware, documentation: documentation, special: special, buildGuide: buildGuide});
})();
