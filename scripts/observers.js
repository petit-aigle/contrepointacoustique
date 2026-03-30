export function createRevealObserver() {
  return new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
}

export function observeRevealItems(revealObserver) {
  document.querySelectorAll(".reveal").forEach((element) => {
    if (element.dataset.revealObserved) {
      return;
    }

    element.dataset.revealObserved = "1";
    revealObserver.observe(element);
  });
}

export function createSectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      const navLinks = Array.from(
        document.querySelectorAll(".navbar__link[data-nav-target]")
      );
      const navByTarget = new Map(
        navLinks.map((link) => [link.dataset.navTarget, link])
      );

      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => link.classList.remove("is-active"));

        const activeLink = navByTarget.get(entry.target.id);
        activeLink?.classList.add("is-active");
      });
    },
    {
      threshold: 0,
      rootMargin: "-40% 0px -45% 0px",
    }
  );

  return {
    refresh() {
      observer.disconnect();

      document.querySelectorAll(".site-row[data-row]").forEach((section) => {
        observer.observe(section);
      });
    },
  };
}
