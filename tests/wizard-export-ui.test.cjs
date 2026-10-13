"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = name => fs.readFileSync(path.join(root, name), "utf8");

function createBrowser() {
  const byId = new Map();
  const downloads = [];
  const documents = [];
  let doc;
  class Element {
    constructor(tag, content = "") {
      this.tag = tag;
      this._text = content;
      this.children = [];
      this.parent = null;
      this.listeners = {};
      this._id = "";
      this.className = "";
      this.dataset = {};
      this.hidden = false;
      this.value = "";
      this.classList = {toggle() {}};
    }
    set id(value) {this._id = value; byId.set(value, this);}
    get id() {return this._id;}
    set textContent(text) {this.replaceChildren(); this._text = String(text);}
    get textContent() {return this._text + this.children.map(c => c.textContent).join("");}
    append(...children) {
      for (const child of children) {
        if (typeof child === "string") {
          this.append(new Element("#text", child));
        } else {
          if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1);
          child.parent = this;
          this.children.push(child);
        }
      }
    }
    replaceChildren(...children) {
      for (const child of this.children) child.parent = null;
      this.children = [];
      this._text = "";
      this.append(...children);
    }
    addEventListener(name, fn) {(this.listeners[name] ||= []).push(fn);}
    dispatch(name) {for (const callback of this.listeners[name] || []) callback();}
    querySelector(selector) {return this.querySelectorAll(selector)[0] || null;}
    querySelectorAll(selector) {
      const hits = [];
      const matches = node => selector === "input" && node.tag === "input" ||
        selector.startsWith(".") && node.className.split(/\s+/).includes(selector.slice(1)) ||
        selector === "li" && node.tag === "li";
      const walk = node => {
        for (const child of node.children) {
          if (matches(child)) hits.push(child);
          walk(child);
        }
      };
      walk(this);
      return hits;
    }
    setAttribute(name, value) {(this.attributes ||= {})[name] = value;}
    removeAttribute(name) {if (this.attributes) delete this.attributes[name];}
    focus() {doc.activeElement = this;}
    scrollIntoView() {}
    remove() {if (this.parent) this.parent.children.splice(this.parent.children.indexOf(this), 1);}
    click() {
      if (this.tag === "a" && this.download) downloads.push({name: this.download, url:this.href});
      this.dispatch("click");
    }
  }
  doc = {
    body: new Element("body"),
    activeElement: null,
    createElement: tag => new Element(tag),
    createTextNode: text => new Element("#text", String(text)),
    getElementById: id => byId.get(id) || null,
    querySelectorAll: selector => {
      if (selector === ".wizard-choice" || selector === ".wizard-stage") return doc.body.querySelectorAll(selector);
      if (selector === "#wizard-step-markers li") return doc.getElementById("wizard-step-markers").querySelectorAll("li");
      throw Error("Unexpected selector: " + selector);
    }
  };
  const ids = [
    "setup","wizard-device-roles","wizard-roles-panel","wizard-role-error",
    "wizard-plans","wizard-hardware","wizard-modes","wizard-purposes","wizard-integrations","wizard-plugin-hint",
    "wizard-result-status","wizard-result-summary","wizard-result-issues",
    "wizard-result-specs","wizard-result-steps","wizard-result-security",
    "wizard-result-tests","wizard-result-unavailable","wizard-result-docs","wizard-result-connector-status","wizard-result-installation",
    "wizard-integration-guides","wizard-integration-title","wizard-context",
    "wizard-context-title","wizard-context-detail","wizard-context-status",
    "wizard-context-notes","wizard-back","wizard-next","wizard-current",
    "wizard-progress","wizard-json","wizard-markdown","wizard-zip","wizard-zip-status","wizard-step-markers"
  ];
  for (const id of ids) {
    const el = new Element("div"); el.id = id; doc.body.append(el);
  }
  for (let i = 0; i < 5; i++) {
    const stage = new Element("div");
    stage.className = "wizard-stage";
    stage.dataset.stage = String(i);
    doc.body.append(stage);
    const heading = new Element("h3");heading.id = "wizard-step-heading-" + i;stage.append(heading);
    const li = new Element("li");doc.getElementById("wizard-step-markers").append(li);
  }
  const blobs = new Map();
  const api = {
    createObjectURL(blob) {const uri="blob:mock-"+blobs.size;blobs.set(uri,blob);return uri;},
    revokeObjectURL() {}
  };
  const ctx = vm.createContext({
    window:{},document:doc,Blob,URL:api,setTimeout() {}
  });
  for (const name of ["assets/js/setup-content.js","assets/js/agent-catalogue.js","assets/js/setup-wizard-data.js","assets/js/setup-export.js","assets/js/setup.js"]) vm.runInContext(read(name),ctx,{filename:name});
  function choose(group,value) {
    const labels = doc.getElementById("wizard-"+group).querySelectorAll(".wizard-choice");
    const input = labels.map(label=>label.querySelector("input")).find(input=>input.value===value);
    assert.ok(input, group+" / "+value);
    input.checked = true; input.dispatch("change");
  }
  function role(device,assignedRole) {
    const select=doc.getElementById("wizard-role-"+device);
    assert.ok(select,"role select for "+device);
    select.value=assignedRole; select.dispatch("change");
  }
  async function exportFile(type) {
    doc.getElementById(type==="json"?"wizard-json":"wizard-markdown").click();
    const item=downloads.at(-1);
    assert.ok(item && item.name.endsWith(type==="json"?".json":".md"));
    return {name:item.name,contents:await blobs.get(item.url).text()};
  }
  return {doc,choose,role,exportFile,downloads};
}

test("Regression: displayed multi-device selection and compatibility match JSON and Markdown downloads",async()=>{
  const app=createBrowser();
  app.choose("hardware","pi");
  app.choose("hardware","mac");
  app.role("pi","remote");
  app.role("mac","admin");
  app.choose("modes","hybrid");
  app.choose("purposes","code");
  app.choose("integrations","github");
  // Drive the same Back/Next callbacks that an end user invokes.
  for(let i=0;i<4;i++) app.doc.getElementById("wizard-next").click();
  assert.match(app.doc.getElementById("wizard-current").textContent,/Schritt 5 von 5/);
  const summary=app.doc.getElementById("wizard-result-summary").textContent;
  const status=app.doc.getElementById("wizard-result-status").textContent;
  const display=app.doc.getElementById("wizard-result-specs").textContent;
  assert.match(summary,/Raspberry Pi \+ macOS/);
  assert.equal(status,"Unter Voraussetzungen möglich");
  assert.match(display,/Raspberry Pi → Remote-Ziel/);
  assert.match(display,/macOS → Entwicklung/);

  const json=await app.exportFile("json");
  const data=JSON.parse(json.contents);
  assert.deepEqual(data.selection.hardware,["pi","mac"]);
  assert.deepEqual(data.selection.hardwareRoles,{pi:"remote",mac:"admin"});
  assert.deepEqual(data.selection.integrations,["github"]);
  assert.deepEqual(data.selection.purposes,["code"]);
  assert.equal(data.schemaVersion,6);
  assert.equal(data.installation.chatgptZipImportSupported,false);
  assert.equal(data.integrationRequirements[0].status.connected,"unverified");
  assert.equal(data.selection.mode,"hybrid");
  assert.equal(data.compatibility.status,"conditional");
  assert.deepEqual(data.agentPackage.agentIds,["brain","infrastructure","code","project-manager"]);
  assert.equal(data.summary,summary);
  assert.equal(data.hardware.assignments.length,2);
  assert.ok(data.hardware.prerequisites.some(s=>s.includes("Raspberry Pi [Remote-Ziel")));
  assert.ok(data.steps.some(s=>s.title.includes("Rolle einrichten: macOS")));

  const markdown=await app.exportFile("markdown");
  assert.match(markdown.contents,/Raspberry Pi: Remote-Ziel/);
  assert.match(markdown.contents,/macOS: Entwicklung/);
  assert.ok(markdown.contents.includes(summary));
  assert.match(markdown.contents,/Status: Nur unter Voraussetzungen/);
  assert.match(markdown.contents,/## Hardware & Netzwerk/);
  assert.match(markdown.contents,/## Ausgewählte Axiom-Rollen/);
  assert.match(markdown.contents,/## Installation und manuelle Konfiguration/);
  assert.match(markdown.contents,/nicht verbunden oder verifiziert/);
  assert.match(markdown.contents,/Raspberry Pi \[Remote-Ziel/);
  assert.match(markdown.contents,/macOS \[Entwicklung/);
});

test("Regression: no-device selection remains exclusive in display and both exported formats",async()=>{
  const app=createBrowser();
  app.choose("hardware","pi");
  app.role("pi","storage");
  app.choose("hardware","none");
  assert.equal(app.doc.getElementById("wizard-roles-panel").hidden,true);
  const summary=app.doc.getElementById("wizard-result-summary").textContent;
  assert.match(summary,/Keine eigene Hardware/);
  const json=JSON.parse((await app.exportFile("json")).contents);
  assert.deepEqual(json.selection.hardware,["none"]);
  assert.deepEqual(json.selection.hardwareRoles,{});
  assert.equal(json.summary,summary);
  const md=(await app.exportFile("markdown")).contents;
  assert.match(md,/Keine eigene Hardware/);
  assert.doesNotMatch(md,/Rolle einrichten: Raspberry Pi/);
});

test("V1.4 purpose recommendation never auto-connects a plugin",async()=>{
  const app=createBrowser();
  app.choose("purposes","files");
  const hint=app.doc.getElementById("wizard-plugin-hint").textContent;
  assert.match(hint,/Datei- \/ Serverintegration/);
  assert.match(hint,/keine Installation/);
  const config=JSON.parse((await app.exportFile("json")).contents);
  assert.deepEqual(config.selection.purposes,["files"]);
  assert.deepEqual(config.selection.integrations,[]);
  assert.ok(config.agentPackage.agentIds.includes("brain"));
  assert.equal(config.integrationRequirements.length,0);
  assert.equal(config.installation.chatgptZipImportSupported,false);
});
