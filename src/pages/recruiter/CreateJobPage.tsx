// src/pages/recruiter/CreateJobPage.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { createJob } from '@/store/slices/jobSlice';
import { CreateJobRequest, JobType, ExperienceLevel } from '@/types/job.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';

export const CreateJobPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobRequest>();

  const onSubmit = async (data: CreateJobRequest) => {
    try {
      await dispatch(createJob(data)).unwrap();
      navigate('/jobs');
    } catch (error) {
      // Error handled by toast
    }
  };

  const jobTypeOptions = [
    { value: JobType.FullTime.toString(), label: 'Full-time' },
    { value: JobType.PartTime.toString(), label: 'Part-time' },
    { value: JobType.Contract.toString(), label: 'Contract' },
    { value: JobType.Internship.toString(), label: 'Internship' },
    { value: JobType.Freelance.toString(), label: 'Freelance' },
  ];

  const experienceOptions = [
    { value: ExperienceLevel.EntryLevel.toString(), label: 'Entry Level' },
    { value: ExperienceLevel.MidLevel.toString(), label: 'Mid Level' },
    { value: ExperienceLevel.Senior.toString(), label: 'Senior' },
    { value: ExperienceLevel.Lead.toString(), label: 'Lead' },
    { value: ExperienceLevel.Executive.toString(), label: 'Executive' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-2 text-gray-600">Fill in the details to create a job listing</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Job Title"
              placeholder="e.g., Senior React Developer"
              error={errors.title?.message}
              {...register('title', {
                required: 'Job title is required',
              })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent border-gray-300"
                placeholder="Describe the role, responsibilities, and requirements..."
                {...register('description', {
                  required: 'Job description is required',
                })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Company Name"
                placeholder="Your company name"
                {...register('company')}
              />

              <Input
                label="Location"
                placeholder="e.g., Bangalore or Remote"
                {...register('location')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Job Type"
                options={jobTypeOptions}
                {...register('jobType')}
              />

              <Select
                label="Experience Level"
                options={experienceOptions}
                {...register('experienceLevel')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Minimum Salary (₹)"
                type="number"
                placeholder="e.g., 50000"
                {...register('minSalary', {
                  valueAsNumber: true,
                })}
              />

              <Input
                label="Maximum Salary (₹)"
                type="number"
                placeholder="e.g., 100000"
                {...register('maxSalary', {
                  valueAsNumber: true,
                })}
              />
            </div>

            <Input
              label="Required Skills"
              placeholder="e.g., React, TypeScript, Node.js"
              helperText="Comma-separated list of skills"
              {...register('skills')}
            />

            <Input
              label="Application Deadline"
              type="date"
              {...register('deadline')}
            />

            <div className="flex gap-4">
              <Button type="submit" isLoading={isSubmitting} className="flex-1">
                Post Job
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/jobs')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
