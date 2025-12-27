// KAM API functions for managing assigned clients and pending approvals
import apiClient from './api';

// Dashboard
export const getKAMDashboard = async () => {
    const response = await apiClient.get('/kam/dashboard');
    return response;
};

// Clients
export const getAssignedClients = async () => {
    const response = await apiClient.get('/kam/clients');
    return response;
};

export const getClientById = async (clientId) => {
    const response = await apiClient.get(`/kam/clients/${clientId}`);
    return response;
};

// Jobs
export const getClientJobs = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/kam/jobs${params ? `?${params}` : ''}`);
    return response;
};

// Pending Status Changes
export const getPendingStatusChanges = async () => {
    const response = await apiClient.get('/kam/pending-status-changes');
    return response;
};

export const getPendingStatusChangeById = async (id) => {
    const response = await apiClient.get(`/kam/pending-status-changes/${id}`);
    return response;
};

export const approvePendingStatusChange = async (id, notes) => {
    const response = await apiClient.patch(`/kam/pending-status-changes/${id}/approve`, { notes });
    return response;
};

export const rejectPendingStatusChange = async (id, notes) => {
    const response = await apiClient.patch(`/kam/pending-status-changes/${id}/reject`, { notes });
    return response;
};

// Client Applications
export const getClientApplications = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/kam/applications${params ? `?${params}` : ''}`);
    return response;
};

// Job Approvals
export const getPendingJobs = async () => {
    const response = await apiClient.get('/kam/pending-jobs');
    return response;
};

export const approveJob = async (jobId, notes = '') => {
    const response = await apiClient.patch(`/kam/jobs/${jobId}/approve`, { notes });
    return response;
};

export const rejectJob = async (jobId, notes = '') => {
    const response = await apiClient.patch(`/kam/jobs/${jobId}/reject`, { notes });
    return response;
};
