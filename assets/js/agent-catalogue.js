/* Axiom Web V1.3 – deterministic, instruction-only role/skill routing.
 * Mirrors assets/axiom/catalogue.json; nothing here installs or runs tools.
 */
(function () {
  "use strict";
  const profiles = Object.freeze({
  "orchestrator": {
    "name": "Axiom Orchestrator",
    "skills": [
      "axiom-orchestrator",
      "axiom-actions",
      "axiom-capabilities",
      "axiom-runtime",
      "axiom-settings",
      "axiom-state",
      "axiom-verification",
      "axiom-workflows"
    ]
  },
  "brain": {
    "name": "Brain Agent",
    "skills": [
      "axiom-brain",
      "axiom-documents",
      "axiom-contacts"
    ]
  },
  "code": {
    "name": "Code Agent",
    "skills": [
      "axiom-code",
      "axiom-project-manager",
      "axiom-research"
    ]
  },
  "security": {
    "name": "Security Agent",
    "skills": [
      "axiom-security",
      "axiom-auth",
      "axiom-connectors",
      "axiom-connect"
    ]
  },
  "design": {
    "name": "Design Agent",
    "skills": [
      "axiom-design"
    ]
  },
  "mail": {
    "name": "Mail Agent",
    "skills": [
      "axiom-mail",
      "axiom-notifications"
    ]
  },
  "calendar": {
    "name": "Calendar Agent",
    "skills": [
      "axiom-calendar",
      "axiom-automation"
    ]
  },
  "finance": {
    "name": "Finance Agent",
    "skills": [
      "axiom-finance"
    ]
  },
  "infrastructure": {
    "name": "Infrastructure Agent",
    "skills": [
      "axiom-infrastructure",
      "axiom-maintenance"
    ]
  },
  "learning": {
    "name": "Learning Agent",
    "skills": [
      "axiom-learning",
      "axiom-career"
    ]
  },
  "health": {
    "name": "Health Agent",
    "skills": [
      "axiom-health"
    ]
  },
  "onboarding": {
    "name": "Onboarding Agent",
    "skills": [
      "axiom-onboarding"
    ]
  }
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
    "remote-desktop": ["infrastructure", "security"],
    files: ["brain", "security"]
  });
  const byPurpose = Object.freeze({
    code: ["code"],
    mail: ["mail"],
    calendar: ["calendar"],
    server: ["infrastructure", "security", "health"],
    files: ["brain"],
    finance: ["finance"],
    learning: ["learning"],
    design: ["design"],
    research: ["code"]
  });
  const unique = items => Array.from(new Set(items));
  const resolve = function (config) {
    if (!config || typeof config !== "object" || !Array.isArray(config.integrations)) throw new TypeError("Ungültige Auswahl für Agentenauflösung.");
    if (!Object.hasOwn(byMode, config.mode)) throw new RangeError("Unbekannte Betriebsart für Agentenauflösung.");
    const purposes = config.purposes === undefined ? [] : config.purposes;
    if (!Array.isArray(purposes) || purposes.some(id => !Object.hasOwn(byPurpose, id)) || new Set(purposes).size !== purposes.length) throw new RangeError("Unbekannter oder doppelter Verwendungszweck.");
    const viaIntegrations = config.integrations.flatMap(id => {
      if (!Object.hasOwn(byIntegration, id)) throw new RangeError("Unbekannte Integration für Agentenauflösung: " + id);
      return byIntegration[id];
    });
    const agentIds = unique(all.concat(byMode[config.mode], viaIntegrations, purposes.flatMap(id => byPurpose[id])));
    const agents = agentIds.map(id => ({id: id, name: profiles[id].name, skills: profiles[id].skills.slice(), execution: "instruction-only"}));
    return {agentIds: agentIds, agents: agents, skillIds: unique(agents.flatMap(agent => agent.skills)), reason: "Regelbasiertes Routing V1.3; Markdown-Rollen und Skills führen selbst keine Tools aus."};
  };
  window.AxiomAgentCatalogue = Object.freeze({version: "1.3.0", resolve: resolve, profiles: profiles, rules: {all: all, byMode: byMode, byIntegration: byIntegration, byPurpose: byPurpose}});
})();
