const loader = document.querySelector(".loader");
const loaderNumber = document.querySelector(".loader__number");
const loaderProgress = document.querySelector(".loader__track span");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function finishLoading() {
  loader?.remove();
  document.body.classList.remove("is-loading");
}

if (!loader || prefersReducedMotion || typeof gsap === "undefined") {
  finishLoading();
} else {
  const progress = { value: 0 };

  gsap.to(progress, {
    value: 100,
    duration: 1,
    ease: "none",
    onUpdate: () => {
      if (loaderNumber) loaderNumber.textContent = String(Math.round(progress.value)).padStart(2, "0");
      if (loaderProgress) gsap.set(loaderProgress, { scaleX: progress.value / 100 });
    },
    onComplete: () => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: () => {
          finishLoading();
          gsap.from(".hero__eyebrow, .hero h1, .hero__aside, .hero__bottom", {
            y: 24,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "all"
          });
        }
      });
    }
  });

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".about__content, .projects__heading, .project").forEach((element) => {
      gsap.from(element, {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true
        }
      });
    });
  }
}