// src/pages/jobs/JobDetailPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchJobById,
  applyToJob,
  clearCurrentJob,
} from "@/store/slices/jobSlice";
import { JobType, ExperienceLevel } from "@/types/job.types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { UserRole } from "@/types/auth.types";

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob, loading } = useAppSelector((state) => state.jobs);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
    }

    return () => {
      dispatch(clearCurrentJob());
    };
  }, [id, dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for jobs");
      navigate("/login");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select your resume");
      return;
    }

    if (id) {
      setIsApplying(true);
      try {
        await dispatch(
          applyToJob({ jobId: id, resumeFile: selectedFile }),
        ).unwrap();
        setSelectedFile(null);
      } catch (error) {
        // Error handled by toast in slice
      } finally {
        setIsApplying(false);
      }
    }
  };

  if (loading || !currentJob) {
    return <Loader fullScreen />;
  }

  const getJobTypeLabel = (type: JobType): string => {
    const labels = {
      [JobType.FullTime]: "Full-time",
      [JobType.PartTime]: "Part-time",
      [JobType.Contract]: "Contract",
      [JobType.Internship]: "Internship",
      [JobType.Freelance]: "Freelance",
    };
    return labels[type];
  };

  const getExperienceLevelLabel = (level: ExperienceLevel): string => {
    const labels = {
      [ExperienceLevel.EntryLevel]: "Entry Level",
      [ExperienceLevel.MidLevel]: "Mid Level",
      [ExperienceLevel.Senior]: "Senior",
      [ExperienceLevel.Lead]: "Lead",
      [ExperienceLevel.Executive]: "Executive",
    };
    return labels[level];
  };

  const formatSalary = (min?: number, max?: number): string => {
    if (!min && !max) return "Not specified";
    if (min && max)
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    return `Up to ₹${max?.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          onClick={() => navigate("/jobs")}
          className="mb-6">
          ← Back to Jobs
        </Button>

        <Card>
          {/* Header */}
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentJob.title}
                </h1>
                {currentJob.company && (
                  <p className="text-xl text-gray-600 mt-2">
                    {currentJob.company}
                  </p>
                )}
              </div>
              {!currentJob.isActive && (
                <span className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-full">
                  Position Closed
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {getJobTypeLabel(currentJob.jobType)}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {getExperienceLevelLabel(currentJob.experienceLevel)}
              </span>
              {currentJob.location && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  📍 {currentJob.location}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
              <div>
                <span className="font-semibold text-gray-900">Salary: </span>
                {formatSalary(currentJob.minSalary, currentJob.maxSalary)}
              </div>
              <div>
                Posted{" "}
                {formatDistanceToNow(new Date(currentJob.createdAt), {
                  addSuffix: true,
                })}
              </div>
              {currentJob.deadline && (
                <div className="text-red-600">
                  Apply by: {new Date(currentJob.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Job Description
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {currentJob.description}
            </p>
          </div>

          {/* Skills */}
          {currentJob.skills && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentJob.skills.split(",").map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Section */}
          {currentJob.isActive && user?.roles.includes(UserRole.User) && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Apply for this position
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume (PDF, DOC, DOCX)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {selectedFile.name} (
                      {(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleApply}
                  isLoading={isApplying}
                  disabled={!selectedFile || isApplying}
                  size="lg">
                  Submit Application
                </Button>
              </div>
            </div>
          )}

          {!isAuthenticated && currentJob.isActive && (
            <div className="border-t pt-6">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center">
                <p className="text-gray-700 mb-4">
                  Please login to apply for this job
                </p>
                <Button onClick={() => navigate("/login")}>
                  Login to Apply
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
