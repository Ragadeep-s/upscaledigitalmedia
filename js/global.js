document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const initTopNav = () => {
    const nav = document.querySelector(".top-nav");
    const hoverZone = document.querySelector(".top-hover-zone");
    if (!nav || !hoverZone) return;

    let hideTimer;

    const showNav = () => {
      clearTimeout(hideTimer);
      nav.classList.add("show");
    };

    const hideNav = () => {
      hideTimer = setTimeout(() => {
        if (!nav.matches(":hover") && !hoverZone.matches(":hover")) {
          nav.classList.remove("show");
        }
      }, 180);
    };

    hoverZone.addEventListener("mouseenter", showNav);
    nav.addEventListener("mouseenter", showNav);
    hoverZone.addEventListener("mouseleave", hideNav);
    nav.addEventListener("mouseleave", hideNav);

    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        nav.classList.add("show");
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => nav.classList.remove("show"), 900);
      }
    });
  };

  const initActiveNav = () => {
    const current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".top-nav a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === current) {
        link.classList.add("active");
      }
    });
  };

  const initPageTransition = () => {
    const transition = document.querySelector(".page-transition");
    if (!transition) return;

    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank"
      ) {
        return;
      }

      link.addEventListener("click", (event) => {
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;

        event.preventDefault();
        transition.classList.add("show");
        setTimeout(() => {
          window.location.href = url.href;
        }, prefersReducedMotion ? 0 : 320);
      });
    });

    window.addEventListener("pageshow", () => {
      transition.classList.remove("show");
    });
  };

  const initReveal = () => {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, Math.min(index * 70, 280));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((item) => observer.observe(item));
  };

  const initCursor = () => {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;
    if (window.innerWidth <= 768 || prefersReducedMotion) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateRing);
    };

    animateRing();

    const activate = () => ring.classList.add("active");
    const deactivate = () => ring.classList.remove("active");

    document.querySelectorAll("a, button, .service-card").forEach((el) => {
      el.addEventListener("mouseenter", activate);
      el.addEventListener("mouseleave", deactivate);
    });
  };

  const initServiceCards = () => {
    document.querySelectorAll(".service-card[data-link]").forEach((card) => {
      const goToLink = () => {
        const href = card.getAttribute("data-link");
        if (!href) return;
        const transition = document.querySelector(".page-transition");
        if (transition && !prefersReducedMotion) {
          transition.classList.add("show");
          setTimeout(() => {
            window.location.href = href;
          }, 280);
        } else {
          window.location.href = href;
        }
      };

      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "link");

      card.addEventListener("click", goToLink);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToLink();
        }
      });
    });
  };

  const initFAQ = () => {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const trigger = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      if (!trigger || !answer) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach((openItem) => {
          openItem.classList.remove("open");
          const openAnswer = openItem.querySelector(".faq-answer");
          if (openAnswer) openAnswer.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add("open");
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });
    });
  };

  initTopNav();
  initActiveNav();
  initPageTransition();
  initReveal();
  initCursor();
  initServiceCards();
  initFAQ();
});
