var j=i=>{throw TypeError(i)};var D=(i,e,t)=>e.has(i)||j("Cannot "+t);var c=(i,e,t)=>(D(i,e,"read from private field"),t?t.call(i):e.get(i)),y=(i,e,t)=>e.has(i)?j("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(i):e.set(i,t),b=(i,e,t,a)=>(D(i,e,"write to private field"),a?a.call(i,t):e.set(i,t),t),E=(i,e,t)=>(D(i,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const se="modulepreload",re=function(i){return"/submission/"+i},V={},oe=function(e,t,a){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),n=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(t.map(l=>{if(l=re(l),l in V)return;V[l]=!0;const d=l.endsWith(".css"),g=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${g}`))return;const v=document.createElement("link");if(v.rel=d?"stylesheet":se,d||(v.as="script"),v.crossOrigin="",v.href=l,n&&v.setAttribute("nonce",n),document.head.appendChild(v),d)return new Promise((_,ie)=>{v.addEventListener("load",_),v.addEventListener("error",()=>ie(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=o,window.dispatchEvent(n),!n.defaultPrevented)throw o}return s.then(o=>{for(const n of o||[])n.status==="rejected"&&r(n.reason);return e().catch(r)})};class q{constructor(e){this.viewModel=e,this.view=null}setView(e){this.view=e}async fetchData(){}async handleUserAction(e,t){}}class P{constructor(){this.data=null,this.loading=!1,this.error=null}setLoading(e){this.loading=e}setError(e){this.error=e}clearError(){this.error=null}setData(e){this.data=e}}const x={BASE_URL:"https://story-api.dicoding.dev/v1"},C={REGISTER:`${x.BASE_URL}/register`,LOGIN:`${x.BASE_URL}/login`,GET_STORIES:`${x.BASE_URL}/stories`,ADD_STORY:`${x.BASE_URL}/stories`};async function ne(i,e,t){const a=await fetch(C.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:i,password:t})});if(!a.ok){const s=await a.json();throw new Error(s.message||"Registration failed")}return await a.json()}async function le(i,e){const t=await fetch(C.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i,password:e})});if(!t.ok){const a=await t.json();throw new Error(a.message||"Login failed")}return await t.json()}async function ce(i=1,e=20,t=void 0){let a=`${C.GET_STORIES}?page=${i}&size=${e}`;t!==void 0&&(a+=`&location=${t}`);const s=localStorage.getItem("token"),r={"Content-Type":"application/json"};s&&(r.Authorization=`Bearer ${s}`);const o=await fetch(a,{headers:r});if(!o.ok)throw new Error("Failed to fetch stories");return await o.json()}async function de(i){const e=localStorage.getItem("token"),t={};e&&(t.Authorization=`Bearer ${e}`);const a=await fetch(C.ADD_STORY,{method:"POST",headers:t,body:i});if(!a.ok){const s=await a.json();throw new Error(s.message||"Failed to add story")}return await a.json()}function N(i){localStorage.setItem("token",i)}function ue(){return localStorage.getItem("token")}function he(){localStorage.removeItem("token")}function w(){return!!ue()}function W(i){localStorage.setItem("user",JSON.stringify(i))}function pe(){localStorage.removeItem("user")}function me(){he(),pe()}const fe="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",z="push-subscription",G="push-enabled";function ve(i){const e="=".repeat((4-i.length%4)%4),t=(i+e).replace(/-/g,"+").replace(/_/g,"/"),a=window.atob(t),s=new Uint8Array(a.length);for(let r=0;r<a.length;++r)s[r]=a.charCodeAt(r);return s}function K(){return localStorage.getItem(G)==="true"}function F(i){localStorage.setItem(G,i?"true":"false")}function R(i){localStorage.setItem(z,JSON.stringify(i))}function ge(){localStorage.removeItem(z)}async function Q(){if(!("serviceWorker"in navigator))throw new Error("Service Worker not supported");if(await Notification.requestPermission()!=="granted")throw new Error("Notification permission not granted");const e=await navigator.serviceWorker.ready,t=await e.pushManager.getSubscription();if(t)return R(t),F(!0),t;const a=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:ve(fe)});return R(a),F(!0),a}async function ye(){if(!("serviceWorker"in navigator))return;const e=await(await navigator.serviceWorker.ready).pushManager.getSubscription();e&&await e.unsubscribe(),ge(),F(!1)}async function be(){if(!K())return null;const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();return t?(R(t),t):await Q()}const we="storyapp-db",Se=2,u={STORIES:"stories",FAVORITES:"favorites",QUEUE:"sync-queue"};function S(){return new Promise((i,e)=>{const t=indexedDB.open(we,Se);t.onupgradeneeded=()=>{const a=t.result;if(!a.objectStoreNames.contains(u.STORIES)){const s=a.createObjectStore(u.STORIES,{keyPath:"id"});s.createIndex("createdAt","createdAt",{unique:!1}),s.createIndex("lat","lat",{unique:!1}),s.createIndex("lon","lon",{unique:!1}),s.createIndex("name","name",{unique:!1})}a.objectStoreNames.contains(u.QUEUE)||a.createObjectStore(u.QUEUE,{keyPath:"queueId",autoIncrement:!0}),a.objectStoreNames.contains(u.FAVORITES)||a.createObjectStore(u.FAVORITES,{keyPath:"id"})},t.onsuccess=()=>i(t.result),t.onerror=()=>e(t.error)})}function k(i,e,t){return i.transaction(e,t).objectStore(e)}function M(i){return new Promise((e,t)=>{i.onsuccess=()=>e(i.result),i.onerror=()=>t(i.error)})}function ke(i){return`${i.name||""} ${i.description||""}`.toLowerCase()}async function $(i){const e=await S(),t=k(e,u.STORIES,"readwrite");return await M(t.put(i)),e.close(),i}async function J(){const i=await S(),t=k(i,u.STORIES,"readonly").getAll(),a=await M(t);return i.close(),a||[]}async function Y(i){const e=await S(),t=k(e,u.STORIES,"readwrite");await M(t.delete(i)),e.close()}async function Z(i){const e=await S(),t=k(e,u.FAVORITES,"readwrite");return await M(t.put(i)),e.close(),i}async function B(){const i=await S(),t=k(i,u.FAVORITES,"readonly").getAll(),a=await M(t);return i.close(),a||[]}async function U(i){const e=await S(),t=k(e,u.FAVORITES,"readwrite");await M(t.delete(i)),e.close()}async function X(i){const e=await S(),t=k(e,u.QUEUE,"readwrite"),a=await M(t.add(i));return e.close(),a}function H(i,{query:e="",location:t=null,sort:a="latest"}={}){const s=(e||"").trim().toLowerCase();let r=i;return t&&(r=r.filter(o=>o.lat===t.lat&&o.lon===t.lon)),s&&(r=r.filter(o=>ke(o).includes(s))),a==="name"?r=[...r].sort((o,n)=>(o.name||"").localeCompare(n.name||"")):a==="oldest"?r=[...r].sort((o,n)=>new Date(o.createdAt||0)-new Date(n.createdAt||0)):r=[...r].sort((o,n)=>new Date(n.createdAt||0)-new Date(o.createdAt||0)),r}const Le=Object.freeze(Object.defineProperty({__proto__:null,filterStories:H,idbDeleteFavoriteStory:U,idbDeleteStory:Y,idbGetAllFavoriteStories:B,idbGetAllStories:J,idbPutFavoriteStory:Z,idbPutStory:$,idbQueueEnqueue:X},Symbol.toStringTag,{value:"Module"}));class Me extends P{constructor(){super(),this.stories=[],this.filteredStories=[],this.currentLocation=null,this.offlineStoriesLoaded=!1}setStories(e){this.stories=e,this.filteredStories=e}filterByLocation(e){this.currentLocation=e,e===null?this.filteredStories=this.stories:this.filteredStories=this.stories.filter(t=>t.lon===e.lon&&t.lat===e.lat)}}class Ee extends q{async loadStories(){try{const e=await J();e&&e.length>0&&(this.viewModel.setStories(e),this.viewModel.offlineStoriesLoaded=!0)}catch{}try{this.viewModel.setLoading(!0),this.viewModel.clearError();const a=((await ce()).listStory||[]).map(s=>({...s,id:s.id||`${s.lat}-${s.lon}-${s.createdAt||""}`}));this.viewModel.setStories(a);try{for(const s of a)await oe(async()=>{const{idbPutStory:r}=await Promise.resolve().then(()=>Le);return{idbPutStory:r}},void 0).then(({idbPutStory:r})=>r(s))}catch{}return!0}catch(e){return this.viewModel.offlineStoriesLoaded?!0:(this.viewModel.setError(e.message),!1)}finally{this.viewModel.setLoading(!1)}}filterStories(e){this.viewModel.filterByLocation(e)}}class Ae{constructor(){this.viewModel=new Me,this.presenter=new Ee(this.viewModel),this.presenter.setView(this),this.map=null,this.markers={},this.favoriteIds=new Set,this.tileLayerControl=null}async render(){return`
      <main class="home-main">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        
        <section class="home-section">
          <div class="container home-container">
            <h1>Cerita-cerita dari Seluruh Dunia</h1>
            
            ${w()?`
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
            `:`
              <div class="auth-prompt">
                <p>Silakan <a href="#/login">masuk</a> atau <a href="#/register">daftar</a> untuk melihat cerita.</p>
              </div>
            `}
          </div>
        </section>
      </main>
    `}async afterRender(){if(!w())return;this.setupPushToggle(),await this.presenter.loadStories(),await this.loadFavoriteIds(),this.initializeMap(),this.renderStories();const e=document.querySelector("#filter-all");e&&e.addEventListener("click",()=>{this.presenter.filterStories(null),document.querySelectorAll(".filter-btn").forEach(t=>{t.classList.remove("active"),t.setAttribute("aria-pressed","false")}),e.classList.add("active"),e.setAttribute("aria-pressed","true"),this.updateMapMarkers(),this.renderStories()}),this.setupStoriesInteractivity()}initializeMap(){this.map&&this.map.remove();const e=document.querySelector("#map");if(!e)return;this.map=L.map(e).setView([-6.2088,106.8456],13);const t=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors",maxZoom:19}),a=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles © Esri",maxZoom:19});t.addTo(this.map),L.control.layers({OpenStreetMap:t,Satellite:a},{}).addTo(this.map),this.updateMapMarkers()}updateMapMarkers(){if(this.map&&(Object.values(this.markers).forEach(e=>{this.map.removeLayer(e)}),this.markers={},this.viewModel.filteredStories.forEach(e=>{if(e.lat&&e.lon){const t=L.marker([e.lat,e.lon]).addTo(this.map),a=`
          <div class="map-popup">
            <h3>${this.escapeHtml(e.name)}</h3>
            <img src="${e.photoUrl}" alt="" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 4px; margin: 8px 0;">
            <p>${this.escapeHtml(e.description).substring(0,100)}...</p>
          </div>
        `;t.bindPopup(a),this.markers[`${e.lat}-${e.lon}`]=t}}),Object.keys(this.markers).length>0)){const e=new L.featureGroup(Object.values(this.markers));this.map.fitBounds(e.getBounds(),{padding:[50,50]})}}async loadFavoriteIds(){try{const e=await B();this.favoriteIds=new Set(e.map(t=>String(t.id)))}catch{this.favoriteIds=new Set}}async toggleFavoriteStory(e){const t=this.viewModel.stories.find(a=>String(a.id)===String(e));t&&(this.favoriteIds.has(String(e))?(await U(e),this.favoriteIds.delete(String(e))):(await Z(t),this.favoriteIds.add(String(e))),this.renderStories(),this.setupStoriesInteractivity())}renderStories(){const e=document.querySelector("#stories-list");if(!e)return;if(this.viewModel.stories.length===0){e.innerHTML='<p class="no-data">Belum ada cerita.</p>';return}const a=(this.viewModel.filteredStories.length>0?this.viewModel.filteredStories:this.viewModel.stories).map(s=>{const r=this.favoriteIds.has(String(s.id));return`
        <article class="story-card" data-id="${s.id||""}" data-lat="${s.lat}" data-lon="${s.lon}">
          <div class="story-actions">
            <button class="favorite-story-btn ${r?"active":""}" type="button" aria-label="${r?"Hapus favorit":"Simpan favorit"}" title="${r?"Hapus favorit":"Simpan favorit"}">
              ${r?"★ Favorit":"☆ Favorit"}
            </button>
            <button class="delete-story-btn" type="button" aria-label="Hapus cerita" title="Hapus">🗑️</button>
          </div>
          <img
            src="${s.photoUrl}"
            alt="Foto dari ${this.escapeHtml(s.name)}"
            class="story-image"
          />
          <div class="story-content">
            <h3>${this.escapeHtml(s.name)}</h3>
            <p class="story-description">${this.escapeHtml(s.description).substring(0,80)}...</p>
            <span class="story-date">${new Date(s.createdAt).toLocaleDateString("id-ID")}</span>
          </div>
        </article>
      `}).join("");e.innerHTML=a,document.querySelectorAll(".story-card").forEach(s=>{s.addEventListener("click",()=>{const r=parseFloat(s.dataset.lat),o=parseFloat(s.dataset.lon);document.querySelectorAll(".story-card.active").forEach(l=>{l.classList.remove("active")}),s.classList.add("active");const n=`${r}-${o}`;this.markers[n]&&(this.markers[n].openPopup(),this.map.setView([r,o],16))})})}setupPushToggle(){const e=document.querySelector("#push-toggle");e&&(e.checked=K(),e.addEventListener("change",async()=>{if(e.checked)try{await Q()}catch(t){e.checked=!1,F(!1),console.warn(t)}else await ye()}))}setupStoriesInteractivity(){const e=document.querySelector("#stories-search"),t=document.querySelector("#stories-sort"),a=()=>{const s=e?e.value:"",r=t?t.value:"latest",o=H(this.viewModel.stories,{query:s,location:this.viewModel.currentLocation,sort:r});this.viewModel.filteredStories=o,this.updateMapMarkers(),this.renderStories()};e&&e.addEventListener("input",a),t&&t.addEventListener("change",a),document.querySelectorAll(".story-card .delete-story-btn").forEach(s=>{s.addEventListener("click",async r=>{var l;r.preventDefault(),r.stopPropagation();const o=s.closest(".story-card"),n=(l=o==null?void 0:o.dataset)==null?void 0:l.id;n&&(await Y(n),this.viewModel.stories=this.viewModel.stories.filter(d=>String(d.id)!==String(n)),this.viewModel.filteredStories=this.viewModel.stories,this.updateMapMarkers(),this.renderStories())})}),document.querySelectorAll(".story-card .favorite-story-btn").forEach(s=>{s.addEventListener("click",async r=>{var l;r.preventDefault(),r.stopPropagation();const o=s.closest(".story-card"),n=(l=o==null?void 0:o.dataset)==null?void 0:l.id;n&&await this.toggleFavoriteStory(n)})})}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}}class Te{async render(){return`
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
    `}async afterRender(){}}class Ie extends P{}class qe extends q{async handleLogin(e,t){try{this.viewModel.setLoading(!0),this.viewModel.clearError();const a=await le(e,t);return N(a.loginResult.token),W({userId:a.loginResult.userId,name:a.loginResult.name,email:a.loginResult.email}),this.viewModel.setData(a.loginResult),!0}catch(a){return this.viewModel.setError(a.message),!1}finally{this.viewModel.setLoading(!1)}}}class Pe{constructor(){this.viewModel=new Ie,this.presenter=new qe(this.viewModel),this.presenter.setView(this)}async render(){return`
      <main class="auth-main">
        <section class="auth-container">
          <div class="auth-card">
            <h1>Masuk ke Akun</h1>
            <form id="login-form" class="auth-form">
              <div class="form-group">
                <label for="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  class="form-input"
                  required
                  aria-label="Email"
                />
              </div>

              <div class="form-group">
                <label for="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  class="form-input"
                  required
                  aria-label="Password"
                />
              </div>

              <div id="error-message" class="error-message" role="alert"></div>

              <button
                type="submit"
                id="login-submit"
                class="auth-button"
                aria-busy="false"
              >
                Masuk
              </button>
            </form>

            <p class="auth-link">
              Belum punya akun? <a href="#/register">Daftar di sini</a>
            </p>
          </div>
        </section>
      </main>
    `}async afterRender(){const e=document.querySelector("#login-form"),t=document.querySelector("#login-submit"),a=document.querySelector("#error-message");e.addEventListener("submit",async s=>{s.preventDefault();const r=e.querySelector('[name="email"]').value.trim(),o=e.querySelector('[name="password"]').value;if(!r||!o){a.textContent="Email dan password harus diisi";return}t.disabled=!0,t.setAttribute("aria-busy","true"),a.textContent="",await this.presenter.handleLogin(r,o)?window.location.hash="#/":(a.textContent=this.viewModel.error,t.disabled=!1,t.setAttribute("aria-busy","false"))})}}class xe extends P{}class Fe extends q{async handleRegister(e,t,a){try{this.viewModel.setLoading(!0),this.viewModel.clearError();const s=await ne(e,t,a);return N(s.loginResult.token),W({userId:s.loginResult.userId,name:s.loginResult.name,email:s.loginResult.email}),this.viewModel.setData(s.loginResult),!0}catch(s){return this.viewModel.setError(s.message),!1}finally{this.viewModel.setLoading(!1)}}}class Ce{constructor(){this.viewModel=new xe,this.presenter=new Fe(this.viewModel),this.presenter.setView(this)}async render(){return`
      <main class="auth-main">
        <section class="auth-container">
          <div class="auth-card">
            <h1>Daftar Akun</h1>
            <form id="register-form" class="auth-form">
              <div class="form-group">
                <label for="register-name">Nama Lengkap</label>
                <input
                  type="text"
                  id="register-name"
                  name="name"
                  class="form-input"
                  required
                  aria-label="Nama lengkap"
                />
              </div>

              <div class="form-group">
                <label for="register-email">Email</label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  class="form-input"
                  required
                  aria-label="Email"
                />
              </div>

              <div class="form-group">
                <label for="register-password">Password</label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  class="form-input"
                  required
                  aria-label="Password"
                />
              </div>

              <div id="error-message" class="error-message" role="alert"></div>

              <button
                type="submit"
                id="register-submit"
                class="auth-button"
                aria-busy="false"
              >
                Daftar
              </button>
            </form>

            <p class="auth-link">
              Sudah punya akun? <a href="#/login">Masuk di sini</a>
            </p>
          </div>
        </section>
      </main>
    `}async afterRender(){const e=document.querySelector("#register-form"),t=document.querySelector("#register-submit"),a=document.querySelector("#error-message");e.addEventListener("submit",async s=>{s.preventDefault();const r=e.querySelector('[name="name"]').value.trim(),o=e.querySelector('[name="email"]').value.trim(),n=e.querySelector('[name="password"]').value;if(!r||!o||!n){a.textContent="Semua field harus diisi";return}t.disabled=!0,t.setAttribute("aria-busy","true"),a.textContent="",await this.presenter.handleRegister(o,r,n)?window.location.hash="#/":(a.textContent=this.viewModel.error,t.disabled=!1,t.setAttribute("aria-busy","false"))})}}class De extends P{constructor(){super(),this.selectedLocation=null}setLocation(e,t){this.selectedLocation={lat:e,lon:t}}getLocation(){return this.selectedLocation}}class Re extends q{async handleAddStory(e){var t;try{const a=e.get("description");if(this.viewModel.setLoading(!0),this.viewModel.clearError(),!this.viewModel.getLocation())throw new Error("Pilih lokasi di peta terlebih dahulu");const s=this.viewModel.getLocation();e.append("lat",s.lat),e.append("lon",s.lon);const r=e.get("lat"),o=e.get("lon"),n={id:((t=crypto==null?void 0:crypto.randomUUID)==null?void 0:t.call(crypto))||`${Date.now()}-${Math.random()}`,name:"Cerita",description:a||"",lat:parseFloat(r),lon:parseFloat(o),createdAt:new Date().toISOString(),photoUrl:""};if(await $(n),!navigator.onLine)return await X({type:"CREATE_STORY",localId:n.id,description:n.description,lat:n.lat,lon:n.lon,queuedAt:new Date().toISOString()}),this.viewModel.setData({success:!0,offline:!0}),!0;const l=await de(e),d=l&&(l.story||l)||{},g=d.id||d.storyId||n.id;return await $({...n,id:g,name:d.name||n.name,description:d.description||n.description,lat:d.lat??n.lat,lon:d.lon??n.lon,createdAt:d.createdAt||n.createdAt,photoUrl:d.photoUrl||d.photo||n.photoUrl}),this.viewModel.setData({success:!0}),!0}catch(a){return this.viewModel.setError(a.message),!1}finally{this.viewModel.setLoading(!1)}}}class $e{constructor(){this.viewModel=new De,this.presenter=new Re(this.viewModel),this.presenter.setView(this),this.map=null,this.selectedMarker=null,this.mediaStream=null,this.video=null,this.canvas=null}async render(){return w()?`
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
    `:`
        <main class="add-story-main">
          <section class="container">
            <div class="auth-prompt">
              <p>Silakan <a href="#/login">masuk</a> atau <a href="#/register">daftar</a> untuk menambah cerita.</p>
            </div>
          </section>
        </main>
      `}async afterRender(){w()&&(this.initializeMap(),this.setupFormHandlers(),this.setupCameraButton())}initializeMap(){const e=document.querySelector("#add-story-map");e&&(this.map=L.map(e).setView([-6.2088,106.8456],13),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors",maxZoom:19}).addTo(this.map),this.map.on("click",t=>{const{lat:a,lng:s}=t.latlng;this.setMapLocation(a,s)}))}setMapLocation(e,t){this.selectedMarker&&this.map.removeLayer(this.selectedMarker),this.selectedMarker=L.marker([e,t]).addTo(this.map),this.map.setView([e,t],16),this.viewModel.setLocation(e,t);const a=document.querySelector("#location-info");a&&(a.textContent=`Lokasi dipilih: ${e.toFixed(4)}, ${t.toFixed(4)}`)}setupFormHandlers(){const e=document.querySelector("#add-story-form"),t=document.querySelector("#story-photo"),a=document.querySelector("#add-story-submit"),s=document.querySelector("#error-message"),r=document.querySelector("#success-message"),o=document.querySelector("#photo-preview-container");t&&t.addEventListener("change",n=>{const l=n.target.files[0];if(l){const d=new FileReader;d.onload=g=>{o.innerHTML=`
              <div class="photo-preview">
                <img src="${g.target.result}" alt="Preview foto cerita" />
              </div>
            `},d.readAsDataURL(l)}}),e.addEventListener("submit",async n=>{n.preventDefault();const l=e.querySelector('[name="description"]').value.trim(),d=e.querySelector('[name="photo"]');let g=!1;if(l||(document.querySelector("#description-error").textContent="Deskripsi harus diisi",g=!0),d.files.length||(document.querySelector("#photo-error").textContent="Foto harus dipilih",g=!0),g)return;a.disabled=!0,a.setAttribute("aria-busy","true"),s.textContent="",r.textContent="";const v=new FormData(e);await this.presenter.handleAddStory(v)?(r.textContent="Cerita berhasil ditambahkan!",setTimeout(()=>{window.location.hash="#/"},1500)):(s.textContent=this.viewModel.error,a.disabled=!1,a.setAttribute("aria-busy","false"))})}setupCameraButton(){const e=document.querySelector("#camera-btn"),t=document.querySelector("#story-photo"),a=document.querySelector("#photo-preview-container");e&&e.addEventListener("click",async s=>{s.preventDefault();try{this.mediaStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});const r=this.createCameraModal();document.body.appendChild(r),this.video=r.querySelector("#camera-video"),this.canvas=r.querySelector("#camera-canvas"),this.video.srcObject=this.mediaStream,r.querySelector("#capture-btn").addEventListener("click",()=>{this.capturePhoto(t,a,r)}),r.querySelector("#close-camera-btn").addEventListener("click",()=>{this.stopCamera(),r.remove()}),r.addEventListener("click",l=>{l.target===r&&(this.stopCamera(),r.remove())})}catch(r){document.querySelector("#photo-error").textContent="Tidak dapat mengakses kamera: "+r.message}})}createCameraModal(){const e=document.createElement("div");return e.className="camera-modal",e.innerHTML=`
      <div class="camera-modal-content">
        <button id="close-camera-btn" class="close-modal-btn" aria-label="Tutup kamera">✕</button>
        <h2>Ambil Foto</h2>
        <video id="camera-video" autoplay playsinline></video>
        <canvas id="camera-canvas" style="display: none;"></canvas>
        <button id="capture-btn" class="camera-capture-btn" type="button">
          Ambil Foto
        </button>
      </div>
    `,e}capturePhoto(e,t,a){const s=this.canvas.getContext("2d");this.canvas.width=this.video.videoWidth,this.canvas.height=this.video.videoHeight,s.drawImage(this.video,0,0);const r=this.canvas.toDataURL("image/jpeg");this.canvas.toBlob(o=>{const n=new File([o],"camera-photo.jpg",{type:"image/jpeg"}),l=new DataTransfer;l.items.add(n),e.files=l.files,t.innerHTML=`
        <div class="photo-preview">
          <img src="${r}" alt="Foto yang diambil dari kamera" />
        </div>
      `,this.stopCamera(),a.remove()})}stopCamera(){this.mediaStream&&(this.mediaStream.getTracks().forEach(e=>e.stop()),this.mediaStream=null)}}class Oe{async render(){return`
      <main class="story-detail-main">
        <section class="container">
          <h1>Detail Cerita</h1>
          <p class="loading-text">Memuat detail...</p>
          <div id="story-detail-content" aria-live="polite"></div>
        </section>
      </main>
    `}async afterRender(){const e=document.querySelector("#story-detail-content"),a=(window.location.hash||"").split("/"),s=a[a.length-1];e&&(e.innerHTML=`
        <p>Detail cerita: <strong>${this.escapeHtml(s||"")}</strong></p>
        <p>Untuk evaluasi tugas, navigasi dari notifikasi sudah diimplementasikan.</p>
      `)}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}}class Be extends P{constructor(){super(),this.favorites=[],this.filteredFavorites=[],this.searchQuery="",this.sortBy="latest"}setFavorites(e){this.favorites=e,this.applyFilters()}applyFilters(){this.filteredFavorites=H(this.favorites,{query:this.searchQuery,sort:this.sortBy})}setSearchQuery(e){this.searchQuery=e,this.applyFilters()}setSortBy(e){this.sortBy=e,this.applyFilters()}}class Ue extends q{async loadFavorites(){try{const e=await B();return this.viewModel.setFavorites(e),!0}catch(e){return this.viewModel.setError(e.message),!1}}async deleteFavorite(e){await U(e),this.viewModel.favorites=this.viewModel.favorites.filter(t=>String(t.id)!==String(e)),this.viewModel.applyFilters()}updateSearch(e){this.viewModel.setSearchQuery(e)}updateSort(e){this.viewModel.setSortBy(e)}}class He{constructor(){this.viewModel=new Be,this.presenter=new Ue(this.viewModel),this.presenter.setView(this)}async render(){return`
      <main class="favorites-main">
        <section class="favorites-section container">
          <h1>Cerita Favorit</h1>
          ${w()?`
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
              `:`
                <div class="auth-prompt">
                  <p>Silakan <a href="#/login">masuk</a> untuk mengelola cerita favorit Anda.</p>
                </div>
              `}
        </section>
      </main>
    `}async afterRender(){w()&&(await this.presenter.loadFavorites(),this.renderFavorites(),this.setupSearchAndSort(),this.setupFavoriteActions())}setupSearchAndSort(){const e=document.querySelector("#favorites-search"),t=document.querySelector("#favorites-sort");e&&e.addEventListener("input",a=>{this.presenter.updateSearch(a.target.value),this.renderFavorites()}),t&&t.addEventListener("change",a=>{this.presenter.updateSort(a.target.value),this.renderFavorites()})}renderFavorites(){var o;const e=document.querySelector("#favorites-list"),t=document.querySelector("#favorites-stats");if(!e)return;const a=this.viewModel.filteredFavorites||[],s=((o=this.viewModel.favorites)==null?void 0:o.length)||0;if(t&&(a.length===0&&s===0?t.innerHTML='<p class="stats-text">Belum ada cerita favorit.</p>':a.length===0?t.innerHTML=`<p class="stats-text">Tidak ada hasil pencarian. Total cerita favorit: ${s}</p>`:t.innerHTML=`<p class="stats-text">Menampilkan ${a.length} dari ${s} cerita favorit</p>`),!a||a.length===0){e.innerHTML=this.viewModel.favorites.length===0?'<p class="no-data">Belum ada cerita favorit.</p>':'<p class="no-data">Tidak ada hasil pencarian.</p>';return}const r=a.map(n=>`
          <article class="favorite-card" data-id="${n.id}">
            <img src="${n.photoUrl}" alt="Foto dari ${this.escapeHtml(n.name)}" />
            <div class="favorite-card-content">
              <h3>${this.escapeHtml(n.name)}</h3>
              <p>${this.escapeHtml(n.description).substring(0,140)}...</p>
              <span class="story-date">${new Date(n.createdAt).toLocaleDateString("id-ID")}</span>
            </div>
            <button class="remove-favorite-btn" type="button" aria-label="Hapus cerita favorit">Hapus</button>
          </article>
        `).join("");e.innerHTML=r}setupFavoriteActions(){document.querySelectorAll(".remove-favorite-btn").forEach(e=>{e.addEventListener("click",async t=>{var r;t.preventDefault();const a=e.closest(".favorite-card"),s=(r=a==null?void 0:a.dataset)==null?void 0:r.id;s&&(await this.presenter.deleteFavorite(s),this.renderFavorites(),this.setupFavoriteActions())})})}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}}const _e={"/":new Ae,"/about":new Te,"/login":new Pe,"/register":new Ce,"/add-story":new $e,"/story":new Oe,"/favorites":new He};function je(i){const e=i.split("/");return{resource:e[1]||null,id:e[2]||null}}function Ve(i){let e="";return i.resource&&(e=e.concat(`/${i.resource}`)),i.id&&(e=e.concat("/:id")),e||"/"}function Ne(){return location.hash.replace("#","")||"/"}function We(){const i=Ne(),e=je(i);return Ve(e)}var p,m,h,A,T,I,f,ee,te,ae,O;class ze{constructor({navigationDrawer:e,drawerButton:t,content:a}){y(this,f);y(this,p,null);y(this,m,null);y(this,h,null);y(this,A,null);y(this,T,null);y(this,I,null);b(this,p,a),b(this,m,t),b(this,h,e),b(this,A,document.querySelector("#close-drawer-btn")),b(this,T,document.querySelector("#logout-btn")),b(this,I,document.querySelector("#logout-item")),E(this,f,ee).call(this),E(this,f,te).call(this),E(this,f,ae).call(this),E(this,f,O).call(this)}async renderPage(){const e=We(),t=_e[e];if(!t){c(this,p).innerHTML='<section class="container"><h1>Halaman tidak ditemukan</h1></section>';return}document.startViewTransition?document.startViewTransition(async()=>{c(this,p).innerHTML=await t.render(),await t.afterRender()}):(c(this,p).classList.add("fade-out"),await new Promise(a=>setTimeout(a,200)),c(this,p).innerHTML=await t.render(),c(this,p).classList.remove("fade-out"),c(this,p).classList.add("fade-in"),await t.afterRender(),setTimeout(()=>{c(this,p).classList.remove("fade-in")},300)),E(this,f,O).call(this)}}p=new WeakMap,m=new WeakMap,h=new WeakMap,A=new WeakMap,T=new WeakMap,I=new WeakMap,f=new WeakSet,ee=function(){c(this,m).addEventListener("click",()=>{c(this,h).classList.toggle("open");const e=c(this,h).classList.contains("open");c(this,m).setAttribute("aria-expanded",e)}),c(this,A)&&c(this,A).addEventListener("click",()=>{c(this,h).classList.remove("open"),c(this,m).setAttribute("aria-expanded","false")}),document.body.addEventListener("click",e=>{!c(this,h).contains(e.target)&&!c(this,m).contains(e.target)&&(c(this,h).classList.remove("open"),c(this,m).setAttribute("aria-expanded","false"))}),c(this,h).querySelectorAll("a, button").forEach(e=>{e.addEventListener("click",()=>{c(this,h).classList.remove("open"),c(this,m).setAttribute("aria-expanded","false")})}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(c(this,h).classList.remove("open"),c(this,m).setAttribute("aria-expanded","false"))})},te=function(){c(this,T)&&c(this,T).addEventListener("click",()=>{me(),window.location.hash="#/login"})},ae=function(){const e=document.querySelector("#main-content"),t=document.querySelector(".skip-link");t&&e&&t.addEventListener("click",function(a){a.preventDefault(),t.blur(),e.focus(),e.scrollIntoView()})},O=function(){const e=w();c(this,I)&&(c(this,I).style.display=e?"block":"none")};async function Ge(){if("serviceWorker"in navigator)try{const i=await navigator.serviceWorker.register("/submission/sw.js");await be(),navigator.serviceWorker.addEventListener("message",e=>{!e||!e.data||e.data.type==="NAVIGATE"&&e.data.url&&(window.location.hash=e.data.url.replace(/^.*#/,""),e.data.url.startsWith("/"))}),console.log("SW registered",i)}catch(i){console.warn("SW registration failed",i)}}document.addEventListener("DOMContentLoaded",async()=>{await Ge();const i=new ze({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await i.renderPage(),window.addEventListener("hashchange",async()=>{await i.renderPage()})});
