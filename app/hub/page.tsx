"use client";

import { useEffect, useRef } from "react";
import { HUB_MARKUP } from "@/lib/hubMarkup";

// Version query busts the browser cache when the hub stylesheet changes.
const CSS_HREF = "/hub-app/hub.css?v=6";
const THEME_KEY = "hubTheme"; // "dark" | "light"
const SCRIPTS = [
  "/hub-app/dataLoader.js",
  "/hub-app/tools.js",
  "/hub-app/tech.js",
  "/hub-app/main.js",
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false; // preserve execution order
    s.dataset.hub = "1";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

function getStoredTheme(): "dark" | "light" {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {}
  return "dark"; // default to dark, matching the rest of the site
}

export default function HubPage() {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    document.body.classList.add("hub-active");

    // Apply the saved theme (dark by default).
    const applyTheme = (theme: "dark" | "light") => {
      document.body.classList.toggle("hub-dark", theme === "dark");
      const btn = document.getElementById("hub-theme-toggle");
      if (btn) {
        btn.setAttribute(
          "aria-label",
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        );
      }
    };
    let theme = getStoredTheme();
    applyTheme(theme);

    // Toggle handler, delegated so it survives the dangerouslySetInnerHTML markup.
    const onToggleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("#hub-theme-toggle");
      if (!target) return;
      theme = theme === "dark" ? "light" : "dark";
      applyTheme(theme);
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {}
    };
    document.addEventListener("click", onToggleClick);

    // Inject hub stylesheet (scoped to this route by removing it on unmount).
    let link = document.getElementById("hub-css") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = "hub-css";
      link.rel = "stylesheet";
      link.href = CSS_HREF;
      document.head.appendChild(link);
    }

    // Boot the catalog controllers in order, after the markup is in the DOM.
    (async () => {
      try {
        for (const src of SCRIPTS) {
          if (!mounted.current) return;
          await loadScript(src);
        }
      } catch (e) {
        console.error("[hub] failed to initialize:", e);
      }
    })();

    return () => {
      mounted.current = false;
      document.removeEventListener("click", onToggleClick);
      document.body.classList.remove("hub-active", "hub-dark");
      document.getElementById("hub-css")?.remove();
      document.querySelectorAll('script[data-hub="1"]').forEach((el) => el.remove());
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HUB_MARKUP }} />;
}
