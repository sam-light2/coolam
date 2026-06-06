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
    return '<img class="ph-photo" src="'+p.img+'" alt="'+p.addr+' duplex exterior" loading="lazy" onerror="this.remove()">';
  }

  /* build property cards */
  var grid = document.getElementById("propGrid");
  props.forEach(function(p, i){
    var card = document.createElement("button");
    card.className = "prop-card reveal";
    card.setAttribute("data-d", String((i % 2) + 1));
    card.setAttribute("aria-label", p.addr + ", view duplex details");
    card.innerHTML =
      '<div class="ph">'+ phMarkup(p.pi) + photoMarkup(p) +'<span class="ph-tag">Duplex</span></div>'
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
