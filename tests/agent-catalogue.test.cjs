"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const catalogue = JSON.parse(read("assets/axiom/catalogue.json"));
const schema = JSON.parse(read("assets/axiom/plugin-package.schema.json"));
const sandbox = {window:{}};
vm.runInNewContext(read("assets/js/agent-catalogue.js"), sandbox, {filename:"assets/js/agent-catalogue.js"});
const resolver = sandbox.window.AxiomAgentCatalogue;

test("V1.3 catalogue contains 30 unique valid instruction-only skills", () => {
  assert.equal(catalogue.catalogueVersion, "1.3.0");
  assert.equal(catalogue.executionModel, "instruction-only");
  assert.equal(catalogue.skills.length, 30);
  const ids = catalogue.skills.map(skill => skill.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(catalogue.skills.map(skill => skill.name)).size, catalogue.skills.length, "no duplicate skill definitions");
  for (const skill of catalogue.skills) {
    assert.match(skill.id, /^axiom-[a-z0-9-]+$/);
    assert.equal(skill.execution, "instruction-only");
    assert.ok(skill.activation.length > 8);
    assert.ok(skill.constraints.length > 0);
  }
});

test("Every agent has a valid unique ID, definition and declared skills", () => {
  const ids = new Set(catalogue.skills.map(skill => skill.id));
  const agents = catalogue.agents.map(agent => agent.id);
  assert.equal(agents.length,12);
  assert.equal(new Set(agents).size, agents.length);
  assert.equal(new Set(catalogue.agents.map(agent => agent.definition)).size, catalogue.agents.length, "no duplicate agent definitions");
  for (const agent of catalogue.agents) {
    assert.match(agent.id, /^[a-z][a-z0-9-]*$/);
    assert.ok(agent.skills.length > 0);
    assert.ok(agent.skills.every(id => ids.has(id)), agent.id + " maps only known skills");
    assert.ok(fs.existsSync(path.join(root, agent.definition.replace(/^\//, ""))), agent.definition);
  }
});

test("Browser selection selects valid roles and skills deterministically", () => {
  const selected = resolver.resolve({mode:"hybrid", integrations:["github", "remote-desktop"]});
  assert.deepEqual(Array.from(selected.agentIds), ["orchestrator", "infrastructure", "code", "security"]);
  assert.ok(selected.skillIds.includes("axiom-code"));
  assert.ok(selected.skillIds.includes("axiom-security"));
  for (const agent of selected.agents) {
    const declared = catalogue.agents.find(item => item.id === agent.id);
    assert.deepEqual(Array.from(agent.skills), declared.skills, agent.id + " keeps the central skill mapping");
  }
  assert.deepEqual(Object.keys(resolver.profiles).sort(), agents.slice().sort());
  const all=resolver.resolve({mode:"chatgpt", integrations:[], purposes:["code","mail","calendar","server","files","finance","learning","design"]});
  assert.ok(all.agentIds.includes("health"));
  assert.ok(all.agentIds.includes("finance"));
  assert.ok(all.agentIds.includes("brain"));
  assert.ok(all.agentIds.includes("design"));
  assert.throws(() => resolver.resolve({mode:"wrong", integrations:[]}), /Betriebsart/);
  assert.throws(() => resolver.resolve({mode:"chatgpt", integrations:["wrong"]}), /Integration/);
});

test("Private package contract cannot be mistaken for a ChatGPT manifest or carry credentials", () => {
  assert.equal(catalogue.pluginPackage.chatgptImportSupported, false);
  assert.equal(catalogue.pluginPackage.credentialPolicy, "forbidden");
  assert.equal(schema.properties.format.const, "axiom-web-private-package");
  const source = [read("assets/axiom/catalogue.json"), read("assets/axiom/plugin-package.schema.json"), read("assets/js/agent-catalogue.js")].join("\n");
  assert.doesNotMatch(source, /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}/);
});
