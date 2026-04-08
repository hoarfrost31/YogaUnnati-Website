const gallerySlider = document.querySelector("[data-gallery-slider]");
const galleryTrack = gallerySlider?.querySelector("[data-gallery-track]");
const gallerySlides = Array.from(galleryTrack?.querySelectorAll(".gallery-slide") || []);
const galleryPrev = gallerySlider?.querySelector("[data-gallery-prev]");
const galleryNext = gallerySlider?.querySelector("[data-gallery-next]");
const experienceCarousel = document.querySelector("[data-experience-carousel]");
const experienceTrack = experienceCarousel?.querySelector(".experience-grid");
const experiencePrev = experienceCarousel?.querySelector("[data-carousel-prev]");
const experienceNext = experienceCarousel?.querySelector("[data-carousel-next]");

if (gallerySlider && galleryTrack && gallerySlides.length > 0) {
  let activeIndex = 0;
  let galleryTimer;

  const setSlide = (index) => {
    activeIndex = (index + gallerySlides.length) % gallerySlides.length;
    galleryTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
  };

  const restartGallery = () => {
    window.clearInterval(galleryTimer);
    galleryTimer = window.setInterval(() => {
      setSlide(activeIndex + 1);
    }, 3400);
  };

  galleryPrev?.addEventListener("click", () => {
    setSlide(activeIndex - 1);
    restartGallery();
  });

  galleryNext?.addEventListener("click", () => {
    setSlide(activeIndex + 1);
    restartGallery();
  });

  restartGallery();
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
