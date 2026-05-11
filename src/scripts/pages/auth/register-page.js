import PagePresenter from "../../utils/page-presenter";
import ViewModel from "../../utils/view-model";
import { registerUser } from "../../data/api";
import { setToken, setUser } from "../../utils/storage";

class RegisterViewModel extends ViewModel {}

class RegisterPresenter extends PagePresenter {
  async handleRegister(email, name, password) {
    try {
      this.viewModel.setLoading(true);
      this.viewModel.clearError();

      const response = await registerUser(email, name, password);

      setToken(response.loginResult.token);
      setUser({
        userId: response.loginResult.userId,
        name: response.loginResult.name,
        email: response.loginResult.email,
      });

      this.viewModel.setData(response.loginResult);
      return true;
    } catch (error) {
      this.viewModel.setError(error.message);
      return false;
    } finally {
      this.viewModel.setLoading(false);
    }
  }
}

export default class RegisterPage {
  constructor() {
    this.viewModel = new RegisterViewModel();
    this.presenter = new RegisterPresenter(this.viewModel);
    this.presenter.setView(this);
  }

  async render() {
    return `
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
    `;
  }

  async afterRender() {
    const form = document.querySelector("#register-form");
    const submitButton = document.querySelector("#register-submit");
    const errorMessage = document.querySelector("#error-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const password = form.querySelector('[name="password"]').value;

      if (!name || !email || !password) {
        errorMessage.textContent = "Semua field harus diisi";
        return;
      }

      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      errorMessage.textContent = "";

      const success = await this.presenter.handleRegister(
        email,
        name,
        password,
      );

      if (success) {
        window.location.hash = "#/";
      } else {
        errorMessage.textContent = this.viewModel.error;
        submitButton.disabled = false;
        submitButton.setAttribute("aria-busy", "false");
      }
    });
  }
}
