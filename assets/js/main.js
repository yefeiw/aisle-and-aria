/* ============================================================
   Aisle & Aria — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     CONFIG — edit these values to make the site yours.
     ---------------------------------------------------------- */
  var CONFIG = {
    email: "hello@aisleandaria.com",   // booking form + contact link
    phone: "+1 (000) 000-0000",       // shown in the contact list
    social: {
      label: "@aisleandaria",          // shown in the contact list
      url: "https://instagram.com/aisleandaria"
    }
  };

  /* ----------------------------------------------------------
     Nav: scrolled state + mobile menu
     ---------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("menu-open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a") && nav.classList.contains("menu-open")) {
      nav.classList.remove("menu-open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  /* ----------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal:not(.in)");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----------------------------------------------------------
     Lightbox
     ---------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var lbCap = document.getElementById("lightboxCap");
  var lbClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".g-item:not(.g-quote)").forEach(function (item) {
    item.addEventListener("click", function () {
      var img = item.querySelector("img");
      if (!img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = item.dataset.cap || "";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ----------------------------------------------------------
     FAQ: close other items when one opens
     ---------------------------------------------------------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ----------------------------------------------------------
     Booking form → mailto
     (swap for Formspree / Netlify Forms / your backend later)
     ---------------------------------------------------------- */
  var form = document.getElementById("bookingForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var val = function (id) {
      return (document.getElementById(id).value || "").trim();
    };
    var names = val("fNames");
    var email = val("fEmail");
    var date = val("fDate");
    var place = val("fPlace");
    var guests = val("fGuests");
    var service = val("fService");
    var story = val("fStory");

    if (!names || !email) {
      alert("Please fill in your names and email so I can reply.");
      return;
    }

    var lines = [
      "Names: " + names,
      "Email: " + email,
      "Date: " + (date || "—"),
      "City/venue: " + (place || "—"),
      "Guests: " + (guests || "—"),
      "Service: " + (service || "—"),
      "",
      "Story:",
      story || "—"
    ];

    var subject = "Wedding inquiry — " + names +
      (date ? " (" + date + ")" : "");
    var body = encodeURIComponent(lines.join("\n"));

    window.location.href =
      "mailto:" + CONFIG.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + body;
  });

  /* ----------------------------------------------------------
     Contact details from CONFIG
     ---------------------------------------------------------- */
  document.getElementById("contactEmailText").textContent = CONFIG.email;
  document.getElementById("contactEmailLink").href = "mailto:" + CONFIG.email;

  var phoneEl = document.getElementById("contactPhoneText");
  phoneEl.textContent = CONFIG.phone;
  document.getElementById("contactPhoneLink").href =
    "tel:" + CONFIG.phone.replace(/[^+\d]/g, "");

  var socialEl = document.getElementById("contactSocialText");
  socialEl.textContent = CONFIG.social.label;
  document.getElementById("contactSocialLink").href = CONFIG.social.url;

  /* ----------------------------------------------------------
     Footer year
     ---------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
