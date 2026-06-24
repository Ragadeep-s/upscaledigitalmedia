document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const nav = document.querySelector(".top-nav");
  const topHoverZone = document.querySelector(".top-hover-zone");
  const transitionLayer = document.querySelector(".page-transition");
  const revealItems = document.querySelectorAll(".reveal");
  const serviceCards = document.querySelectorAll(".service-card[data-link]");
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const isTouchDevice = window.matchMedia("(hover: none)").matches;

  let lastScrollY = window.scrollY;
  let navPinned = true;
  let cursorVisible = false;
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  if (transitionLayer) {
    requestAnimationFrame(() => {
      transitionLayer.classList.remove("active");
    });
  }

  if (!prefersReducedMotion && revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const showNav = () => {
    if (!nav) return;
    nav.classList.remove("nav-hidden");
    navPinned = true;
  };

  const hideNav = () => {
    if (!nav || prefersReducedMotion) return;
    nav.classList.add("nav-hidden");
    navPinned = false;
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (!nav) return;

    if (currentScrollY <= 40) {
      showNav();
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY && currentScrollY > 120) {
      hideNav();
    } else if (currentScrollY < lastScrollY) {
      showNav();
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  if (topHoverZone) {
    topHoverZone.addEventListener("mouseenter", showNav);
  }

  serviceCards.forEach((card) => {
    const target = card.getAttribute("data-link");
    if (!target) return;

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `Open ${target.replace(".html", "").replace(/-/g, " ")} page`);

    const goToTarget = () => {
      if (transitionLayer && !prefersReducedMotion) {
        transitionLayer.classList.add("active");
        window.setTimeout(() => {
          window.location.href = target;
        }, 220);
      } else {
        window.location.href = target;
      }
    };

    card.addEventListener("click", (event) => {
      const tag = event.target.tagName.toLowerCase();
      if (["a", "button", "input", "textarea", "select"].includes(tag)) return;
      goToTarget();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goToTarget();
      }
    });
  });

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const isHash = href.startsWith("#");
    const isExternal = /^https?:///i.test(href);
    const isSpecial = href.startsWith("mailto:") || href.startsWith("tel:");
    const opensNewTab = link.getAttribute("target") === "_blank";

    if (isHash || isExternal || isSpecial || opensNewTab) return;

    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();

      if (transitionLayer && !prefersReducedMotion) {
        transitionLayer.classList.add("active");
        window.setTimeout(() => {
          window.location.href = href;
        }, 220);
      } else {
        window.location.href = href;
      }
    });
  });

  if (!prefersReducedMotion && !isTouchDevice && cursorDot && cursorRing) {
    const moveCursor = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.opacity = "1";
      cursorRing.style.opacity = "1";
      cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

      if (!cursorVisible) {
        ringX = mouseX;
        ringY = mouseY;
        cursorVisible = true;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", moveCursor);

    document.addEventListener("mouseleave", () => {
      cursorDot.style.opacity = "0";
      cursorRing.style.opacity = "0";
      cursorVisible = false;
    });

    document.querySelectorAll("a, button, .service-card, .btn").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        cursorRing.style.width = "52px";
        cursorRing.style.height = "52px";
        cursorRing.style.borderColor = "rgba(34, 211, 238, 0.8)";
      });

      item.addEventListener("mouseleave", () => {
        cursorRing.style.width = "36px";
        cursorRing.style.height = "36px";
        cursorRing.style.borderColor = "rgba(255, 255, 255, 0.45)";
      });
    });

    animateRing();
  } else {
    if (cursorDot) cursorDot.style.display = "none";
    if (cursorRing) cursorRing.style.display = "none";
  }
});
