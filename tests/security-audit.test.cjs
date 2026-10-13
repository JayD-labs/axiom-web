"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const win={};
const sandbox={window:win,TextEncoder};
for(const file of ["setup-content.js","agent-catalogue.js","setup-wizard-data.js","setup-export.js"]){
  vm.runInNewContext(read("assets/js/"+file),sandbox,{filename:file});
}
const catalogue=JSON.parse(read("assets/axiom/catalogue.json"));
const manifest=JSON.parse(read("assets/axiom/export-manifest.json"));
const assets=()=>manifest.files.map(x=>({target:x.target,content:read(x.source)}));
const config={plan:"plus",mode:"chatgpt",hardware:["none"],roles:{},integrations:[],purposes:[]};
const guide=()=>win.AxiomWizardRules.buildGuide(config,win.AxiomGuide);

test("Security: invalid profile, purpose and connector identifiers are rejected",()=>{
  for(const payload of ["__proto__","constructor","prototype","<script>alert(1)</script>","../../etc/passwd","github?token=x"]){
    assert.throws(()=>win.AxiomWizardRules.buildGuide({...config,plan:payload},win.AxiomGuide));
    assert.throws(()=>win.AxiomWizardRules.buildGuide({...config,integrations:[payload]},win.AxiomGuide));
    assert.throws(()=>win.AxiomWizardRules.buildGuide({...config,purposes:[payload]},win.AxiomGuide));
  }
  for(const unsupported of ["none","business","enterprise","edu"]){
    assert.throws(()=>win.AxiomWizardRules.buildGuide({...config,plan:unsupported},win.AxiomGuide));
  }
});

test("Security: hostile export ZIP paths are rejected",()=>{
  for(const target of ["../secret","/absolute.md","C:/secret","a/../../secret","a//b","a/./b","a\\b","//other/file"]){
    const injected=assets().concat([{target,content:"placeholder"}]);
    assert.throws(()=>win.AxiomWizardExport.zip(guide(),injected),/ZIP-Pfad|ZIP.*[Pp]fad/,"unsafe path "+target);
  }
  const duplicated=assets();duplicated.push(duplicated[0]);
  assert.throws(()=>win.AxiomWizardExport.zip(guide(),duplicated),/Doppelte ZIP-Pfade/);
});

test("Security: no fake installed/connected state or direct ZIP plugin installer",()=>{
  const g=win.AxiomWizardRules.buildGuide({...config,integrations:["github","outlook","files"]},win.AxiomGuide);
  assert.equal(g.installation.chatgptZipImportSupported,false);
  assert.equal(g.integrationCatalogue.kind,"static-curated");
  for(const item of g.integrationRequirements){
    assert.equal(item.status.selected,true);
    assert.equal(item.status.configured,false);
    assert.equal(item.status.installed,"unverified");
    assert.equal(item.status.connected,"unverified");
    assert.equal(item.status.authorized,"unverified");
    assert.equal(item.status.verified,false);
  }
  assert.equal(catalogue.pluginPackage.chatgptImportSupported,false);
});

test("Security: public HTML contains an explicit safe favicon and local-only CSP",()=>{
  const html=read("index.html");
  assert.match(html,/rel="icon" type="image\/svg\+xml" href="\.\/assets\/favicon\.svg"/);
  assert.match(html,/default-src 'none'/);
  assert.match(html,/script-src 'self'/);
  assert.match(html,/connect-src 'self'/);
  assert.match(html,/form-action 'none'/);
  assert.doesNotMatch(html,/<script\b(?![^>]*src=)/i);
  assert.doesNotMatch(html,/\son(?:load|error|click|focus)\s*=/i);
  const svg=read("assets/favicon.svg");
  assert.doesNotMatch(svg,/<(?:script|foreignObject|image)\b/i);
  assert.doesNotMatch(svg,/\bonload\s*=/i);
});

test("Security: manifest covers every versioned skill and agent exactly once",()=>{
  const src=new Set(manifest.files.map(x=>x.source));
  const dest=new Set(manifest.files.map(x=>x.target));
  assert.equal(src.size,manifest.files.length);
  assert.equal(dest.size,manifest.files.length);
  assert.equal(catalogue.skills.length,30);
  assert.equal(catalogue.agents.length,12);
  for(const skill of catalogue.skills)assert.ok(dest.has("skills/"+skill.id+"/SKILL.md"));
  for(const agent of catalogue.agents)assert.ok(src.has(agent.definition.slice(1)));
});
