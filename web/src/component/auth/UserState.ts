const TOKEN_KEY = "auth.token";

export const UserState = new (class {
  public token?: string;

  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY) || undefined;
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.token = token;
  }

  deleteToken() {
    localStorage.removeItem(TOKEN_KEY);
    delete this.token;
  }

  get isAuthenticated() {
    return !!this.token;
  }
})();
