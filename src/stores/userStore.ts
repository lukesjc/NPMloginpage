import { defineStore } from 'pinia';
import axios from 'axios';
export const useUserStore = defineStore('user', {
  state: () => ({
    token: null as string | null,
    userId: null as number | null,
    users: [] as any[],
    error: '' as string,
    isLoading: false,
    currentPage: 1,
    totalPages: 2
  }),
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        const res = await axios.post(
          'https://reqres.in/api/login',
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'reqres-free-v1'
            }
          }
        );
        this.token = res.data.token;
        this.error = '';
        console.log('Login token:', this.token);
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Login failed. Please check your credentials.';
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async register(email: string, password: string) {
      try {
        const res = await axios.post(
          'https://reqres.in/api/register',
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'reqres-free-v1'
            }
          }
        );
        if (!res.data.token || !res.data.id) {
          throw new Error('Registration failed. Token or ID not received.');
        }
        this.token = res.data.token;
        this.userId = res.data.id;
        this.error = '';
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Registration failed';
        throw new Error(this.error);
      }
    },
    logout() {
      this.token = null;
      this.userId = null;
      this.users = [];
      this.error = '';
      this.currentPage = 1;
    },
    async loadMoreUsers() {
      if (!this.token) {
        this.error = 'User not authenticated.';
        return;
      }
      this.isLoading = true;
      try {
        const res = await axios.get(`https://reqres.in/api/users?page=${this.currentPage}`, {
          headers: {
            'x-api-key': 'reqres-free-v1',
            'Authorization': `Bearer ${this.token}`
          }
        });
        const newUsers = res.data.data;
        this.users.push(...newUsers);
        this.error = '';
        if (this.currentPage >= this.totalPages) {
          this.currentPage = 1;
        } else {
          this.currentPage++;
        }
      } catch (error) {
        this.error = 'Unable to load users.';
      } finally {
        this.isLoading = false;
      }
    }
  }
});
