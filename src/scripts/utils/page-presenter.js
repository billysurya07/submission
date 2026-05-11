/**
 * Base PagePresenter class for MVP architecture
 */
export default class PagePresenter {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async fetchData() {
    // Override in subclasses
  }

  async handleUserAction(action, data) {
    // Override in subclasses
  }
}
