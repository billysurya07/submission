import PagePresenter from "../../utils/page-presenter";
import ViewModel from "../../utils/view-model";
import { getAllStories } from "../../data/api";
import { isAuthenticated } from "../../utils/storage";

import {
  ensureSubscribedIfEnabled,
  isPushEnabled,
  requestPermissionAndSubscribe,
  unsubscribe,
  setPushEnabled,
} from "../../utils/push";

import {
  idbGetAllStories,
  filterStories,
  idbDeleteStory,
} from "../../utils/idb";

class HomeViewModel extends ViewModel {
  constructor() {
    super();
    this.stories = [];
    this.filteredStories = [];
    this.currentLocation = null;
    this.offlineStoriesLoaded = false;
  }

  setStories(stories) {
    this.stories = stories;
    this.filteredStories = stories;
  }

  filterByLocation(location) {
    this.currentLocation = location;
    if (location === null) {
      this.filteredStories = this.stories;
    } else {
      this.filteredStories = this.stories.filter(
        (story) => story.lon === location.lon && story.lat === location.lat,
      );
    }
  }
}

class HomePresenter extends PagePresenter {
  async loadStories() {
    // First try IndexedDB for offline UX
    try {
      const cached = await idbGetAllStories();
      if (cached && cached.length > 0) {
        this.viewModel.setStories(cached);
        this.viewModel.offlineStoriesLoaded = true;
      }
    } catch (_) {
      // ignore
    }

    // Then try network
    try {
      this.viewModel.setLoading(true);
      this.viewModel.clearError();

      const response = await getAllStories();
      const list = response.listStory || [];
      this.viewModel.setStories(list);

      // Sync cache
      try {
        for (const s of list) {
          // idb requires id
          const id = s.id || `${s.lat}-${s.lon}-${s.createdAt || ""}`;
          await import("../../utils/idb").then(({ idbPutStory }) =>
            idbPutStory({ ...s, id }),
          );
        }
      } catch (_) {
        // ignore
      }

      return true;
    } catch (error) {
      // if offline cache exists, still consider success
      if (this.viewModel.offlineStoriesLoaded) return true;
      this.viewModel.setError(error.message);
      return false;
    } finally {
      this.viewModel.setLoading(false);
    }
  }

  filterStories(location) {
    this.viewModel.filterByLocation(location);
  }
}

export default class HomePage {
  constructor() {
    this.viewModel = new HomeViewModel();
    this.presenter = new HomePresenter(this.viewModel);
    this.presenter.setView(this);
    this.map = null;
    this.markers = {};
    this.tileLayerControl = null;
  }

  async render() {
    return `
      <main class="home-main">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        
        <section class="home-section">
          <div class="container home-container">
            <h1>Cerita-cerita dari Seluruh Dunia</h1>
            
            ${
              !isAuthenticated()
                ? `
              <div class="auth-prompt">
                <p>Silakan <a href="#/login">masuk</a> atau <a href="#/register">daftar</a> untuk melihat cerita.</p>
              </div>
            `
                : `
              <div class="home-content">
                <aside class="stories-sidebar">
                  <div class="stories-header">
                    <h2>Daftar Cerita</h2>
                    <div class="push-toggle" role="group" aria-label="Kontrol notifikasi push">
                      <label class="push-toggle-label">
                        <input id="push-toggle" type="checkbox" />
                        Aktifkan notifikasi
                      </label>
                    </div>
                    <button id="filter-all" class="filter-btn active" aria-pressed="true">
                      Semua
                    </button>
                  </div>

                  <div class="stories-controls" role="region" aria-label="Kontrol cerita">
                    <label class="sr-only" for="stories-search">Cari cerita</label>
                    <input id="stories-search" class="stories-search" type="search" placeholder="Cari berdasarkan deskripsi" aria-label="Cari cerita" />
                    <label class="sr-only" for="stories-sort">Urutkan</label>
                    <select id="stories-sort" class="stories-sort" aria-label="Urutkan cerita">
                      <option value="latest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                      <option value="name">Nama</option>
                    </select>
                  </div>
                  <div id="stories-list" class="stories-list" role="region" aria-label="Daftar cerita">
                    <p class="loading-text">Memuat cerita...</p>
                  </div>
                </aside>

                <section class="map-section">
                  <div id="map" class="map-container" role="region" aria-label="Peta cerita"></div>
                </section>
              </div>

              <div class="add-story-btn-container">
                <a href="#/add-story" class="add-story-btn" aria-label="Tambah cerita baru">
                  + Tambah Cerita
                </a>
              </div>
            `
            }
          </div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    if (!isAuthenticated()) {
      return;
    }

    // Setup push toggle
    this.setupPushToggle();

    await this.presenter.loadStories();

    // Initialize map
    this.initializeMap();

    // Render stories
    this.renderStories();

    // Setup filter button
    const filterAllBtn = document.querySelector("#filter-all");
    if (filterAllBtn) {
      filterAllBtn.addEventListener("click", () => {
        this.presenter.filterStories(null);
        document.querySelectorAll(".filter-btn").forEach((btn) => {
          btn.classList.remove("active");
          btn.setAttribute("aria-pressed", "false");
        });
        filterAllBtn.classList.add("active");
        filterAllBtn.setAttribute("aria-pressed", "true");
        this.updateMapMarkers();
        this.renderStories();
      });
    }

    // Setup search/sort + delete
    this.setupStoriesInteractivity();
  }

  initializeMap() {
    if (this.map) {
      this.map.remove();
    }

    const mapContainer = document.querySelector("#map");
    if (!mapContainer) {
      return;
    }

    // Use global L object from Leaflet CDN
    this.map = L.map(mapContainer).setView([-6.2088, 106.8456], 13);

    // Add tile layers with layer control
    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      },
    );

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles © Esri",
        maxZoom: 19,
      },
    );

    osmLayer.addTo(this.map);

    // Add layer control
    L.control
      .layers(
        {
          OpenStreetMap: osmLayer,
          Satellite: satelliteLayer,
        },
        {},
      )
      .addTo(this.map);

    // Add all story markers
    this.updateMapMarkers();
  }

  updateMapMarkers() {
    if (!this.map) return;

    // Clear existing markers
    Object.values(this.markers).forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers = {};

    // Add markers for filtered stories
    this.viewModel.filteredStories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);

        const popupContent = `
          <div class="map-popup">
            <h3>${this.escapeHtml(story.name)}</h3>
            <img src="${story.photoUrl}" alt="" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 4px; margin: 8px 0;">
            <p>${this.escapeHtml(story.description).substring(0, 100)}...</p>
          </div>
        `;

        marker.bindPopup(popupContent);
        this.markers[`${story.lat}-${story.lon}`] = marker;
      }
    });

    // Fit bounds if markers exist
    if (Object.keys(this.markers).length > 0) {
      const group = new L.featureGroup(Object.values(this.markers));
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }

  renderStories() {
    const storiesList = document.querySelector("#stories-list");
    if (!storiesList) return;

    if (this.viewModel.stories.length === 0) {
      storiesList.innerHTML = '<p class="no-data">Belum ada cerita.</p>';
      return;
    }

    const storiesToDisplay =
      this.viewModel.filteredStories.length > 0
        ? this.viewModel.filteredStories
        : this.viewModel.stories;

    const html = storiesToDisplay
      .map(
        (story) => `
        <article class="story-card" data-id="${story.id || ""}" data-lat="${story.lat}" data-lon="${story.lon}">
          <button class="delete-story-btn" type="button" aria-label="Hapus cerita" title="Hapus">🗑️</button>
          <img
            src="${story.photoUrl}"
            alt="Foto dari ${this.escapeHtml(story.name)}"
            class="story-image"
          />
          <div class="story-content">
            <h3>${this.escapeHtml(story.name)}</h3>
            <p class="story-description">${this.escapeHtml(story.description).substring(0, 80)}...</p>
            <span class="story-date">${new Date(story.createdAt).toLocaleDateString("id-ID")}</span>
          </div>
        </article>
      `,
      )
      .join("");

    storiesList.innerHTML = html;

    // Add click listeners to highlight stories
    document.querySelectorAll(".story-card").forEach((card) => {
      card.addEventListener("click", () => {
        const lat = parseFloat(card.dataset.lat);
        const lon = parseFloat(card.dataset.lon);

        // Remove previous highlights
        document.querySelectorAll(".story-card.active").forEach((c) => {
          c.classList.remove("active");
        });

        // Highlight clicked card
        card.classList.add("active");

        // Highlight marker on map
        const markerKey = `${lat}-${lon}`;
        if (this.markers[markerKey]) {
          this.markers[markerKey].openPopup();
          this.map.setView([lat, lon], 16);
        }
      });
    });
  }

  setupPushToggle() {
    const toggle = document.querySelector("#push-toggle");
    if (!toggle) return;

    // init state
    toggle.checked = isPushEnabled();

    toggle.addEventListener("change", async () => {
      if (toggle.checked) {
        try {
          await requestPermissionAndSubscribe();
        } catch (e) {
          toggle.checked = false;
          setPushEnabled(false);
          console.warn(e);
        }
      } else {
        await unsubscribe();
      }
    });
  }

  setupStoriesInteractivity() {
    const searchInput = document.querySelector("#stories-search");
    const sortSelect = document.querySelector("#stories-sort");

    const apply = () => {
      const query = searchInput ? searchInput.value : "";
      const sort = sortSelect ? sortSelect.value : "latest";

      // interactivity based on currently loaded stories
      const filtered = filterStories(this.viewModel.stories, {
        query,
        location: this.viewModel.currentLocation,
        sort,
      });

      this.viewModel.filteredStories = filtered;
      this.updateMapMarkers();
      this.renderStories();
    };

    if (searchInput) searchInput.addEventListener("input", apply);
    if (sortSelect) sortSelect.addEventListener("change", apply);

    // delete handler (basic)
    document
      .querySelectorAll(".story-card .delete-story-btn")
      .forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const card = btn.closest(".story-card");
          const id = card?.dataset?.id;
          if (!id) return;

          await idbDeleteStory(id);

          // Optimistic update
          this.viewModel.stories = this.viewModel.stories.filter(
            (s) => String(s.id) !== String(id),
          );
          this.viewModel.filteredStories = this.viewModel.stories;
          this.updateMapMarkers();
          this.renderStories();

          // TODO: enqueue delete sync when backend endpoint is available
        });
      });
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
