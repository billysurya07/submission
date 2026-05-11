import PagePresenter from "../../utils/page-presenter";
import ViewModel from "../../utils/view-model";
import { isAuthenticated } from "../../utils/storage";
import {
  idbGetAllFavoriteStories,
  idbDeleteFavoriteStory,
} from "../../utils/idb";

class FavoritesViewModel extends ViewModel {
  constructor() {
    super();
    this.favorites = [];
  }

  setFavorites(favorites) {
    this.favorites = favorites;
  }
}

class FavoritesPresenter extends PagePresenter {
  async loadFavorites() {
    try {
      const favorites = await idbGetAllFavoriteStories();
      this.viewModel.setFavorites(favorites);
      return true;
    } catch (error) {
      this.viewModel.setError(error.message);
      return false;
    }
  }

  async deleteFavorite(id) {
    await idbDeleteFavoriteStory(id);
    this.viewModel.favorites = this.viewModel.favorites.filter(
      (story) => String(story.id) !== String(id),
    );
  }
}

export default class FavoritesPage {
  constructor() {
    this.viewModel = new FavoritesViewModel();
    this.presenter = new FavoritesPresenter(this.viewModel);
    this.presenter.setView(this);
  }

  async render() {
    return `
      <main class="favorites-main">
        <section class="favorites-section container">
          <h1>Cerita Favorit</h1>
          ${
            !isAuthenticated()
              ? `
                <div class="auth-prompt">
                  <p>Silakan <a href="#/login">masuk</a> untuk mengelola cerita favorit Anda.</p>
                </div>
              `
              : `
                <div id="favorites-list" class="favorites-list" role="region" aria-label="Daftar cerita favorit">
                  <p class="loading-text">Memuat cerita favorit...</p>
                </div>
              `
          }
        </section>
      </main>
    `;
  }

  async afterRender() {
    if (!isAuthenticated()) {
      return;
    }

    await this.presenter.loadFavorites();
    this.renderFavorites();
    this.setupFavoriteActions();
  }

  renderFavorites() {
    const container = document.querySelector("#favorites-list");
    if (!container) return;

    if (!this.viewModel.favorites || this.viewModel.favorites.length === 0) {
      container.innerHTML = '<p class="no-data">Belum ada cerita favorit.</p>';
      return;
    }

    const html = this.viewModel.favorites
      .map(
        (story) => `
          <article class="favorite-card" data-id="${story.id}">
            <img src="${story.photoUrl}" alt="Foto dari ${this.escapeHtml(story.name)}" />
            <div class="favorite-card-content">
              <h3>${this.escapeHtml(story.name)}</h3>
              <p>${this.escapeHtml(story.description).substring(0, 140)}...</p>
              <span class="story-date">${new Date(story.createdAt).toLocaleDateString("id-ID")}</span>
            </div>
            <button class="remove-favorite-btn" type="button" aria-label="Hapus cerita favorit">Hapus</button>
          </article>
        `,
      )
      .join("");

    container.innerHTML = html;
  }

  setupFavoriteActions() {
    document.querySelectorAll(".remove-favorite-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        const card = button.closest(".favorite-card");
        const id = card?.dataset?.id;
        if (!id) return;

        await this.presenter.deleteFavorite(id);
        this.renderFavorites();
      });
    });
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
