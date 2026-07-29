/* MG COACH — biblioteca de estudos · comportamento compartilhado */
(function(){
  /* ---------- tema claro/escuro ---------- */
  var KEY="mgcoach-theme";
  function apply(t){
    if(t==="light"){document.documentElement.setAttribute("data-theme","light");}
    else{document.documentElement.removeAttribute("data-theme");}
    var lbl=document.querySelector(".theme-toggle .tt-label");
    var icon=document.querySelector(".theme-toggle .tt-icon");
    if(lbl)lbl.textContent=(t==="light")?"Escuro":"Claro";
    if(icon)icon.innerHTML=(t==="light")
      ? '<path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/>'
      : '<path d="M20 14.5A7.5 7.5 0 0 1 9.5 4 6.5 6.5 0 1 0 20 14.5z" fill="currentColor"/>';
  }
  var saved=null;try{saved=localStorage.getItem(KEY);}catch(e){}
  apply(saved||"dark");
  document.addEventListener("click",function(e){
    var btn=e.target.closest&&e.target.closest(".theme-toggle");
    if(!btn)return;
    var cur=document.documentElement.getAttribute("data-theme")==="light"?"light":"dark";
    var next=cur==="light"?"dark":"light";
    apply(next);
    try{localStorage.setItem(KEY,next);}catch(err){}
  });

  /* ---------- índice recolhível ---------- */
  var TKEY="mgcoach-toc";
  var btn=document.getElementById("tocBtn"),nav=document.getElementById("tocNav"),lbl=document.getElementById("tocLbl");
  if(!btn||!nav)return;
  var n=document.querySelectorAll("main section[id]").length
       || document.querySelectorAll("section[id]").length;
  function paint(open){
    document.body.classList.toggle("toc-open",open);
    btn.setAttribute("aria-expanded",open?"true":"false");
    if(lbl)lbl.textContent=open?"Fechar \u00edndice":("\u00cdndice"+(n?" \u00b7 "+n+" se\u00e7\u00f5es":""));
  }
  var open=false;try{open=localStorage.getItem(TKEY)==="open";}catch(e){}
  paint(open);
  btn.addEventListener("click",function(){
    var next=!document.body.classList.contains("toc-open");
    paint(next);try{localStorage.setItem(TKEY,next?"open":"closed");}catch(err){}
  });
  nav.addEventListener("click",function(e){
    var a=e.target.closest("a");if(!a)return;
    var href=a.getAttribute("href")||"";
    if(href.charAt(0)!=="#")return;              /* link externo: deixa passar */
    var el=document.getElementById(href.slice(1));
    paint(false);try{localStorage.setItem(TKEY,"closed");}catch(err){}
    if(!el)return;
    e.preventDefault();
    var off=document.querySelector("header.topbar").getBoundingClientRect().height+12;
    window.scrollTo({top:el.getBoundingClientRect().top+window.pageYOffset-off,behavior:"instant"});
    try{history.replaceState(null,"","#"+href.slice(1));}catch(err){}
  });
})();
