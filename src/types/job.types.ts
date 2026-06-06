// src/types/job.types.ts

export enum JobType {
  FullTime = 0,
  PartTime = 1,
  Contract = 2,
  Internship = 3,
  Freelance = 4,
}

export enum ExperienceLevel {
  EntryLevel = 0,
  MidLevel = 1,
  Senior = 2,
  Lead = 3,
  Executive = 4,
}

export enum SortOrder {
  Asc = 0,
  Desc = 1,
}

export interface Job {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  location?: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  minSalary?: number;
  maxSalary?: number;
  company?: string;
  isActive: boolean;
  deadline?: string;
  skills?: string;
}

export interface JobQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  order?: SortOrder;
  search?: string;
  location?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  minSalary?: number;
  maxSalary?: number;
  company?: string;
  isActive?: boolean;
  skills?: string;
  deadlineAfter?: string;
  createdAfter?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  location?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  minSalary?: number;
  maxSalary?: number;
  company?: string;
  deadline?: string;
  skills?: string;
}
