"use strict";
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const {spawn,spawnSync} = require("node:child_process");
const root = path.resolve(__dirname,"..");
const names = [process.env.CHROME_BIN,"google-chrome","chromium","chromium-browser"].filter(Boolean);
const chrome = names.find(n=>spawnSync("sh",["-c",'command -v "$1"',"sh",n]).status===0);
if(!chrome){console.log("SKIP: No Chrome/Chromium on CI runner");process.exit(0);}
const smokePage = `<!DOCTYPE html><html lang="de"><meta charset="utf-8"><title>Axiom Browser Smoke</title><body>
<div id="smoke-result">WAITING</div><iframe id="site" src="/" style="width:1440px;height:850px;border:0"></iframe>
<script>
(function(){
  const frame=document.getElementById('site');
  const result=document.getElementById('smoke-result');
  const check=(ok,msg)=>{if(!ok)throw Error(msg);};
  frame.addEventListener('load',function(){
    try {
      const doc=frame.contentDocument, app=frame.contentWindow;
      const favicon=doc.querySelector('link[rel="icon"]');
      check(favicon && favicon.href.endsWith('/assets/favicon.svg'),'Axiom favicon missing');
      check(Object.keys(app.AxiomGuide.plans).join(',')==='free,plus,pro,selfhosted','plan scope');
      const choice=(group,value)=>{
        const input=doc.querySelector('#wizard-'+group+' input[value="'+value+'"]');
        check(!!input,'missing '+group+'/'+value);input.click();
      };
      const role=(id,r)=>{
        const select=doc.getElementById('wizard-role-'+id);
        check(!!select,'missing role '+id);select.value=r;
        select.dispatchEvent(new Event('change',{bubbles:true}));
      };
      const next=()=>doc.getElementById('wizard-next').click();
      check(doc.getElementById('wizard-current').textContent.includes('Schritt 1 von 5'),'initial step');
      next();choice('hardware','pi');choice('hardware','mac');
      role('pi','remote');role('mac','admin');
      next();choice('modes','hybrid');next();
      choice('purposes','code');choice('purposes','files');
      check(doc.getElementById('wizard-plugin-hint').textContent.includes('GitHub'),'recommended connector');
      choice('integrations','github');choice('integrations','files');next();
      check(doc.getElementById('wizard-current').textContent.includes('Schritt 5 von 5'),'finish');
      check(doc.getElementById('wizard-result-status').textContent.includes('Unter Voraussetzungen'),'compatibility');
      const guide=app.AxiomWizardRules.buildGuide({
        plan:'plus',hardware:['pi','mac'],roles:{pi:'remote',mac:'admin'},mode:'hybrid',
        purposes:['code','files'],integrations:['github','files']
      },app.AxiomGuide);
      check(guide.schemaVersion===5,'schema version');
      check(guide.installation.chatgptZipImportSupported===false,'installer status');
      check(guide.integrationRequirements.every(x=>x.status.connected==='unverified'),'connection state');
      check(doc.getElementById('wizard-result-summary').textContent===guide.summary,'screen/export data parity');
      check(guide.agentPackage.agentIds.includes('onboarding')&&guide.agentPackage.agentIds.includes('brain'),'routing');
      frame.style.width='375px';
      const width=frame.contentWindow.innerWidth,scroll=doc.documentElement.scrollWidth;
      check(width>=375&&width<420,'mobile viewport '+width);
      check(scroll<=width+2,'mobile horizontal overflow '+scroll+'>'+width);
      const back=doc.getElementById('wizard-back');back.focus();
      check(doc.activeElement===back,'keyboard focus');
      choice('plans','selfhosted');
      check(doc.querySelector('#wizard-modes input[value="bridge"]').checked,'selfhosted selects bridge');
      check(doc.getElementById('wizard-result-status').textContent.includes('Unter Voraussetzungen'),'selfhosted remains conditional');
      result.textContent='AXIOM_BROWSER_SMOKE_'+'PASS: real Chrome wizard, mobile layout, focus, and Self-Hosted preview';
    }catch(error){result.textContent='AXIOM_BROWSER_SMOKE_'+'FAIL: '+error.message;}
  },{once:true});
})();
</script></body></html>`;
const server=http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);}
  catch{res.writeHead(400).end();return;}
  if(pathname==="/__axiom_browser_smoke__"){
    res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"}).end(smokePage);return;
  }
  const rel=pathname==="/"?"index.html":pathname.replace(/^\//,"");
  const full=path.resolve(root,rel);
  if(!full.startsWith(root+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile()){
    res.writeHead(404).end();return;
  }
  const mime=full.endsWith(".js")?"application/javascript":
    full.endsWith(".css")?"text/css":full.endsWith(".json")?"application/json":"text/html";
  res.writeHead(200,{"Content-Type":mime,"X-Content-Type-Options":"nosniff"}).end(fs.readFileSync(full));
});
server.listen(0,"127.0.0.1",()=>{
  const port=server.address().port;
  const args=["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
    "--no-first-run","--disable-background-networking","--virtual-time-budget=5000",
    "--window-size=1560,950","--dump-dom",`http://127.0.0.1:${port}/__axiom_browser_smoke__`];
  const child=spawn(chrome,args,{stdio:["ignore","pipe","pipe"]});
  let stdout="",stderr="";
  child.stdout.on("data",d=>{stdout+=d.toString();});
  child.stderr.on("data",d=>{stderr+=d.toString();});
  const timer=setTimeout(()=>child.kill("SIGKILL"),25000);
  child.on("error",err=>{clearTimeout(timer);server.close();console.error(err);process.exitCode=1;});
  child.on("close",exitCode=>{
    clearTimeout(timer);server.close();
    const match=stdout.match(/AXIOM_BROWSER_SMOKE_(PASS|FAIL): [^<]*/);
    console.log(match?match[0]:"Browser produced no smoke result");
    if(exitCode!==0||!match||match[1]!=="PASS"){
      console.error(stderr.slice(-1500));process.exitCode=1;
    }
  });
});
