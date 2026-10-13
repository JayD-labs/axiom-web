"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const source = name => fs.readFileSync(path.join(root, name), "utf8");
const sandbox = {window: {}};
for (const name of ["assets/js/setup-content.js","assets/js/agent-catalogue.js","assets/js/setup-wizard-data.js","assets/js/setup-export.js"]) {
  vm.runInNewContext(source(name), sandbox, {filename:name});
}
const catalogue=sandbox.window.AxiomGuide;
const rules=sandbox.window.AxiomWizardRules;
const exporter=sandbox.window.AxiomWizardExport;
const hardware=Object.keys(rules.hardware).filter(id=>id!=="none");
const plans=Object.keys(catalogue.plans);
const modes=Object.keys(catalogue.modes);
const integrations=Object.keys(catalogue.integrations);
const roleIds=Object.keys(rules.roles);
const cfg=(overrides={})=>({plan:"plus",hardware:["none"],roles:{},mode:"chatgpt",integrations:[],...overrides});
function guide(config){return rules.buildGuide(config,catalogue)}
function subsets(items){return Array.from({length:1<<items.length},(_,mask)=>items.filter((_,i)=>(mask&(1<<i))!==0));}
test("Catalogue and 6 role definitions are available without dependencies",()=>{
  assert.deepEqual(plans,["free","plus","pro"]);
  assert.equal(modes.length,3);
  assert.equal(roleIds.length,6);
  for(const role of roleIds) {
    assert.ok(rules.roles[role].steps);
    assert.ok(rules.roles[role].prerequisites.length);
  }
});
test("All 64 valid hardware selections preserve multiple devices and never mix none",()=>{
  const combos=[["none"],...subsets(hardware).filter(arr=>arr.length)];
  assert.equal(combos.length,64);
  for(const devices of combos){
    const roles=Object.fromEntries(devices.filter(id=>id!=="none").map(id=>[id,"admin"]));
    const result=guide(cfg({hardware:devices,roles}));
    assert.equal(JSON.stringify(result.selection.hardware),JSON.stringify(devices));
    assert.equal(result.hardware.assignments.length, devices.includes("none")?0:devices.length);
    assert.equal(new Set(result.selection.hardware).size,devices.length);
  }
});
test("none is strictly exclusive and invalid hardware combinations fail loudly",()=>{
  for(const device of hardware) assert.throws(()=>guide(cfg({hardware:["none",device]})),/schließt/);
  for(const device of hardware) assert.throws(()=>guide(cfg({hardware:[device,"none"]})),/schließt/);
  assert.throws(()=>guide(cfg({hardware:[]})),/Hardware/);
  assert.throws(()=>guide(cfg({hardware:["bogus"]})),/Hardware/);
  assert.throws(()=>guide(cfg({hardware:["pi","pi"]})),/doppelt/);
});
test("Each assigned hardware role creates its own prerequisites and guide step",()=>{
  for(const device of hardware)for(const role of roleIds){
    const result=guide(cfg({hardware:[device],roles:{[device]:role}}));
    assert.equal(result.selection.hardwareRoles[device],role);
    assert.equal(result.hardware.assignments[0].role,role);
    assert.ok(result.steps.some(step=>step.title.includes("Rolle einrichten:") && step.title.includes(rules.roles[role].label)));
    assert.ok(result.hardware.prerequisites.some(item=>item.includes(rules.roles[role].label)));
    assert.ok(result.tests.some(item=>item.includes(rules.roles[role].label)));
  }
});
test("Missing device roles are explicit blockers, not silently inferred",()=>{
  for(const device of hardware){
    const result=guide(cfg({hardware:[device],roles:{}}));
    assert.equal(result.compatibility.status,"blocked");
    assert.match(result.compatibility.blockers.join(" "),/Rolle fehlt/);
    assert.equal(result.hardware.assignments[0].role,null);
  }
});
test("Plans, modes, roles and integration combinations produce deterministic results",()=>{
  const selections=[["none"],...subsets(hardware).filter(a=>a.length)];
  let checked=0;
  const sets=subsets(integrations);
  for(const devices of selections)for(const plan of plans)for(const mode of modes)for(const selected of sets){
    const assignments=Object.fromEntries(devices.filter(id=>id!=="none").map((id,i)=>[id,mode==="hybrid"&&i===0?"remote":mode==="bridge"&&i===0?"mcp":"admin"]));
    const result=guide(cfg({plan,mode,hardware:devices,roles:assignments,integrations:selected}));
    assert.ok(["supported","conditional","blocked"].includes(result.compatibility.status));
    assert.equal(result.selection.plan,plan);
    assert.equal(result.selection.mode,mode);
    assert.equal(result.selection.integrations.length,selected.length);
    assert.equal(result.selection.hardware.length,devices.length);
    assert.ok(result.steps.length>0);
    assert.match(result.notice,/Keine Installation/);
    if(result.compatibility.blockers.length) assert.equal(result.compatibility.status,"blocked");
    else if(result.compatibility.conditions.length) assert.equal(result.compatibility.status,"conditional");
    checked++;
  }
  assert.equal(checked,64*3*3*(2**integrations.length));
});
test("Known unsupported configurations provide actionable causes and alternatives",()=>{
  for(const deferred of ["business","enterprise","none","edu"]) assert.throws(()=>guide(cfg({plan:deferred})),/Unbekannter ChatGPT-Plan/);
  const hybridNoHardware=guide(cfg({mode:"hybrid"}));
  assert.equal(hybridNoHardware.compatibility.status,"blocked");
  const hybridNoRemote=guide(cfg({mode:"hybrid",hardware:["mac"],roles:{mac:"admin"}}));
  assert.equal(hybridNoRemote.compatibility.status,"blocked");
  assert.match(hybridNoRemote.compatibility.blockers.join(" "),/Remote-Ziel/);
  const plusCustomMcp=guide(cfg({mode:"bridge",hardware:["pi"],roles:{pi:"mcp"}}));
  assert.equal(plusCustomMcp.compatibility.status,"blocked");
  assert.match(plusCustomMcp.compatibility.blockers.join(" "),/separater MCP-fähiger Client/);
  const nasMcp=guide(cfg({plan:"pro",mode:"bridge",hardware:["nas"],roles:{nas:"mcp"}}));
  assert.equal(nasMcp.compatibility.status,"conditional");
  assert.match(nasMcp.compatibility.conditions.join(" "),/MCP-Laufzeit/);
  const other=guide(cfg({hardware:["other"],roles:{other:"other"}}));
  assert.equal(other.compatibility.status,"conditional");
});
test("Invalid objects, input types, role and integration identifiers are rejected",()=>{
  for(const invalid of [
    null,[],{},cfg({plan:"premium"}),cfg({mode:"invalid"}),cfg({hardware:null}),
    cfg({hardware:"pi"}),cfg({integrations:null}),cfg({integrations:["nope"]}),
    cfg({integrations:["github","github"]}),cfg({roles:[]}),
    cfg({roles:{pi:"remote"}}),cfg({hardware:["pi"],roles:{pi:"unknown"}}),
    cfg({hardware:["none"],roles:{none:"admin"}})
  ]) assert.throws(()=>guide(invalid));
});
test("JSON export uses schemaVersion 5 and preserves device-role mapping plus agents",()=>{
  const c=cfg({plan:"pro",mode:"bridge",hardware:["pi","linux","mac"],roles:{pi:"mcp",linux:"storage",mac:"admin"},integrations:["github","calendar"]});
  const before=JSON.stringify(c);
  const value=exporter.json(guide(c));
  const data=JSON.parse(value);
  assert.equal(data.schemaVersion,5);
  assert.equal(JSON.stringify(data.selection.hardwareRoles),JSON.stringify(c.roles));
  assert.equal(JSON.stringify(data.selection.hardware),JSON.stringify(c.hardware));
  assert.equal(data.hardware.assignments.length,3);
  assert.deepEqual(data.agentPackage.agentIds,["orchestrator","onboarding","infrastructure","security","code","calendar"]);
  assert.ok(data.agentPackage.skillIds.includes("axiom-security"));
  assert.ok(value.endsWith("\n"));
  assert.equal(JSON.stringify(c),before);
});
test("Markdown export includes roles, requirements, steps, status and safety notice",()=>{
  const result=guide(cfg({plan:"pro",mode:"bridge",hardware:["pi","mac"],roles:{pi:"mcp",mac:"admin"},integrations:["github"]}));
  const md=exporter.markdown(result);
  assert.match(md,/# Axiom/);
  assert.match(md,/## Geräterollen/);
  assert.match(md,/Raspberry Pi: Eigener MCP-Server/);
  assert.match(md,/macOS: Entwicklung/);
  assert.match(md,/## Schritt-für-Schritt-Einrichtung/);
  assert.match(md,/## Ausgewählte Axiom-Rollen/);
  assert.match(md,/## Kompatibilität/);
  assert.match(md,/Keine Installation, Berechtigung oder Verbindung wurde/);
});
test("HTML structure, script load order, focus hooks, responsive rules and privacy are preserved",()=>{
  const html=source("index.html"), css=source("assets/css/styles.css"), ui=source("assets/js/setup.js");
  for(const id of ["wizard-device-roles","wizard-roles-panel","wizard-role-error","wizard-progress","wizard-back","wizard-next",
    "wizard-purposes","wizard-plugin-hint","wizard-result-connector-status","wizard-result-installation",
    ...Array.from({length:5},(_,i)=>"wizard-step-heading-"+i)]) assert.ok(html.includes('id="'+id+'"'),id);
  const scripts=["setup-content.js","agent-catalogue.js","setup-wizard-data.js","setup-export.js","setup.js"];
  for(let i=1;i<scripts.length;i++) assert.ok(html.indexOf('src="./assets/js/'+scripts[i-1]+'"')<html.indexOf('src="./assets/js/'+scripts[i]+'"'));
  assert.match(html,/aria-live="assertive"/);
  assert.match(html,/tabindex="-1"/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/wizard-role-grid/);
  assert.match(ui,/\.focus\(\)/);
  assert.match(ui,/wizard-back/);
  assert.match(ui,/wizard-next/);
  assert.match(ui,/axiom-setup-v1\.3\.json/);
  assert.match(html,/connect-src 'self'/);
  assert.match(html,/rel="icon" type="image\/svg\+xml" href="\.\/assets\/favicon\.svg"/);
  assert.match(source("assets/favicon.svg"),/viewBox="0 0 128 128"/);
  // ZIP assets are loaded on demand from our own static origin; no outbound
  // requests, background upload, storage or external API are permitted.
  assert.match(ui,/fetch\("\.\/assets\/axiom\/export-manifest\.json"/);
  assert.match(ui,/fetch\("\.\/" \+ item\.source\)/);
  assert.doesNotMatch(ui,/fetch\(['"`]https?:\/\//);
  for(const file of ["setup.js","setup-wizard-data.js","setup-export.js"]) {
    const data=source("assets/js/"+file);
    assert.doesNotMatch(data,/\b(XMLHttpRequest|WebSocket|localStorage|sessionStorage|sendBeacon)\s*\(/);
  }
});

test("V1.3 purpose selection maps to verified instruction-only agent descriptions",()=>{
  const all=Object.keys(catalogue.purposes);
  const selected=guide(cfg({purposes:all,integrations:["github","files"]}));
  assert.deepEqual(Array.from(selected.selection.purposes),all);
  assert.equal(selected.agentPackage.agents.some(a=>a.id==="brain"),true);
  assert.equal(selected.agentPackage.agents.some(a=>a.id==="design"),true);
  assert.equal(selected.agentPackage.agents.some(a=>a.id==="finance"),true);
  assert.equal(selected.agentPackage.agents.every(a=>a.execution==="instruction-only"),true);
  assert.equal(selected.integrationCatalogue.kind,"static-curated");
  assert.equal(selected.integrationRequirements.length,2);
  for(const requirement of selected.integrationRequirements){
    assert.equal(requirement.status.selected,true);
    assert.equal(requirement.status.configured,false);
    assert.equal(requirement.status.available,"unverified");
    assert.equal(requirement.status.installed,"unverified");
    assert.equal(requirement.status.connected,"unverified");
    assert.equal(requirement.status.authorized,"unverified");
    assert.equal(requirement.status.executable,"unverified");
    assert.equal(requirement.status.verified,false);
  }
  assert.equal(selected.installation.chatgptZipImportSupported,false);
  assert.match(exporter.markdown(selected),/Installation und manuelle Konfiguration/);
});
test("Purpose and integration input validation denies unknown and duplicate selections",()=>{
  assert.throws(()=>guide(cfg({purposes:"code"})),/Verwendungszweck/);
  assert.throws(()=>guide(cfg({purposes:["bogus"]})),/Verwendungszweck/);
  assert.throws(()=>guide(cfg({purposes:["code","code"]})),/Verwendungszweck/);
  assert.throws(()=>guide(cfg({integrations:["files","files"]})),/doppelt/);
  const selected=guide(cfg({purposes:["files"],integrations:["files"]}));
  assert.ok(selected.agentPackage.agentIds.includes("brain"));
  assert.ok(selected.agentPackage.agentIds.includes("security"));
});

test("Public plan catalogue is Free, Plus and Pro only",()=> {
  assert.deepEqual(Object.keys(catalogue.plans),["free","plus","pro"]);
  assert.equal(catalogue.supportedPlans.length,3);
  for(const mode of modes) assert.deepEqual(Object.keys(catalogue.combinations[mode]),["free","plus","pro"]);
  for(const unsupported of ["business","enterprise","edu","none"]) assert.equal(Object.hasOwn(catalogue.plans,unsupported),false);
});
