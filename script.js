(function () {
  "use strict";

  /* ---------- Ano no footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: sombra ao rolar ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var menuToggle = document.getElementById("menu-toggle");
  var mainNav = document.getElementById("main-nav");

  function closeMenu() {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
  function toggleMenu() {
    var isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  }
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", toggleMenu);
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Comparador Antes / Depois ---------- */
  var compareEl = document.querySelector("[data-compare]");
  if (compareEl) {
    var frame = compareEl.querySelector(".compare-frame");
    var clip = compareEl.querySelector(".compare-clip");
    var handle = compareEl.querySelector(".compare-handle");
    var range = compareEl.querySelector("[data-compare-range]");

    function setFrameWidthVar() {
      frame.style.setProperty("--frame-w", frame.clientWidth + "px");
    }

    function setPosition(percent) {
      percent = Math.max(0, Math.min(100, percent));
      clip.style.width = percent + "%";
      handle.style.left = percent + "%";
      range.value = percent;
    }

    setFrameWidthVar();
    window.addEventListener("resize", setFrameWidthVar);

    range.addEventListener("input", function () {
      setPosition(parseFloat(range.value));
    });

    var dragging = false;

    function percentFromClientX(clientX) {
      var rect = frame.getBoundingClientRect();
      var x = clientX - rect.left;
      return (x / rect.width) * 100;
    }

    function startDrag(clientX) {
      dragging = true;
      setPosition(percentFromClientX(clientX));
    }
    function moveDrag(clientX) {
      if (!dragging) return;
      setPosition(percentFromClientX(clientX));
    }
    function endDrag() {
      dragging = false;
    }

    frame.addEventListener("mousedown", function (e) {
      startDrag(e.clientX);
      e.preventDefault();
    });
    window.addEventListener("mousemove", function (e) {
      moveDrag(e.clientX);
    });
    window.addEventListener("mouseup", endDrag);

    frame.addEventListener(
      "touchstart",
      function (e) {
        startDrag(e.touches[0].clientX);
      },
      { passive: true }
    );
    frame.addEventListener(
      "touchmove",
      function (e) {
        moveDrag(e.touches[0].clientX);
      },
      { passive: true }
    );
    frame.addEventListener("touchend", endDrag);

    setPosition(50);
  }

  /* ---------- Galeria + Lightbox ---------- */
  var galleryItems = document.querySelectorAll(".gallery-item");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");
  var lastFocused = null;

  function openLightbox(src, alt) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxClose.focus();
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var full = item.getAttribute("data-full");
      var img = item.querySelector("img");
      openLightbox(full, img ? img.alt : "");
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

})();
