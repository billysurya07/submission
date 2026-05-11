import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { isAuthenticated, logout } from "../utils/storage";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #closeDrawerBtn = null;
  #logoutBtn = null;
  #logoutItem = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#closeDrawerBtn = document.querySelector("#close-drawer-btn");
    this.#logoutBtn = document.querySelector("#logout-btn");
    this.#logoutItem = document.querySelector("#logout-item");

    this.#setupDrawer();
    this.#setupLogout();
    this.#setupSkipLink();
    this.#updateAuthUI();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
      const isOpen = this.#navigationDrawer.classList.contains("open");
      this.#drawerButton.setAttribute("aria-expanded", isOpen);
    });

    // Close drawer button
    if (this.#closeDrawerBtn) {
      this.#closeDrawerBtn.addEventListener("click", () => {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.setAttribute("aria-expanded", "false");
      });
    }

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.setAttribute("aria-expanded", "false");
      }
    });

    this.#navigationDrawer.querySelectorAll("a, button").forEach((link) => {
      link.addEventListener("click", () => {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.setAttribute("aria-expanded", "false");
      });
    });

    // Keyboard navigation - close on Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  #setupLogout() {
    if (this.#logoutBtn) {
      this.#logoutBtn.addEventListener("click", () => {
        logout();
        window.location.hash = "#/login";
      });
    }
  }

  #setupSkipLink() {
    const mainContent = document.querySelector("#main-content");
    const skipLink = document.querySelector(".skip-link");

    if (skipLink && mainContent) {
      skipLink.addEventListener("click", function (event) {
        event.preventDefault();
        skipLink.blur();
        mainContent.focus();
        mainContent.scrollIntoView();
      });
    }
  }

  #updateAuthUI() {
    const authenticated = isAuthenticated();
    if (this.#logoutItem) {
      this.#logoutItem.style.display = authenticated ? "block" : "none";
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (!page) {
      this.#content.innerHTML =
        '<section class="container"><h1>Halaman tidak ditemukan</h1></section>';
      return;
    }

    // Use View Transitions API for smooth page transitions
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      // Fallback for browsers without View Transitions support
      this.#content.classList.add("fade-out");
      await new Promise((resolve) => setTimeout(resolve, 200));
      this.#content.innerHTML = await page.render();
      this.#content.classList.remove("fade-out");
      this.#content.classList.add("fade-in");
      await page.afterRender();
      setTimeout(() => {
        this.#content.classList.remove("fade-in");
      }, 300);
    }

    this.#updateAuthUI();
  }
}

export default App;
