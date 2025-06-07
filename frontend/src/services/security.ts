import Cookies from 'js-cookie';

export const TOKEN_KEY = 'access_token';

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    Cookies.set(TOKEN_KEY, token, { expires: 7 }); // Expires in 7 days
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getTokenFromCookie = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const getTokenFromLocalStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const getToken = (): string | null | undefined => {
  if (typeof window !== 'undefined') {
    const cookieToken = getTokenFromCookie();
    if (cookieToken) {
      return cookieToken;
    }
  }
  const localStorageToken = getTokenFromLocalStorage();
  if (localStorageToken) {
    return localStorageToken;
  }

  return null;
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
}; 