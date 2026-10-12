/* Axiom Setup Wizard V1.2 – lokale, separat testbare Export-Serialisierung. */
(function () {
  "use strict";
  function markdown(guide) {
    const lines = ["# Axiom 🐸 – Setup-Anleitung", "",
      "**" + guide.summary + "**", "",
      "Status: " + ({blocked:"Nicht direkt unterstützt",conditional:"Nur unter Voraussetzungen",supported:"Technisch geeignet"}[guide.compatibility.status]), "",
      "> " + guide.notice, ""];
    const section = function (title, entries) {
      lines.push("## " + title, "");
      (entries.length ? entries : ["Keine."]).forEach(function (entry) { lines.push("- " + entry); });
      lines.push("");
    };
    section("Auswahl", [guide.labels.plan].concat(guide.labels.hardware, [guide.labels.mode], guide.labels.integrations));
    section("Geräterollen", guide.hardware.assignments.map(function (item) {
      return item.label + ": " + item.roleLabel;
    }));
    section("Kompatibilität / Blockaden", guide.compatibility.blockers.concat(guide.compatibility.conditions, guide.compatibility.warnings));
    section("ChatGPT / KI", [guide.plan.description, guide.plan.requirements, guide.plan.limits]);
    section("Hardware & Netzwerk", guide.hardware.prerequisites.concat([guide.hardware.network, guide.hardware.server, guide.hardware.llm]));
    section("Software", guide.software);
    section("Connectoren", guide.connectors);
    section("Ausgewählte Axiom-Rollen", guide.agentPackage.agents.map(function (agent) {
      return agent.name + " (" + agent.skills.join(", ") + ")";
    }));
    lines.push("## Schritt-für-Schritt-Einrichtung", "");
    guide.steps.forEach(function (item, i) { lines.push((i + 1) + ". **" + item.title + "** – " + item.detail); });
    lines.push("");
    section("Sicherheit", guide.security);
    section("Tests", guide.tests);
    section("Noch nicht verfügbar", guide.unavailable);
    lines.push("## Dokumentation", "");
    guide.docs.forEach(function (doc) { lines.push("- [" + doc.title + "](" + doc.url + ")"); });
    lines.push("", "Die Rollen und Skills sind exportierbare Anweisungen, keine installierten Tools. Keine Installation, Berechtigung oder Verbindung wurde durch diese Datei bestätigt.", "");
    return lines.join("\n");
  }
  function json(guide) { return JSON.stringify(guide, null, 2) + "\n"; }

  // No CDN, server-side ZIP service or external library. Store-only ZIP 2.0.
  // All bytes (including CRC32) are assembled inside the browser after a click.
  function zip(guide, assets) {
    if (!Array.isArray(assets)) throw new TypeError("ZIP assets must be an array.");
    const catalogueAsset = assets.find(item => item.target === "docs/catalogue.json");
    if (!catalogueAsset) throw new Error("Der Skill-Katalog fehlt.");
    const catalogue = JSON.parse(catalogueAsset.content);
    if (!Array.isArray(catalogue.skills) || catalogue.skills.length !== 30) throw new Error("Unvollständiger Skill-Katalog.");
    const required = catalogue.skills.map(skill => "skills/" + skill.id + "/SKILL.md");
    required.push("axiom-orchestrator.md");
    const paths = new Set(assets.map(item => item.target));
    for (const path of required) if (!paths.has(path)) throw new Error("Erforderliche Datei fehlt: " + path);
    const about = [
      "# Axiom 🐸 – Offline-Paket", "",
      "Dieses Paket enthält **alle 30 Axiom-Skills**, die Agenten-Definitionen,",
      "Orchestrator-Referenzen und deine im Wizard gewählte Setup-Konfiguration.", "",
      "## Einstieg", "",
      "1. Lies setup.md für deine gewählte Konfiguration.",
      "2. axiom-orchestrator.md enthält die zentralen Projektanweisungen.",
      "3. agents/ und skills/ enthalten die tatsächlichen Markdown-Regeln.",
      "4. Unterstützende Dateien liegen in den jeweiligen skills/*/references/ und scripts/.", "",
      "## Sicherheits- und Produktgrenze", "",
      "Ein ZIP installiert **keine** ChatGPT-Plugins, KI-Modelle oder MCP-Tools.",
      "Es aktiviert keine Connectoren, Berechtigungen, Tunnel oder Automationen.",
      "Skripte sind Quelldateien; führe sie nicht ungeprüft aus.",
      "Installer/Bridge-Setups werden ausdrücklich **nicht** mitgeliefert.",
      "Keine Tokens, Zugangsdaten oder Kontoinhalte werden exportiert.", "",
      "Die Datei package-files.json dokumentiert die Archivdateien.",
      ""
    ].join("\n");
    const entries = [
      {name:"README.md", text:about},
      {name:"setup.md", text:markdown(guide)},
      {name:"setup.json", text:json(guide)}
    ];
    for (const item of assets) {
      if (!item || typeof item.target !== "string" || typeof item.content !== "string") throw new TypeError("Ungültige Paketdatei.");
      entries.push({name:item.target, text:item.content});
    }
    entries.push({name:"package-files.json", text:JSON.stringify({
      format:"axiom-web-offline-package", version:1,
      skillCount:catalogue.skills.length,
      files:entries.map(entry => entry.name)
    }, null, 2) + "\n"});
    return writeZip(entries);
  }

  function writeZip(entries) {
    if (entries.length > 1000) throw new RangeError("Zu viele ZIP-Einträge.");
    const encoder = new TextEncoder();
    const put16 = (buffer, index, value) => {
      buffer[index] = value & 255; buffer[index + 1] = (value >>> 8) & 255;
    };
    const put32 = (buffer, index, value) => {
      put16(buffer, index, value & 65535); put16(buffer, index + 2, value >>> 16);
    };
    const crc32 = bytes => {
      let crc = 0xffffffff;
      for (const byte of bytes) {
        crc ^= byte;
        for (let n = 0; n < 8; n++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
      }
      return (crc ^ 0xffffffff) >>> 0;
    };
    const join = (parts, size) => {
      const all = new Uint8Array(size);
      let at = 0;
      for (const part of parts) {all.set(part, at); at += part.length;}
      return all;
    };
    const locals = [], directory = [], names = new Set();
    let localSize = 0, directorySize = 0;
    for (const entry of entries) {
      const path = entry.name;
      if (typeof path !== "string" || !/^[A-Za-z0-9._/-]+$/.test(path) ||
          path.startsWith("/") || path.split("/").some(part => !part || part === "." || part === "..") ||
          names.has(path)) throw new Error("Unsicherer oder doppelter ZIP-Pfad: " + path);
      names.add(path);
      const name = encoder.encode(path), data = encoder.encode(entry.text);
      if (name.length > 65535 || data.length > 8 * 1024 * 1024 || localSize + data.length > 16 * 1024 * 1024) {
        throw new RangeError("ZIP-Paket zu groß.");
      }
      const checksum = crc32(data);
      const local = new Uint8Array(30 + name.length);
      put32(local, 0, 0x04034b50); put16(local, 4, 20); put16(local, 6, 0x0800);
      put16(local, 12, 33); // 1980-01-01; reproducible archive
      put32(local, 14, checksum); put32(local, 18, data.length);
      put32(local, 22, data.length); put16(local, 26, name.length);
      local.set(name, 30);
      const central = new Uint8Array(46 + name.length);
      put32(central, 0, 0x02014b50); put16(central, 4, 20);
      put16(central, 6, 20); put16(central, 8, 0x0800);
      put16(central, 14, 33); put32(central, 16, checksum);
      put32(central, 20, data.length); put32(central, 24, data.length);
      put16(central, 28, name.length); put32(central, 42, localSize);
      central.set(name, 46);
      locals.push(local, data); directory.push(central);
      localSize += local.length + data.length;
      directorySize += central.length;
    }
    const ending = new Uint8Array(22);
    put32(ending, 0, 0x06054b50); put16(ending, 8, entries.length);
    put16(ending, 10, entries.length); put32(ending, 12, directorySize);
    put32(ending, 16, localSize);
    return join(locals.concat(directory, [ending]), localSize + directorySize + ending.length);
  }

  window.AxiomWizardExport = Object.freeze({markdown: markdown, json: json, zip: zip});
})();
