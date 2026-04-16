const heroVideoShell = document.querySelector("[data-hero-video-shell]");
const heroVideo = heroVideoShell?.querySelector("[data-hero-video]");
const heroVideoToggle = heroVideoShell?.querySelector("[data-hero-video-toggle]");
const heroVideoSound = heroVideoShell?.querySelector("[data-hero-video-sound]");

if (heroVideoShell && heroVideo && heroVideoToggle) {
  let heroVideoIdleTimer;

  const showHeroVideoControls = () => {
    heroVideoShell.classList.remove("is-idle");
    window.clearTimeout(heroVideoIdleTimer);
    if (!heroVideo.paused && !heroVideo.ended) {
      heroVideoIdleTimer = window.setTimeout(() => {
        heroVideoShell.classList.add("is-idle");
      }, 1800);
    }
  };

  const syncHeroVideoSoundState = () => {
    const isMuted = heroVideo.muted || heroVideo.volume === 0;
    heroVideoShell.classList.toggle("is-muted", isMuted);
    if (heroVideoSound) {
      heroVideoSound.setAttribute("aria-pressed", String(!isMuted));
      heroVideoSound.setAttribute("aria-label", isMuted ? "Unmute video" : "Mute video");
    }
  };

  const syncHeroVideoState = () => {
    const isPlaying = !heroVideo.paused && !heroVideo.ended;
    heroVideoShell.classList.toggle("is-playing", isPlaying);
    if (!isPlaying) {
      heroVideoShell.classList.remove("is-idle");
      window.clearTimeout(heroVideoIdleTimer);
    }
    heroVideoToggle.setAttribute("aria-pressed", String(isPlaying));
    syncHeroVideoSoundState();
  };

  const toggleHeroVideo = async () => {
    try {
      if (heroVideo.paused || heroVideo.ended) {
        heroVideo.muted = false;
        syncHeroVideoSoundState();
        await heroVideo.play();
      } else {
        heroVideo.pause();
      }
    } catch (error) {
      syncHeroVideoState();
    }
  };

  heroVideoToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleHeroVideo();
  });

  if (heroVideoSound) {
    heroVideoSound.addEventListener("click", (event) => {
      event.stopPropagation();
      heroVideo.muted = !heroVideo.muted;
      syncHeroVideoSoundState();
      showHeroVideoControls();
    });
  }

  heroVideoShell.addEventListener("click", (event) => {
    if (event.target.closest("[data-hero-video-toggle], [data-hero-video-sound]")) return;
    showHeroVideoControls();
    toggleHeroVideo();
  });

  ["pointerdown", "touchstart", "mousemove", "focusin"].forEach((eventName) => {
    heroVideoShell.addEventListener(eventName, showHeroVideoControls, { passive: true });
  });

  ["play", "pause", "ended", "volumechange"].forEach((eventName) => {
    heroVideo.addEventListener(eventName, syncHeroVideoState);
  });

  heroVideo.addEventListener("play", showHeroVideoControls);

  if ("IntersectionObserver" in window) {
    const heroVideoObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) {
          heroVideo.pause();
        }
      },
      { threshold: [0, 0.35, 0.75] }
    );

    heroVideoObserver.observe(heroVideoShell);
  }

  syncHeroVideoState();
}

const gallerySlider = document.querySelector("[data-gallery-slider]");
const galleryTrack = gallerySlider?.querySelector("[data-gallery-track]");
const gallerySlides = Array.from(galleryTrack?.querySelectorAll(".gallery-slide") || []);
const galleryPrev = gallerySlider?.querySelector("[data-gallery-prev]");
const galleryNext = gallerySlider?.querySelector("[data-gallery-next]");
const experienceCarousel = document.querySelector("[data-experience-carousel]");
const experienceTrack = experienceCarousel?.querySelector(".experience-grid");
const experiencePrev = experienceCarousel?.querySelector("[data-carousel-prev]");
const experienceNext = experienceCarousel?.querySelector("[data-carousel-next]");
const reviewCarousel = document.querySelector("[data-review-carousel]");
const reviewTrack = reviewCarousel?.querySelector("[data-review-track]");
const reviewPrev = reviewCarousel?.querySelector("[data-review-prev]");
const reviewNext = reviewCarousel?.querySelector("[data-review-next]");

if (gallerySlider && galleryTrack && gallerySlides.length > 0) {
  let galleryTimer;

  gallerySlides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    galleryTrack.appendChild(clone);
  });

  const slideWidth = () => {
    const firstSlide = galleryTrack.querySelector(".gallery-slide");
    if (!firstSlide) return 0;
    return firstSlide.getBoundingClientRect().width;
  };

  const scrollGallery = (direction = 1) => {
    const step = slideWidth();
    if (!step) return;
    galleryTrack.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const resetGalleryLoop = () => {
    const halfWidth = galleryTrack.scrollWidth / 2;
    if (galleryTrack.scrollLeft >= halfWidth) {
      galleryTrack.style.scrollBehavior = "auto";
      galleryTrack.scrollLeft -= halfWidth;
      galleryTrack.style.scrollBehavior = "smooth";
    }
  };

  const restartGallery = () => {
    window.clearInterval(galleryTimer);
    galleryTimer = window.setInterval(() => {
      scrollGallery(1);
      window.setTimeout(resetGalleryLoop, 360);
    }, 3400);
  };

  galleryPrev?.addEventListener("click", () => {
    scrollGallery(-1);
    window.setTimeout(resetGalleryLoop, 360);
    restartGallery();
  });

  galleryNext?.addEventListener("click", () => {
    scrollGallery(1);
    window.setTimeout(resetGalleryLoop, 360);
    restartGallery();
  });

  galleryTrack.addEventListener("scroll", resetGalleryLoop, { passive: true });

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

if (reviewCarousel && reviewTrack && reviewPrev && reviewNext) {
  let reviewTimer;
  const originalReviews = Array.from(reviewTrack.querySelectorAll(".review-card"));

  originalReviews.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    reviewTrack.appendChild(clone);
  });

  const reviewCardWidth = () => {
    const firstCard = reviewTrack.querySelector(".review-card");
    if (!firstCard) return 0;
    const gap = Number.parseFloat(getComputedStyle(reviewTrack).columnGap || getComputedStyle(reviewTrack).gap || "0");
    return firstCard.getBoundingClientRect().width + gap;
  };

  const scrollReviews = (direction = 1) => {
    const step = reviewCardWidth();
    if (!step) return;
    reviewTrack.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const resetReviewLoop = () => {
    const halfWidth = reviewTrack.scrollWidth / 2;
    if (reviewTrack.scrollLeft >= halfWidth) {
      reviewTrack.scrollLeft -= halfWidth;
    }
    if (reviewTrack.scrollLeft < 0) {
      reviewTrack.scrollLeft += halfWidth;
    }
  };

  const restartReviews = () => {
    window.clearInterval(reviewTimer);
    reviewTimer = window.setInterval(() => {
      scrollReviews(1);
      window.setTimeout(resetReviewLoop, 380);
    }, 5200);
  };

  const pauseReviews = () => {
    window.clearInterval(reviewTimer);
  };

  const handleReviewManual = (direction) => {
    pauseReviews();
    scrollReviews(direction);
    window.setTimeout(resetReviewLoop, 380);
    window.setTimeout(restartReviews, 420);
  };

  reviewPrev.addEventListener("click", () => {
    handleReviewManual(-1);
  });

  reviewNext.addEventListener("click", () => {
    handleReviewManual(1);
  });

  reviewTrack.addEventListener("scroll", resetReviewLoop, { passive: true });

  restartReviews();
}

const faqItems = Array.from(document.querySelectorAll(".faq-item"));
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) {
        other.open = false;
      }
    });
  });
});

const revealSections = Array.from(document.querySelectorAll(".section"));
if (revealSections.length > 0) {
  revealSections.forEach((section) => section.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    revealSections.forEach((section) => observer.observe(section));
  } else {
    revealSections.forEach((section) => section.classList.add("is-visible"));
  }
}
