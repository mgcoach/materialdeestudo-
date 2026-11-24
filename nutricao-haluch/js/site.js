(function(){
"use strict";
var $=function(id){return document.getElementById(id)};
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
var store={get:function(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var done=store.get("haluch-done")||{};

var PARTS=[
{n:1,c:"var(--glc)",t:"Carboidratos",d:"Classificação, digestão, índice glicêmico, glicogênio, insulina, frutose, hipertrofia, endurance e saúde.",on:true},
{n:2,c:"var(--fat)",t:"Lipídios",d:"Tipos de gordura, digestão, lipogênese, lipólise, cetose, colesterol e risco cardiovascular.",on:true},
{n:3,c:"var(--pro)",t:"Proteínas",d:"Aminoácidos, síntese e degradação, dose por refeição, qualidade, suplementos proteicos e rim.",on:true},
{n:4,c:"var(--adr)",t:"Bioenergética, exercício e fadiga",d:"Krebs, fosforilação oxidativa, sistemas energéticos, fadiga, dano e recuperação muscular.",on:true},
{n:5,c:"var(--ins)",t:"Gasto energético e cálculo de dieta",d:"Componentes do gasto, fórmulas, superávit, déficit e montagem passo a passo.",on:true},
{n:6,c:"var(--glu)",t:"Emagrecimento",d:"Obesidade, fome e saciedade, resistência à insulina e à leptina, adaptação metabólica, reganho.",on:true},
{n:7,c:"var(--gly)",t:"Estratégias nutricionais",d:"Dieta flexível, refeição livre, ciclo de carboidratos, modelo Haluch, jejum intermitente e nutrient timing.",on:true},
{n:8,c:"var(--fib)",t:"Suplementação e termogênicos",d:"Creatina, cafeína, tampões, vasodilatadores, termogênicos e fármacos do emagrecimento.",on:true},
{n:9,c:"var(--glc)",t:"Fisiculturismo",d:"Potencial genético, off season, avaliação por dobras, pré-contest, semana final e rebote.",on:true},
{n:10,c:"var(--cor)",t:"Hormônios",d:"Eixo hormonal, testosterona, estrogênio, riscos documentados, mulheres e GH. Fisiologia e riscos, sem doses.",on:true},
{n:11,c:"var(--pro)",t:"Longevidade",d:"Envelhecimento, mTOR e IGF-1, restrição calórica e proteica, zonas azuis, jejum e o conflito com a hipertrofia.",on:true},
{n:12,c:"var(--fib)",t:"Vitaminas e minerais",d:"Coenzimas do complexo B, metilação, vitaminas C, A, D, E e K, eletrólitos, cálcio, magnésio, ferro e hepcidina, zinco, selênio e iodo.",on:true},
{n:13,c:"var(--pro)",t:"Aminoácidos",d:"Essenciais e não essenciais, leucina e mTOR, BCAA e EAA, glutamina, glutationa, citrulina, colágeno e fadiga central.",on:true}];

var ph=$("parts");
PARTS.forEach(function(p){
  var a=el(p.on?"a":"div","part "+(p.on?"on":"off"),'<span class="no">'+("0"+p.n).slice(-2)+"</span><span><b>"+p.t+"</b><small>"+p.d+'</small></span><span class="st">'+(p.on?"Ler":"Em preparo")+"</span>");
  a.style.setProperty("--c",p.c);if(p.on)a.href="#parte-"+p.n;ph.appendChild(a);
});

/* ---------- rotas ---------- */
var home=$("home"),reader=$("reader"),nav=$("nav"),drawer=$("drawer"),cache={},current=0;
function route(){
  var m=/^#parte-(\d+)$/.exec(location.hash),n=m?+m[1]:0,p=PARTS[n-1];
  if(!p||!p.on){current=0;reader.hidden=true;home.hidden=false;$("where").textContent="Sumário";$("menuBtn").textContent="Partes";buildNavHome();meter();return}
  current=n;home.hidden=true;reader.hidden=false;$("menuBtn").textContent="Seções";
  $("where").textContent="Parte "+n+" · "+p.t;
  if(cache[n]){mount(n);return}
  reader.innerHTML='<div class="loading">Carregando a parte '+n+"…</div>";
  fetch("partes/p"+n+".html").then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(h){cache[n]=h;if(current===n)mount(n)})
    .catch(function(){reader.innerHTML='<div class="loading">Não foi possível carregar esta parte. Recarregue a página.</div>'});
}
function buildNavHome(){nav.innerHTML="<h3>Partes</h3>";PARTS.forEach(function(p){if(!p.on)return;var a=el("a",null,'<span class="n">'+("0"+p.n).slice(-2)+"</span><span>"+p.t+"</span>");a.href="#parte-"+p.n;nav.appendChild(a)})}
function mount(n){
  reader.innerHTML=cache[n];window.scrollTo(0,0);
  nav.innerHTML="<h3>Parte "+n+"</h3>";
  var h=el("a",null,'<span class="n">←</span><span>Voltar ao sumário</span>');h.href="#inicio";nav.appendChild(h);
  [].forEach.call(reader.querySelectorAll(".sec"),function(s){
    var a=el("a",null,'<span class="n">'+s.dataset.n+"</span><span>"+s.querySelector("h2").textContent+"</span>");a.href="#";a.dataset.to=s.id;
    if(done[s.id])a.classList.add("done");nav.appendChild(a);
    var b=s.querySelector(".donebtn");if(b){b.dataset.id=s.id;paintBtn(b)}
  });
  widgets();gloss();meter();
}
function paintBtn(b){var d=!!done[b.dataset.id];b.setAttribute("aria-pressed",d);b.textContent=d?"Seção estudada ✓":"Marcar seção como estudada"}
function meter(){var s=reader.querySelectorAll(".sec"),k=0;[].forEach.call(s,function(x){if(done[x.id])k++});$("meter").style.width=(current&&s.length?k/s.length*100:0)+"%"}
window.addEventListener("hashchange",route);
$("menuBtn").onclick=function(){drawer.classList.add("open")};
$("shade").onclick=function(){drawer.classList.remove("open")};
document.addEventListener("keydown",function(e){if(e.key==="Escape"){drawer.classList.remove("open");$("sheet").classList.remove("open")}});
nav.addEventListener("click",function(e){var a=e.target.closest("a");if(!a)return;drawer.classList.remove("open");
  if(a.dataset.to){e.preventDefault();var t=$(a.dataset.to);if(t)window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-60})}});
document.addEventListener("click",function(e){
  var b=e.target.closest(".donebtn");
  if(b){var id=b.dataset.id;done[id]=!done[id];store.set("haluch-done",done);paintBtn(b);meter();var l=nav.querySelector('[data-to="'+id+'"]');if(l)l.classList.toggle("done",!!done[id]);return}
  var g=e.target.closest(".g");
  if(g){var x=G[+g.dataset.g];$("sheetT").textContent=x[0];$("sheetD").textContent=x[2];$("sheet").classList.add("open");return}
  if(!e.target.closest("#sheet"))$("sheet").classList.remove("open");
});
$("sheetX").onclick=function(){$("sheet").classList.remove("open")};

/* ---------- widgets ---------- */
function widgets(){
  [].forEach.call(reader.querySelectorAll(".tabs"),function(t){
    var chips=el("div","chips"),panels=[].slice.call(t.querySelectorAll(":scope > .panel"));
    panels.forEach(function(p,i){var b=el("button","chip",p.dataset.label);b.type="button";b.setAttribute("aria-pressed",i===0);p.hidden=i!==0;
      b.onclick=function(){[].forEach.call(chips.children,function(c){c.setAttribute("aria-pressed","false")});b.setAttribute("aria-pressed","true");panels.forEach(function(q){q.hidden=q!==p})};chips.appendChild(b)});
    t.insertBefore(chips,panels[0]);
  });
  var cg=reader.querySelector('[data-w="cg"]');
  if(cg){
    var foods=[["Arroz branco cozido",64,28],["Arroz integral cozido",55,26],["Batata inglesa cozida",81,12],["Batata doce cozida",61,18],["Macarrão cozido",61,25],["Feijão cozido",40,14],["Pão integral",52,44],["Aveia",55,57],["Banana",52,24],["Maçã",40,15],["Melancia",72,8],["Abacaxi",66,12]];
    var sel=cg.querySelector("select"),gr=cg.querySelector("input"),out=cg.querySelector(".res");
    foods.forEach(function(f,i){var o=el("option",null,f[0]+" (IG "+f[1]+")");o.value=i;sel.appendChild(o)});
    var run=function(){var f=foods[+sel.value],g=parseFloat(gr.value);
      if(!(g>0&&g<=2000)){out.innerHTML="<span>Informe uma porção entre 1 e 2.000 g.</span>";return}
      var carb=f[2]*g/100,v=f[1]*carb/100,cl=v<10?"baixa":v<20?"média":"alta";
      out.innerHTML="<b>"+v.toFixed(1).replace(".",",")+"</b><span>Carga glicêmica <b style=\"font:inherit;font-weight:700;color:#fff\">"+cl+"</b>. A porção tem "+carb.toFixed(0)+" g de carboidrato. Conta: "+f[1]+" × "+carb.toFixed(0)+" ÷ 100.</span>"};
    sel.onchange=run;gr.oninput=run;run();
  }
  var pr=reader.querySelector('[data-w="prot"]');
  if(pr){var pw=pr.querySelector("input"),ps=pr.querySelector("select"),po=pr.querySelector(".res"),r5p=function(n){return (Math.round(n/5)*5).toLocaleString("pt-BR")};
    var pf=function(){var k=parseFloat(pw.value);if(!(k>=35&&k<=200)){po.innerHTML="<span>Informe um peso entre 35 e 200 kg.</span>";return}
      var v=ps.value.split(","),lo=+v[0],hi=+v[1];
      po.innerHTML='<span style="display:grid;gap:6px;width:100%">'+[["Total por dia",r5p(lo*k)+" a "+r5p(hi*k)+" g"],["Por refeição (0,25 a 0,50 g/kg)",Math.round(.25*k)+" a "+Math.round(.5*k)+" g"],["Antes de dormir (~0,5 g/kg)","~"+Math.round(.5*k)+" g"]].map(function(x){return '<span style="display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid rgba(255,255,255,.12);padding-bottom:5px"><span>'+x[0]+'</span><b style="font-family:var(--serif);font-weight:400;font-size:22px;color:var(--pro);white-space:nowrap">'+x[1]+"</b></span>"}).join("")+"</span>"};
    pw.oninput=pf;ps.onchange=pf;pf();}
  var lu=reader.querySelector('[data-w="leu"]');
  if(lu){var ls=lu.querySelector("select"),lp=lu.querySelector("input"),lo=lu.querySelector(".res");
    var lf=function(){var p=parseFloat(lp.value),pc=+ls.value;if(!(p>=5&&p<=120)){lo.innerHTML="<span>Informe entre 5 e 120 g de proteína.</span>";return}
      var g=p*pc/100,need=2.8/(pc/100);
      lo.innerHTML="<b>"+g.toFixed(1).replace(".",",")+"</b><span>gramas de leucina. "+(g>=2.8?"Passa do limiar de ~2,8 g.":"Abaixo do limiar de ~2,8 g.")+" Para chegar a 2,8 g com essa fonte: cerca de <b style=\"font:inherit;font-weight:700;color:#fff\">"+Math.round(need)+" g de proteína</b>.</span>"};
    ls.onchange=lf;lp.oninput=lf;lf();}
  var pc=reader.querySelector('[data-w="pcr"]');
  if(pc){var pci=pc.querySelector("input"),pco=pc.querySelector(".res");
    var pcf=function(){var t=parseFloat(pci.value);if(!(t>=0&&t<=600)){pco.innerHTML="<span>Informe entre 0 e 600 segundos.</span>";return}
      var v=30+70*(1-Math.exp(-t/55));pco.innerHTML="<b>"+Math.round(v)+"%</b><span>da fosfocreatina de repouso recuperada após "+t+" s, partindo de ~30% no fim de uma série intensa. "+(v<75?"Descanso curto: a próxima série depende mais da glicólise.":v<93?"Boa parte já voltou.":"Praticamente recuperada.")+"</span>"};
    pci.oninput=pcf;pcf();}
  var gerAll=function(sx,I,P,A,bf){var m=sx==="m",o={};
    o.hb=m?66+13.8*P+5*A-6.8*I:655+9.6*P+1.9*A-4.7*I;
    var f=I<18?(m?[17.686,658.2]:[13.384,692.6]):I<30?(m?[15.057,692.2]:[14.818,486.6]):I<=60?(m?[11.472,873.1]:[8.126,845.6]):(m?[11.711,587.7]:[9.082,658.5]);
    o.fa=f[0]*P+f[1];o.mi=10*P+6.25*A-5*I+(m?5:-161);o.tp=24.8*P+10;
    if(bf>=3&&bf<=60){var L=P*(1-bf/100);o.mlg=L;o.cu=22*L+500;o.tm=25.9*L+284}
    return o};
  var eqN={hb:"Harris-Benedict",fa:"FAO/OMS",mi:"Mifflin-St Jeor",cu:"Cunningham (MLG)",tp:"Tinsley (peso)",tm:"Tinsley (MLG)"};
  var fmtK=function(n){return Math.round(n).toLocaleString("pt-BR")};
  var rowK=function(a,b,c){return '<span style="display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid rgba(255,255,255,.12);padding-bottom:5px"><span>'+a+'</span><b style="font-family:var(--serif);font-weight:400;font-size:21px;color:'+(c||"var(--glc)")+';white-space:nowrap">'+b+"</b></span>"};
  var gr=reader.querySelector('[data-w="ger"]');
  if(gr){var gq=function(i){return gr.querySelector("#"+i)},go=gr.querySelector(".res");
    var gf=function(){var P=parseFloat(gq("grP").value),A=parseFloat(gq("grA").value),I=parseFloat(gq("grI").value),bf=parseFloat(gq("grG").value);
      if(!(P>=35&&P<=200&&A>=130&&A<=220&&I>=10&&I<=90)){go.innerHTML="<span>Confira idade, peso e altura.</span>";return}
      var o=gerAll(gq("grS").value,I,P,A,bf),ks=["hb","fa","mi","cu","tp","tm"].filter(function(k){return o[k]}),vs=ks.map(function(k){return o[k]});
      go.innerHTML='<span style="display:grid;gap:6px;width:100%">'+ks.map(function(k){return rowK(eqN[k],fmtK(o[k])+" kcal")}).join("")+rowK("Diferença entre a menor e a maior",fmtK(Math.max.apply(0,vs)-Math.min.apply(0,vs))+" kcal","var(--glu)")+(o.mlg?'<span style="font-size:13px;opacity:.8">Massa livre de gordura: '+o.mlg.toFixed(1).replace(".",",")+" kg</span>":"")+"</span>"};
    [].forEach.call(gr.querySelectorAll("input,select"),function(e){e.oninput=gf;e.onchange=gf});gf();}
  var dt=reader.querySelector('[data-w="dieta"]');
  if(dt){var dq=function(i){return dt.querySelector("#"+i)},dout=dt.querySelector(".res");
    var df=function(){var P=parseFloat(dq("dtP").value),A=parseFloat(dq("dtA").value),I=parseFloat(dq("dtI").value),bf=parseFloat(dq("dtG").value),fa=parseFloat(dq("dtF").value),aj=parseFloat(dq("dtJ").value)||0,pk=parseFloat(dq("dtR").value),pc=parseFloat(dq("dtC").value),eq=dq("dtE").value;
      if(!(P>=35&&P<=200&&A>=130&&A<=220&&I>=10&&I<=90&&pk>=0.8&&pk<=3.5&&pc>=10&&pc<=70)){dout.innerHTML="<span>Confira os campos.</span>";return}
      var o=gerAll(dq("dtS").value,I,P,A,bf);if(!o[eq]){dout.innerHTML="<span>Essa equação precisa do percentual de gordura.</span>";return}
      var ger=Math.round(o[eq]),get=Math.round(ger*fa),vet=get+aj;if(vet<800){dout.innerHTML="<span>O ajuste deixou a dieta abaixo de 800 kcal. Reduza o déficit.</span>";return}
      var pg=P*pk,pp=pg*4/vet*100,gp=100-pp-pc,cg=vet*pc/100/4,gg=vet*gp/100/9;
      if(gp<10){dout.innerHTML="<span>Proteína e carboidrato somam "+Math.round(pp+pc)+"% e sobra pouco para gordura. Reduza o carboidrato.</span>";return}
      var l1=function(n){return n.toFixed(1).replace(".",",")};
      dout.innerHTML='<span style="display:grid;gap:6px;width:100%">'+rowK("1 · GER ("+eqN[eq]+")",fmtK(ger)+" kcal")+rowK("2 · GET (× "+String(fa).replace(".",",")+")",fmtK(get)+" kcal")+rowK("3 · VET ("+(aj>=0?"+":"−")+Math.abs(aj)+")",fmtK(vet)+" kcal","#fff")+rowK("4 · Proteína · "+Math.round(pp)+"%",Math.round(pg)+" g","var(--pro)")+rowK("5 · Carboidrato · "+Math.round(pc)+"% · "+l1(cg/P)+" g/kg",Math.round(cg)+" g","var(--glc)")+rowK("5 · Gordura · "+Math.round(gp)+"% · "+l1(gg/P)+" g/kg",Math.round(gg)+" g","var(--fat)")+'<span style="font-size:13px;opacity:.8">Por refeição, em 4 refeições: cerca de '+Math.round(pg/4)+" g de proteína. Faixa dos livros: "+Math.round(.25*P)+" a "+Math.round(.5*P)+" g.</span></span>"};
    [].forEach.call(dt.querySelectorAll("input,select"),function(e){e.oninput=df;e.onchange=df});df();}
  var cy=reader.querySelector('[data-w="ciclo"]');
  if(cy){var cq=function(i){return parseFloat(cy.querySelector("#"+i).value)},cout=cy.querySelector(".res");
    var cf=function(){var C=cq("ccC"),P=cq("ccP"),G=cq("ccG"),lc=cq("ccLC"),lp=cq("ccLP"),lg=cq("ccLG");
      if(!(C>0&&P>0&&G>0&&lc>0&&lp>0&&lg>0)){cout.innerHTML="<span>Preencha os seis campos.</span>";return}
      if(lc>=C){cout.innerHTML="<span>O carboidrato do dia low carb precisa ser menor que o do dia moderado.</span>";return}
      var hc=(5*C-3*lc)/2,hp=(5*P-3*lp)/2,hg=(5*G-3*lg)/2;
      if(hp<40||hg<15){cout.innerHTML="<span>Com esses dias low carb, sobra pouca "+(hp<40?"proteína":"gordura")+" para os dias high carb. Reduza "+(hp<40?"a proteína":"a gordura")+" dos dias low carb.</span>";return}
      var k=function(c,p,g){return 4*c+4*p+9*g},km=k(C,P,G),kl=k(lc,lp,lg),kh=k(hc,hp,hg),r=Math.round;
      var ln=function(c,p,g){return r(c)+" C · "+r(p)+" P · "+r(g)+" G"};
      cout.innerHTML='<span style="display:grid;gap:6px;width:100%">'+rowK("Low × 3 · "+ln(lc,lp,lg),fmtK(kl)+" kcal","var(--ins)")+rowK("Moderado × 2 · "+ln(C,P,G),fmtK(km)+" kcal","var(--gly)")+rowK("High × 2 · "+ln(hc,hp,hg),fmtK(kh)+" kcal","var(--glc)")+rowK("Semana ciclada",fmtK(3*kl+2*km+2*kh)+" kcal","#fff")+rowK("Semana contínua (7 × moderado)",fmtK(7*km)+" kcal","#fff")+'<span style="font-size:13px;opacity:.8">Gramas por dia de carboidrato (C), proteína (P) e gordura (G). As duas semanas fecham iguais: o déficit semanal é o mesmo.</span></span>'};
    [].forEach.call(cy.querySelectorAll("input"),function(e){e.oninput=cf;e.onchange=cf});cf();}
  var sp=reader.querySelector('[data-w="supl"]');
  if(sp){var sout=sp.querySelector(".res"),sin=sp.querySelector("#spP");
    var sf=function(){var P=parseFloat(sin.value);if(!(P>=40&&P<=160)){sout.innerHTML="<span>Informe um peso entre 40 e 160 kg.</span>";return}
      var r=Math.round,g1=function(n){return n.toFixed(1).replace(".",",")};
      sout.innerHTML='<span style="display:grid;gap:6px;width:100%">'+rowK("Creatina · todo dia","3 a 5 g","var(--glc)")+rowK("Creatina · saturação opcional, 5 a 7 dias",r(.3*P)+" g/dia","var(--glc)")+rowK("Beta-alanina · todo dia, doses de até 1,6 g","3,2 a 6,4 g","var(--pro)")+rowK("Cafeína · 1 h antes",r(3*P)+" a "+r(6*P)+" mg","var(--adr)")+rowK("Bicarbonato · 60 a 150 min antes",g1(.3*P)+" g","var(--ins)")+rowK("Citrulina · 45 a 60 min antes","6 a 8 g","var(--glu)")+rowK("Nitrato · 2 h antes",r(4*P)+" a "+r(10*P)+" mg","var(--fat)")+'<span style="font-size:13px;opacity:.8">Cafeína: '+r(3*P)+" mg equivalem a cerca de "+g1(3*P/100)+" cafés expressos de 150 ml, pelos valores do livro. Nitrato: a beterraba tem de 100 a 150 mg por 100 g.</span></span>"};
    sin.oninput=sf;sin.onchange=sf;sf();}
  var pw=reader.querySelector('[data-w="prep"]');
  if(pw){var pq=function(i){return pw.querySelector("#"+i)},pout=pw.querySelector(".res");
    var BFM={3:"4 a 5",4:"5 a 6",5:"6 a 7",6:"7 a 8",7:"8 a 9",8:"9 a 10",9:"10 a 11",10:"11 a 12",11:"12 a 13",12:"14 a 15",13:"15 a 16",14:"17 a 18",15:"18 a 20"};
    var BFF={3:"7 a 8",4:"8 a 10",5:"10 a 12",6:"12 a 14",7:"13 a 15",8:"15 a 17",9:"17 a 19",10:"18 a 20",11:"19 a 21",12:"20 a 22",13:"21 a 23",14:"22 a 24",15:"23 a 25"};
    var pf=function(){var sx=pq("ppS").value,d=Math.round(parseFloat(pq("ppD").value)),P=parseFloat(pq("ppP").value);
      if(!(d>=3&&d<=15&&P>=40&&P<=160)){pout.innerHTML="<span>Dobra de 3 a 15 mm e peso de 40 a 160 kg.</span>";return}
      var f=sx=="f",bf=(f?BFF:BFM)[d],lo=parseFloat(bf.split(" a ")[0]),hi=parseFloat(bf.split(" a ")[1]);
      var t,alvo=f?"8 a 10":"4 a 6";
      if(hi<=(f?13:8))t="8 semanas";else if(hi<=(f?15:12))t="10 a 12 semanas";else if(hi<=(f?18:15))t="12 a 16 semanas";else t="16 a 20 semanas";
      var g1=function(n){return n.toFixed(1).replace(".",",")};
      var kgs=P*(lo+hi)/200-P*(f?0.09:0.05);
      pout.innerHTML='<span style="display:grid;gap:6px;width:100%">'+rowK("Dobra abdominal",d+" mm","var(--gly)")+rowK("Gordura estimada",bf+" %","var(--glu)")+rowK("Condição de palco",alvo+" %","var(--glc)")+rowK("Tempo de pré-contest",t,"#fff")+rowK("Perda de 0,5 a 1% por semana",g1(P*0.005)+" a "+g1(P*0.01)+" kg","var(--pro)")+(kgs>0?rowK("Gordura a perder, aproximada",g1(kgs)+" kg","var(--fat)"):"")+'<span style="font-size:13px;opacity:.8">Estimativas das tabelas do livro (dobra e tempo) e do ritmo de Helms (2014). A gordura a perder usa o ponto médio da faixa estimada. Ferramenta de estudo, não é prescrição.</span></span>'};
    [].forEach.call(pw.querySelectorAll("input,select"),function(e){e.oninput=pf;e.onchange=pf});pf();}
  var mt=reader.querySelector('[data-w="met"]');
  if(mt){
    /* METs do Compêndio de Atividades Físicas para Adultos, 2024 (Herrmann e colaboradores). * = valor estimado pelos autores. */
    var MET=[["Musculação e academia",[["Musculação, vários exercícios, 8 a 15 repetições",3.5],["Musculação: agachamento e levantamento terra",5.0],["Musculação em circuito ou superséries",5.8],["Musculação intensa (fisiculturismo, powerlifting)",6.0],["Circuito com kettlebell, pouco descanso",7.5],["Kettlebell swing",9.8],["Calistenia leve (abdominais, prancha)",2.8],["Calistenia moderada (flexões, barras, afundos)",3.8],["Calistenia vigorosa (burpees, polichinelos, corda naval)",7.5],["HIIT, esforço moderado",7.0],["HIIT vigoroso (burpees, tabata, saltos)",11.0],["Elíptico, esforço moderado",5.0],["Elíptico, esforço vigoroso",9.0],["Escada ergométrica",9.3],["Remo ergômetro, menos de 100 W",5.0],["Remo ergômetro, 100 a 149 W",7.5],["Remo ergômetro, 150 a 199 W",11.0],["Remo ergômetro, 200 W ou mais",14.0],["Pular corda, lento (menos de 100 saltos/min)",8.3],["Pular corda, moderado (100 a 120 saltos/min)",11.8],["Pular corda, rápido (120 a 160 saltos/min)",12.3],["Step, degrau de 15 a 20 cm",7.3],["Ginástica aeróbica, baixo impacto",4.8],["Ginástica aeróbica, alto impacto",8.0],["Aula de condicionamento em academia",7.8],["Alongamento leve",2.3],["Pilates, geral",2.8],["Ioga, geral",2.3],["Power ioga",4.0]]],["Caminhada e escada",[["Caminhada muito lenta, menos de 3,2 km/h",2.3],["Caminhada lenta, 3,2 a 3,9 km/h",2.8],["Caminhada a 4,0 km/h",3.0],["Caminhada moderada, 4,5 a 5,5 km/h",3.8],["Caminhada rápida, 5,6 a 6,3 km/h",4.8],["Caminhada muito rápida, 6,4 a 7,0 km/h",5.5],["Caminhada a 7,2 a 7,9 km/h",7.0],["Caminhada a 8,0 a 8,9 km/h",8.5],["Passear com o cachorro",3.0],["Caminhada na areia ou em terreno fofo",4.5],["Caminhada em subida de 1 a 5%",5.3],["Caminhada em subida de 6 a 10%",7.0],["Caminhada em subida de 11 a 20%",8.8],["Trilha em ritmo normal, sem carga",5.3],["Trilha com mochila",7.8],["Caminhada nórdica (com bastões), 5,8 a 7,1 km/h",5.3],["Marcha atlética",6.5],["Descer escada",3.5],["Subir escada, ritmo lento",4.5],["Subir escada, geral",6.8],["Subir escada, ritmo rápido",9.3]]],["Corrida",[["Trote em ritmo livre",7.5],["Corrida a 6,4 a 6,8 km/h",6.5],["Corrida a 6,9 a 7,7 km/h",7.8],["Corrida a 8,0 a 8,4 km/h",8.5],["Corrida a 8,9 a 9,3 km/h",9.0],["Corrida a 9,7 a 10,1 km/h",9.3],["Corrida a 10,8 km/h",10.5],["Corrida a 11,3 km/h",11.0],["Corrida a 12,1 km/h",11.8],["Corrida a 12,9 km/h",12.0],["Corrida a 13,8 km/h",12.5],["Corrida a 14,5 km/h",13.0],["Corrida a 16,1 km/h",14.8],["Corrida a 17,7 km/h",16.8],["Corrida a 19,3 km/h",18.5],["Corrida em subida de 5%, a 9,7 km/h",13.3],["Corrida cross country",9.3],["Maratona",13.3],["Subir escada correndo",15.0],["Corrida de vai e vem (frente, trás, lateral)",11.0],["Corrida empurrando carrinho de bebê, 8 km/h",10.0]]],["Bicicleta",[["Pedalar a passeio, menos de 16 km/h",4.0],["Pedalar a 16 a 19 km/h, esforço leve",6.8],["Pedalar a 19 a 22 km/h, esforço moderado",8.0],["Pedalar a 22,5 a 25,5 km/h, esforço vigoroso",10.0],["Pedalar a 26 a 30,5 km/h, muito rápido",12.0],["Pedalar acima de 32 km/h, competição",16.8],["Mountain bike, geral",8.5],["Mountain bike, subida vigorosa",14.0],["BMX",8.5],["Bicicleta elétrica, assistência alta",4.0],["Bicicleta elétrica, assistência leve",6.0],["Ergométrica, 50 W",4.0],["Ergométrica, 90 a 100 W",6.0],["Ergométrica, 101 a 125 W",6.8],["Ergométrica, 126 a 150 W",8.0],["Ergométrica, 151 a 199 W",10.3],["Ergométrica, 200 a 229 W",10.8],["Ergométrica, 230 a 250 W",12.5],["Aula de spinning",9.0],["HIIT na bicicleta",8.8]]],["Lutas",[["Artes marciais, ritmo lento, iniciantes",5.3],["Artes marciais, ritmo moderado (judô, jiu-jitsu, caratê, kickboxing, taekwondo, muay thai)",10.3],["Judô",11.3],["Taekwondo, simulação de combate",14.3],["Kickboxing",7.3],["Kung fu",5.5],["Boxe no ringue",12.3],["Boxe, sparring",7.8],["Boxe, round simulado (treino)",9.3],["Boxe, saco de pancada, geral",5.8],["Boxe, saco de pancada, 120 golpes/min",8.5],["Boxe, saco de pancada, 180 golpes/min",10.8],["Luta olímpica (wrestling), competitiva*",6.0],["Kendo, intensidade moderada",6.5],["Kendo, intensidade muito alta",11.3],["Esgrima, geral",6.0],["Esgrima, espada, competitiva",9.8],["Tai chi chuan, geral",3.3]]],["Danças",[["Dança de salão lenta (valsa, foxtrote, samba, tango, rumba)",3.0],["Dança de salão rápida",5.5],["Dança de salão recreativa (valsa, foxtrote, chá-chá-chá, swing)",6.0],["Dança de salão competitiva",11.3],["Salsa com par",4.8],["Salsa afro-cubana",6.0],["Danças culturais (salsa, merengue, dança do ventre, flamenco, swing)*",4.5],["Flamenco",8.5],["Dança folclórica, esforço moderado",5.0],["Dança em balada ou folclórica, esforço vigoroso",9.8],["Balé, jazz ou moderno, aula ou ensaio",5.0],["Balé, exercícios de barra e centro",6.3],["Balé, jazz ou moderno, apresentação vigorosa",6.8],["Sapateado",4.8],["Jazz, geral",4.5],["Dança contemporânea, geral",3.8],["Zumba, aula em grupo",6.5],["Zumba, vídeo em casa",5.5],["Pole dance, aula",4.5],["Bambolê",5.8],["Teatro musical, cantando e dançando",10.3]]],["Esportes coletivos",[["Futebol recreativo",7.0],["Futebol competitivo",9.5],["Futsal",7.8],["Futebol caminhado",3.5],["Basquete, arremessos",5.0],["Basquete, geral",7.5],["Basquete, jogo",8.0],["Basquete, treino com exercícios",9.3],["Vôlei recreativo, 6 a 9 por time",3.0],["Vôlei competitivo, em quadra",6.0],["Vôlei de praia*",8.0],["Handebol*",8.0],["Rúgbi competitivo",8.3],["Futebol americano, flag ou touch",8.0],["Hóquei sobre grama",7.8],["Polo aquático",10.0],["Beisebol ou softbol",5.0],["Frisbee ultimate*",8.0],["Queimada e brincadeiras de rua",5.8]]],["Esportes de raquete",[["Tênis, bater bola*",5.0],["Tênis em duplas",4.5],["Tênis, geral, esforço moderado",6.8],["Tênis, simples, competitivo",8.0],["Tênis de mesa",4.0],["Badminton recreativo",5.5],["Badminton competitivo",7.0],["Badminton, partida competitiva",9.0],["Squash, geral",7.3],["Raquetebol, geral",7.0],["Raquetebol competitivo*",10.0]]],["Natação e água",[["Natação de lazer, sem contar voltas",6.0],["Nado livre, lento, recreativo",5.8],["Crawl, velocidade média (cerca de 46 m/min)",8.0],["Nado livre, rápido, esforço vigoroso",9.8],["Crawl, rápido (cerca de 69 m/min)",10.5],["Nado costas, recreativo",4.8],["Nado costas, treino ou competição",9.5],["Nado peito, recreativo",5.3],["Nado peito, treino ou competição",10.3],["Nado borboleta",13.8],["Natação em mar, lago ou rio",6.0],["Hidroginástica, geral",5.5],["Hidroginástica, alta intensidade",7.5],["Caminhada na água, esforço moderado",4.8],["Corrida na água, esforço vigoroso",9.8],["Surfe, geral",3.0],["Surfe, remando na prancha",6.8],["Stand up paddle, geral",6.5],["Caiaque, esforço moderado",5.0],["Canoagem ou remo, esforço moderado",5.8],["Remo em competição",12.0],["Mergulho autônomo recreativo",6.8],["Snorkel",5.0],["Windsurfe, sem buscar velocidade",5.0],["Kitesurfe ou windsurfe, travessia",11.0]]],["Aventura e outros esportes",[["Escalada em rocha, dificuldade baixa a moderada",5.8],["Escalada em rocha, geral",8.0],["Escalada boulder",8.8],["Rapel*",5.0],["Skate, esforço moderado*",5.0],["Longboard, velocidade típica (16 km/h)",8.3],["Patins de rodas",7.0],["Patins inline, 14,4 km/h",7.5],["Patins inline, 17,7 km/h",9.8],["Patinação no gelo, geral",7.0],["Cama elástica, recreativa",6.3],["Ginástica artística, geral",3.8],["Atletismo, saltos e lançamento de dardo*",6.0],["Atletismo, barreiras e obstáculos*",10.0],["Corrida de orientação*",9.0],["Hipismo, geral",5.5],["Hipismo, trote",5.8],["Arco e flecha",4.3],["Golfe, caminhando e carregando os tacos",4.3],["Boliche",3.8],["Sinuca",2.5],["Esqui alpino ou snowboard, esforço moderado",6.3],["Esqui cross country, velocidade moderada",8.5]]],["Dia a dia",[["Andar dentro de casa",2.3],["Cozinhar, esforço leve",2.0],["Cozinha em geral (cozinhar, lavar louça), esforço moderado",3.3],["Varrer, geral",3.3],["Passar pano no chão, esforço moderado",3.5],["Limpeza geral da casa, esforço moderado",3.3],["Cuidar de criança, em pé (banho, vestir, alimentar)",3.5],["Empurrar carrinho de bebê, 4,0 a 5,0 km/h",3.8],["Carregar compras no plano",3.5],["Carregar compras escada acima",5.3],["Carregar ou descarregar o carro",3.8],["Carregar carga escada acima, geral",8.3],["Jardinagem, esforço moderado",3.8],["Capinar ou cultivar o jardim, esforço moderado",4.5],["Cavar ou revolver a terra",5.0],["Cortar grama andando, esforço moderado",5.5]]]];
    var mP=mt.querySelector("#mtP"),mM=mt.querySelector("#mtM"),mA=mt.querySelector("#mtA"),mo=mt.querySelector(".res"),ml=reader.querySelector("[data-met]"),mc=0;
    MET.forEach(function(c,i){var g=document.createElement("optgroup");g.label=c[0];c[1].forEach(function(a,j){var o=el("option",null,a[0].replace("*","")+" ("+String(a[1]).replace(".",",")+" MET)");o.value=i+"-"+j;g.appendChild(o)});mA.appendChild(g)});
    mA.value="0-0";
    var chips=el("div","chips"),tw=el("div","tw");ml.appendChild(chips);ml.appendChild(tw);
    MET.forEach(function(c,i){var b=el("button","chip",c[0]);b.type="button";b.setAttribute("aria-pressed",i===0);b.onclick=function(){mc=i;[].forEach.call(chips.children,function(x){x.setAttribute("aria-pressed","false")});b.setAttribute("aria-pressed","true");mtab()};chips.appendChild(b)});
    var mv=function(n){return String(n).replace(".",",")};
    var mtab=function(){var P=parseFloat(mP.value),ok=P>=35&&P<=200,c=MET[mc];
      tw.innerHTML='<table style="min-width:0"><thead><tr><th>'+c[0]+'</th><th style="text-align:right">MET</th><th style="text-align:right;white-space:nowrap">kcal/h</th></tr></thead><tbody>'+c[1].slice().sort(function(a,b){return a[1]-b[1]}).map(function(a){return "<tr><td>"+a[0]+'</td><td class="v" style="text-align:right">'+mv(a[1].toFixed(1))+'</td><td class="v" style="text-align:right">'+(ok?fmtK(a[1]*P):"–")+"</td></tr>"}).join("")+'</tbody><caption>kcal/h = gasto total por hora de atividade contínua'+(ok?" para "+mv(P)+" kg":"")+', já com o repouso incluído. * = valor estimado pelos autores do compêndio, sem medição direta.</caption></table>'};
    var mf=function(){var P=parseFloat(mP.value),M=parseFloat(mM.value),k=mA.value.split("-"),a=MET[+k[0]][1][+k[1]];
      if(!(P>=35&&P<=200&&M>=1&&M<=600)){mo.innerHTML="<span>Informe um peso entre 35 e 200 kg e uma duração entre 1 e 600 minutos.</span>";mtab();return}
      var h=M/60,tot=a[1]*P*h,rep=P*h;
      mo.innerHTML='<span style="display:grid;gap:6px;width:100%">'+rowK("Intensidade",mv(a[1].toFixed(1))+" MET","#fff")+rowK("Gasto total em "+Math.round(M)+" min",fmtK(tot)+" kcal")+rowK("Repouso no mesmo tempo",fmtK(rep)+" kcal","var(--cor)")+rowK("Acréscimo real",fmtK(tot-rep)+" kcal","var(--pro)")+'<span style="font-size:13px;opacity:.8">O acréscimo é o que a atividade somou ao seu dia. É o número que interessa para o déficit.</span></span>';mtab()};
    [mP,mM,mA].forEach(function(e){e.oninput=mf;e.onchange=mf});mf();}
  var ed=reader.querySelector('[data-w="endur"]');
  if(ed){var w=ed.querySelector("input"),o=ed.querySelector(".res"),r5=function(n){return (Math.round(n/5)*5).toLocaleString("pt-BR")};
    var f=function(){var k=parseFloat(w.value);if(!(k>=35&&k<=200)){o.innerHTML="<span>Informe um peso entre 35 e 200 kg.</span>";return}
      o.innerHTML='<span style="display:grid;gap:6px;width:100%">'+[["Treino até 1 h/dia",5,7],["Treino de 1 a 3 h/dia",6,10],["Treino acima de 4 h/dia",8,12],["48 h antes de prova longa",10,12],["Pré-prova (1 a 4 h antes)",1,4]].map(function(x){return '<span style="display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid rgba(255,255,255,.12);padding-bottom:5px"><span>'+x[0]+'</span><b style="font-family:var(--serif);font-weight:400;font-size:22px;color:var(--glc);white-space:nowrap">'+r5(x[1]*k)+" a "+r5(x[2]*k)+" g</b></span>"}).join("")+"</span>"};
    w.oninput=f;f();}
}

/* ---------- glossário automático ---------- */
var byForm={},forms=[];
G.forEach(function(g,i){g[1].forEach(function(f){[f,f.charAt(0).toUpperCase()+f.slice(1)].forEach(function(v){if(!(v in byForm)){byForm[v]=i;forms.push(v)}})})});
forms.sort(function(a,b){return b.length-a.length});
var re=new RegExp("(?<![\\p{L}\\p{N}-])("+forms.map(function(s){return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}).join("|")+")(?![\\p{L}\\p{N}])","u");
var skip={SVG:1,BUTTON:1,A:1,H1:1,H2:1,H3:1,H4:1,H5:1,TH:1,LABEL:1,SELECT:1,OPTION:1,SUMMARY:1,FIGCAPTION:1,CAPTION:1};
function gloss(){
  [].forEach.call(reader.querySelectorAll(".sec"),function(sec){
    var used={},tw=document.createTreeWalker(sec,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      for(var p=n.parentNode;p&&p!==sec;p=p.parentNode){if(skip[p.nodeName.toUpperCase()]||(p.classList&&(p.classList.contains("m")||p.classList.contains("res")||p.classList.contains("tag")||p.classList.contains("ask")||p.classList.contains("anchor")||p.classList.contains("refs"))))return NodeFilter.FILTER_REJECT}
      return NodeFilter.FILTER_ACCEPT}}),nodes=[],n;
    while((n=tw.nextNode()))nodes.push(n);
    nodes.forEach(function(node){var guard=0;
      while(node&&guard++<40){var txt=node.nodeValue,m,from=0,hit=null;
        while((m=re.exec(txt.slice(from)))){var k=byForm[m[1]];if(!used[k]){hit={i:from+m.index,len:m[1].length,k:k};break}from+=m.index+m[1].length}
        if(!hit)break;used[hit.k]=1;
        var rest=node.splitText(hit.i),after=rest.splitText(hit.len),b=document.createElement("button");
        b.type="button";b.className="g";b.dataset.g=hit.k;b.textContent=rest.nodeValue;rest.parentNode.replaceChild(b,rest);node=after}
    });
  });
}
route();
})();
