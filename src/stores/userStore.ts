import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null as string | null,        // Token can be null initially
    userId: null as number | null,       // Store user ID
    users: [] as any[],                 // Store users (name, email, password) if needed
    error: '' as string,                // Error message
    isLoading: false,                   // Track loading state
  }),

  actions: {
    // Login method to authenticate the user
    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        const res = await axios.post(
          'https://reqres.in/api/login',
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'reqres-free-v1',
            },
          }
        );
        this.token = res.data.token;
        this.error = '';
        console.log('Login token:', this.token);
      } catch (error: any) {
        console.error('Login failed:', error);
        this.error = error.response?.data?.error || 'Login failed. Please check your credentials.';
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    // Register a new user
    async register(email: string, password: string) {
      try {
        // Send only email and password as the API expects
        const res = await axios.post(
          'https://reqres.in/api/register',
          {
            email,
            password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'reqres-free-v1',  
            },
          }
        );

        // Check if the token is received from the response
        if (!res.data.token) {
          throw new Error('Registration failed. Token not received.');
        }

        // Check if the ID is received from the response
        if (!res.data.id) {
          throw new Error('Registration failed. ID not received.');
        }

        // Store the token and userId in the state
        this.token = res.data.token;
        this.userId = res.data.id;

        // Reset any previous errors
        this.error = '';

        console.log('Registration successful. Token:', this.token, 'User ID:', this.userId);
      } catch (error: any) {
        // Handle error and log it
        console.error('Registration failed:', error);

        // Check if the error response contains an error message
        if (error.response) {
          console.error('Error Response:', error.response);
          this.error = error.response?.data?.error || 'Registration failed';
        } else {
          this.error = 'Registration failed. Please try again.';
        }

        // Throw the error after updating the state
        throw new Error(this.error);
      }
    },

    // Logout the user
    logout() {
      this.token = null;   // Set token to null
      this.userId = null;  // Set userId to null
      this.users = [];     // Clear users
      this.error = '';     // Clear error
    },

    // Fetch users (for the dashboard)
    async fetchUsers() {
      this.isLoading = true;
      try {
        if (!this.token) {
          throw new Error('User not authenticated.');
        }

        const res = await axios.get('https://reqres.in/api/users?page=1', {
          headers: {
            'x-api-key': 'reqres-free-v1',
            'Authorization': `Bearer ${this.token}`,
          },
        });
        this.users = res.data.data;
        this.error = '';
      } catch (error) {
        console.error('Fetching users failed:', error);
        this.error = 'Unable to fetch users at the moment.';
      } finally {
        this.isLoading = false;
      }
    },
  },
});
