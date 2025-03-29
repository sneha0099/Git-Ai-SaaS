import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthState {
  emailofUser: string | null;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
    verify: (email: string, otp: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      emailofUser: null,
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/v1/auth/login",
            { email, password }
          );
          const { user, token } = response.data;
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({ emailofUser: email, user, token, isAuthenticated: true });
          
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },

      register: async (firstName, lastName, email, password) => {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/v1/auth/register",
            { firstName, lastName, email, password }
          );
          const { user } = response.data;
          set({ user });
          set({ emailofUser: email });
        } catch (error) {
          console.error("Registration failed:", error);
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Optionally clear cookies or tokens from storage
      },

      forgotPassword: async (email) => {
        try {
          await axios.post("/api/forgot-password", { email });
        } catch (error) {
          console.error("Forgot password failed:", error);
          throw error;
        }
      },

      resetPassword: async (token, newPassword, confirmPassword) => {
        try {
          await axios.post("/api/reset-password", {
            token,
            newPassword,
            confirmPassword,
          });
        } catch (error) {
          console.error("Reset password failed:", error);
          throw error;
        }
      },

      verify: async (email ,otp) => {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/v1/auth/verify",
            { email,otp }
          );
          const { user } = response.data;
          set({ user });
        } catch (error) {
          console.error("Verify failed:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage", // ✅ Unique key to store in localStorage
      storage: createJSONStorage(() => localStorage), // ✅ Use localStorage
    }
  )
);

export default useAuthStore;
