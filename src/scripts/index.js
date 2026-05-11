// CSS imports
import "../styles/styles.css";

import App from "./pages/app";

import { ensureSubscribedIfEnabled } from "./utils/push";

async function initPWA() {
  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register(
      `${import.meta.env.BASE_URL}sw.js`,
    );

    // If user previously enabled push, ensure subscription exists
    await ensureSubscribedIfEnabled();

    // Listen SW navigation messages
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (!event || !event.data) return;
      if (event.data.type === "NAVIGATE" && event.data.url) {
        window.location.hash = event.data.url.replace(/^.*#/, "");
        // Fallback full navigation for browsers that don't like hash-only changes
        if (event.data.url.startsWith("/")) {
          // no-op; keep SPA hash
        }
      }
    });

    // Optional: report active sw state
    console.log("SW registered", registration);
  } catch (err) {
    console.warn("SW registration failed", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await initPWA();

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
