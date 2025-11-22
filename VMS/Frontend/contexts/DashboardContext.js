'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { dashboardAPI } from '@/lib/api';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  dashboardData: null,
  isLoading: true,
  error: null,
  lastUpdated: null
};

// Action types
const DASHBOARD_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_DATA: 'SET_DATA',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_APPLICATION_STATUS: 'UPDATE_APPLICATION_STATUS',
  ADD_APPLICATION: 'ADD_APPLICATION',
  REFRESH_DATA: 'REFRESH_DATA'
};

// Reducer function
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case DASHBOARD_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case DASHBOARD_ACTIONS.SET_DATA:
      return {
        ...state,
        dashboardData: action.payload,
        isLoading: false,
        error: null,
        lastUpdated: new Date()
      };

    case DASHBOARD_ACTIONS.SET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case DASHBOARD_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case DASHBOARD_ACTIONS.UPDATE_APPLICATION_STATUS:
      if (!state.dashboardData) return state;
      
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          applications: state.dashboardData.applications?.map(app =>
            app._id === action.payload.applicationId
              ? { ...app, status: action.payload.status }
              : app
          ) || []
        }
      };

    case DASHBOARD_ACTIONS.ADD_APPLICATION:
      if (!state.dashboardData) return state;
      
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          applications: [action.payload, ...(state.dashboardData.applications || [])]
        }
      };

    case DASHBOARD_ACTIONS.REFRESH_DATA:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    default:
      return state;
  }
};

// Create context
const DashboardContext = createContext();

// Dashboard provider component
export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Fetch dashboard data based on user role
  const fetchDashboardData = async () => {
    if (!isAuthenticated || !user) return;

    try {
      dispatch({ type: DASHBOARD_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: DASHBOARD_ACTIONS.CLEAR_ERROR });

      let response;
      switch (user.role) {
        case 'recruiter':
          response = await dashboardAPI.getRecruiterDashboard();
          break;
        case 'client':
          response = await dashboardAPI.getClientDashboard();
          break;
        case 'candidate':
          response = await dashboardAPI.getCandidateDashboard();
          break;
        case 'consultancy':
          response = await dashboardAPI.getConsultancyDashboard();
          break;
        default:
          throw new Error('Invalid user role');
      }

      if (response.success) {
        dispatch({
          type: DASHBOARD_ACTIONS.SET_DATA,
          payload: response.data
        });
      } else {
        dispatch({
          type: DASHBOARD_ACTIONS.SET_ERROR,
          payload: response.message || 'Failed to fetch dashboard data'
        });
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      dispatch({
        type: DASHBOARD_ACTIONS.SET_ERROR,
        payload: error.message || 'Failed to fetch dashboard data'
      });
    }
  };

  // Refresh dashboard data
  const refreshData = async () => {
    dispatch({ type: DASHBOARD_ACTIONS.REFRESH_DATA });
    await fetchDashboardData();
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, statusData) => {
    try {
      const response = await dashboardAPI.updateApplicationStatus(applicationId, statusData);
      
      if (response.success) {
        dispatch({
          type: DASHBOARD_ACTIONS.UPDATE_APPLICATION_STATUS,
          payload: {
            applicationId,
            status: statusData.status
          }
        });
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Apply to job (for candidates)
  const applyToJob = async (jobId, applicationData) => {
    try {
      const response = await dashboardAPI.applyToJob(jobId, applicationData);
      
      if (response.success) {
        dispatch({
          type: DASHBOARD_ACTIONS.ADD_APPLICATION,
          payload: response.data
        });
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Create job (for clients/consultancies)
  const createJob = async (jobData) => {
    try {
      const response = await dashboardAPI.createJob(jobData);
      
      if (response.success) {
        // Refresh dashboard data to include new job
        await refreshData();
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: DASHBOARD_ACTIONS.CLEAR_ERROR });
  };

  // Fetch data when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    } else {
      dispatch({ type: DASHBOARD_ACTIONS.SET_DATA, payload: null });
    }
  }, [isAuthenticated, user]);

  const value = {
    ...state,
    fetchDashboardData,
    refreshData,
    updateApplicationStatus,
    applyToJob,
    createJob,
    clearError
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
};

export default DashboardContext;

