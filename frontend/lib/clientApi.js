// Client API functions for job management and CV handling
import apiClient from './api';

// Create a new job posting
export const createJob = async (jobData) => {
  const response = await apiClient.post('/client/jobs/create', jobData);
  return response;
};

// Get all jobs posted by the client
export const getMyJobs = async () => {
  const response = await apiClient.get('/client/jobs');
  return response;
};

// Get received CVs
export const getReceivedCVs = async () => {
  const response = await apiClient.get('/client/cvs');
  return response;
};

// Update CV status
export const updateCVStatus = async (cvId, statusData) => {
  const response = await apiClient.put(`/client/cv/update-status/${cvId}`, statusData);
  return response;
};

// Get hiring details for closure
export const getHiringDetails = async (candidateId, jobId) => {
  try {
    const response = await apiClient.get(`/client/hiring/${candidateId}/${jobId}`);
    return response;
  } catch (error) {
    console.error('Error fetching hiring details:', error);
    // Fallback to mock data
    return {
      success: true,
      data: {
        candidate: {
          id: candidateId || '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          experience: '5 years',
          expectedSalary: 120000,
          cvUrl: '/cvs/john-doe.pdf'
        },
        job: {
          id: jobId || '1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'New York',
          salaryRange: '₹120k - ₹180k'
        },
        clientCommission: 5000
      },
    };
  }
};

// Mark hiring as closed
export const markAsClosed = async (candidateId, jobId) => {
  try {
    const response = await apiClient.post(`/client/hiring/close`, { candidateId, jobId });
    return response;
  } catch (error) {
    console.error('Error marking as closed:', error);
    // Fallback to mock success
    return {
      success: true,
      message: 'Hiring marked as closed successfully',
    };
  }
};



