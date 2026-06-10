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
    {addr:"3928 Hawthorn Ave", sqft:"3,498", bed:"3", bath:"3.5", pi:0, img:"3928.webp"},
    {addr:"3930 Hawthorn Ave", sqft:"3,465", bed:"3", bath:"3.5", pi:1, img:"3930.webp"},
    {addr:"4030 Hawthorn Ave", sqft:"3,218", bed:"3", bath:"3.5", pi:2, img:"4030.jpeg"},
    {addr:"4032 Hawthorn Ave", sqft:"3,140", bed:"3", bath:"3.5", pi:3, img:"4032.jpeg"}
  ];

  /* six-plex collection: two three-unit buildings, every unit sold */
  var plexes = [
    {addr:"3939 Hawthorn Ave", units:["A","B","C"], pi:0, img:"3939.webp"},
    {addr:"3943 Hawthorn Ave", units:["A","B","C"], pi:2, img:"3943.webp"}
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

  /* real photo layer; removes itself if the file is missing so the placeholder shows */
  function photoMarkup(p){
    return '<img class="ph-photo" src="'+p.img+'" alt="'+p.addr+' exterior" loading="lazy" onerror="this.remove()">';
  }

  /* build property cards */
  var grid = document.getElementById("propGrid");
  props.forEach(function(p, i){
    var card = document.createElement("button");
    card.className = "prop-card reveal";
    card.setAttribute("data-d", String((i % 2) + 1));
    card.setAttribute("aria-label", p.addr + ", sold duplex, view details");
    card.innerHTML =
      '<div class="ph">'+ phMarkup(p.pi) + photoMarkup(p)
      +   '<span class="ph-tag">Duplex</span>'
      +   '<span class="ph-status is-sold">Sold</span>'
      + '</div>'
      + '<div class="prop-info">'
      +   '<h3>'+ p.addr +'</h3>'
      +   '<p class="meta">'+ p.bed +' Bed &middot; '+ p.bath +' Bath &middot; '+ p.sqft +' Sq Ft</p>'
      +   '<div class="prop-foot">'
      +     '<span class="prop-cta">View Details</span>'
      +     '<span class="prop-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
      +   '</div>'
      + '</div>';
    card.addEventListener("click", function(){ openModal(p); });
    grid.appendChild(card);
  });

  /* build six-plex building cards (informational, every unit sold) */
  var plexGrid = document.getElementById("plexGrid");
  if(plexGrid){
    plexes.forEach(function(b, i){
      var chips = b.units.map(function(u){
        return '<span class="unit-chip"><span>Unit '+u+'</span><b>Sold</b></span>';
      }).join("");
      var photo = '<img class="ph-photo" src="'+b.img+'" alt="'+b.addr+' six-plex building" loading="lazy" onerror="this.remove()">';
      var card = document.createElement("article");
      card.className = "plex-card reveal";
      card.setAttribute("data-d", String((i % 2) + 1));
      card.innerHTML =
        '<div class="ph">'+ phMarkup(b.pi) + photo
        +   '<span class="ph-tag">Six-Plex Development</span>'
        +   '<span class="ph-status is-sold">Sold Out</span>'
        + '</div>'
        + '<div class="prop-info">'
        +   '<h3>'+ b.addr +'</h3>'
        +   '<p class="meta">Three residences &middot; Units A, B &amp; C</p>'
        +   '<div class="unit-row">'+ chips +'</div>'
        + '</div>';
      plexGrid.appendChild(card);
    });
  }

  /* ---- upcoming / in-development pipeline ---- */
  var upcoming = [
    {
      group:"Nearly Complete", status:"soon",
      note:"Final finishes underway — these homes are nearing completion.",
      items:[
        {addr:"4128 Prescott Ave", kind:"Two-Story Duplex", pi:1, img:"4128.webp"},
        {addr:"4130 Prescott Ave", kind:"Two-Story Duplex", pi:3, img:"4130.webp"}
      ]
    },
    {
      group:"In Construction", status:"building",
      note:"Actively under construction on Hawthorn Avenue.",
      items:[
        {addr:"3912 Hawthorn Ave", kind:"Two-Story Duplex", pi:0, img:"3912.webp"},
        {addr:"3914 Hawthorn Ave", kind:"Two-Story Duplex", pi:2, img:"3914.webp"}
      ]
    },
    {
      group:"In Planning", status:"planning",
      note:"A new six-plex collection — two three-unit buildings in the planning stage.",
      items:[
        {addr:"4015 Hershel Ave", kind:"Six-Plex &middot; Three Residences", units:["A","B","C"], pi:1, img:"4015.webp"},
        {addr:"4017 Hershel Ave", kind:"Six-Plex &middot; Three Residences", units:["A","B","C"], pi:3, img:"4017.webp"}
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
        var photo = '<img class="ph-photo" src="'+it.img+'" alt="Exterior rendering of '+it.addr+'" loading="lazy" onerror="this.remove()">';
        var units = "";
        if(it.units){
          units = '<div class="up-units">' + it.units.map(function(u){
            return '<span class="up-unit"><span>Unit '+u+'</span><b>'+meta.label+'</b></span>';
          }).join("") + '</div>';
        }
        return '<article class="up-card reveal" data-d="'+((i % 2) + 1)+'">'
          + '<div class="ph">'+ phMarkup(it.pi) + photo
          +   '<span class="ph-status is-'+phase.status+'">'+ meta.label +'</span>'
          + '</div>'
          + '<div class="up-info">'
          +   '<h3>'+ it.addr +'</h3>'
          +   '<p class="meta">'+ it.kind +'</p>'
          +   units
          +   trackMarkup(meta.stage, phase.status)
          + '</div>'
          + '</article>';
      }).join("");

      phaseEl.innerHTML =
        '<div class="up-phase-head">'
        +   '<h3>'+ phase.group +'</h3>'
        +   '<span class="status-pill is-'+phase.status+'">'+ meta.label +'</span>'
        + '</div>'
        + '<p class="up-phase-note">'+ phase.note +'</p>'
        + '<div class="up-grid">'+ cards +'</div>';
      upWrap.appendChild(phaseEl);
    });
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

  /* ---- property modal ---- */
  var modal = document.getElementById("modal");
  var lastFocus = null;
  function openModal(p){
    lastFocus = document.activeElement;
    document.getElementById("modalTitle").textContent = p.addr;
    document.getElementById("mSqft").textContent = p.sqft;
    document.getElementById("mBed").textContent = p.bed;
    document.getElementById("mBath").textContent = p.bath;
    document.getElementById("modalPh").innerHTML = phMarkup(p.pi) + photoMarkup(p);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("nav-open");
    document.getElementById("modalClose").focus();
  }
  function closeModal(){
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("nav-open");
    if(lastFocus) lastFocus.focus();
  }
  modal.addEventListener("click", function(e){
    if(e.target.hasAttribute("data-close") || e.target.closest("[data-close]")) closeModal();
  });
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      if(modal.classList.contains("open")) closeModal();
      else if(navLinks.classList.contains("open")) closeMenu();
    }
  });

  /* ---- contact form ---- */
  var form = document.getElementById("contactForm");
  var success = document.getElementById("formSuccess");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    if(!form.checkValidity()){ form.reportValidity(); return; }
    success.classList.add("show");
  });
  document.getElementById("resetForm").addEventListener("click", function(){
    success.classList.remove("show");
    form.reset();
    document.getElementById("name").focus();
  });

  /* ---- year ---- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
