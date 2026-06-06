// src/components/jobs/JobCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Job, JobType, ExperienceLevel } from '@/types/job.types';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/Card';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const getJobTypeLabel = (type: JobType): string => {
    const labels = {
      [JobType.FullTime]: 'Full-time',
      [JobType.PartTime]: 'Part-time',
      [JobType.Contract]: 'Contract',
      [JobType.Internship]: 'Internship',
      [JobType.Freelance]: 'Freelance',
    };
    return labels[type];
  };

  const getExperienceLevelLabel = (level: ExperienceLevel): string => {
    const labels = {
      [ExperienceLevel.EntryLevel]: 'Entry Level',
      [ExperienceLevel.MidLevel]: 'Mid Level',
      [ExperienceLevel.Senior]: 'Senior',
      [ExperienceLevel.Lead]: 'Lead',
      [ExperienceLevel.Executive]: 'Executive',
    };
    return labels[level];
  };

  const formatSalary = (min?: number, max?: number): string => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    return `Up to ₹${max?.toLocaleString()}`;
  };

  return (
    <Link to={`/jobs/${job.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600">
                  {job.title}
                </h3>
                {job.company && (
                  <p className="text-gray-600 font-medium mt-1">{job.company}</p>
                )}
              </div>
              {!job.isActive && (
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  Closed
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {getJobTypeLabel(job.jobType)}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {getExperienceLevelLabel(job.experienceLevel)}
              </span>
              {job.location && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  📍 {job.location}
                </span>
              )}
            </div>

            <p className="mt-3 text-gray-600 line-clamp-2">{job.description}</p>

            {job.skills && (
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.split(',').slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">
                  {formatSalary(job.minSalary, job.maxSalary)}
                </span>
                <span>
                  Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </span>
              </div>
              {job.deadline && (
                <span className="text-red-600">
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
