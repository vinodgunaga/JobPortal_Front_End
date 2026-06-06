// src/components/jobs/JobFilters.tsx

import React, { useState } from 'react';
import { JobQueryParams, JobType, ExperienceLevel, SortOrder } from '@/types/job.types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface JobFiltersProps {
  onFilterChange: (filters: Partial<JobQueryParams>) => void;
  currentFilters: JobQueryParams;
}

export const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange, currentFilters }) => {
  const [localFilters, setLocalFilters] = useState<Partial<JobQueryParams>>(currentFilters);

  const handleInputChange = (field: keyof JobQueryParams, value: any) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const jobTypeOptions = [
    { value: '', label: 'All Types' },
    { value: JobType.FullTime.toString(), label: 'Full-time' },
    { value: JobType.PartTime.toString(), label: 'Part-time' },
    { value: JobType.Contract.toString(), label: 'Contract' },
    { value: JobType.Internship.toString(), label: 'Internship' },
    { value: JobType.Freelance.toString(), label: 'Freelance' },
  ];

  const experienceOptions = [
    { value: '', label: 'All Levels' },
    { value: ExperienceLevel.EntryLevel.toString(), label: 'Entry Level' },
    { value: ExperienceLevel.MidLevel.toString(), label: 'Mid Level' },
    { value: ExperienceLevel.Senior.toString(), label: 'Senior' },
    { value: ExperienceLevel.Lead.toString(), label: 'Lead' },
    { value: ExperienceLevel.Executive.toString(), label: 'Executive' },
  ];

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Latest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'salary-desc', label: 'Salary (High to Low)' },
    { value: 'salary-asc', label: 'Salary (Low to High)' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Search"
          placeholder="Job title, company, or keywords..."
          value={localFilters.search || ''}
          onChange={(e) => handleInputChange('search', e.target.value)}
        />
      </div>

      <div>
        <Input
          label="Location"
          placeholder="City or remote"
          value={localFilters.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
        />
      </div>

      <div>
        <Select
          label="Job Type"
          options={jobTypeOptions}
          value={localFilters.jobType?.toString() || ''}
          onChange={(e) =>
            handleInputChange('jobType', e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>

      <div>
        <Select
          label="Experience Level"
          options={experienceOptions}
          value={localFilters.experienceLevel?.toString() || ''}
          onChange={(e) =>
            handleInputChange(
              'experienceLevel',
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />
      </div>

      <div>
        <Input
          label="Min Salary"
          type="number"
          placeholder="Minimum salary"
          value={localFilters.minSalary || ''}
          onChange={(e) =>
            handleInputChange('minSalary', e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>

      <div>
        <Input
          label="Max Salary"
          type="number"
          placeholder="Maximum salary"
          value={localFilters.maxSalary || ''}
          onChange={(e) =>
            handleInputChange('maxSalary', e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </div>

      <div>
        <Input
          label="Skills"
          placeholder="e.g., React, Node.js, Python"
          value={localFilters.skills || ''}
          onChange={(e) => handleInputChange('skills', e.target.value)}
          helperText="Comma-separated"
        />
      </div>

      <div>
        <Select
          label="Sort By"
          options={sortOptions}
          value={`${localFilters.sortBy || 'createdAt'}-${localFilters.order === SortOrder.Asc ? 'asc' : 'desc'}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            handleInputChange('sortBy', sortBy);
            handleInputChange('order', order === 'asc' ? SortOrder.Asc : SortOrder.Desc);
          }}
        />
      </div>

      <Button onClick={applyFilters} fullWidth>
        Apply Filters
      </Button>
    </div>
  );
};
