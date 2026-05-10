const links = document.querySelectorAll('a[href^="#"]');

for (const link of links) {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
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
