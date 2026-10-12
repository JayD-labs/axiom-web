"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");
const manifest = JSON.parse(read("assets/axiom/export-manifest.json"));
const catalogue = JSON.parse(read("assets/axiom/catalogue.json"));
const context = vm.createContext({window:{}, TextEncoder});
for(const file of ["setup-content.js", "agent-catalogue.js", "setup-wizard-data.js", "setup-export.js"]) {
  vm.runInContext(read("assets/js/" + file), context, {filename:file});
}
const guide = context.window.AxiomWizardRules.buildGuide({
  plan:"plus", hardware:["none"], roles:{}, mode:"chatgpt", integrations:[]
}, context.window.AxiomGuide);
const assets = () => manifest.files.map(item => ({target:item.target,content:read(item.source)}));

function storedZipFiles(buffer) {
  const zip = Buffer.from(buffer);
  const entries = new Map();
  let index = 0;
  while(index < zip.length && zip.readUInt32LE(index) === 0x04034b50) {
    assert.equal(zip.readUInt16LE(index + 8), 0, "uncompressed store method");
    assert.equal(zip.readUInt16LE(index + 6), 0x0800, "UTF-8 names");
    const length = zip.readUInt32LE(index + 18);
    const filenameLength = zip.readUInt16LE(index + 26);
    const extraLength = zip.readUInt16LE(index + 28);
    const name = zip.toString("utf8", index + 30, index + 30 + filenameLength);
    const begin = index + 30 + filenameLength + extraLength;
    const content = zip.subarray(begin,begin + length).toString("utf8");
    assert.ok(!entries.has(name),"duplicate zip entry " + name);
    entries.set(name,content);
    index = begin + length;
  }
  assert.equal(zip.readUInt32LE(index), 0x02014b50, "central directory present");
  assert.equal(zip.readUInt32LE(zip.length - 22), 0x06054b50, "end record present");
  assert.equal(zip.readUInt16LE(zip.length - 14), entries.size, "central directory count");
  return entries;
}

test("Manifest contains each file and every original skill exactly once", () => {
  assert.equal(manifest.format, "axiom-web-offline-assets");
  assert.equal(manifest.version, 1);
  const sources = manifest.files.map(item => item.source);
  const targets = manifest.files.map(item => item.target);
  assert.equal(new Set(sources).size, sources.length);
  assert.equal(new Set(targets).size, targets.length);
  for (const file of manifest.files) assert.ok(fs.existsSync(path.join(root,file.source)),file.source);
  for(const skill of catalogue.skills) {
    const target = "skills/" + skill.id + "/SKILL.md";
    assert.ok(targets.includes(target),target);
    assert.match(read("assets/axiom/" + target), /^---\nname: axiom-/);
  }
  assert.equal(catalogue.skills.length, 30);
  assert.ok(targets.some(name => name.startsWith("skills/axiom-orchestrator/references/docs/")));
  assert.ok(targets.includes("agents/agent-code.md"));
  assert.ok(targets.includes("axiom-orchestrator.md"));
});

test("Real ZIP includes 30 original skills, agent markdown, setup and supporting files", () => {
  const data = storedZipFiles(context.window.AxiomWizardExport.zip(guide,assets()));
  assert.equal(data.size, manifest.files.length + 4);
  assert.equal(data.get("skills/axiom-code/SKILL.md"),read("assets/axiom/skills/axiom-code/SKILL.md"));
  assert.equal(data.get("agents/agent-security.md"),read("assets/axiom/agents/agent-security.md"));
  assert.equal(data.get("skills/axiom-orchestrator/references/docs/setup.md"),read("assets/axiom/skills/axiom-orchestrator/references/docs/setup.md"));
  const config = JSON.parse(data.get("setup.json"));
  assert.equal(config.selection.mode,"chatgpt");
  assert.equal(config.agentPackage.agentIds[0],"orchestrator");
  assert.match(data.get("setup.md"),/Ausgewählte Axiom-Rollen/);
  assert.match(data.get("README.md"),/alle 30 Axiom-Skills/);
  assert.equal(JSON.parse(data.get("package-files.json")).skillCount,30);
});

test("ZIP rejects incomplete data and path traversal instead of creating partial archive", () => {
  assert.throws(() => context.window.AxiomWizardExport.zip(guide,assets().filter(file => file.target !== "skills/axiom-mail/SKILL.md")),/Erforderliche Datei fehlt/);
  const invalid = assets();
  invalid.push({target:"../breakout.md",content:"bad"});
  assert.throws(() => context.window.AxiomWizardExport.zip(guide,invalid),/ZIP-Pfad/);
});
