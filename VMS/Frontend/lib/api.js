// API Configuration and Utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Set auth token in localStorage
  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Remove auth token from localStorage
  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Get user data from localStorage
  getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Set user data in localStorage
  setUser(userData) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  // Remove user data from localStorage
  removeUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData');
    }
  }

  // Make HTTP request with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle token expiration
      if (response.status === 401 && data.message?.includes('token')) {
        this.removeToken();
        this.removeUser();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Upload file with FormData
  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('File Upload Error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Authentication API methods
export const authAPI = {
  // Login user
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);

    if (response.success) {
      apiClient.setToken(response.token);
      // Backend returns 'user' field, not 'data'
      const userData = response.user || response.data;
      apiClient.setUser(userData);

      // Save user name and role in localStorage for easy access
      if (userData && typeof window !== 'undefined') {
        if (userData.fullName) {
          localStorage.setItem('userName', userData.fullName);
        }
        if (userData.role) {
          localStorage.setItem('userRole', userData.role);
        }
      }
    }

    return response;
  },

  // Register user
  async signup(userData) {
    const response = await apiClient.post('/auth/signup', userData);

    if (response.success) {
      apiClient.setToken(response.token);
      // Backend returns 'user' field, not 'data'
      apiClient.setUser(response.user || response.data);
    }

    return response;
  },

  // Get current user
  async getMe() {
    const response = await apiClient.get('/auth/me');
    return response;
  },

  // Update profile
  async updateProfile(profileData) {
    const response = await apiClient.put('/auth/profile', profileData);

    if (response.success) {
      apiClient.setUser(response.data);
    }

    return response;
  },

  // Logout user
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.removeToken();
      apiClient.removeUser();
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiClient.getToken();
  },

  // Get current user data
  getCurrentUser() {
    return apiClient.getUser();
  }
};

// Dashboard API methods
export const dashboardAPI = {
  // Get recruiter dashboard
  async getRecruiterDashboard() {
    return apiClient.get('/dashboard/recruiter');
  },

  // Get client dashboard
  async getClientDashboard() {
    return apiClient.get('/dashboard/client');
  },

  // Get candidate dashboard
  async getCandidateDashboard() {
    return apiClient.get('/dashboard/candidate');
  },

  // Get consultancy dashboard
  async getConsultancyDashboard() {
    return apiClient.get('/dashboard/consultancy');
  },

  // Create job posting
  async createJob(jobData) {
    return apiClient.post('/dashboard/jobs', jobData);
  },

  // Update application status
  async updateApplicationStatus(applicationId, statusData) {
    return apiClient.put(`/dashboard/applications/${applicationId}`, statusData);
  },

  // Apply to job
  async applyToJob(jobId, applicationData) {
    return apiClient.post(`/dashboard/jobs/${jobId}/apply`, applicationData);
  }
};

// Utility functions
export const apiUtils = {
  // Handle API errors consistently
  handleError(error, defaultMessage = 'An error occurred') {
    if (error.message) {
      return error.message;
    }
    return defaultMessage;
  },

  // Format API response for UI
  formatResponse(response) {
    return {
      success: response.success,
      data: response.data,
      message: response.message,
      errors: response.errors
    };
  },

  // Check if response is successful
  isSuccess(response) {
    return response && response.success === true;
  }
};

// Export the API client instance for direct use if needed
export default apiClient;

 