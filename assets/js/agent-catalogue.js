/* Axiom Web V1.4 – routing for 14 verified plugin role definitions.
 * System skills are always available as instructions, never as executable agents.
 * Mirrors assets/axiom/catalogue.json; zero automatic authorization/install.
 */
(function () {
  "use strict";
  const profiles = Object.freeze({
  "auth": {
    "name": "Auth Agent",
    "skills": [
      "axiom-auth",
      "axiom-security"
    ]
  },
  "automation": {
    "name": "Automation Agent",
    "skills": [
      "axiom-automation",
      "axiom-workflows",
      "axiom-notifications"
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
  "calendar": {
    "name": "Calendar Agent",
    "skills": [
      "axiom-calendar",
      "axiom-automation"
    ]
  },
  "career": {
    "name": "Career Agent",
    "skills": [
      "axiom-career"
    ]
  },
  "code": {
    "name": "Code Agent",
    "skills": [
      "axiom-code"
    ]
  },
  "design": {
    "name": "Design Agent",
    "skills": [
      "axiom-design"
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
      "axiom-maintenance",
      "axiom-health"
    ]
  },
  "learning": {
    "name": "Learning Agent",
    "skills": [
      "axiom-learning"
    ]
  },
  "mail": {
    "name": "Mail Agent",
    "skills": [
      "axiom-mail",
      "axiom-notifications"
    ]
  },
  "project-manager": {
    "name": "Project Manager Agent",
    "skills": [
      "axiom-project-manager",
      "axiom-workflows"
    ]
  },
  "research": {
    "name": "Research Agent",
    "skills": [
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
  }
});
  const all = Object.freeze(["brain"]);
  const byMode = Object.freeze({
    chatgpt: [], hybrid: ["infrastructure"], bridge: ["infrastructure","security","auth"]
  });
  const byIntegration = Object.freeze({
    github: ["code","project-manager"], outlook: ["mail"], calendar: ["calendar","automation"],
    "remote-desktop": ["infrastructure","security","auth"], files: ["brain","security"]
  });
  const byPurpose = Object.freeze({
    code: ["code","project-manager"], mail: ["mail"], calendar: ["calendar","automation"],
    server: ["infrastructure","security"], files: ["brain"], finance: ["finance"],
    learning: ["learning","career"], design: ["design"], research: ["research"]
  });
  const systemSkillIds = Object.freeze(["axiom-orchestrator","axiom-onboarding","axiom-actions","axiom-capabilities","axiom-runtime","axiom-verification"]);
  const unique = items => Array.from(new Set(items));
  const resolve = function (config) {
    if (!config || typeof config !== "object" || !Array.isArray(config.integrations)) throw new TypeError("Ungültige Auswahl für Agentenauflösung.");
    if (!Object.hasOwn(byMode, config.mode)) throw new RangeError("Unbekannte Betriebsart für Agentenauflösung.");
    const purposes = config.purposes === undefined ? [] : config.purposes;
    if (!Array.isArray(purposes) || purposes.some(id => !Object.hasOwn(byPurpose,id)) || new Set(purposes).size !== purposes.length)
      throw new RangeError("Unbekannter oder doppelter Verwendungszweck.");
    if (new Set(config.integrations).size !== config.integrations.length) throw new RangeError("Doppelte Integration.");
    const viaIntegrations = config.integrations.flatMap(id => {
      if (!Object.hasOwn(byIntegration,id)) throw new RangeError("Unbekannte Integration für Agentenauflösung: " + id);
      return byIntegration[id];
    });
    const agentIds = unique(all.concat(byMode[config.mode],viaIntegrations,purposes.flatMap(id=>byPurpose[id])));
    const agents = agentIds.map(id=>({id,name:profiles[id].name,skills:profiles[id].skills.slice(),execution:"instruction-only"}));
    return {agentIds,agents,systemSkillIds:systemSkillIds.slice(),
      skillIds:unique(systemSkillIds.concat(agents.flatMap(agent=>agent.skills))),
      reason:"14 echte Markdown-Fachrollen plus separat ausgewiesene System-Skills; Routing ist instruktionsbasiert. Keine selbstständigen Agentenprozesse."};
  };
  window.AxiomAgentCatalogue = Object.freeze({version:"1.4.0",resolve,profiles,rules:{all,byMode,byIntegration,byPurpose}});
})();
