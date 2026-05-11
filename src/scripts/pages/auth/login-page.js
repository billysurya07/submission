import PagePresenter from "../../utils/page-presenter";
import ViewModel from "../../utils/view-model";
import { loginUser } from "../../data/api";
import { setToken, setUser } from "../../utils/storage";

class LoginViewModel extends ViewModel {}

class LoginPresenter extends PagePresenter {
  async handleLogin(email, password) {
    try {
      this.viewModel.setLoading(true);
      this.viewModel.clearError();

      const response = await loginUser(email, password);

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

export default class LoginPage {
  constructor() {
    this.viewModel = new LoginViewModel();
    this.presenter = new LoginPresenter(this.viewModel);
    this.presenter.setView(this);
  }

  async render() {
    return `
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
    `;
  }

  async afterRender() {
    const form = document.querySelector("#login-form");
    const submitButton = document.querySelector("#login-submit");
    const errorMessage = document.querySelector("#error-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = form.querySelector('[name="email"]').value.trim();
      const password = form.querySelector('[name="password"]').value;

      if (!email || !password) {
        errorMessage.textContent = "Email dan password harus diisi";
        return;
      }

      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      errorMessage.textContent = "";

      const success = await this.presenter.handleLogin(email, password);

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
