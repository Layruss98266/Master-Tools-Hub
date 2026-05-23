"use client";

import { useEffect } from "react";

export default function Effects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scroll reveal (stagger via --delay)
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    let revealIO: IntersectionObserver | null = null;
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("visible"));
    } else {
      revealIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealIO?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => revealIO!.observe(el));
    }

    // Count-up stats
    const fmt = (n: number) => n.toLocaleString("en-US");
    const runCount = (el: HTMLElement) => {
      const target = parseInt(el.dataset.count || "0", 10);
      const suffix = el.dataset.suffix || "";
      if (reduce) {
        el.textContent = fmt(target) + suffix;
        return;
      }
      const dur = 1500;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const nums = Array.from(document.querySelectorAll<HTMLElement>(".stat-number[data-count]"));
    let countIO: IntersectionObserver | null = null;
    if (!("IntersectionObserver" in window)) {
      nums.forEach(runCount);
    } else {
      countIO = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              runCount(e.target as HTMLElement);
              countIO?.unobserve(e.target);
            }
          }),
        { threshold: 0.5 }
      );
      nums.forEach((el) => countIO!.observe(el));
    }

    // Cursor spotlight on cards
    const onMove = (e: PointerEvent) => {
      const group = (e.currentTarget as HTMLElement);
      const card = (e.target as HTMLElement).closest<HTMLElement>(".feature-card");
      if (!card || !group.contains(card)) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-spotlight]"));
    if (!reduce) groups.forEach((g) => g.addEventListener("pointermove", onMove as EventListener));

    // Scroll progress bar
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Interactive 3D tilt on the hero product preview
    const preview = document.querySelector<HTMLElement>(".hero-preview");
    const browser = preview?.querySelector<HTMLElement>(".browser") ?? null;
    const onTilt = (e: PointerEvent) => {
      if (!preview || !browser) return;
      const r = preview.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      browser.classList.add("tilting");
      browser.style.transform = `rotateX(${6 - py * 8}deg) rotateY(${px * 10}deg) translateY(0)`;
    };
    const onTiltLeave = () => {
      if (!browser) return;
      browser.classList.remove("tilting");
      browser.style.transform = "";
    };
    if (!reduce && preview && browser) {
      preview.addEventListener("pointermove", onTilt as EventListener);
      preview.addEventListener("pointerleave", onTiltLeave);
    }

    return () => {
      revealIO?.disconnect();
      countIO?.disconnect();
      if (!reduce) groups.forEach((g) => g.removeEventListener("pointermove", onMove as EventListener));
      window.removeEventListener("scroll", onScroll);
      bar.remove();
      if (!reduce && preview && browser) {
        preview.removeEventListener("pointermove", onTilt as EventListener);
        preview.removeEventListener("pointerleave", onTiltLeave);
      }
    };
  }, []);

  return null;
}
