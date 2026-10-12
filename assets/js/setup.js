/* Axiom Web — local-only configuration UI.
 * No network requests, cookies, browser storage or automatic submissions.
 * Data on hosting requests can still be processed by the hosting provider.
 */
(() => {
  "use strict";
  const catalogue = window.AxiomGuide;
  if (!catalogue) return;
  const $ = (id) => document.getElementById(id);
  const plan = $("plan"), mode = $("mode");
  const boxes = Array.from(document.querySelectorAll(".check input"));
  const integrations = new Set(Object.keys(catalogue.integrations));
  const planIds = new Set(Object.keys(catalogue.plans));
  const modeIds = new Set(Object.keys(catalogue.modes));
  const node = (tag, text, className) => {
    const el = document.createElement(tag);
    if (text != null) el.textContent = String(text);
    if (className) el.className = className;
    return el;
  };
  const listing = (values, numbered=false) => {
    const list = node(numbered ? "ol" : "ul");
    for (const text of values) list.append(node("li",text));
    return list;
  };
  const safeConfig = () => ({
    schemaVersion: 2,
    plan: planIds.has(plan.value) ? plan.value : "free",
    mode: modeIds.has(mode.value) ? mode.value : "chatgpt",
    integrations: boxes.filter(b => b.checked && integrations.has(b.value)).map(b => b.value),
    note: "Konfigurationsentwurf, lokal im Browser erstellt. Keine erfolgreiche Verbindung, Berechtigung oder Installation bestätigt."
  });
  const render = () => {
    const cfg=safeConfig();
    const p=catalogue.plans[cfg.plan], m=catalogue.modes[cfg.mode], combination=catalogue.combinations[cfg.mode][cfg.plan];
    $("result-title").textContent = "Axiom " + p.label;
    $("result-description").textContent = combination.message;
    $("result-steps").replaceChildren(...[
      "Betriebsart: " + m.name,
      "Voraussetzung: " + p.needs,
      "Nächster Schritt: " + combination.addSteps[0]
    ].map(t=>node("li",t)));
    const alert=$("result-warning");
    alert.textContent = combination.recommendation;
    alert.className = "subtle";
    const status=$("setup-status");
    status.textContent = combination.level;
    status.className = combination.compatible ? "setup-status" : "setup-status caution";
    $("plan-title").textContent = p.name + " · " + p.tagline;
    $("plan-detail").textContent = p.intro;
    $("plan-limits").textContent = p.limits;
    $("plan-example").textContent = p.example;
    $("plan-note").textContent = p.note;

    $("mode-heading").textContent = m.name + " – " + m.slogan;
    $("mode-intro").textContent = m.introduction;
    $("mode-req").replaceChildren(...listing([...m.requirements,...combination.addRequirements]).children);
    $("mode-steps").replaceChildren(...listing([...m.steps,...combination.addSteps],true).children);
    $("mode-real").textContent = m.reality;
    $("mode-benefit").textContent = m.benefit;
    $("mode-context").textContent = combination.message;
    $("mode-context").className = combination.compatible ? "notice" : "notice warning";
    $("mode-flow").replaceChildren();
    m.flow.forEach((step,index)=>{
      if(index) $("mode-flow").append(node("b","→"));
      $("mode-flow").append(node("span",step));
    });

    const guide=$("integration-guide");
    guide.replaceChildren();
    for (const id of cfg.integrations) {
      const integration=catalogue.integrations[id];
      const detail=integration[cfg.mode];
      const article=node("article",null,"integration-card");
      const small=node("div","INDIVIDUELLE EINRICHTUNG","smalllabel");
      const title=node("h4",integration.icon+" "+integration.name);
      const summary=node("p",detail.description);
      const needs=node("p","Benötigt: "+detail.needs);
      const header=node("strong","Konkrete Schritte");
      const example=node("p","Beispiel: "+detail.test);
      example.className="subtle";
      article.append(small,title,summary,needs,header,listing(detail.steps,true),example);
      if (!combination.compatible) {
        article.append(node("p","Hinweis: Die gewählte Kombination ist nicht direkt verfügbar; die Schritte sind nur für eine unterstützte Alternative gedacht.","subtle"));
      }
      guide.append(article);
    }
    $("integration-empty").hidden=cfg.integrations.length>0;
    $("integration-header").textContent=cfg.integrations.length
      ? "Deine Integrationen – "+cfg.integrations.length+" individuelle Anleitung"+(cfg.integrations.length===1?"":"en")
      : "Deine Integrationen";
    $("export").disabled = false;
  };
  const exportConfig = () => {
    const data=safeConfig(), combo=catalogue.combinations[data.mode][data.plan];
    const output={...data,compatibleWithSelectedMode:combo.compatible,compatibilityNote:combo.message};
    const blob=new Blob([JSON.stringify(output,null,2)+"\n"],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const link=node("a");
    link.href=url;
    link.download="axiom-konfiguration.json";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  plan.addEventListener("change",render);
  mode.addEventListener("change",render);
  boxes.forEach(b=>b.addEventListener("change",render));
  $("export").addEventListener("click",exportConfig);
  render();
})();
