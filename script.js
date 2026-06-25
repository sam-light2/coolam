/* ============================================================
   COOLAM DEVELOPMENT, interactions
   ============================================================ */
(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- property data ---- */
  var palettes = [
    {p1:"#4f9e7e",p2:"#2f6b54",p3:"#163026"},
    {p1:"#5aa98a",p2:"#357a60",p3:"#19342a"},
    {p1:"#6f9e8c",p2:"#3f7a66",p3:"#14241f"},
    {p1:"#4a8f76",p2:"#2c6450",p3:"#122b22"}
  ];
  var props = [
    {addr:"3928 Hawthorn Ave", sqft:"3,498", bed:"3", bath:"3.5", pi:0, img:"3928.webp", kind:"duplex", link:"https://www.zillow.com/homedetails/3928-Hawthorne-Ave-Dallas-TX-75219/26693087_zpid/"},
    {addr:"3930 Hawthorn Ave", sqft:"3,465", bed:"3", bath:"3.5", pi:1, img:"3930.webp", kind:"duplex", link:"https://www.zillow.com/homedetails/3930-Hawthorne-Ave-Dallas-TX-75219/26693086_zpid/"},
    {addr:"3939 Hawthorn Ave", sqft:"2,283", bed:"3", bath:"3.5", pi:0, img:"3939.webp", kind:"plex", link:"https://www.zillow.com/homedetails/3939-Hawthorne-Ave-103-Dallas-TX-75219/453629554_zpid/"},
    {addr:"3943 Hawthorn Ave", sqft:"2,283", bed:"3", bath:"3.5", pi:2, img:"3943.webp", kind:"plex", link:"https://www.zillow.com/homedetails/3943-Hawthorne-Ave-102-Dallas-TX-75219/452126483_zpid/"},
    {addr:"4030 Hawthorn Ave", sqft:"3,218", bed:"3", bath:"3.5", pi:2, img:"4030.jpeg", kind:"duplex", link:"https://www.zillow.com/homedetails/4030-Hawthorne-Ave-Dallas-TX-75219/26693036_zpid/"},
    {addr:"4032 Hawthorn Ave", sqft:"3,140", bed:"3", bath:"3.5", pi:3, img:"4032.jpeg", kind:"duplex", link:"https://www.zillow.com/homedetails/4032-Hawthorne-Ave-Dallas-TX-75219/339351966_zpid/"}
  ];

  /* art-directed CSS placeholder (renders behind the real photo) */
  function phMarkup(pi){
    var c = palettes[pi];
    return '<div class="img" style="--p1:'+c.p1+';--p2:'+c.p2+';--p3:'+c.p3+'">'
      + '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
      +   '<g stroke="rgba(230,241,236,.28)" stroke-width="1" fill="none">'
      +     '<line x1="250" y1="20" x2="250" y2="240"/><line x1="300" y1="20" x2="300" y2="240"/>'
      +     '<line x1="350" y1="40" x2="350" y2="240"/>'
      +     '<line x1="235" y1="70" x2="400" y2="70"/><line x1="235" y1="155" x2="400" y2="155"/>'
      +   '</g>'
      +   '<rect x="40" y="150" width="120" height="90" rx="4" fill="rgba(230,241,236,.12)"/>'
      + '</svg>'
      + '<div class="ph-grain"></div><div class="floor"></div>'
      + '</div>';
  }

  /* build property cards */
  var grid = document.getElementById("propGrid");
  props.forEach(function(p, i){
    var isPlex = p.kind === "plex";
    var tag = isPlex ? "Six-Plex" : "Duplex";
    var meta = isPlex
      ? '3 residences &middot; '+ p.bed +' Bed &middot; '+ p.bath +' Bath &middot; '+ p.sqft +' Sq Ft each'
      : p.bed +' Bed &middot; '+ p.bath +' Bath &middot; '+ p.sqft +' Sq Ft';
    var altText = isPlex ? p.addr+' six-plex building' : p.addr+' exterior';
    var photo = '<img class="ph-photo" src="'+p.img+'" alt="'+altText+'" loading="lazy" onerror="this.remove()">';
    var card = document.createElement(p.link ? "a" : "article");
    card.className = "prop-card reveal";
    if(p.link){
      card.href = p.link;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", "View " + p.addr + " on Zillow (opens in a new tab)");
    }
    card.setAttribute("data-d", String((i % 2) + 1));
    card.innerHTML =
      '<div class="ph">'+ phMarkup(p.pi) + photo
      +   '<span class="ph-tag">'+ tag +'</span>'
      +   '<span class="ph-status is-sold">Sold</span>'
      + '</div>'
      + '<div class="prop-info">'
      +   '<h3>'+ p.addr +'</h3>'
      +   '<p class="meta">'+ meta +'</p>'
      + '</div>';
    grid.appendChild(card);
  });

  /* ---- upcoming / in-development pipeline ---- */
  var upcoming = [
    {
      group:"Nearly Complete", status:"soon",
      note:"Final finishes underway — these homes are nearing completion.",
      items:[
        {addr:"4128 Prescott Ave", kind:"Two-Story Duplex", pi:1, img:"4128.png"},
        {addr:"4130 Prescott Ave", kind:"Two-Story Duplex", pi:3, img:"4130.png", objPos:"67% center"}
      ]
    },
    {
      group:"In Construction", status:"building",
      note:"Actively under construction on Hawthorn Avenue.",
      items:[
        {addr:"3912 Hawthorn Ave", kind:"Two-Story Duplex", pi:0, img:"3912.png", objPos:"50% center"},
        {addr:"3914 Hawthorn Ave", kind:"Two-Story Duplex", pi:2, img:"3914.png", objPos:"20% center"}
      ]
    },
    {
      group:"In Planning", status:"planning",
      note:"A new six-plex collection — two three-unit buildings in the planning stage.",
      items:[
        {addr:"4015 Hershel Ave", kind:"Six-Plex &middot; Three Residences", units:["A","B","C"], pi:1, img:"4015.png"},
        {addr:"4017 Hershel Ave", kind:"Six-Plex &middot; Three Residences", units:["A","B","C"], pi:3, img:"4017.png", objPos:"center 30%"}
      ]
    }
  ];
  var statusMeta = {
    planning:{label:"In Planning", stage:0},
    building:{label:"In Construction", stage:1},
    soon:{label:"Nearly Complete", stage:2}
  };
  var stageLabels = ["Planning","Construction","Nearly Done"];

  function trackMarkup(stage, status){
    var lis = stageLabels.map(function(lbl, i){
      var cls = i < stage ? "is-done" : (i === stage ? "is-active" : "");
      return '<li class="'+cls+'"><span class="dot"></span><b>'+lbl+'</b></li>';
    }).join("");
    return '<ol class="up-track" aria-label="Stage: '+statusMeta[status].label+'">'+lis+'</ol>';
  }

  var upWrap = document.getElementById("upcomingPhases");
  if(upWrap){
    upcoming.forEach(function(phase){
      var meta = statusMeta[phase.status];
      var phaseEl = document.createElement("div");
      phaseEl.className = "up-phase reveal";
      phaseEl.setAttribute("data-d", "1");

      var cards = phase.items.map(function(it, i){
        var posStyle = it.objPos ? ' style="object-position:'+it.objPos+'"' : '';
        var photo = '<img class="ph-photo" src="'+it.img+'" alt="Exterior rendering of '+it.addr+'" loading="lazy" onerror="this.remove()"'+posStyle+'>';
        return '<article class="up-card reveal" data-d="'+((i % 2) + 1)+'">'
          + '<div class="ph">'+ phMarkup(it.pi) + photo
          +   '<span class="ph-status is-'+phase.status+'">'+ meta.label +'</span>'
          + '</div>'
          + '<div class="up-info">'
          +   '<h3>'+ it.addr +'</h3>'
          +   '<p class="meta">'+ it.kind +'</p>'
          +   trackMarkup(meta.stage, phase.status)
          + '</div>'
          + '</article>';
      }).join("");

      phaseEl.innerHTML = '<div class="up-grid">'+ cards +'</div>';
      upWrap.appendChild(phaseEl);
    });
  }

  /* ---- hero video: ensure it autoplays (muted, inline) across browsers ---- */
  var heroVideo = document.querySelector(".hero-bg-video");
  if(heroVideo){
    heroVideo.muted = true; // required for programmatic autoplay
    var tryPlay = function(){
      var pr = heroVideo.play();
      if(pr && typeof pr.catch === "function"){ pr.catch(function(){}); }
    };
    tryPlay();
    heroVideo.addEventListener("canplay", tryPlay, {once:true});
    document.addEventListener("visibilitychange", function(){
      if(!document.hidden) tryPlay();
    });
    // last-resort: kick playback on the first user interaction
    var kick = function(){ tryPlay(); window.removeEventListener("pointerdown", kick); };
    window.addEventListener("pointerdown", kick, {passive:true});
  }

  /* ---- header scroll state ---- */
  var header = document.getElementById("header");
  function onScroll(){
    if(window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, {passive:true});

  /* ---- mobile menu ---- */
  var toggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");
  function closeMenu(){
    navLinks.classList.remove("open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded","false");
    toggle.setAttribute("aria-label","Open menu");
  }
  toggle.addEventListener("click", function(){
    var open = navLinks.classList.toggle("open");
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navLinks.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", closeMenu);
  });

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if(reduce || !("IntersectionObserver" in window)){
    reveals.forEach(function(el){ el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, {threshold:.16, rootMargin:"0px 0px -8% 0px"});
    reveals.forEach(function(el){ io.observe(el); });
  }

  /* ---- close mobile menu on Escape ---- */
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && navLinks.classList.contains("open")) closeMenu();
  });

  /* ---- contact form (delivers to steven@coolam.com via FormSubmit AJAX) ---- */
  var form = document.getElementById("contactForm");
  var success = document.getElementById("formSuccess");
  var formError = document.getElementById("formError");
  var submitBtn = form.querySelector(".submit-btn");
  var submitBtnHTML = submitBtn ? submitBtn.innerHTML : "";
  function restoreBtn(){
    if(!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.classList.remove("is-sending");
    submitBtn.innerHTML = submitBtnHTML;
  }
  form.addEventListener("submit", function(e){
    e.preventDefault();
    if(!form.checkValidity()){ form.reportValidity(); return; }
    if(formError) formError.hidden = true;
    if(submitBtn){
      submitBtn.disabled = true;
      submitBtn.classList.add("is-sending");
      submitBtn.textContent = "Sending…";
    }
    fetch("https://formsubmit.co/ajax/steven@coolam.com", {
      method:"POST",
      headers:{ "Accept":"application/json" },
      body:new FormData(form)
    }).then(function(res){
      if(!res.ok) throw new Error("bad response");
      return res.json();
    }).then(function(){
      restoreBtn();
      form.reset();
      success.classList.add("show");
    }).catch(function(){
      restoreBtn();
      if(formError) formError.hidden = false;
    });
  });
  document.getElementById("resetForm").addEventListener("click", function(){
    success.classList.remove("show");
    if(formError) formError.hidden = true;
    form.reset();
    restoreBtn();
    document.getElementById("name").focus();
  });

  /* ---- year ---- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
