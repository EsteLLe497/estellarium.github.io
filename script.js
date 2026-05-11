const links = document.querySelectorAll('a[href^="#"]');

document.body.classList.add("page-ready");
links[0]?.classList.add("is-active");

for (const link of links) {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

const revealTargets = document.querySelectorAll([
  ".panel:not(.hero)",
  ".section-title",
  ".story-text",
  ".life-chart",
  ".character-portrait",
  ".character-copy",
  ".hobby-card",
  ".gallery-grid figure",
  ".work-card",
  ".chart-points li",
].join(","));

revealTargets.forEach((target, index) => {
  target.classList.add("reveal");
  target.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
});

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  }
}, {
  rootMargin: "-8% 0px -12%",
  threshold: 0.12,
});

for (const target of revealTargets) {
  revealObserver.observe(target);
}

const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const activeLink = document.querySelector(`.global-nav a[href="#${entry.target.id}"]`);
    if (!activeLink) continue;
    links.forEach((link) => link.classList.toggle("is-active", link === activeLink));
  }
}, {
  rootMargin: "-42% 0px -48%",
  threshold: 0,
});

for (const section of document.querySelectorAll("main > section[id]")) {
  sectionObserver.observe(section);
}

let ticking = false;

const updateScrollMotion = () => {
  document.documentElement.style.setProperty("--scroll-shift", `${Math.min(window.scrollY, 760)}px`);
  ticking = false;
};

window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScrollMotion);
}, { passive: true });

updateScrollMotion();

const hobbyOpenButtons = document.querySelectorAll("[data-hobby-open]");
const fishingModal = document.querySelector("#fishing-modal");

if (fishingModal) {
  const closeButtons = fishingModal.querySelectorAll("[data-hobby-close]");

  const openFishingModal = () => {
    fishingModal.classList.add("is-open");
    fishingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeFishingModal = () => {
    fishingModal.classList.remove("is-open");
    fishingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  for (const button of hobbyOpenButtons) {
    button.addEventListener("click", openFishingModal);
  }

  for (const button of closeButtons) {
    button.addEventListener("click", closeFishingModal);
  }

  document.addEventListener("keydown", (event) => {
    if (!fishingModal.classList.contains("is-open")) return;
    if (event.key === "Escape") closeFishingModal();
  });
}

const workOpenButtons = document.querySelectorAll("[data-work-open]");
const workModal = document.querySelector("#gamma-modal");

if (workModal) {
  const slides = [...workModal.querySelectorAll(".work-slide")];
  const closeButtons = workModal.querySelectorAll("[data-work-close]");
  const prevButton = workModal.querySelector("[data-slide-prev]");
  const nextButton = workModal.querySelector("[data-slide-next]");
  let currentSlide = 0;

  const stopVideos = () => {
    for (const video of workModal.querySelectorAll("video")) {
      video.pause();
    }
  };

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    stopVideos();
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
    });
  };

  const openModal = () => {
    workModal.classList.add("is-open");
    workModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    showSlide(0);
  };

  const closeModal = () => {
    workModal.classList.remove("is-open");
    workModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    stopVideos();
  };

  for (const button of workOpenButtons) {
    button.addEventListener("click", openModal);
  }

  for (const button of closeButtons) {
    button.addEventListener("click", closeModal);
  }

  prevButton?.addEventListener("click", () => showSlide(currentSlide - 1));
  nextButton?.addEventListener("click", () => showSlide(currentSlide + 1));

  document.addEventListener("keydown", (event) => {
    if (!workModal.classList.contains("is-open")) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowLeft") showSlide(currentSlide - 1);
    if (event.key === "ArrowRight") showSlide(currentSlide + 1);
  });
}
