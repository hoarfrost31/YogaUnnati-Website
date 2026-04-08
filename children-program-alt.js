const altGalleryRoot = document.querySelector("[data-alt-gallery]");
const altGalleryFeature = document.querySelector("[data-alt-gallery-feature]");
const altGalleryThumbs = Array.from(document.querySelectorAll(".gallery-thumb"));
const experienceCarousel = document.querySelector("[data-experience-carousel]");
const experienceTrack = experienceCarousel?.querySelector(".experience-grid");
const experiencePrev = experienceCarousel?.querySelector("[data-carousel-prev]");
const experienceNext = experienceCarousel?.querySelector("[data-carousel-next]");

if (altGalleryRoot && altGalleryFeature && altGalleryThumbs.length > 0) {
  let activeIndex = altGalleryThumbs.findIndex((thumb) => thumb.classList.contains("is-active"));
  let timerId;

  if (activeIndex < 0) {
    activeIndex = 0;
    altGalleryThumbs[0].classList.add("is-active");
  }

  const setActive = (index) => {
    const thumb = altGalleryThumbs[index];
    if (!thumb) return;

    altGalleryThumbs.forEach((item) => item.classList.remove("is-active"));
    thumb.classList.add("is-active");

    const nextSrc = thumb.dataset.gallerySrc;
    const nextAlt = thumb.dataset.galleryAlt;

    altGalleryFeature.style.opacity = "0.25";
    altGalleryFeature.style.transform = "scale(1.035)";

    window.setTimeout(() => {
      altGalleryFeature.src = nextSrc;
      altGalleryFeature.alt = nextAlt;
      altGalleryFeature.style.opacity = "1";
      altGalleryFeature.style.transform = "scale(1)";
    }, 170);

    activeIndex = index;
  };

  const restartTimer = () => {
    window.clearInterval(timerId);
    timerId = window.setInterval(() => {
      setActive((activeIndex + 1) % altGalleryThumbs.length);
    }, 3400);
  };

  altGalleryThumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      setActive(index);
      restartTimer();
    });
  });

  restartTimer();
}

if (experienceCarousel && experienceTrack && experiencePrev && experienceNext) {
  let carouselTimer;
  const originalCards = Array.from(experienceTrack.querySelectorAll(".experience-card"));

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    experienceTrack.appendChild(clone);
  });

  const cardWidth = () => {
    const firstCard = experienceTrack.querySelector(".experience-card");
    if (!firstCard) return 0;
    const gap = Number.parseFloat(getComputedStyle(experienceTrack).columnGap || getComputedStyle(experienceTrack).gap || "0");
    return firstCard.getBoundingClientRect().width + gap;
  };

  const scrollByCards = (direction = 1) => {
    const step = cardWidth();
    if (!step) return;
    experienceTrack.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const resetLoopIfNeeded = () => {
    const halfWidth = experienceTrack.scrollWidth / 2;
    if (experienceTrack.scrollLeft >= halfWidth) {
      experienceTrack.scrollLeft -= halfWidth;
    }
    if (experienceTrack.scrollLeft < 0) {
      experienceTrack.scrollLeft += halfWidth;
    }
  };

  const restartCarousel = () => {
    window.clearInterval(carouselTimer);
    carouselTimer = window.setInterval(() => {
      scrollByCards(1);
      window.setTimeout(resetLoopIfNeeded, 380);
    }, 3600);
  };

  const pauseCarousel = () => {
    window.clearInterval(carouselTimer);
  };

  const handleManualScroll = (direction) => {
    pauseCarousel();
    scrollByCards(direction);
    window.setTimeout(resetLoopIfNeeded, 380);
    window.setTimeout(restartCarousel, 420);
  };

  experiencePrev.addEventListener("click", () => {
    handleManualScroll(-1);
  });

  experienceNext.addEventListener("click", () => {
    handleManualScroll(1);
  });

  experienceTrack.addEventListener("scroll", resetLoopIfNeeded, { passive: true });

  restartCarousel();
}
