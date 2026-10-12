/* Axiom Web V1.2 – local selection rules for instruction-only agents and skills.
 * The authoritative inventory is assets/axiom/catalogue.json. This file keeps
 * only deterministic browser selection logic; it performs no network request. */
(function () {
  "use strict";
  const profiles = Object.freeze({
    orchestrator: {name: "Axiom Orchestrator", skills: ["axiom-orchestrator", "axiom-actions", "axiom-capabilities", "axiom-runtime", "axiom-settings", "axiom-state", "axiom-verification", "axiom-workflows"]},
    code: {name: "Code Agent", skills: ["axiom-code", "axiom-project-manager", "axiom-research"]},
    mail: {name: "Mail Agent", skills: ["axiom-mail", "axiom-notifications"]},
    calendar: {name: "Calendar Agent", skills: ["axiom-calendar", "axiom-automation"]},
    security: {name: "Security Agent", skills: ["axiom-security", "axiom-auth", "axiom-connectors", "axiom-connect"]},
    infrastructure: {name: "Infrastructure Agent", skills: ["axiom-infrastructure", "axiom-maintenance"]}
  });
  const all = Object.freeze(["orchestrator"]);
  const byMode = Object.freeze({
    chatgpt: [],
    hybrid: ["infrastructure"],
    bridge: ["infrastructure", "security"]
  });
  const byIntegration = Object.freeze({
    github: ["code"],
    outlook: ["mail"],
    calendar: ["calendar"],
    "remote-desktop": ["infrastructure", "security"]
  });
  const unique = items => Array.from(new Set(items));
  const resolve = function (config) {
    if (!config || typeof config !== "object" || !Array.isArray(config.integrations)) throw new TypeError("Ungültige Auswahl für Agentenauflösung.");
    if (!Object.hasOwn(byMode, config.mode)) throw new RangeError("Unbekannte Betriebsart für Agentenauflösung.");
    const agentIds = unique(all.concat(byMode[config.mode], config.integrations.flatMap(id => {
      if (!Object.hasOwn(byIntegration, id)) throw new RangeError("Unbekannte Integration für Agentenauflösung: " + id);
      return byIntegration[id];
    })));
    const agents = agentIds.map(id => ({id: id, name: profiles[id].name, skills: profiles[id].skills.slice()}));
    return {agentIds: agentIds, agents: agents, skillIds: unique(agents.flatMap(agent => agent.skills)), reason: "Auswahlregel V1.2; Rollen und Skills sind nur Dokumentations-/Exportgrundlage."};
  };
  window.AxiomAgentCatalogue = Object.freeze({version: "1.2.0", resolve: resolve, profiles: profiles, rules: {all: all, byMode: byMode, byIntegration: byIntegration}});
})();
