document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".top-nav");
  const hoverZone = document.querySelector(".top-hover-zone");
  const transition = document.querySelector(".page-transition");

  let hideTimer;

  const showNav = () => {
    if (!nav) return;
    clearTimeout(hideTimer);
    nav.classList.add("show");
  };

  const hideNav = () => {
    if (!nav) return;
    hideTimer = setTimeout(() => {
      nav.classList.remove("show");
    }, 260);
  };

  if (hoverZone && nav) {
    hoverZone.addEventListener("mouseenter", showNav);
    nav.addEventListener("mouseenter", showNav);
    nav.addEventListener("mouseleave", hideNav);

    document.addEventListener("mousemove", (e) => {
      if (e.clientY < 18) {
        showNav();
      }
    });
  }

  const current = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".top-nav a").forEach((a) => {
    const href = a.getAttribute("href");

    if (href === current) {
      a.classList.add("active");
    }

    a.addEventListener("click", (e) => {
      if (href && !href.startsWith("#")) {
        e.preventDefault();
        if (transition) transition.classList.add("show");
        setTimeout(() => {
          window.location.href = href;
        }, 380);
      }
    });
  });

  window.addEventListener("pageshow", () => {
    if (transition) transition.classList.remove("show");
  });

  const revealItems = document.querySelectorAll(".section-card, .card, .faq-item, .process-step, .gallery-item, .footer-card");
  revealItems.forEach((item) => item.classList.add("reveal"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));

  if (window.innerWidth > 768) {
    const dot = document.createElement("div");
    const ring = document.createElement("div");

    dot.className = "cursor-dot";
    ring.className = "cursor-ring";

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    window.addEventListener("mousemove", (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll("a, button, .btn, .card, .gallery-item").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("active"));
    });
  }
});
