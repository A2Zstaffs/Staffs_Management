// Recruiter Manager API functions for assigned recruiters and dashboard
import apiClient from './api';

// Dashboard
export const getRecruiterManagerDashboard = async () => {
    const response = await apiClient.get('/recruiter-manager/dashboard');
    return response;
};

// Assigned Recruiters
export const getAssignedRecruiters = async () => {
    const response = await apiClient.get('/recruiter-manager/recruiters');
    return response;
};

export const getRecruiterById = async (recruiterId) => {
    const response = await apiClient.get(`/recruiter-manager/recruiters/${recruiterId}`);
    return response;
};

// Jobs (full access like a recruiter)
export const getJobs = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/recruiter-manager/jobs${params ? `?${params}` : ''}`);
    return response;
};

// Profiles
export const getProfiles = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/recruiter-manager/profiles${params ? `?${params}` : ''}`);
    return response;
};

// Applications
export const getApplications = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/recruiter-manager/applications${params ? `?${params}` : ''}`);
    return response;
};
