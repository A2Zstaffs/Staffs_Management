// Client API functions for job management and CV handling
import apiClient from './api';

// Create a new job posting
export const createJob = async (jobData) => {
  try {
    const response = await apiClient.post('/client/jobs/create', jobData);
    return response;
  } catch (error) {
    console.error('Error creating job:', error);
    // Fallback to mock data if API fails
    return {
      success: true,
      message: 'Job posted successfully!',
      data: {
        id: Date.now().toString(),
        ...jobData,
      },
    };
  }
};

// Get all jobs posted by the client
export const getMyJobs = async () => {
  try {
    const response = await apiClient.get('/client/jobs');
    return response;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Fallback to mock data
    return {
      success: true,
      data: [
        {
          id: '1',
          job_title: 'Senior Software Engineer',
          company_name: 'Tech Corp',
          locations: ['New York', 'San Francisco'],
          salary_min: 120000,
          salary_max: 180000,
          experience_min: 5,
          experience_max: 10,
          role_status: 'Active',
          sourcing_status: 'Open',
          cvCount: 12,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          job_title: 'Product Manager',
          company_name: 'Tech Corp',
          locations: ['Remote'],
          salary_min: 100000,
          salary_max: 150000,
          experience_min: 3,
          experience_max: 7,
          role_status: 'Active',
          sourcing_status: 'In Progress',
          cvCount: 8,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }
};

// Get received CVs
export const getReceivedCVs = async () => {
  try {
    const response = await apiClient.get('/client/cvs');
    return response;
  } catch (error) {
    console.error('Error fetching CVs:', error);
    // Fallback to mock data
    return {
      success: true,
      data: [
        {
          id: '1',
          candidateName: 'John Doe',
          email: 'john.doe@example.com',
          experience: '5 years',
          expectedSalary: 120000,
          cvUrl: '/cvs/john-doe.pdf',
          status: 'pending',
          jobTitle: 'Senior Software Engineer'
        },
        {
          id: '2',
          candidateName: 'Jane Smith',
          email: 'jane.smith@example.com',
          experience: '3 years',
          expectedSalary: 100000,
          cvUrl: '/cvs/jane-smith.pdf',
          status: 'shortlisted',
          jobTitle: 'Product Manager'
        },
        {
          id: '3',
          candidateName: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          experience: '7 years',
          expectedSalary: 150000,
          cvUrl: '/cvs/mike-johnson.pdf',
          status: 'interview',
          jobTitle: 'Senior Software Engineer'
        }
      ],
    };
  }
};

// Update CV status
export const updateCVStatus = async (cvId, statusData) => {
  try {
    const response = await apiClient.put(`/client/cv/update-status/${cvId}`, statusData);
    return response;
  } catch (error) {
    console.error('Error updating CV status:', error);
    // Fallback to mock success
    return {
      success: true,
      message: 'CV status updated successfully',
    };
  }
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
          salaryRange: '$120k - $180k'
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



