import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const AUTH_TOKEN_COOKIE = 'auth_token';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Invalid credentials');
    }

    const data: AuthResponse = await response.json();
    this.saveToken(data.access_token, data.expires_in);
    return data;
  }

  static async refresh(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error(await response.json().catch(() => ({ message: 'Refresh failed' })));
      this.removeToken();
      throw new Error('Session expired');
    }

    const data: AuthResponse = await response.json();
    this.saveToken(data.access_token, data.expires_in);
    return data;
  }

  static saveToken(token: string, expiresIn: number): void {
    // Convert expires_in (seconds) to days for cookie expiration
    const expiresInDays = expiresIn / (60 * 60 * 24);
    Cookies.set(AUTH_TOKEN_COOKIE, token, {
      expires: expiresInDays,
      sameSite: 'strict',
      secure: globalThis.location.protocol === 'https:'
    });
  }

  static getToken(): string | undefined {
    return Cookies.get(AUTH_TOKEN_COOKIE);
  }

  static removeToken(): void {
    Cookies.remove(AUTH_TOKEN_COOKIE);
  }

  static async logout(options?: { allDevices: boolean }): Promise<void> {
    const token = this.getToken();

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ allDevices: options?.allDevices }) // Log out from all devices
        });

        if (!response.ok) {
          console.error(await response.json().catch(() => ({ message: 'Logout failed' })));
        }

      } catch (error) {
        // Even if the API call fails, we still want to remove the local token
        console.warn('Logout API call failed:', error);
      }
    }

    // Always remove the token from local storage
    this.removeToken();
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
