r(function () {
  "use strict";

  var header = document.getElementById("header");
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var toTop = document.getElementById("toTop");
  var links = document.querySelectorAll(".nav__link");

  document.getElementById("year").textContent = new Date().getFullYear();

  // Mobile menu
  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i class="fi fi-rr-menu-burger"></i>';
  }
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = open ? '<i class="fi fi-rr-cross-small"></i>' : '<i class="fi fi-rr-menu-burger"></i>';
  });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });

  // Header shadow, back-to-top, active link
  var sections = Array.prototype.map.call(links, function (l) {
    return document.querySelector(l.getAttribute("href"));
  });
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 10);
    toTop.classList.toggle("show", y > 600);
    var current = 0;
    sections.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top <= 140) current = i;
    });
    links.forEach(function (l, i) { l.classList.toggle("active", i === current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var revealEls = document.querySelectorAll(
    ".strip__item, .about__media, .about__text, .mv__card, .card, .veterans__text, .veterans__media, .step, .form, .request__intro, .contact-card, .contact__map"
  );
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
  }

  // Min date = today
  var dateInput = document.getElementById("fDate");
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  // Request form -> opens email (static site; replace with a form service/back end when ready)
  var form = document.getElementById("requestForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (f) {
      var bad = !f.value.trim();
      f.closest(".field").classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.style.color = "#B22234";
      note.textContent = "Please complete the required fields marked with *.";
      return;
    }
    var d = new FormData(form);
    var body =
      "Name: " + d.get("name") + "\n" +
      "Phone: " + d.get("phone") + "\n" +
      "Email: " + d.get("email") + "\n" +
      "Preferred Date: " + d.get("date") + "\n" +
      "Pickup Address: " + d.get("pickup") + "\n" +
      "Cemetery / Destination: " + d.get("cemetery") + "\n" +
      "Passengers: " + d.get("passengers") + "\n" +
      "Assistance Needed: " + d.get("assist") + "\n\n" +
      "Message:\n" + d.get("message");
    window.location.href =
      "mailto:mimtransportation@yahoo.com?subject=" +
      encodeURIComponent("Transportation Request - " + d.get("name")) +
      "&body=" + encodeURIComponent(body);
    note.style.color = "";
    note.textContent = "Thank you! Your email app is opening so you can send your request.";
  });
})();

