import api from "./api";
import { User } from "../types";

const STORAGE_KEY = "hrm_auth_user";
const TOKEN_KEY = "hrm_auth_token";

export const authService = {
  login: async (identifier: string, password: string): Promise<User> => {
    // Call Flask backend
    const res = await api.post("/auth/login", {
      login_id: identifier,
      password: password,
    });

    const { token, user } = res.data;

    // Store JWT
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    return user;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
};
