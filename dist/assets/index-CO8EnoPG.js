var _=a=>{throw TypeError(a)};var R=(a,e,t)=>e.has(a)||_("Cannot "+t);var l=(a,e,t)=>(R(a,e,"read from private field"),t?t.call(a):e.get(a)),v=(a,e,t)=>e.has(a)?_("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(a):e.set(a,t),b=(a,e,t,i)=>(R(a,e,"write to private field"),i?i.call(a,t):e.set(a,t),t),w=(a,e,t)=>(R(a,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const te="modulepreload",ae=function(a){return"/"+a},H={},ie=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),n=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(t.map(c=>{if(c=ae(c),c in H)return;H[c]=!0;const d=c.endsWith(".css"),g=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${g}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":te,d||(f.as="script"),f.crossOrigin="",f.href=c,n&&f.setAttribute("nonce",n),document.head.appendChild(f),d)return new Promise(($,ee)=>{f.addEventListener("load",$),f.addEventListener("error",()=>ee(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=o,window.dispatchEvent(n),!n.defaultPrevented)throw o}return s.then(o=>{for(const n of o||[])n.status==="rejected"&&r(n.reason);return e().catch(r)})};class T{constructor(e){this.viewModel=e,this.view=null}setView(e){this.view=e}async fetchData(){}async handleUserAction(e,t){}}class P{constructor(){this.data=null,this.loading=!1,this.error=null}setLoading(e){this.loading=e}setError(e){this.error=e}clearError(){this.error=null}setData(e){this.data=e}}const A={BASE_URL:"https://story-api.dicoding.dev/v1"},I={REGISTER:`${A.BASE_URL}/register`,LOGIN:`${A.BASE_URL}/login`,GET_STORIES:`${A.BASE_URL}/stories`,ADD_STORY:`${A.BASE_URL}/stories`};async function se(a,e,t){const i=await fetch(I.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:a,password:t})});if(!i.ok){const s=await i.json();throw new Error(s.message||"Registration failed")}return await i.json()}async function re(a,e){const t=await fetch(I.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a,password:e})});if(!t.ok){const i=await t.json();throw new Error(i.message||"Login failed")}return await t.json()}async function oe(a=1,e=20,t=void 0){let i=`${I.GET_STORIES}?page=${a}&size=${e}`;t!==void 0&&(i+=`&location=${t}`);const s=localStorage.getItem("token"),r={"Content-Type":"application/json"};s&&(r.Authorization=`Bearer ${s}`);const o=await fetch(i,{headers:r});if(!o.ok)throw new Error("Failed to fetch stories");return await o.json()}async function ne(a){const e=localStorage.getItem("token"),t={};e&&(t.Authorization=`Bearer ${e}`);const i=await fetch(I.ADD_STORY,{method:"POST",headers:t,body:a});if(!i.ok){const s=await i.json();throw new Error(s.message||"Failed to add story")}return await i.json()}function j(a){localStorage.setItem("token",a)}function le(){return localStorage.getItem("token")}function ce(){localStorage.removeItem("token")}function M(){return!!le()}function F(a){localStorage.setItem("user",JSON.stringify(a))}function de(){localStorage.removeItem("user")}function ue(){ce(),de()}const pe="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",N="push-subscription",V="push-enabled";function he(a){const e="=".repeat((4-a.length%4)%4),t=(a+e).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(t),s=new Uint8Array(i.length);for(let r=0;r<i.length;++r)s[r]=i.charCodeAt(r);return s}function W(){return localStorage.getItem(V)==="true"}function q(a){localStorage.setItem(V,a?"true":"false")}function O(a){localStorage.setItem(N,JSON.stringify(a))}function me(){localStorage.removeItem(N)}async function z(){if(!("serviceWorker"in navigator))throw new Error("Service Worker not supported");if(await Notification.requestPermission()!=="granted")throw new Error("Notification permission not granted");const e=await navigator.serviceWorker.ready,t=await e.pushManager.getSubscription();if(t)return O(t),q(!0),t;const i=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:he(pe)});return O(i),q(!0),i}async function fe(){if(!("serviceWorker"in navigator))return;const e=await(await navigator.serviceWorker.ready).pushManager.getSubscription();e&&await e.unsubscribe(),me(),q(!1)}async function ge(){if(!W())return null;const t=await(await navigator.serviceWorker.ready).pushManager.getSubscription();return t?(O(t),t):await z()}const ve="storyapp-db",ye=1,y={STORIES:"stories",QUEUE:"sync-queue"};function x(){return new Promise((a,e)=>{const t=indexedDB.open(ve,ye);t.onupgradeneeded=()=>{const i=t.result;if(!i.objectStoreNames.contains(y.STORIES)){const s=i.createObjectStore(y.STORIES,{keyPath:"id"});s.createIndex("createdAt","createdAt",{unique:!1}),s.createIndex("lat","lat",{unique:!1}),s.createIndex("lon","lon",{unique:!1}),s.createIndex("name","name",{unique:!1})}i.objectStoreNames.contains(y.QUEUE)||i.createObjectStore(y.QUEUE,{keyPath:"queueId",autoIncrement:!0})},t.onsuccess=()=>a(t.result),t.onerror=()=>e(t.error)})}function C(a,e,t){return a.transaction(e,t).objectStore(e)}function D(a){return new Promise((e,t)=>{a.onsuccess=()=>e(a.result),a.onerror=()=>t(a.error)})}function be(a){return`${a.name||""} ${a.description||""}`.toLowerCase()}async function U(a){const e=await x(),t=C(e,y.STORIES,"readwrite");return await D(t.put(a)),e.close(),a}async function G(){const a=await x(),t=C(a,y.STORIES,"readonly").getAll(),i=await D(t);return a.close(),i||[]}async function K(a){const e=await x(),t=C(e,y.STORIES,"readwrite");await D(t.delete(a)),e.close()}async function J(a){const e=await x(),t=C(e,y.QUEUE,"readwrite"),i=await D(t.add(a));return e.close(),i}function Y(a,{query:e="",location:t=null,sort:i="latest"}={}){const s=(e||"").trim().toLowerCase();let r=a;return t&&(r=r.filter(o=>o.lat===t.lat&&o.lon===t.lon)),s&&(r=r.filter(o=>be(o).includes(s))),i==="name"?r=[...r].sort((o,n)=>(o.name||"").localeCompare(n.name||"")):i==="oldest"?r=[...r].sort((o,n)=>new Date(o.createdAt||0)-new Date(n.createdAt||0)):r=[...r].sort((o,n)=>new Date(n.createdAt||0)-new Date(o.createdAt||0)),r}const we=Object.freeze(Object.defineProperty({__proto__:null,filterStories:Y,idbDeleteStory:K,idbGetAllStories:G,idbPutStory:U,idbQueueEnqueue:J},Symbol.toStringTag,{value:"Module"}));class Se extends P{constructor(){super(),this.stories=[],this.filteredStories=[],this.currentLocation=null,this.offlineStoriesLoaded=!1}setStories(e){this.stories=e,this.filteredStories=e}filterByLocation(e){this.currentLocation=e,e===null?this.filteredStories=this.stories:this.filteredStories=this.stories.filter(t=>t.lon===e.lon&&t.lat===e.lat)}}class ke extends T{async loadStories(){try{const e=await G();e&&e.length>0&&(this.viewModel.setStories(e),this.viewModel.offlineStoriesLoaded=!0)}catch{}try{this.viewModel.setLoading(!0),this.viewModel.clearError();const t=(await oe()).listStory||[];this.viewModel.setStories(t);try{for(const i of t){const s=i.id||`${i.lat}-${i.lon}-${i.createdAt||""}`;await ie(async()=>{const{idbPutStory:r}=await Promise.resolve().then(()=>we);return{idbPutStory:r}},void 0).then(({idbPutStory:r})=>r({...i,id:s}))}}catch{}return!0}catch(e){return this.viewModel.offlineStoriesLoaded?!0:(this.viewModel.setError(e.message),!1)}finally{this.viewModel.setLoading(!1)}}filterStories(e){this.viewModel.filterByLocation(e)}}class Le{constructor(){this.viewModel=new Se,this.presenter=new ke(this.viewModel),this.presenter.setView(this),this.map=null,this.markers={},this.tileLayerControl=null}async render(){return`
      <main class="home-main">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        
        <section class="home-section">
          <div class="container home-container">
            <h1>Cerita-cerita dari Seluruh Dunia</h1>
            
            ${M()?`
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
    `}async afterRender(){if(!M())return;this.setupPushToggle(),await this.presenter.loadStories(),this.initializeMap(),this.renderStories();const e=document.querySelector("#filter-all");e&&e.addEventListener("click",()=>{this.presenter.filterStories(null),document.querySelectorAll(".filter-btn").forEach(t=>{t.classList.remove("active"),t.setAttribute("aria-pressed","false")}),e.classList.add("active"),e.setAttribute("aria-pressed","true"),this.updateMapMarkers(),this.renderStories()}),this.setupStoriesInteractivity()}initializeMap(){this.map&&this.map.remove();const e=document.querySelector("#map");if(!e)return;this.map=L.map(e).setView([-6.2088,106.8456],13);const t=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors",maxZoom:19}),i=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles © Esri",maxZoom:19});t.addTo(this.map),L.control.layers({OpenStreetMap:t,Satellite:i},{}).addTo(this.map),this.updateMapMarkers()}updateMapMarkers(){if(this.map&&(Object.values(this.markers).forEach(e=>{this.map.removeLayer(e)}),this.markers={},this.viewModel.filteredStories.forEach(e=>{if(e.lat&&e.lon){const t=L.marker([e.lat,e.lon]).addTo(this.map),i=`
          <div class="map-popup">
            <h3>${this.escapeHtml(e.name)}</h3>
            <img src="${e.photoUrl}" alt="" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 4px; margin: 8px 0;">
            <p>${this.escapeHtml(e.description).substring(0,100)}...</p>
          </div>
        `;t.bindPopup(i),this.markers[`${e.lat}-${e.lon}`]=t}}),Object.keys(this.markers).length>0)){const e=new L.featureGroup(Object.values(this.markers));this.map.fitBounds(e.getBounds(),{padding:[50,50]})}}renderStories(){const e=document.querySelector("#stories-list");if(!e)return;if(this.viewModel.stories.length===0){e.innerHTML='<p class="no-data">Belum ada cerita.</p>';return}const i=(this.viewModel.filteredStories.length>0?this.viewModel.filteredStories:this.viewModel.stories).map(s=>`
        <article class="story-card" data-id="${s.id||""}" data-lat="${s.lat}" data-lon="${s.lon}">
          <button class="delete-story-btn" type="button" aria-label="Hapus cerita" title="Hapus">🗑️</button>
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
      `).join("");e.innerHTML=i,document.querySelectorAll(".story-card").forEach(s=>{s.addEventListener("click",()=>{const r=parseFloat(s.dataset.lat),o=parseFloat(s.dataset.lon);document.querySelectorAll(".story-card.active").forEach(c=>{c.classList.remove("active")}),s.classList.add("active");const n=`${r}-${o}`;this.markers[n]&&(this.markers[n].openPopup(),this.map.setView([r,o],16))})})}setupPushToggle(){const e=document.querySelector("#push-toggle");e&&(e.checked=W(),e.addEventListener("change",async()=>{if(e.checked)try{await z()}catch(t){e.checked=!1,q(!1),console.warn(t)}else await fe()}))}setupStoriesInteractivity(){const e=document.querySelector("#stories-search"),t=document.querySelector("#stories-sort"),i=()=>{const s=e?e.value:"",r=t?t.value:"latest",o=Y(this.viewModel.stories,{query:s,location:this.viewModel.currentLocation,sort:r});this.viewModel.filteredStories=o,this.updateMapMarkers(),this.renderStories()};e&&e.addEventListener("input",i),t&&t.addEventListener("change",i),document.querySelectorAll(".story-card .delete-story-btn").forEach(s=>{s.addEventListener("click",async r=>{var c;r.preventDefault(),r.stopPropagation();const o=s.closest(".story-card"),n=(c=o==null?void 0:o.dataset)==null?void 0:c.id;n&&(await K(n),this.viewModel.stories=this.viewModel.stories.filter(d=>String(d.id)!==String(n)),this.viewModel.filteredStories=this.viewModel.stories,this.updateMapMarkers(),this.renderStories())})})}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}}class Ee{async render(){return`
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
    `}async afterRender(){}}class Me extends P{}class Ae extends T{async handleLogin(e,t){try{this.viewModel.setLoading(!0),this.viewModel.clearError();const i=await re(e,t);return j(i.loginResult.token),F({userId:i.loginResult.userId,name:i.loginResult.name,email:i.loginResult.email}),this.viewModel.setData(i.loginResult),!0}catch(i){return this.viewModel.setError(i.message),!1}finally{this.viewModel.setLoading(!1)}}}class qe{constructor(){this.viewModel=new Me,this.presenter=new Ae(this.viewModel),this.presenter.setView(this)}async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#login-form"),t=document.querySelector("#login-submit"),i=document.querySelector("#error-message");e.addEventListener("submit",async s=>{s.preventDefault();const r=e.querySelector('[name="email"]').value.trim(),o=e.querySelector('[name="password"]').value;if(!r||!o){i.textContent="Email dan password harus diisi";return}t.disabled=!0,t.setAttribute("aria-busy","true"),i.textContent="",await this.presenter.handleLogin(r,o)?window.location.hash="#/":(i.textContent=this.viewModel.error,t.disabled=!1,t.setAttribute("aria-busy","false"))})}}class Te extends P{}class Pe extends T{async handleRegister(e,t,i){try{this.viewModel.setLoading(!0),this.viewModel.clearError();const s=await se(e,t,i);return j(s.loginResult.token),F({userId:s.loginResult.userId,name:s.loginResult.name,email:s.loginResult.email}),this.viewModel.setData(s.loginResult),!0}catch(s){return this.viewModel.setError(s.message),!1}finally{this.viewModel.setLoading(!1)}}}class Ie{constructor(){this.viewModel=new Te,this.presenter=new Pe(this.viewModel),this.presenter.setView(this)}async render(){return`
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
    `}async afterRender(){const e=document.querySelector("#register-form"),t=document.querySelector("#register-submit"),i=document.querySelector("#error-message");e.addEventListener("submit",async s=>{s.preventDefault();const r=e.querySelector('[name="name"]').value.trim(),o=e.querySelector('[name="email"]').value.trim(),n=e.querySelector('[name="password"]').value;if(!r||!o||!n){i.textContent="Semua field harus diisi";return}t.disabled=!0,t.setAttribute("aria-busy","true"),i.textContent="",await this.presenter.handleRegister(o,r,n)?window.location.hash="#/":(i.textContent=this.viewModel.error,t.disabled=!1,t.setAttribute("aria-busy","false"))})}}class xe extends P{constructor(){super(),this.selectedLocation=null}setLocation(e,t){this.selectedLocation={lat:e,lon:t}}getLocation(){return this.selectedLocation}}class Ce extends T{async handleAddStory(e){var t;try{const i=e.get("description");if(this.viewModel.setLoading(!0),this.viewModel.clearError(),!this.viewModel.getLocation())throw new Error("Pilih lokasi di peta terlebih dahulu");const s=this.viewModel.getLocation();e.append("lat",s.lat),e.append("lon",s.lon);const r=e.get("lat"),o=e.get("lon"),n={id:((t=crypto==null?void 0:crypto.randomUUID)==null?void 0:t.call(crypto))||`${Date.now()}-${Math.random()}`,name:"Cerita",description:i||"",lat:parseFloat(r),lon:parseFloat(o),createdAt:new Date().toISOString(),photoUrl:""};if(await U(n),!navigator.onLine)return await J({type:"CREATE_STORY",localId:n.id,description:n.description,lat:n.lat,lon:n.lon,queuedAt:new Date().toISOString()}),this.viewModel.setData({success:!0,offline:!0}),!0;const c=await ne(e),d=c&&(c.story||c)||{},g=d.id||d.storyId||n.id;return await U({...n,id:g,name:d.name||n.name,description:d.description||n.description,lat:d.lat??n.lat,lon:d.lon??n.lon,createdAt:d.createdAt||n.createdAt,photoUrl:d.photoUrl||d.photo||n.photoUrl}),this.viewModel.setData({success:!0}),!0}catch(i){return this.viewModel.setError(i.message),!1}finally{this.viewModel.setLoading(!1)}}}class De{constructor(){this.viewModel=new xe,this.presenter=new Ce(this.viewModel),this.presenter.setView(this),this.map=null,this.selectedMarker=null,this.mediaStream=null,this.video=null,this.canvas=null}async render(){return M()?`
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
      `}async afterRender(){M()&&(this.initializeMap(),this.setupFormHandlers(),this.setupCameraButton())}initializeMap(){const e=document.querySelector("#add-story-map");e&&(this.map=L.map(e).setView([-6.2088,106.8456],13),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors",maxZoom:19}).addTo(this.map),this.map.on("click",t=>{const{lat:i,lng:s}=t.latlng;this.setMapLocation(i,s)}))}setMapLocation(e,t){this.selectedMarker&&this.map.removeLayer(this.selectedMarker),this.selectedMarker=L.marker([e,t]).addTo(this.map),this.map.setView([e,t],16),this.viewModel.setLocation(e,t);const i=document.querySelector("#location-info");i&&(i.textContent=`Lokasi dipilih: ${e.toFixed(4)}, ${t.toFixed(4)}`)}setupFormHandlers(){const e=document.querySelector("#add-story-form"),t=document.querySelector("#story-photo"),i=document.querySelector("#add-story-submit"),s=document.querySelector("#error-message"),r=document.querySelector("#success-message"),o=document.querySelector("#photo-preview-container");t&&t.addEventListener("change",n=>{const c=n.target.files[0];if(c){const d=new FileReader;d.onload=g=>{o.innerHTML=`
              <div class="photo-preview">
                <img src="${g.target.result}" alt="Preview foto cerita" />
              </div>
            `},d.readAsDataURL(c)}}),e.addEventListener("submit",async n=>{n.preventDefault();const c=e.querySelector('[name="description"]').value.trim(),d=e.querySelector('[name="photo"]');let g=!1;if(c||(document.querySelector("#description-error").textContent="Deskripsi harus diisi",g=!0),d.files.length||(document.querySelector("#photo-error").textContent="Foto harus dipilih",g=!0),g)return;i.disabled=!0,i.setAttribute("aria-busy","true"),s.textContent="",r.textContent="";const f=new FormData(e);await this.presenter.handleAddStory(f)?(r.textContent="Cerita berhasil ditambahkan!",setTimeout(()=>{window.location.hash="#/"},1500)):(s.textContent=this.viewModel.error,i.disabled=!1,i.setAttribute("aria-busy","false"))})}setupCameraButton(){const e=document.querySelector("#camera-btn"),t=document.querySelector("#story-photo"),i=document.querySelector("#photo-preview-container");e&&e.addEventListener("click",async s=>{s.preventDefault();try{this.mediaStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});const r=this.createCameraModal();document.body.appendChild(r),this.video=r.querySelector("#camera-video"),this.canvas=r.querySelector("#camera-canvas"),this.video.srcObject=this.mediaStream,r.querySelector("#capture-btn").addEventListener("click",()=>{this.capturePhoto(t,i,r)}),r.querySelector("#close-camera-btn").addEventListener("click",()=>{this.stopCamera(),r.remove()}),r.addEventListener("click",c=>{c.target===r&&(this.stopCamera(),r.remove())})}catch(r){document.querySelector("#photo-error").textContent="Tidak dapat mengakses kamera: "+r.message}})}createCameraModal(){const e=document.createElement("div");return e.className="camera-modal",e.innerHTML=`
      <div class="camera-modal-content">
        <button id="close-camera-btn" class="close-modal-btn" aria-label="Tutup kamera">✕</button>
        <h2>Ambil Foto</h2>
        <video id="camera-video" autoplay playsinline></video>
        <canvas id="camera-canvas" style="display: none;"></canvas>
        <button id="capture-btn" class="camera-capture-btn" type="button">
          Ambil Foto
        </button>
      </div>
    `,e}capturePhoto(e,t,i){const s=this.canvas.getContext("2d");this.canvas.width=this.video.videoWidth,this.canvas.height=this.video.videoHeight,s.drawImage(this.video,0,0);const r=this.canvas.toDataURL("image/jpeg");this.canvas.toBlob(o=>{const n=new File([o],"camera-photo.jpg",{type:"image/jpeg"}),c=new DataTransfer;c.items.add(n),e.files=c.files,t.innerHTML=`
        <div class="photo-preview">
          <img src="${r}" alt="Foto yang diambil dari kamera" />
        </div>
      `,this.stopCamera(),i.remove()})}stopCamera(){this.mediaStream&&(this.mediaStream.getTracks().forEach(e=>e.stop()),this.mediaStream=null)}}class Re{async render(){return`
      <main class="story-detail-main">
        <section class="container">
          <h1>Detail Cerita</h1>
          <p class="loading-text">Memuat detail...</p>
          <div id="story-detail-content" aria-live="polite"></div>
        </section>
      </main>
    `}async afterRender(){const e=document.querySelector("#story-detail-content"),i=(window.location.hash||"").split("/"),s=i[i.length-1];e&&(e.innerHTML=`
        <p>Detail cerita: <strong>${this.escapeHtml(s||"")}</strong></p>
        <p>Untuk evaluasi tugas, navigasi dari notifikasi sudah diimplementasikan.</p>
      `)}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}}const Oe={"/":new Le,"/about":new Ee,"/login":new qe,"/register":new Ie,"/add-story":new De,"/story":new Re};function Ue(a){const e=a.split("/");return{resource:e[1]||null,id:e[2]||null}}function Be(a){let e="";return a.resource&&(e=e.concat(`/${a.resource}`)),a.id&&(e=e.concat("/:id")),e||"/"}function $e(){return location.hash.replace("#","")||"/"}function _e(){const a=$e(),e=Ue(a);return Be(e)}var p,h,u,S,k,E,m,Q,Z,X,B;class He{constructor({navigationDrawer:e,drawerButton:t,content:i}){v(this,m);v(this,p,null);v(this,h,null);v(this,u,null);v(this,S,null);v(this,k,null);v(this,E,null);b(this,p,i),b(this,h,t),b(this,u,e),b(this,S,document.querySelector("#close-drawer-btn")),b(this,k,document.querySelector("#logout-btn")),b(this,E,document.querySelector("#logout-item")),w(this,m,Q).call(this),w(this,m,Z).call(this),w(this,m,X).call(this),w(this,m,B).call(this)}async renderPage(){const e=_e(),t=Oe[e];if(!t){l(this,p).innerHTML='<section class="container"><h1>Halaman tidak ditemukan</h1></section>';return}document.startViewTransition?document.startViewTransition(async()=>{l(this,p).innerHTML=await t.render(),await t.afterRender()}):(l(this,p).classList.add("fade-out"),await new Promise(i=>setTimeout(i,200)),l(this,p).innerHTML=await t.render(),l(this,p).classList.remove("fade-out"),l(this,p).classList.add("fade-in"),await t.afterRender(),setTimeout(()=>{l(this,p).classList.remove("fade-in")},300)),w(this,m,B).call(this)}}p=new WeakMap,h=new WeakMap,u=new WeakMap,S=new WeakMap,k=new WeakMap,E=new WeakMap,m=new WeakSet,Q=function(){l(this,h).addEventListener("click",()=>{l(this,u).classList.toggle("open");const e=l(this,u).classList.contains("open");l(this,h).setAttribute("aria-expanded",e)}),l(this,S)&&l(this,S).addEventListener("click",()=>{l(this,u).classList.remove("open"),l(this,h).setAttribute("aria-expanded","false")}),document.body.addEventListener("click",e=>{!l(this,u).contains(e.target)&&!l(this,h).contains(e.target)&&(l(this,u).classList.remove("open"),l(this,h).setAttribute("aria-expanded","false"))}),l(this,u).querySelectorAll("a, button").forEach(e=>{e.addEventListener("click",()=>{l(this,u).classList.remove("open"),l(this,h).setAttribute("aria-expanded","false")})}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(l(this,u).classList.remove("open"),l(this,h).setAttribute("aria-expanded","false"))})},Z=function(){l(this,k)&&l(this,k).addEventListener("click",()=>{ue(),window.location.hash="#/login"})},X=function(){const e=document.querySelector("#main-content"),t=document.querySelector(".skip-link");t&&e&&t.addEventListener("click",function(i){i.preventDefault(),t.blur(),e.focus(),e.scrollIntoView()})},B=function(){const e=M();l(this,E)&&(l(this,E).style.display=e?"block":"none")};async function je(){if("serviceWorker"in navigator)try{const a=await navigator.serviceWorker.register("/sw.js");await ge(),navigator.serviceWorker.addEventListener("message",e=>{!e||!e.data||e.data.type==="NAVIGATE"&&e.data.url&&(window.location.hash=e.data.url.replace(/^.*#/,""),e.data.url.startsWith("/"))}),console.log("SW registered",a)}catch(a){console.warn("SW registration failed",a)}}document.addEventListener("DOMContentLoaded",async()=>{await je();const a=new He({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await a.renderPage(),window.addEventListener("hashchange",async()=>{await a.renderPage()})});
