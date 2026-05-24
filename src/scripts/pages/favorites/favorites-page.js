import PagePresenter from "../../utils/page-presenter";
import ViewModel from "../../utils/view-model";
import { isAuthenticated } from "../../utils/storage";
import {
  idbGetAllFavoriteStories,
  idbDeleteFavoriteStory,
  filterStories,
} from "../../utils/idb";

class FavoritesViewModel extends ViewModel {
  constructor() {
    super();
    this.favorites = [];
    this.filteredFavorites = [];
    this.searchQuery = "";
    this.sortBy = "latest";
  }

  setFavorites(favorites) {
    this.favorites = favorites;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredFavorites = filterStories(this.favorites, {
      query: this.searchQuery,
      sort: this.sortBy,
    });
  }

  setSearchQuery(query) {
    this.searchQuery = query;
    this.applyFilters();
  }

  setSortBy(sort) {
    this.sortBy = sort;
    this.applyFilters();
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
    this.viewModel.applyFilters();
  }

  updateSearch(query) {
    this.viewModel.setSearchQuery(query);
  }

  updateSort(sort) {
    this.viewModel.setSortBy(sort);
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
          <h2 class="favorites-subtitle">Koleksi cerita favorit Anda</h2>
          ${
            !isAuthenticated()
              ? `
                <div class="auth-prompt">
                  <p>Silakan <a href="#/login">masuk</a> untuk mengelola cerita favorit Anda.</p>
                </div>
              `
              : `
                <div class="favorites-controls" role="region" aria-label="Kontrol cerita favorit">
                  <div class="search-container">
                    <label class="sr-only" for="favorites-search">Cari cerita favorit</label>
                    <input 
                      id="favorites-search" 
                      class="favorites-search" 
                      type="search" 
                      placeholder="Cari berdasarkan judul atau deskripsi..." 
                      aria-label="Cari cerita favorit" 
                    />
                  </div>
                  
                  <div class="sort-container">
                    <label class="sr-only" for="favorites-sort">Urutkan cerita favorit</label>
                    <select 
                      id="favorites-sort" 
                      class="favorites-sort" 
                      aria-label="Urutkan cerita favorit"
                    >
                      <option value="latest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                      <option value="name">Nama A-Z</option>
                    </select>
                  </div>
                </div>

                <div id="favorites-stats" class="favorites-stats" role="status" aria-live="polite">
                  <p class="loading-text">Memuat cerita favorit...</p>
                </div>

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
    this.setupSearchAndSort();
    this.setupFavoriteActions();
  }

  setupSearchAndSort() {
    const searchInput = document.querySelector("#favorites-search");
    const sortSelect = document.querySelector("#favorites-sort");

    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        this.presenter.updateSearch(event.target.value);
        this.renderFavorites();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (event) => {
        this.presenter.updateSort(event.target.value);
        this.renderFavorites();
      });
    }
  }

  renderFavorites() {
    const container = document.querySelector("#favorites-list");
    const statsContainer = document.querySelector("#favorites-stats");

    if (!container) return;

    const favorites = this.viewModel.filteredFavorites || [];
    const total = this.viewModel.favorites?.length || 0;

    // Update stats
    if (statsContainer) {
      if (favorites.length === 0 && total === 0) {
        statsContainer.innerHTML =
          '<p class="stats-text">Belum ada cerita favorit.</p>';
      } else if (favorites.length === 0) {
        statsContainer.innerHTML = `<p class="stats-text">Tidak ada hasil pencarian. Total cerita favorit: ${total}</p>`;
      } else {
        statsContainer.innerHTML = `<p class="stats-text">Menampilkan ${favorites.length} dari ${total} cerita favorit</p>`;
      }
    }

    if (!favorites || favorites.length === 0) {
      container.innerHTML =
        this.viewModel.favorites.length === 0
          ? '<p class="no-data">Belum ada cerita favorit.</p>'
          : '<p class="no-data">Tidak ada hasil pencarian.</p>';
      return;
    }

    const html = favorites
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
        this.setupFavoriteActions();
      });
    });
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
