/**
 * FOOD JOINT - Guwahati, Assam
 * Lightweight Vanilla JavaScript
 * - Mobile Navigation Menu
 * - Category Filter for Menu
 * - Pure JavaScript Lightbox with Keyboard & Touch Support
 * - Live Opening Hours Indicator (IST Timezone)
 */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const mobileOverlay = document.getElementById("mobileNavOverlay");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function openMenu() {
    menuToggle.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileNav.classList.add("active");
    mobileOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (mobileNav.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // 2. Menu Category Filtering (All, Breakfast, Lunch, Snacks, Dinner)
  const tabBtns = document.querySelectorAll(".menu-tab-btn");
  const categoryBlocks = document.querySelectorAll(".menu-category-block");

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      this.classList.add("active");

      const targetCategory = this.getAttribute("data-category");

      categoryBlocks.forEach(function (block) {
        if (targetCategory === "all") {
          block.style.display = "block";
        } else {
          if (block.getAttribute("data-category") === targetCategory) {
            block.style.display = "block";
          } else {
            block.style.display = "none";
          }
        }
      });
    });
  });

  // 3. Pure JavaScript Lightbox Gallery
  const galleryItems = document.querySelectorAll(".gallery-card");
  const lightbox = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentIndex = 0;
  const galleryData = [];

  galleryItems.forEach(function (item, index) {
    const img = item.querySelector("img");
    const caption = item.querySelector(".gallery-caption");
    const src = img ? img.getAttribute("src") : "";
    const title = caption ? caption.textContent.trim() : (img ? img.getAttribute("alt") : "");

    galleryData.push({ src: src, title: title });

    item.addEventListener("click", function () {
      openLightbox(index);
    });

    // Also support keyboard Enter key on cards
    item.setAttribute("tabindex", "0");
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  function openLightbox(index) {
    if (!lightbox || galleryData.length === 0) return;
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightboxContent() {
    if (currentIndex < 0) currentIndex = galleryData.length - 1;
    if (currentIndex >= galleryData.length) currentIndex = 0;

    const data = galleryData[currentIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.title;
    lightboxCaption.textContent = data.title + " (" + (currentIndex + 1) + " of " + galleryData.length + ")";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener("click", showNext);
  if (lightboxPrev) lightboxPrev.addEventListener("click", showPrev);

  // Close lightbox if clicking outside the image
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener("keydown", function (e) {
    if (lightbox && lightbox.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
  });

  // 4. Live Restaurant Hours Check (9:00 AM – 9:00 PM IST)
  function updateHoursStatus() {
    const statusBadges = document.querySelectorAll(".live-hours-status");
    if (!statusBadges.length) return;

    try {
      // Calculate current hour & minute in India Standard Time (UTC+5:30)
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istOffsetHours = 5.5;
      const istDate = new Date(utcTime + (3600000 * istOffsetHours));
      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const currentDecimal = hours + (minutes / 60);

      // Open 9:00 AM to 9:00 PM (9.0 to 21.0)
      const isOpen = currentDecimal >= 9.0 && currentDecimal < 21.0;

      statusBadges.forEach(function (badge) {
        if (isOpen) {
          badge.innerHTML = '<span class="status-dot"></span> Open Now (Closes 9:00 PM)';
          badge.style.color = "#81c784";
        } else {
          badge.innerHTML = '<span class="status-dot" style="background-color: #ffb74d;"></span> Opens at 9:00 AM';
          badge.style.color = "#ffb74d";
        }
      });
    } catch (err) {
      // Fallback
    }
  }

  updateHoursStatus();
});
