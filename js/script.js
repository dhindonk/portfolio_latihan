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
          gsap.from(".site-header-wrap, .hero__eyebrow, .hero h1, .hero__aside, .hero__bottom", {
            y: 20,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "all"
          });
        }
      });
    }
  });

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".about__content, .projects__heading, .project, .channel-card").forEach((element) => {
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

// --- Penanda Navigasi Aktif (Scroll Spy) ---
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".main-nav a[href^='#']");
  const headerWrap = document.querySelector(".site-header-wrap");

  if (!sections.length || !navLinks.length) return;

  function updateActiveNav() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Beri gaya pada header saat halaman digulir
    if (headerWrap) {
      if (scrollY > 15) {
        headerWrap.classList.add("is-scrolled");
      } else {
        headerWrap.classList.remove("is-scrolled");
      }
    }

    let currentSectionId = "";
    const scrollPosition = scrollY + 130;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute("id");
      }
    });

    // Jika scroll berada di paling bawah halaman, aktifkan bagian kontak/footer
    const isAtBottom = window.innerHeight + Math.ceil(scrollY) >= document.documentElement.scrollHeight - 60;
    if (isAtBottom) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        currentSectionId = lastSection.getAttribute("id");
      }
    }

    navLinks.forEach((link) => {
      const targetId = link.getAttribute("href").replace("#", "");
      if (targetId && targetId === currentSectionId) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("resize", updateActiveNav, { passive: true });
  updateActiveNav();
}

initScrollSpy();

// --- Fitur Interaktif Salin Email ---
function initCopyEmail() {
  const copyBtn = document.getElementById("copyEmailBtn");
  const copyToast = document.getElementById("copyToast");
  const emailToCopy = "halo@fahdin.dev";

  if (!copyBtn || !copyToast) return;

  let timeoutId = null;

  copyBtn.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback untuk file:/// atau browser lama
        const tempInput = document.createElement("input");
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      copyToast.textContent = "Tersalin! Siap dikirimi pesan";
      copyToast.classList.add("is-shown");

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        copyToast.classList.remove("is-shown");
      }, 2500);
    } catch (err) {
      console.error("Gagal menyalin email:", err);
    }
  });
}

initCopyEmail();