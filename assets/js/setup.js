/* Axiom Web Setup Wizard V1.0 – keine Requests, keine Cookies, kein Storage.
 * Die Auswahl bleibt ausschließlich im Arbeitsspeicher des Browsers.
 */
(function () {
  "use strict";
  const catalogue = window.AxiomGuide;
  const rules = window.AxiomWizardRules;
  if (!catalogue || !rules) return;
  const $ = function (id) { return document.getElementById(id); };
  const stageLabels = ["KI / ChatGPT", "Hardware", "Betriebsart", "Integrationen", "Deine Anleitung"];
  const state = {plan: "plus", hardware: new Set(["none"]), mode: "chatgpt", integrations: new Set()};
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
          } else if (input.checked) {
            state.hardware.delete("none");
            state.hardware.add(id);
          } else {
            state.hardware.delete(id);
            if (state.hardware.size === 0) state.hardware.add("none");
          }
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
    textList(specs, [guide.plan.requirements, guide.plan.limits], "ChatGPT / KI-Voraussetzungen");
    textList(specs, guide.hardware.prerequisites.concat([guide.hardware.server, guide.hardware.network, guide.hardware.llm]), "Hardware & Netzwerk");
    textList(specs, guide.software, "Benötigte Software");
    textList(specs, guide.connectors.length ? guide.connectors : ["Keine weiteren Connectoren ausgewählt."], "Benötigte Connectoren");
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
    const cfg = {plan: state.plan, hardware: Array.from(state.hardware), mode: state.mode, integrations: Array.from(state.integrations)};
    const guide = rules.buildGuide(cfg, catalogue);
    document.querySelectorAll(".wizard-choice").forEach(function (label) {
      const input = label.querySelector("input");
      const selected = input.type === "checkbox" ? (input.name === "hardware" ? state.hardware.has(input.value) : state.integrations.has(input.value)) : state[input.name] === input.value;
      input.checked = selected;
      label.classList.toggle("is-selected", selected);
    });
    const p = catalogue.plans[state.plan], devices = Array.from(state.hardware, function (id) { return rules.hardware[id]; }), m = catalogue.modes[state.mode];
    const hardwareNames = devices.map(function (device) { return device.label; }).join(" + ");
    const titles = [
      p.name + " · " + p.tagline,
      hardwareNames + " · Voraussetzungen",
      m.name + " · " + m.slogan,
      state.integrations.size + " Integration(en) gewählt"
    ];
    const descriptions = [
      p.intro + " Grenzen: " + p.limits + " " + p.note,
      devices.map(function (device) { return device.label + ": " + device.summary + " Serverbetrieb: " + device.server + " Netzwerk: " + device.network + " Lokales LLM: " + device.llm; }).join(" "),
      catalogue.combinations[state.mode][state.plan].message + " " + m.introduction,
      state.integrations.size
        ? Array.from(state.integrations).map(function (id) { return catalogue.integrations[id].name; }).join(", ") + ". Jede Verbindung benötigt eigene Freigaben und einen erfolgreichen Test."
        : "Integrationen sind optional. Du kannst auch ohne zusätzliche Apps fortfahren."
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
    step = Math.max(0, Math.min(4, next));
    refresh();
    const heading = $("wizard-step-heading-" + step);
    if (heading) heading.focus({preventScroll: true});
    $("setup").scrollIntoView({behavior: "auto", block: "start"});
  };
  $("wizard-back").addEventListener("click", function () { move(step - 1); });
  $("wizard-next").addEventListener("click", function () { move(step + 1); });
  const markdown = function (guide) {
    const lines = ["# Axiom 🐸 – Setup-Anleitung", "", "**" + guide.summary + "**", "",
      "Status: " + ({blocked:"Nicht direkt unterstützt",conditional:"Nur unter Voraussetzungen",supported:"Technisch geeignet"}[guide.compatibility.status]), "",
      "> " + guide.notice, ""];
    const section = function (title, texts) {
      lines.push("## " + title, "");
      texts.forEach(function (t) { lines.push("- " + t); });
      lines.push("");
    };
    section("Auswahl", [guide.labels.plan].concat(guide.labels.hardware, [guide.labels.mode], guide.labels.integrations));
    section("Kompatibilität / Blockaden", guide.compatibility.blockers.concat(guide.compatibility.conditions, guide.compatibility.warnings));
    section("ChatGPT / KI", [guide.plan.description, guide.plan.requirements, guide.plan.limits]);
    section("Hardware & Netzwerk", guide.hardware.prerequisites.concat([guide.hardware.network, guide.hardware.server, guide.hardware.llm]));
    section("Software", guide.software);
    section("Connectoren", guide.connectors);
    lines.push("## Schritt-für-Schritt-Installation", "");
    guide.steps.forEach(function (s, i) { lines.push((i + 1) + ". **" + s.title + "** – " + s.detail); });
    lines.push("");
    section("Sicherheit", guide.security);
    section("Tests", guide.tests);
    section("Noch nicht verfügbar", guide.unavailable);
    lines.push("## Offizielle Dokumentation", "");
    guide.docs.forEach(function (d) { lines.push("- [" + d.title + "](" + d.url + ")"); });
    lines.push("", "Stand: Oktober 2026. Keine Installation oder Verbindung wurde durchgeführt.", "");
    return lines.join("\n");
  };
  const download = function (type) {
    const guide = rules.buildGuide({plan:state.plan,hardware:state.hardware,mode:state.mode,integrations:Array.from(state.integrations)},catalogue);
    const data = type === "json" ? JSON.stringify(guide, null, 2) + "\n" : markdown(guide);
    const blob = new Blob([data], {type: type === "json" ? "application/json;charset=utf-8" : "text/markdown;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = element("a");
    a.href = url;
    a.download = type === "json" ? "axiom-setup-v1.json" : "axiom-setup-v1.md";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };
  $("wizard-json").addEventListener("click", function () { download("json"); });
  $("wizard-markdown").addEventListener("click", function () { download("md"); });
  refresh();
})();
