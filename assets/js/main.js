/* ALM Group — site interactions */
(function () {
  "use strict";

  // WhatsApp number in international format, digits only (country code + number, e.g. 919876543210)
  var WHATSAPP_NUMBER = "910000000000";
  var WHATSAPP_MESSAGE = "Hello ALM Group, I would like to know more about your businesses.";

  var body = document.body;

  document.querySelectorAll(".whatsapp-float").forEach(function (a) {
    a.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
  });
  var header = document.querySelector(".site-header");

  // Header background on scroll
  function onScroll() {
    var y = window.scrollY;
    if (header && !header.classList.contains("solid")) header.classList.toggle("scrolled", y > 40);
    var top = document.querySelector(".back-to-top");
    if (top) top.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      body.style.overflow = open ? "hidden" : "";
    });
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        body.style.overflow = "";
      });
    });
  }

  // Back to top
  var backTop = document.querySelector(".back-to-top");
  if (backTop) backTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  // Businesses sub-navigation: highlight current vertical
  var subLinks = document.querySelectorAll(".sub-nav a");
  if (subLinks.length && "IntersectionObserver" in window) {
    var map = {};
    subLinks.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          subLinks.forEach(function (l) { l.classList.remove("active"); });
          map[e.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });
  }

  // News category filter
  var filterBtns = document.querySelectorAll(".filter-bar button");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      document.querySelectorAll("[data-category]").forEach(function (card) {
        card.style.display = f === "all" || card.getAttribute("data-category") === f ? "" : "none";
      });
    });
  });

  // Contact form: pre-select area of interest from ?interest=... and validate
  var form = document.getElementById("inquiry-form");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var interest = params.get("interest");
    var select = form.querySelector("#interest");
    if (interest && select) {
      Array.prototype.forEach.call(select.options, function (o) { if (o.value === interest) select.value = interest; });
    }
    var subject = params.get("subject");
    if (subject && form.querySelector("#subject")) form.querySelector("#subject").value = subject;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var ok = input.type === "checkbox" ? input.checked : input.value.trim() !== "";
        if (ok && input.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        if (field) field.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        var first = form.querySelector(".invalid input, .invalid select, .invalid textarea");
        if (first) first.focus();
        return;
      }

      var success = document.getElementById("form-success");
      function done() { form.style.display = "none"; if (success) { success.classList.add("show"); success.focus(); } }

      // Set data-endpoint on the form (e.g. a Formspree or backend URL) to deliver submissions.
      var endpoint = form.getAttribute("data-endpoint");
      if (endpoint) {
        var btn = form.querySelector("button[type=submit]");
        if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
        fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
          .then(function (r) { if (!r.ok) throw new Error(); done(); })
          .catch(function () {
            if (btn) { btn.disabled = false; btn.textContent = "Submit Inquiry"; }
            alert("Sorry, your inquiry could not be sent. Please try again later.");
          });
      } else {
        done();
      }
    });

    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", function () { var f = el.closest(".field"); if (f) f.classList.remove("invalid"); });
    });
  }

  // Cookie notice
  var banner = document.querySelector(".cookie-banner");
  if (banner) {
    var seen = false;
    try { seen = localStorage.getItem("alm-cookie-ok") === "1"; } catch (e) {}
    if (!seen) banner.classList.add("show");
    banner.querySelector("button").addEventListener("click", function () {
      banner.classList.remove("show");
      try { localStorage.setItem("alm-cookie-ok", "1"); } catch (e) {}
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
