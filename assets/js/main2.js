(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("primaryNav");
  var menuBtn = document.getElementById("menuBtn");
  var backTop = document.getElementById("backTop");
  var navLinks = document.querySelectorAll(".primary-nav__link");

  var yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile Menu Toggle
  function closeNav() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.innerHTML = '<i class="fi fi-rr-menu-burger"></i>';
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.innerHTML = isOpen
        ? '<i class="fi fi-rr-cross-small"></i>'
        : '<i class="fi fi-rr-menu-burger"></i>';
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  // Scroll state: sticky header, back-to-top, active section link
  var targets = Array.prototype.map.call(navLinks, function (link) {
    var href = link.getAttribute("href");
    return href && href.startsWith("#") ? document.querySelector(href) : null;
  });

  function handleScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 16);
    if (backTop) backTop.classList.toggle("is-visible", y > 520);

    var activeIdx = 0;
    targets.forEach(function (sec, idx) {
      if (sec && sec.getBoundingClientRect().top <= 160) {
        activeIdx = idx;
      }
    });
    navLinks.forEach(function (link, idx) {
      link.classList.toggle("is-active", idx === activeIdx);
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Set minimum date to today
  var dateField = document.getElementById("vDate");
  if (dateField) {
    dateField.min = new Date().toISOString().split("T")[0];
  }

  // Booking form submission -> mailto mimtransportation@yahoo.com
  var form = document.getElementById("visitForm");
  var status = document.getElementById("vformStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll("[required]").forEach(function (input) {
        var empty = !input.value.trim();
        var wrapper = input.closest(".vfield");
        if (wrapper) wrapper.classList.toggle("is-invalid", empty);
        if (empty) valid = false;
      });

      if (!valid) {
        status.style.color = "#A62634";
        status.textContent = "Please complete all required fields marked with *.";
        return;
      }

      var data = new FormData(form);
      var emailBody =
        "Visit Request — Memories In Motion Transportation Ministry\n" +
        "---------------------------------------------------------\n" +
        "Full Name: " + data.get("name") + "\n" +
        "Phone Number: " + data.get("phone") + "\n" +
        "Email: " + (data.get("email") || "Not provided") + "\n" +
        "Preferred Visit Date: " + data.get("date") + "\n" +
        "Pickup Address: " + data.get("pickup") + "\n" +
        "Cemetery / Destination: " + data.get("cemetery") + "\n" +
        "Number of Riders: " + data.get("guests") + "\n" +
        "Support Needed: " + data.get("care") + "\n\n" +
        "Special Notes:\n" + (data.get("notes") || "None");

      window.location.href =
        "mailto:mimtransportation@yahoo.com?subject=" +
        encodeURIComponent("Cemetery Visit Request - " + data.get("name")) +
        "&body=" +
        encodeURIComponent(emailBody);

      status.style.color = "#2B4C3F";
      status.textContent = "Thank you! Opening your email client to send your visit request...";
    });
  }
})();

