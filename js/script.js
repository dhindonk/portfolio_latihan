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

// ==========================================
// Navigasi & Penanda Bagian Aktif (ScrollSpy)
// ==========================================
const siteHeader = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".main-nav .nav-link");
const wordmark = document.querySelector(".wordmark");
const sections = [
  document.getElementById("contact"),
  document.getElementById("projects"),
  document.getElementById("about"),
  document.getElementById("home")
].filter(Boolean);

function updateActiveNav() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const headerOffset = 120;

  // Toggle header border/background saat discroll
  if (siteHeader) {
    if (scrollY > 10) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
  }

  // Jika sudah dekat bagian paling bawah -> aktifkan section kontak
  if (scrollY + windowHeight >= docHeight - 40) {
    setActiveNav("contact");
    return;
  }

  // Jika di paling atas (hero/home)
  if (scrollY < 120) {
    setActiveNav("home");
    return;
  }

  // Cari section mana yang posisinya sedang dibaca
  for (const section of sections) {
    const top = section.offsetTop - headerOffset;
    if (scrollY >= top) {
      setActiveNav(section.id);
      return;
    }
  }

  setActiveNav(null);
}

function setActiveNav(activeId) {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isCurrent = activeId && href === `#${activeId}`;

    if (isCurrent) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "location");
    } else {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    }
  });
}

// Pasang event listener scroll dengan requestAnimationFrame
let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", updateActiveNav, { passive: true });
updateActiveNav();

// Beri respons visual langsung saat tautan navigasi diklik
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href")?.replace("#", "");
    if (targetId) {
      setActiveNav(targetId);
    }
  });
});

wordmark?.addEventListener("click", () => {
  setActiveNav("home");
});
