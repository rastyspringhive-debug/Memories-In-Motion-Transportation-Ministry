(function () {
  "use strict";

  var header = document.getElementById("header");
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var toTop = document.getElementById("toTop");
  var links = document.querySelectorAll(".nav__link");

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i class="fi fi-rr-menu-burger"></i>';
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = open ? '<i class="fi fi-rr-cross-small"></i>' : '<i class="fi fi-rr-menu-burger"></i>';
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  }

  // Header shadow, back-to-top, active link (only for in-page hash links)
  var sections = Array.prototype.map.call(links, function (l) {
    var href = l.getAttribute("href");
    return href && href.charAt(0) === "#" ? document.querySelector(href) : null;
  });
  var hasHashSections = sections.some(function (s) { return s !== null; });

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (toTop) toTop.classList.toggle("show", y > 600);
    if (hasHashSections) {
      var current = 0;
      sections.forEach(function (s, i) {
        if (s && s.getBoundingClientRect().top <= 140) current = i;
      });
      links.forEach(function (l, i) {
        if (sections[i]) {
          l.classList.toggle("active", i === current);
        }
      });
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var revealEls = document.querySelectorAll(
    ".strip__item, .no-cost__card, .about__media, .about__text, .mv__card, .card, .veterans__text, .veterans__media, .sponsor-panel, .schedule-card, .partner-card, .faq__item, .step, .form, .request__intro, .contact-card, .contact__map"
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

  // Min date = today for all date inputs
  ["fDate", "aDate"].forEach(function (id) {
    var dateInput = document.getElementById(id);
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];
  });

  // Pre-select sponsorship tier when clicking a tier button on Sponsor a Visit page
  var amountSelect = document.getElementById("sAmount");
  document.querySelectorAll("[data-amount]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (amountSelect) {
        amountSelect.value = btn.getAttribute("data-amount");
      }
    });
  });

  // Helper to validate required fields in a form
  function validateForm(formEl, noteEl) {
    var ok = true;
    formEl.querySelectorAll("[required]").forEach(function (f) {
      var bad = !f.value.trim();
      var fieldWrap = f.closest(".field");
      if (fieldWrap) fieldWrap.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok && noteEl) {
      noteEl.style.color = "#B22234";
      noteEl.textContent = "Please complete the required fields marked with *.";
    }
    return ok;
  }

  // 1. Request Transportation Form (index.html)
  var requestForm = document.getElementById("requestForm");
  var formNote = document.getElementById("formNote");
  if (requestForm) {
    requestForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateForm(requestForm, formNote)) return;
      var d = new FormData(requestForm);
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
      if (formNote) {
        formNote.style.color = "";
        formNote.textContent = "Thank you! Your email app is opening so you can send your request.";
      }
    });
  }

  // 2. Apply for Transportation Assistance Form (transportation-assistance.html)
  var assistanceForm = document.getElementById("assistanceForm");
  var assistanceNote = document.getElementById("assistanceNote");
  if (assistanceForm) {
    assistanceForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateForm(assistanceForm, assistanceNote)) return;
      var d = new FormData(assistanceForm);
      var body =
        "Transportation Assistance Application (Confidential)\n" +
        "----------------------------------------------------\n" +
        "Name: " + d.get("name") + "\n" +
        "Phone: " + d.get("phone") + "\n" +
        "Email: " + d.get("email") + "\n" +
        "Preferred Visit Date: " + d.get("date") + "\n" +
        "Pickup Address: " + d.get("pickup") + "\n" +
        "Cemetery / Destination: " + d.get("cemetery") + "\n" +
        "Applicant Category: " + d.get("category") + "\n" +
        "Assistance Type: " + d.get("support") + "\n\n" +
        "Additional Details:\n" + d.get("message");
      window.location.href =
        "mailto:mimtransportation@yahoo.com?subject=" +
        encodeURIComponent("Transportation Assistance Application - " + d.get("name")) +
        "&body=" + encodeURIComponent(body);
      if (assistanceNote) {
        assistanceNote.style.color = "";
        assistanceNote.textContent = "Thank you! Your email app is opening to send your confidential assistance application.";
      }
    });
  }

  // 3. Sponsor a Visit Form (sponsor-a-visit.html)
  var sponsorForm = document.getElementById("sponsorForm");
  var sponsorNote = document.getElementById("sponsorNote");
  if (sponsorForm) {
    sponsorForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateForm(sponsorForm, sponsorNote)) return;
      var d = new FormData(sponsorForm);
      var body =
        "Memories In Motion Transportation Sponsorship Commitment\n" +
        "--------------------------------------------------------\n" +
        "Donor / Organization: " + d.get("name") + "\n" +
        "Sponsor Type: " + d.get("type") + "\n" +
        "Email: " + d.get("email") + "\n" +
        "Phone: " + d.get("phone") + "\n" +
        "Sponsorship Level: " + d.get("amount") + "\n" +
        "In Memory / Honor Of: " + (d.get("dedication") || "N/A") + "\n\n" +
        "Message / Notes:\n" + d.get("message");
      window.location.href =
        "mailto:mimtransportation@yahoo.com?subject=" +
        encodeURIComponent("Transportation Sponsorship - " + d.get("name")) +
        "&body=" + encodeURIComponent(body);
      if (sponsorNote) {
        sponsorNote.style.color = "";
        sponsorNote.textContent = "Thank you for your generosity! Opening your email app to submit your sponsorship.";
      }
    });
  }
})();
