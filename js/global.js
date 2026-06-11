document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".top-nav");
  const hoverZone = document.querySelector(".top-hover-zone");
  const transition = document.querySelector(".page-transition");
  let hideTimer;

  const showNav = () => {
    clearTimeout(hideTimer);
    nav.classList.add("show");
  };

  const hideNav = () => {
    hideTimer = setTimeout(() => {
      nav.classList.remove("show");
    }, 250);
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
        transition.classList.add("show");

        setTimeout(() => {
          window.location.href = href;
        }, 380);
      }
    });
  });

  window.addEventListener("pageshow", () => {
    transition.classList.remove("show");
  });
});
