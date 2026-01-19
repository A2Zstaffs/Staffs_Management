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
    // Check if API URL is configured
    if (!this.baseURL) {
      const error = new Error('API URL is not configured. Please check your environment variables.');
      console.error('API Configuration Error:', error);
      throw error;
    }

    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && !options.skipAuth && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // Send cookies with cross-origin requests
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Check if response is JSON before parsing
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, get text response
        const text = await response.text();
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }

      // Handle token expiration
      if (response.status === 401 && data.message?.includes('token')) {
        this.removeToken();
        this.removeUser();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      if (!response.ok) {
        // If there are validation errors, include them in the error message
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err =>
            typeof err === 'string' ? err : err.message || `${err.field || ''}: ${err.message || err.msg || ''}`
          ).join(', ');
          throw new Error(errorMessages || data.message || `HTTP error! status: ${response.status}`);
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // Enhanced error handling for connection issues
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        const connectionError = new Error('Cannot connect to the server. Please try again later.');
        console.error('API Connection Error:', connectionError);
        throw connectionError;
      }
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
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
    const response = await apiClient.post('/auth/login', credentials, { skipAuth: true });

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
    const response = await apiClient.post('/auth/signup', userData, { skipAuth: true });

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
  },

  // Get auth token
  getToken() {
    return apiClient.getToken();
  },

  // Google OAuth login/signup
  async googleAuth(idToken, role = 'candidate') {
    const response = await apiClient.post('/auth/google', { idToken, role }, { skipAuth: true });

    if (response.success) {
      apiClient.setToken(response.token);
      const userData = response.user || response.data;
      apiClient.setUser(userData);

      // Save user name and role in localStorage
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
    // If applicationData is FormData, use uploadFile
    if (applicationData instanceof FormData) {
      return apiClient.uploadFile(`/dashboard/jobs/${jobId}/apply`, applicationData);
    }
    return apiClient.post(`/dashboard/jobs/${jobId}/apply`, applicationData);
  },

  // Upload Resume (Profile)
  async uploadResume(formData) {
    return apiClient.uploadFile('/dashboard/candidate/resume', formData);
  }
};

// Admin API methods
export const adminAPI = {
  // Get admin stats
  async getStats() {
    return apiClient.get('/admin/stats');
  },

  // Get all recruiters
  async getRecruiters() {
    return apiClient.get('/admin/recruiters');
  },

  // Get all clients
  async getClients() {
    return apiClient.get('/admin/clients');
  },

  // Get all users (for KAM assignment)
  async getAllUsers() {
    return apiClient.get('/admin/users');
  },

  // Get all jobs
  async getJobs() {
    return apiClient.get('/admin/jobs');
  },

  // Get all profiles/candidates
  async getProfiles() {
    return apiClient.get('/admin/profiles');
  },

  // Get CV pipeline
  async getPipeline() {
    return apiClient.get('/admin/pipeline');
  },

  // Get performance data
  async getPerformance() {
    return apiClient.get('/admin/performance');
  },

  // Update user status (suspend/activate)
  async updateUserStatus(userId, status) {
    return apiClient.patch(`/admin/users/${userId}/status`, { status });
  },

  async createAdmin(adminData) {
    return apiClient.post('/admin/create', adminData);
  },

  // Verify/Approve user
  async verifyUser(userId, role, status) {
    return apiClient.put(`/admin/users/${userId}/verify`, { role, status });
  },

  // Update job status
  async updateJobStatus(jobId, status) {
    return apiClient.patch(`/admin/jobs/${jobId}/status`, { status });
  },

  // Delete profile
  async deleteProfile(profileId) {
    return apiClient.delete(`/profiles/${profileId}`);
  },

  // KAM Management
  async createKam(kamData) {
    return apiClient.post('/admin/kam/create', kamData);
  },

  async getAllKams() {
    return apiClient.get('/admin/kam/users');
  },

  async assignKamRole(userId, permissions) {
    return apiClient.post('/admin/kam/assign-role', { userId, permissions });
  },

  async revokeKamRole(userId) {
    return apiClient.delete(`/admin/kam/${userId}/revoke-role`);
  },

  async getKamClients(kamId) {
    return apiClient.get(`/admin/kam/${kamId}/clients`);
  },

  async assignClientToKam(kamId, clientId, notes) {
    return apiClient.post(`/admin/kam/${kamId}/assign-client`, { clientId, notes });
  },

  async removeClientFromKam(kamId, clientId) {
    return apiClient.delete(`/admin/kam/${kamId}/clients/${clientId}`);
  },

  async getAllKamAssignments(isActive) {
    const query = isActive !== undefined ? `?isActive=${isActive}` : '';
    return apiClient.get(`/admin/kam/assignments${query}`);
  },

  // Recruiter Manager Management
  async createRecruiterManager(rmData) {
    return apiClient.post('/admin/recruiter-manager/create', rmData);
  },

  async getAllRecruiterManagers() {
    return apiClient.get('/admin/recruiter-manager/users');
  },

  async assignRecruiterManagerRole(userId, permissions) {
    return apiClient.post('/admin/recruiter-manager/assign-role', { userId, permissions });
  },

  async revokeRecruiterManagerRole(userId) {
    return apiClient.delete(`/admin/recruiter-manager/${userId}/revoke-role`);
  },

  async getRecruiterManagerRecruiters(rmId) {
    return apiClient.get(`/admin/recruiter-manager/${rmId}/recruiters`);
  },

  async assignRecruiterToRM(rmId, recruiterId, notes) {
    return apiClient.post(`/admin/recruiter-manager/${rmId}/assign-recruiter`, { recruiterId, notes });
  },

  async removeRecruiterFromRM(rmId, recruiterId) {
    return apiClient.delete(`/admin/recruiter-manager/${rmId}/recruiters/${recruiterId}`);
  },

  async getAllRMAssignments(isActive) {
    const query = isActive !== undefined ? `?isActive=${isActive}` : '';
    return apiClient.get(`/admin/recruiter-manager/assignments${query}`);
  }
};

// KAM API methods
export const kamAPI = {
  // Dashboard
  async getDashboard() {
    return apiClient.get('/kam/dashboard');
  },

  // Clients
  async getClients() {
    return apiClient.get('/kam/clients');
  },

  async getClientById(clientId) {
    return apiClient.get(`/kam/clients/${clientId}`);
  },

  // Jobs
  async getJobs(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return apiClient.get(`/kam/jobs${query ? `?${query}` : ''}`);
  },

  async getJobById(jobId) {
    return apiClient.get(`/kam/jobs/${jobId}`);
  },

  // CVs/Profiles
  async getCVs(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return apiClient.get(`/kam/cvs${query ? `?${query}` : ''}`);
  },

  async getCVById(cvId) {
    return apiClient.get(`/kam/cvs/${cvId}`);
  },

  async shortlistCV(cvId, notes) {
    return apiClient.patch(`/kam/cvs/${cvId}/shortlist`, { notes });
  },

  async shareCVWithClient(cvId, message) {
    return apiClient.post(`/kam/cvs/${cvId}/share`, { message });
  },

  // Feedback
  async getFeedback() {
    return apiClient.get('/kam/feedback');
  },

  // Create job on behalf of client
  async createJobForClient(clientId, jobData) {
    return apiClient.post(`/kam/clients/${clientId}/jobs`, jobData);
  }
};

// Jobs API methods
export const jobsAPI = {
  // Get all jobs
  async getAllJobs() {
    return apiClient.get('/jobs');
  },

  // Get job by ID
  async getJobById(jobId) {
    return apiClient.get(`/jobs/${jobId}`);
  },

  // Create job
  async createJob(jobData) {
    return apiClient.post('/jobs', jobData);
  },

  // Update job
  async updateJob(jobId, jobData) {
    return apiClient.put(`/jobs/${jobId}`, jobData);
  },

  // Delete job
  async deleteJob(jobId) {
    return apiClient.delete(`/jobs/${jobId}`);
  }
};

// Profile API methods
export const profileAPI = {
  // Get profiles with optional filters
  async getProfiles(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/profiles?${queryParams}` : '/profiles';
    return apiClient.get(endpoint);
  },

  // Get profile by ID
  async getProfileById(profileId) {
    return apiClient.get(`/profiles/${profileId}`);
  },

  // Upload profile
  async uploadProfile(formData) {
    return apiClient.uploadFile('/profiles/upload', formData);
  },

  // Update profile
  async updateProfile(profileId, profileData) {
    return apiClient.put(`/profiles/${profileId}`, profileData);
  },

  // Delete profile
  async deleteProfile(profileId) {
    return apiClient.delete(`/profiles/${profileId}`);
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

