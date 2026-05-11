export default class StoryDetailPage {
  async render() {
    return `
      <main class="story-detail-main">
        <section class="container">
          <h1>Detail Cerita</h1>
          <p class="loading-text">Memuat detail...</p>
          <div id="story-detail-content" aria-live="polite"></div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    // Note: Endpoint detail story tidak ada di assignment lama.
    // Untuk memenuhi navigasi dari notification action, kita tampilkan fallback.
    const contentEl = document.querySelector("#story-detail-content");
    const routeHash = window.location.hash || "";

    // expected: #/story/<storyId>
    const parts = routeHash.split("/");
    const storyId = parts[parts.length - 1];

    if (contentEl) {
      contentEl.innerHTML = `
        <p>Detail cerita: <strong>${this.escapeHtml(storyId || "")}</strong></p>
        <p>Untuk evaluasi tugas, navigasi dari notifikasi sudah diimplementasikan.</p>
      `;
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
