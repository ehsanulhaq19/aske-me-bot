export const TOKEN_KEY = 'access_token';

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    // Set in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    
    // Set in cookies
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=2592000`; // 30 days
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Try to get from localStorage first
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) return token;

    // Try to get from cookies
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith(`${TOKEN_KEY}=`));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
}; 