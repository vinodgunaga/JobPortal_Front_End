// src/services/auth.service.ts

import { apiClient } from "./api";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types/auth.types";

export const authService = {
  async getCurrentUser(): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>("/auth/me");
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", data);
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/register", data);
  },

  async logout(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/refresh", { refreshToken });
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  setToken(token: string): void {
    localStorage.setItem("token", token);
  },

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem("refreshToken", refreshToken);
  },
};
