/* Axiom Setup Wizard V1.1 – lokale, separat testbare Export-Serialisierung. */
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
    lines.push("## Schritt-für-Schritt-Einrichtung", "");
    guide.steps.forEach(function (item, i) { lines.push((i + 1) + ". **" + item.title + "** – " + item.detail); });
    lines.push("");
    section("Sicherheit", guide.security);
    section("Tests", guide.tests);
    section("Noch nicht verfügbar", guide.unavailable);
    lines.push("## Dokumentation", "");
    guide.docs.forEach(function (doc) { lines.push("- [" + doc.title + "](" + doc.url + ")"); });
    lines.push("", "Keine Installation, Berechtigung oder Verbindung wurde durch diese Datei bestätigt.", "");
    return lines.join("\n");
  }
  function json(guide) { return JSON.stringify(guide, null, 2) + "\n"; }
  window.AxiomWizardExport = Object.freeze({markdown: markdown, json: json});
})();
