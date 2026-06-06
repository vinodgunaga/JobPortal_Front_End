// src/services/job.service.ts

import { apiClient } from "./api";
import {
  Job,
  JobQueryParams,
  PagedResult,
  CreateJobRequest,
} from "@/types/job.types";

export const jobService = {
  async getJobs(params: JobQueryParams): Promise<PagedResult<Job>> {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== "",
        )
        .map(([key, value]) => [key, String(value)]),
    ).toString();

    return apiClient.get<PagedResult<Job>>(`/jobs?${queryString}`);
  },

  async getJobById(id: string): Promise<Job> {
    return apiClient.get<Job>(`/jobs/${id}`);
  },

  async createJob(data: CreateJobRequest): Promise<Job> {
    return apiClient.post<Job>("/jobs", data);
  },

  async applyToJob(jobId: string, resumeFile: File): Promise<void> {
    const formData = new FormData();
    formData.append("resume", resumeFile);

    return apiClient.postMultipart(`/jobs/${jobId}/apply`, formData);
  },
};
