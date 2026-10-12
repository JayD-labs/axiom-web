/* Axiom Web Setup Wizard V1.2 – keine Requests, keine Cookies, kein Storage.
 * Die Auswahl bleibt ausschließlich im Arbeitsspeicher des Browsers.
 */
(function () {
  "use strict";
  const catalogue = window.AxiomGuide;
  const rules = window.AxiomWizardRules;
  if (!catalogue || !rules) return;
  const $ = function (id) { return document.getElementById(id); };
  const stageLabels = ["KI / ChatGPT", "Hardware", "Betriebsart", "Apps / Plugins", "Deine Anleitung"];
  const state = {plan: "plus", hardware: new Set(["none"]), roles: {}, mode: "chatgpt", integrations: new Set()};
  let step = 0;
  const element = function (tag, text, cls) {
    const el = document.createElement(tag);
    if (text != null) el.textContent = String(text);
    if (cls) el.className = cls;
    return el;
  };
  const appendList = function (target, items, ordered) {
    target.replaceChildren();
    items.forEach(function (item) {
      const li = element("li");
      if (typeof item === "string") li.textContent = item;
      else {
        li.append(element("strong", item.title + " – "), document.createTextNode(item.detail));
      }
      target.append(li);
    });
  };
  // One plain-data snapshot for screen and both exports: never pass a Set to buildGuide.
  const getConfig = function () {
    return {plan: state.plan, hardware: Array.from(state.hardware), roles: {...state.roles}, mode: state.mode, integrations: Array.from(state.integrations)};
  };
  const renderRoles = function () {
    const target = $("wizard-device-roles");
    target.replaceChildren();
    const devices = Array.from(state.hardware).filter(function (id) { return id !== "none"; });
    $("wizard-roles-panel").hidden = devices.length === 0;
    $("wizard-role-error").hidden = true;
    Object.keys(state.roles).forEach(function (id) {
      if (!state.hardware.has(id)) delete state.roles[id];
    });
    devices.forEach(function (id) {
      const wrapper = element("div", null, "wizard-role-card");
      const label = element("label", "Aufgabe für " + rules.hardware[id].label, "wizard-role-label");
      const select = element("select");
      select.id = "wizard-role-" + id;
      select.name = "role-" + id;
      select.required = true;
      select.setAttribute("aria-describedby", "wizard-role-hint-" + id + " wizard-role-error");
      label.htmlFor = select.id;
      const empty = element("option", "Bitte eine Rolle zuweisen");
      empty.value = "";
      select.append(empty);
      Object.entries(rules.roles).forEach(function (entry) {
        const option = element("option", entry[1].label);
        option.value = entry[0];
        select.append(option);
      });
      select.value = state.roles[id] || "";
      const hint = element("p", state.roles[id] ? rules.roles[state.roles[id]].detail : "Wähle bewusst, welche Aufgabe dieses Gerät übernimmt.", "subtle");
      hint.id = "wizard-role-hint-" + id;
      select.addEventListener("change", function () {
        if (select.value) state.roles[id] = select.value;
        else delete state.roles[id];
        hint.textContent = select.value ? rules.roles[select.value].detail : "Bitte eine Rolle zuweisen.";
        $("wizard-role-error").hidden = true;
        select.removeAttribute("aria-invalid");
        refresh();
      });
      wrapper.append(label, select, hint);
      target.append(wrapper);
    });
  };
  const makeChoices = function (target, group, values, multi) {
    target.replaceChildren();
    Object.entries(values).forEach(function (entry) {
      const id = entry[0], data = entry[1];
      const label = element("label", null, "wizard-choice");
      const input = element("input");
      input.type = multi ? "checkbox" : "radio";
      input.name = group;
      input.value = id;
      input.checked = multi ? (group === "hardware" ? state.hardware.has(id) : state.integrations.has(id)) : state[group] === id;
      const copy = element("span", null, "wizard-choice-copy");
      const name = data.name || data.label;
      copy.append(element("strong", (data.icon ? data.icon + " " : "") + name));
      const note = group === "plan" ? data.tagline : group === "hardware" ? data.summary :
        group === "mode" ? data.slogan : data.chatgpt.description;
      copy.append(element("span", note, "wizard-choice-detail"));
      label.append(input, copy);
      target.append(label);
      input.addEventListener("change", function () {
        if (multi && group === "hardware") {
          if (input.checked && id === "none") {
            state.hardware.clear();
            state.hardware.add("none");
            state.roles = {};
          } else if (input.checked) {
            state.hardware.delete("none");
            state.hardware.add(id);
          } else {
            state.hardware.delete(id);
            if (state.hardware.size === 0) state.hardware.add("none");
          }
          renderRoles();
        } else if (multi) {
          if (input.checked) state.integrations.add(id);
          else state.integrations.delete(id);
        } else state[group] = id;
        refresh();
      });
    });
  };
  makeChoices($("wizard-plans"), "plan", catalogue.plans, false);
  makeChoices($("wizard-hardware"), "hardware", rules.hardware, true);
  renderRoles();
  makeChoices($("wizard-modes"), "mode", catalogue.modes, false);
  makeChoices($("wizard-integrations"), "integrations", catalogue.integrations, true);

  const textList = function (container, values, title) {
    const section = element("section", null, "wizard-result-section");
    section.append(element("h4", title));
    const ul = element("ul");
    appendList(ul, values);
    section.append(ul);
    container.append(section);
  };
  const buildResult = function (guide) {
    const status = guide.compatibility.status;
    $("wizard-result-status").textContent = status === "blocked" ? "Nicht direkt unterstützt" : status === "conditional" ? "Unter Voraussetzungen möglich" : "Technisch geeignet";
    $("wizard-result-status").className = "setup-status" + (status === "blocked" ? " caution" : "");
    $("wizard-result-summary").textContent = guide.summary;
    const issues = $("wizard-result-issues");
    issues.replaceChildren();
    if (guide.compatibility.blockers.length) textList(issues, guide.compatibility.blockers, "Blockierende Voraussetzungen");
    if (guide.compatibility.conditions.length) textList(issues, guide.compatibility.conditions, "Vorher prüfen");
    if (guide.compatibility.warnings.length) textList(issues, guide.compatibility.warnings, "Zusätzliche Hinweise");
    const specs = $("wizard-result-specs");
    specs.replaceChildren();
    textList(specs, guide.hardware.assignments.length ? guide.hardware.assignments.map(function (item) {
      return item.label + " → " + item.roleLabel;
    }) : ["Keine eigene Hardware ausgewählt."], "Deine Geräterollen");
    textList(specs, [guide.plan.requirements, guide.plan.limits], "ChatGPT / KI-Voraussetzungen");
    textList(specs, guide.hardware.prerequisites.concat([guide.hardware.server, guide.hardware.network, guide.hardware.llm]), "Hardware & Netzwerk");
    textList(specs, guide.software, "Benötigte Software");
    textList(specs, guide.connectors.length ? guide.connectors : ["Keine weiteren Connectoren ausgewählt."], "Benötigte Connectoren");
    textList(specs, guide.agentPackage.agents.map(function (agent) {
      return agent.name + " → " + agent.skills.join(", ");
    }), "Vorgeschlagene Axiom-Rollen & Skills");
    appendList($("wizard-result-steps"), guide.steps, true);
    appendList($("wizard-result-security"), guide.security);
    appendList($("wizard-result-tests"), guide.tests);
    appendList($("wizard-result-unavailable"), guide.unavailable);
    const docs = $("wizard-result-docs");
    docs.replaceChildren();
    guide.docs.forEach(function (item) {
      const li = element("li");
      const a = element("a", item.title + " ↗");
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.append(a);
      docs.append(li);
    });
    const guides = $("wizard-integration-guides");
    guides.replaceChildren();
    guide.selection.integrations.forEach(function (id) {
      const item = catalogue.integrations[id];
      const detail = item[guide.selection.mode];
      const extra = rules.special[id];
      const article = element("article", null, "integration-card");
      article.append(element("h4", item.icon + " " + item.name));
      article.append(element("p", detail.description));
      article.append(element("p", "Voraussetzung: " + detail.needs));
      article.append(element("p", "Berechtigungen: " + extra.permission));
      article.append(element("strong", "Einrichtung"));
      const ol = element("ol");
      appendList(ol, detail.steps, true);
      article.append(ol);
      article.append(element("p", "Test: " + extra.check, "subtle"));
      if (status === "blocked") article.append(element("p", "Diese Schritte erst ausführen, nachdem die blockierende Kombination behoben wurde.", "subtle"));
      guides.append(article);
    });
    $("wizard-integration-title").hidden = guide.selection.integrations.length === 0;
  };
  const refresh = function () {
    const cfg = getConfig();
    const guide = rules.buildGuide(cfg, catalogue);
    document.querySelectorAll(".wizard-choice").forEach(function (label) {
      const input = label.querySelector("input");
      const selected = input.type === "checkbox" ? (input.name === "hardware" ? state.hardware.has(input.value) : state.integrations.has(input.value)) : state[input.name] === input.value;
      input.checked = selected;
      label.classList.toggle("is-selected", selected);
    });
    const p = catalogue.plans[state.plan], devices = Array.from(state.hardware, function (id) { return rules.hardware[id]; }), m = catalogue.modes[state.mode];
    const hardwareNames = devices.map(function (device) { return device.label; }).join(" + ");
    const chosenRoles = Array.from(state.hardware).filter(function (id) { return id !== "none"; }).map(function (id) { return rules.hardware[id].label + ": " + (state.roles[id] ? rules.roles[state.roles[id]].label : "Rolle offen"); });
    const titles = [
      p.name + " · " + p.tagline,
      hardwareNames + " · Voraussetzungen",
      m.name + " · " + m.slogan,
      state.integrations.size + " App(s) / Plugin(s) gewählt"
    ];
    const descriptions = [
      p.intro + " Grenzen: " + p.limits + " " + p.note,
      devices.map(function (device) { return device.label + ": " + device.summary + " Serverbetrieb: " + device.server + " Netzwerk: " + device.network + " Lokales LLM: " + device.llm; }).join(" ") + (chosenRoles.length ? " Rollen: " + chosenRoles.join("; ") : ""),
      catalogue.combinations[state.mode][state.plan].message + " " + m.introduction,
      state.integrations.size
        ? Array.from(state.integrations).map(function (id) { return catalogue.integrations[id].name; }).join(", ") + ". Jede Verbindung benötigt eigene Freigaben und einen erfolgreichen Test."
        : "Apps/Plugins sind optional. Du kannst auch ohne zusätzliche Verbindungen fortfahren."
    ];
    if (step < 4) {
      $("wizard-context").hidden = false;
      $("wizard-context-title").textContent = titles[step];
      $("wizard-context-detail").textContent = descriptions[step];
      $("wizard-context-status").textContent = guide.compatibility.status === "blocked"
        ? "Aktuelle Kombination: nicht direkt unterstützt"
        : guide.compatibility.status === "conditional" ? "Aktuelle Kombination: Voraussetzungen prüfen" : "Aktuelle Kombination: technisch geeignet";
      $("wizard-context-status").className = "setup-status" + (guide.compatibility.status === "blocked" ? " caution" : "");
      const notices = guide.compatibility.blockers.concat(guide.compatibility.conditions);
      appendList($("wizard-context-notes"), notices.slice(0, 5).length ? notices.slice(0, 5) : ["Weitere Details folgen in deiner individuellen Anleitung."]);
    } else $("wizard-context").hidden = true;
    buildResult(guide);
    document.querySelectorAll(".wizard-stage").forEach(function (stage) { stage.hidden = Number(stage.dataset.stage) !== step; });
    $("wizard-back").disabled = step === 0;
    $("wizard-next").hidden = step === 4;
    $("wizard-next").textContent = step === 3 ? "Anleitung erstellen →" : "Weiter →";
    $("wizard-current").textContent = "Schritt " + (step + 1) + " von 5 · " + stageLabels[step];
    $("wizard-progress").value = step + 1;
    document.querySelectorAll("#wizard-step-markers li").forEach(function (li, i) {
      li.classList.toggle("is-current", i === step);
      li.classList.toggle("is-complete", i < step);
      if (i === step) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
  };
  const move = function (next) {
    if (step === 1 && next > step) {
      const missing = Array.from(state.hardware).filter(function (id) { return id !== "none" && !state.roles[id]; });
      if (missing.length) {
        const feedback = $("wizard-role-error");
        feedback.textContent = "Bitte weise jedem gewählten Gerät eine Aufgabe zu, bevor du fortfährst.";
        feedback.hidden = false;
        const first = $("wizard-role-" + missing[0]);
        if (first) { first.setAttribute("aria-invalid", "true"); first.focus(); }
        return;
      }
    }
    step = Math.max(0, Math.min(4, next));
    refresh();
    const heading = $("wizard-step-heading-" + step);
    if (heading) heading.focus({preventScroll: true});
    $("setup").scrollIntoView({behavior: "auto", block: "start"});
  };
  $("wizard-back").addEventListener("click", function () { move(step - 1); });
  $("wizard-next").addEventListener("click", function () { move(step + 1); });
  const download = function (type) {
    const guide = rules.buildGuide(getConfig(), catalogue);
    const data = type === "json" ? window.AxiomWizardExport.json(guide) : window.AxiomWizardExport.markdown(guide);
    const blob = new Blob([data], {type: type === "json" ? "application/json;charset=utf-8" : "text/markdown;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = element("a");
    a.href = url;
    a.download = type === "json" ? "axiom-setup-v1.2.json" : "axiom-setup-v1.2.md";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };

  // The ZIP is built solely in the browser from versioned same-origin public files.
  // Refuse partial downloads: every asset must be fetched and validated.
  $("wizard-zip").addEventListener("click", async function () {
    const button = $("wizard-zip");
    const status = $("wizard-zip-status");
    button.disabled = true;
    status.textContent = "Axiom-Dateien werden von dieser Website geladen und lokal gepackt …";
    try {
      const indexResponse = await fetch("./assets/axiom/export-manifest.json", {cache:"no-store"});
      if (!indexResponse.ok) throw new Error("Paket-Manifest nicht erreichbar (" + indexResponse.status + ").");
      const manifest = await indexResponse.json();
      if (manifest.format !== "axiom-web-offline-assets" || manifest.version !== 1 ||
          !Array.isArray(manifest.files) || manifest.files.length < 42 || manifest.files.length > 300) {
        throw new Error("Ungültiges oder unvollständiges Paket-Manifest.");
      }
      const assets = new Array(manifest.files.length);
      const sources = new Set(), targets = new Set();
      for (const item of manifest.files) {
        if (!item || typeof item.source !== "string" || typeof item.target !== "string" ||
            !(/^(assets\/axiom\/|axiom-orchestrator\.md$)/.test(item.source)) ||
            !/^[A-Za-z0-9._/-]+$/.test(item.source) ||
            !/^[A-Za-z0-9._/-]+$/.test(item.target) ||
            item.source.split("/").includes("..") || item.target.split("/").includes("..") ||
            sources.has(item.source) || targets.has(item.target)) {
          throw new Error("Ungültiger oder doppelter Dateipfad im Paket-Manifest.");
        }
        sources.add(item.source); targets.add(item.target);
      }
      let next = 0;
      async function loadWorker() {
        while (next < manifest.files.length) {
          const position = next++;
          const item = manifest.files[position];
          const response = await fetch("./" + item.source);
          if (!response.ok) throw new Error("Paketdatei nicht erreichbar: " + item.source);
          assets[position] = {target:item.target, content:await response.text()};
        }
      }
      await Promise.all(Array.from({length:6}, loadWorker));
      const guide = rules.buildGuide(getConfig(), catalogue);
      const archive = window.AxiomWizardExport.zip(guide, assets);
      const blob = new Blob([archive], {type:"application/zip"});
      const url = URL.createObjectURL(blob);
      const anchor = element("a");
      anchor.href = url; anchor.download = "axiom-setup-v1.2.zip";
      document.body.append(anchor); anchor.click(); anchor.remove();
      setTimeout(function () {URL.revokeObjectURL(url);}, 1000);
      status.textContent = "ZIP erstellt: 30 Skills, Agentendateien, Referenzen und deine Setup-Konfiguration.";
    } catch (error) {
      status.textContent = "ZIP konnte nicht erstellt werden: " + (error && error.message ? error.message : "Unbekannter Fehler.") + " Es wurde kein unvollständiges Archiv heruntergeladen.";
    } finally {
      button.disabled = false;
    }
  });
  $("wizard-json").addEventListener("click", function () { download("json"); });
  $("wizard-markdown").addEventListener("click", function () { download("md"); });
  refresh();
})();
