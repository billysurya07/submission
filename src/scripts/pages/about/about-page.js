export default class AboutPage {
  async render() {
    return `
      <main class="about-main">
        <section class="container about-container">
          <h1>Tentang Aplikasi</h1>
          
          <article class="about-content">
            <section class="about-section">
              <h2>Apa Itu StoryApp?</h2>
              <p>
                StoryApp adalah aplikasi untuk berbagi cerita dari seluruh dunia. Dengan antarmuka yang 
                intuitif dan fitur peta interaktif, Anda dapat melihat cerita dari berbagai lokasi 
                dan menyimpan pengalaman unik Anda.
              </p>
            </section>

            <section class="about-section">
              <h2>Fitur Utama</h2>
              <ul class="about-list">
                <li>Lihat cerita dari seluruh dunia melalui peta interaktif</li>
                <li>Berbagi cerita baru dengan foto dan lokasi</li>
                <li>Filter cerita berdasarkan lokasi</li>
                <li>Antarmuka yang responsif dan ramah pengaksesan</li>
              </ul>
            </section>

            <section class="about-section">
              <h2>Teknologi yang Digunakan</h2>
              <ul class="about-list">
                <li>JavaScript (ES6+)</li>
                <li>Vite Build Tool</li>
                <li>Leaflet untuk peta interaktif</li>
                <li>Fetch API untuk komunikasi server</li>
              </ul>
            </section>

            <section class="about-section">
              <h2>Aksesibilitas</h2>
              <p>
                Aplikasi ini dirancang dengan mempertimbangkan aksesibilitas pengguna, termasuk:
              </p>
              <ul class="about-list">
                <li>Label yang jelas untuk setiap elemen input</li>
                <li>Alternatif teks untuk semua gambar</li>
                <li>Navigasi keyboard lengkap</li>
                <li>Desain responsif untuk semua ukuran layar</li>
              </ul>
            </section>

            <div class="back-link-container">
              <a href="#/" class="back-link">← Kembali ke Beranda</a>
            </div>
          </article>
        </section>
      </main>
    `;
  }

  async afterRender() {
    // No additional initialization needed
  }
}
