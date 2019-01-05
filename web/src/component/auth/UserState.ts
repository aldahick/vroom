const TOKEN_KEY = "auth.token";

export const UserState = new (class {
  public token?: string;

  constructor() {
    this.token = sessionStorage.getItem(TOKEN_KEY) || undefined;
  }

  setToken(token: string) {
    sessionStorage.setItem(TOKEN_KEY, token);
    this.token = token;
  }
})();
