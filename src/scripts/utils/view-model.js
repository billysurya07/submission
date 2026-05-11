/**
 * Base ViewModel class for MVP architecture
 */
export default class ViewModel {
  constructor() {
    this.data = null;
    this.loading = false;
    this.error = null;
  }

  setLoading(state) {
    this.loading = state;
  }

  setError(error) {
    this.error = error;
  }

  clearError() {
    this.error = null;
  }

  setData(data) {
    this.data = data;
  }
}
