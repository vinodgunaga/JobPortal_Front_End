// src/store/slices/jobSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jobService } from '@/services/job.service';
import { Job, JobQueryParams, PagedResult, CreateJobRequest } from '@/types/job.types';
import { toast } from 'react-hot-toast';

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  pagination: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  filters: JobQueryParams;
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  currentJob: null,
  pagination: {
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  filters: {
    page: 1,
    pageSize: 10,
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params: JobQueryParams, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobs(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (data: CreateJobRequest, { rejectWithValue }) => {
    try {
      const response = await jobService.createJob(data);
      toast.success('Job created successfully!');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const applyToJob = createAsyncThunk(
  'jobs/applyToJob',
  async ({ jobId, resumeFile }: { jobId: string; resumeFile: File }, { rejectWithValue }) => {
    try {
      await jobService.applyToJob(jobId, resumeFile);
      toast.success('Application submitted successfully!');
      return jobId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply to job');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<JobQueryParams>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    clearFilters: (state) => {
      state.filters = { page: 1, pageSize: 10 };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<PagedResult<Job>>) => {
        state.loading = false;
        state.jobs = action.payload.items;
        state.pagination = {
          totalCount: action.payload.totalCount,
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
          hasPreviousPage: action.payload.hasPreviousPage,
          hasNextPage: action.payload.hasNextPage,
        };
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        state.jobs = [action.payload, ...state.jobs];
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Apply to job
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setPage, clearCurrentJob, clearError } = jobSlice.actions;
export default jobSlice.reducer;
