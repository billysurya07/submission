import PagePresenter from "../../utils/page-presenter";
import ViewModel from "../../utils/view-model";
import { addStory } from "../../data/api";
import { isAuthenticated } from "../../utils/storage";

import { idbPutStory, idbQueueEnqueue } from "../../utils/idb";

class AddStoryViewModel extends ViewModel {
  constructor() {
    super();
    this.selectedLocation = null;
  }

  setLocation(lat, lon) {
    this.selectedLocation = { lat, lon };
  }

  getLocation() {
    return this.selectedLocation;
  }
}

class AddStoryPresenter extends PagePresenter {
  async handleAddStory(formData) {
    try {
      const description = formData.get("description");
      this.viewModel.setLoading(true);
      this.viewModel.clearError();

      if (!this.viewModel.getLocation()) {
        throw new Error("Pilih lokasi di peta terlebih dahulu");
      }

      const location = this.viewModel.getLocation();
      formData.append("lat", location.lat);
      formData.append("lon", location.lon);

      // Read required fields for offline cache
      const lat = formData.get("lat");
      const lon = formData.get("lon");

      // Always store to IndexedDB for offline UX
      // For photo: store as null (handle file upload blob not persistent). Backend will provide photoUrl on sync.
      const localStory = {
        id: crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        name: "Cerita",
        description: description || "",
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        createdAt: new Date().toISOString(),
        photoUrl: "",
      };

      await idbPutStory(localStory);

      // If offline, enqueue sync and return success
      if (!navigator.onLine) {
        await idbQueueEnqueue({
          type: "CREATE_STORY",
          localId: localStory.id,
          description: localStory.description,
          lat: localStory.lat,
          lon: localStory.lon,
          queuedAt: new Date().toISOString(),
        });
        this.viewModel.setData({ success: true, offline: true });
        return true;
      }

      // Online: send to API then put returned story into cache
      const res = await addStory(formData);
      const serverStory = (res && (res.story || res)) || {};
      const serverId = serverStory.id || serverStory.storyId || localStory.id;

      await idbPutStory({
        ...localStory,
        id: serverId,
        name: serverStory.name || localStory.name,
        description: serverStory.description || localStory.description,
        lat: serverStory.lat ?? localStory.lat,
        lon: serverStory.lon ?? localStory.lon,
        createdAt: serverStory.createdAt || localStory.createdAt,
        photoUrl:
          serverStory.photoUrl || serverStory.photo || localStory.photoUrl,
      });

      this.viewModel.setData({ success: true });
      return true;
    } catch (error) {
      this.viewModel.setError(error.message);
      return false;
    } finally {
      this.viewModel.setLoading(false);
    }
  }
}

export default class AddStoryPage {
  constructor() {
    this.viewModel = new AddStoryViewModel();
    this.presenter = new AddStoryPresenter(this.viewModel);
    this.presenter.setView(this);
    this.map = null;
    this.selectedMarker = null;
    this.mediaStream = null;
    this.video = null;
    this.canvas = null;
  }

  async render() {
    if (!isAuthenticated()) {
      return `
        <main class="add-story-main">
          <section class="container">
            <div class="auth-prompt">
              <p>Silakan <a href="#/login">masuk</a> atau <a href="#/register">daftar</a> untuk menambah cerita.</p>
            </div>
          </section>
        </main>
      `;
    }

    return `
      <main class="add-story-main">
        <section class="add-story-section">
          <div class="container add-story-container">
            <h1>Tambah Cerita Baru</h1>

            <form id="add-story-form" class="add-story-form">
              <div class="form-group">
                <label for="story-description">Deskripsi</label>
                <textarea
                  id="story-description"
                  name="description"
                  class="form-textarea"
                  rows="4"
                  required
                  aria-label="Deskripsi cerita"
                  aria-describedby="description-error"
                ></textarea>
                <span id="description-error" class="error-text"></span>
              </div>

              <div class="form-group">
                <label>Foto</label>
                <div class="photo-input-group">
                  <div class="photo-input-option">
                    <label for="story-photo" class="photo-label">
                      <input
                        type="file"
                        id="story-photo"
                        name="photo"
                        class="form-input file-input"
                        accept="image/*"
                        required
                        aria-label="Pilih foto cerita"
                        aria-describedby="photo-error"
                      />
                      <span class="upload-text">Pilih Foto</span>
                    </label>
                    <span id="photo-error" class="error-text"></span>
                  </div>

                  <div class="photo-divider">atau</div>

                  <div class="photo-input-option">
                    <button
                      type="button"
                      id="camera-btn"
                      class="camera-button"
                      aria-label="Ambil foto dari kamera"
                    >
                      📷 Ambil Foto dari Kamera
                    </button>
                  </div>
                </div>

                <div id="photo-preview-container" class="photo-preview-container"></div>
              </div>

              <div class="form-group">
                <label>Lokasi pada Peta</label>
                <p class="location-hint">Klik pada peta untuk memilih lokasi</p>
                <div id="add-story-map" class="map-container" role="region" aria-label="Peta untuk memilih lokasi cerita"></div>
                <div id="location-info" class="location-info">Lokasi belum dipilih</div>
              </div>

              <div id="error-message" class="error-message" role="alert"></div>
              <div id="success-message" class="success-message" role="alert"></div>

              <button
                type="submit"
                id="add-story-submit"
                class="auth-button"
                aria-busy="false"
              >
                Tambah Cerita
              </button>
            </form>
          </div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    if (!isAuthenticated()) {
      return;
    }

    this.initializeMap();
    this.setupFormHandlers();
    this.setupCameraButton();
  }

  initializeMap() {
    const mapContainer = document.querySelector("#add-story-map");
    if (!mapContainer) return;

    // Use global L object from Leaflet CDN
    this.map = L.map(mapContainer).setView([-6.2088, 106.8456], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(this.map);

    // Click on map to select location
    this.map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.setMapLocation(lat, lng);
    });
  }

  setMapLocation(lat, lon) {
    // Remove previous marker
    if (this.selectedMarker) {
      this.map.removeLayer(this.selectedMarker);
    }

    // Add new marker
    this.selectedMarker = L.marker([lat, lon]).addTo(this.map);
    this.map.setView([lat, lon], 16);

    // Update view model
    this.viewModel.setLocation(lat, lon);

    // Update location info
    const locationInfo = document.querySelector("#location-info");
    if (locationInfo) {
      locationInfo.textContent = `Lokasi dipilih: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  }

  setupFormHandlers() {
    const form = document.querySelector("#add-story-form");
    const photoInput = document.querySelector("#story-photo");
    const submitButton = document.querySelector("#add-story-submit");
    const errorMessage = document.querySelector("#error-message");
    const successMessage = document.querySelector("#success-message");
    const previewContainer = document.querySelector("#photo-preview-container");

    // Photo preview
    if (photoInput) {
      photoInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            previewContainer.innerHTML = `
              <div class="photo-preview">
                <img src="${event.target.result}" alt="Preview foto cerita" />
              </div>
            `;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate required fields
      const description = form
        .querySelector('[name="description"]')
        .value.trim();
      const photoInput = form.querySelector('[name="photo"]');

      let hasErrors = false;

      if (!description) {
        document.querySelector("#description-error").textContent =
          "Deskripsi harus diisi";
        hasErrors = true;
      }

      if (!photoInput.files.length) {
        document.querySelector("#photo-error").textContent =
          "Foto harus dipilih";
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }

      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      errorMessage.textContent = "";
      successMessage.textContent = "";

      const formData = new FormData(form);

      const success = await this.presenter.handleAddStory(formData);

      if (success) {
        successMessage.textContent = "Cerita berhasil ditambahkan!";
        setTimeout(() => {
          window.location.hash = "#/";
        }, 1500);
      } else {
        errorMessage.textContent = this.viewModel.error;
        submitButton.disabled = false;
        submitButton.setAttribute("aria-busy", "false");
      }
    });
  }

  setupCameraButton() {
    const cameraBtn = document.querySelector("#camera-btn");
    const photoInput = document.querySelector("#story-photo");
    const previewContainer = document.querySelector("#photo-preview-container");

    if (!cameraBtn) return;

    cameraBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        // Request camera access
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        // Show camera modal
        const modal = this.createCameraModal();
        document.body.appendChild(modal);

        this.video = modal.querySelector("#camera-video");
        this.canvas = modal.querySelector("#camera-canvas");

        this.video.srcObject = this.mediaStream;

        // Capture button
        const captureBtn = modal.querySelector("#capture-btn");
        captureBtn.addEventListener("click", () => {
          this.capturePhoto(photoInput, previewContainer, modal);
        });

        // Close button
        const closeBtn = modal.querySelector("#close-camera-btn");
        closeBtn.addEventListener("click", () => {
          this.stopCamera();
          modal.remove();
        });

        // Close on backdrop click
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            this.stopCamera();
            modal.remove();
          }
        });
      } catch (error) {
        document.querySelector("#photo-error").textContent =
          "Tidak dapat mengakses kamera: " + error.message;
      }
    });
  }

  createCameraModal() {
    const modal = document.createElement("div");
    modal.className = "camera-modal";
    modal.innerHTML = `
      <div class="camera-modal-content">
        <button id="close-camera-btn" class="close-modal-btn" aria-label="Tutup kamera">✕</button>
        <h2>Ambil Foto</h2>
        <video id="camera-video" autoplay playsinline></video>
        <canvas id="camera-canvas" style="display: none;"></canvas>
        <button id="capture-btn" class="camera-capture-btn" type="button">
          Ambil Foto
        </button>
      </div>
    `;
    return modal;
  }

  capturePhoto(fileInput, previewContainer, modal) {
    const context = this.canvas.getContext("2d");
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    context.drawImage(this.video, 0, 0);

    const dataUrl = this.canvas.toDataURL("image/jpeg");

    // Convert to File object
    this.canvas.toBlob((blob) => {
      const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      previewContainer.innerHTML = `
        <div class="photo-preview">
          <img src="${dataUrl}" alt="Foto yang diambil dari kamera" />
        </div>
      `;

      this.stopCamera();
      modal.remove();
    });
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }
}
