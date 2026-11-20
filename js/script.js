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

// --- Interactive Canvas Background (Constellation Particles) ---
function initBackgroundParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 130 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  }, { passive: true });

  // Density: ~1 particle per 20000px, max 50 particles
  const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 20000), 50);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.5 + 1.2;
      this.isClay = Math.random() > 0.65;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isClay ? "rgba(226, 109, 72, 0.75)" : "rgba(117, 149, 103, 0.75)";
      ctx.fill();
    }
  }

  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          const alpha = (1 - dist / 115) * 0.24;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(148, 163, 151, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(226, 109, 72, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

initBackgroundParticles();
