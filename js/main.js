(() => {
  "use strict";

  // Scroll suave e lento para links internos (#ancora), duração maior que o padrão do navegador
  function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const start = performance.now();
    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
    function step(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutQuad(elapsed));
      if (elapsed < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      if (prefersReducedMotion) {
        window.scrollTo(0, top);
      } else {
        smoothScrollTo(top, 1400);
      }
    });
  });

  // Menu mobile
  const menuBtn = document.getElementById("menuBtn");
  const navbar = document.getElementById("navbar");
  if (menuBtn && navbar) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
    navbar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navbar.classList.remove("is-open"));
    });
  }

  // Typewriter
  const typeEl = document.getElementById("typewriter");
  if (typeEl) {
    let words = [];
    try {
      words = JSON.parse(typeEl.dataset.words || "[]");
    } catch {
      words = [];
    }
    if (words.length) {
      let wordIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const word = words[wordIndex];
        if (!deleting) {
          charIndex++;
          typeEl.textContent = word.slice(0, charIndex);
          if (charIndex === word.length) {
            deleting = true;
            setTimeout(tick, 1400);
            return;
          }
        } else {
          charIndex--;
          typeEl.textContent = word.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
          }
        }
        setTimeout(tick, deleting ? 60 : 90);
      };
      tick();
    }
  }

  // Contadores das estatísticas
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const animateCounter = (el) => {
      const target = Number(el.dataset.count);
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target).toString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toString();
        }
      };
      requestAnimationFrame(step);
    };
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => counterObserver.observe(el));
  }

  // Reveal ao rolar
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${i * 120}ms`;
      revealObserver.observe(el);
    });
  }

  // Lazy-load da cena 3D só quando a seção Sobre entra na tela
  const deskContainer = document.getElementById("desk3d");
  if (deskContainer) {
    const deskObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          deskObserver.disconnect();
          import("./desk3d.bundle.js")
            .then((mod) => mod.initDesk3d(deskContainer))
            .catch(() => {
              deskContainer.classList.add("desk3d-fallback");
            });
        }
      });
    }, { threshold: 0.2 });
    deskObserver.observe(deskContainer);
  }

  // Formulário de contato -> envia via API serverless (/api/contact)
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector("button[type=submit]");
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      if (submitBtn) submitBtn.disabled = true;
      if (formStatus) formStatus.textContent = "Enviando...";

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, subject, message }),
        });
        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          if (formStatus) formStatus.textContent = "Mensagem enviada! Respondo em breve.";
          form.reset();
        } else {
          if (formStatus) formStatus.textContent = data.error || "Não foi possível enviar. Tente pelo e-mail abaixo.";
        }
      } catch (err) {
        if (formStatus) formStatus.textContent = "Falha de conexão. Tente pelo e-mail abaixo.";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
