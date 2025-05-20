import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UsersApiResponse {
  data: User[];
  total_pages: number;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    users: [] as User[],
    error: '' as string,
    isLoading: false,
    currentPage: 1,
    totalPages: 1,
  }),

  actions: {
    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        const res = await axios.post<{
          message: string;
          token: string;
          id: string;
          name: string;
          email: string;
          avatar?: string;
        }>('http://localhost:5000/api/login', { email, password });

        this.token = res.data.token;
        this.userId = res.data.id;
        this.persistTokenToLocalStorage(this.token, this.userId);
        this.error = '';

        // Persist token and userId
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.id);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          this.error = err.response.data?.message || 'Login failed';
        } else {
          this.error = 'Login failed';
        }
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async register(name: string, email: string, password: string) {
      this.isLoading = true;
      try {
        const res = await axios.post<{
          message: string;
          token: string;
          id: string;
          name: string;
          email: string;
          avatar?: string;
        }>('http://localhost:5000/api/user/register', {
          name,
          email,
          password,
        });

        this.token = res.data.token;
        this.userId = res.data.id;
        this.error = '';

        // Persist token and userId
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.id);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          this.error = err.response.data?.message || 'Registration failed';
        } else {
          this.error = 'Registration failed';
        }
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.token = null;
      this.userId = null;
      this.users = [];
      this.error = '';
      this.currentPage = 1;
      this.totalPages = 1;
      this.clearTokenFromLocalStorage();
      // Clear from localStorage on logout
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },

    async loadMoreUsers() {
      this.restoreTokenFromLocalStorage();
      if (!this.token) {
        this.error = 'User not authenticated.';
        return;
      }
      if (this.currentPage > this.totalPages) return; // No more pages

      this.isLoading = true;
      try {
        const res = await axios.get<UsersApiResponse>(
          `http://localhost:5000/api/users?page=${this.currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
        this.users.push(...res.data.data);
        this.totalPages = res.data.total_pages;
        this.error = '';

        this.currentPage++;
      } catch {
        this.error = 'Unable to load users.';
      } finally {
        this.isLoading = false;
      }
    },
    persistTokenToLocalStorage(token: string, userId: string) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user_id', userId);
},

restoreTokenFromLocalStorage() {
  const token = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('auth_user_id');
  if (token && userId) {
    this.token = token;
    this.userId = userId;
  }
},

clearTokenFromLocalStorage() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user_id');
}

  },
});
