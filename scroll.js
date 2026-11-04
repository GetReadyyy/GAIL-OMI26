(() => {
  const bar = document.querySelector(".nav .w");
  if (bar && !bar.querySelector(".nol-nav")) {
    const nav = document.createElement("nav");
    nav.className = "nol-nav";
    nav.setAttribute("aria-label", "Navigasi utama");
    const buttons = [...bar.querySelectorAll(".l")];
    const menuGroups = [
      ["Belajar", ["panduan", "model", "lab", "asesmen"]],
      ["Aktivitas", ["misi", "kartu", "lacak", "log"]],
      ["Lainnya", ["riset", "saran", "tentang", "admin"]],
    ];
    const grouped = new Set(menuGroups.flatMap(([, routes]) => routes));
    const home = buttons.find((button) => button.dataset.go === "beranda");
    if (home) nav.appendChild(home);

    menuGroups.forEach(([label, routes]) => {
      const details = document.createElement("details");
      details.className = "nav-menu";
      const summary = document.createElement("summary");
      summary.textContent = label;
      const items = document.createElement("div");
      items.className = "nav-menu-items";
      items.setAttribute("role", "group");
      items.setAttribute("aria-label", label);
      routes.forEach((route) => {
        const button = buttons.find((item) => item.dataset.go === route);
        if (button) items.appendChild(button);
      });
      details.append(summary, items);
      nav.appendChild(details);
    });

    buttons
      .filter(
        (button) =>
          button !== home && !grouped.has(button.dataset.go),
      )
      .forEach((button) => nav.appendChild(button));

    const label = document.createElement("p");
    label.id = "sec";
    label.className = "sec-label";
    label.textContent = "Awal";
    const anchor = document.getElementById("me");
    bar.insertBefore(nav, anchor);
    bar.insertBefore(label, nav);
  }

  let enterTimer = null;
  let leaveTimer = null;

  document.querySelectorAll(".nav-menu").forEach((menu) => {
    menu.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      clearTimeout(leaveTimer);
      clearTimeout(enterTimer);

      const anyOpen = document.querySelector(".nav-menu[open]");
      const delay = anyOpen ? 60 : 130;

      enterTimer = setTimeout(() => {
        document.querySelectorAll(".nav-menu[open]").forEach((openMenu) => {
          if (openMenu !== menu) openMenu.open = false;
        });
        menu.open = true;
      }, delay);
    });

    menu.addEventListener("pointerleave", () => {
      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        if (!menu.contains(document.activeElement)) {
          menu.open = false;
        }
      }, 220);
    });

    menu.addEventListener("focusout", () => {
      queueMicrotask(() => {
        if (!menu.contains(document.activeElement) && !menu.matches(":hover")) {
          menu.open = false;
        }
      });
    });
  });

  document.addEventListener("click", (event) => {
    clearTimeout(enterTimer);
    clearTimeout(leaveTimer);
    document.querySelectorAll(".nav-menu[open]").forEach((menu) => {
      if (!menu.contains(event.target)) menu.open = false;
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const menu = document.querySelector(".nav-menu[open]");
    if (!menu) return;
    menu.open = false;
    menu.querySelector("summary").focus();
  });

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        seen.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.16 },
  );

  window.nolReveal = (el) => {
    if (reduce) el.classList.add("in");
    else seen.observe(el);
  };

  document.documentElement.classList.add("reveal-ready");
  document.querySelectorAll(".rv:not(.in)").forEach((el) => window.nolReveal(el));
})();
