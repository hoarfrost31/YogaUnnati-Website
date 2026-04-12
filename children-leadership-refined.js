const refinedExperienceCarousel = document.querySelector("[data-experience-carousel]");
const refinedExperienceTrack = refinedExperienceCarousel?.querySelector("[data-experience-track]");
const refinedExperiencePrev = refinedExperienceCarousel?.querySelector("[data-carousel-prev]");
const refinedExperienceNext = refinedExperienceCarousel?.querySelector("[data-carousel-next]");

if (refinedExperienceCarousel && refinedExperienceTrack && refinedExperiencePrev && refinedExperienceNext) {
  let carouselTimer;
  const originalCards = Array.from(refinedExperienceTrack.querySelectorAll(".experience-card"));

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    refinedExperienceTrack.appendChild(clone);
  });

  const cardWidth = () => {
    const firstCard = refinedExperienceTrack.querySelector(".experience-card");
    if (!firstCard) return 0;
    const gap = Number.parseFloat(getComputedStyle(refinedExperienceTrack).columnGap || getComputedStyle(refinedExperienceTrack).gap || "0");
    return firstCard.getBoundingClientRect().width + gap;
  };

  const scrollByCards = (direction = 1) => {
    const step = cardWidth();
    if (!step) return;
    refinedExperienceTrack.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const resetLoopIfNeeded = () => {
    const halfWidth = refinedExperienceTrack.scrollWidth / 2;
    if (refinedExperienceTrack.scrollLeft >= halfWidth) {
      refinedExperienceTrack.scrollLeft -= halfWidth;
    }
    if (refinedExperienceTrack.scrollLeft < 0) {
      refinedExperienceTrack.scrollLeft += halfWidth;
    }
  };

  const restartCarousel = () => {
    window.clearInterval(carouselTimer);
    carouselTimer = window.setInterval(() => {
      scrollByCards(1);
      window.setTimeout(resetLoopIfNeeded, 380);
    }, 3600);
  };

  const handleManualScroll = (direction) => {
    window.clearInterval(carouselTimer);
    scrollByCards(direction);
    window.setTimeout(resetLoopIfNeeded, 380);
    window.setTimeout(restartCarousel, 420);
  };

  refinedExperiencePrev.addEventListener("click", () => handleManualScroll(-1));
  refinedExperienceNext.addEventListener("click", () => handleManualScroll(1));
  refinedExperienceTrack.addEventListener("scroll", resetLoopIfNeeded, { passive: true });

  restartCarousel();
}
