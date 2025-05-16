import type { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse } from '../types/auth';
import { AUTH_ENDPOINTS } from '../constants/api';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    }
  }

  static setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static removeToken(): void {
    localStorage.removeItem('token');
  }

  static setUser(user: string): void {
    localStorage.setItem('user', user);
  }

  static getUser(): string | null {
    return localStorage.getItem('user');
  }

  static removeUser(): void {
    localStorage.removeItem('user');
  }

  static logout(): void {
    this.removeToken();
    this.removeUser();
  }

  static async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await fetch(AUTH_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed');
    }
  }
}
