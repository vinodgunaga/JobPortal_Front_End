import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchJobs,
  setFilters,
  setPage,
  clearFilters,
} from "@/store/slices/jobSlice";
import { JobType, ExperienceLevel, SortOrder } from "@/types/job.types";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { Pagination } from "@/components/ui/Pagination";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";

export const JobListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, pagination, filters, loading } = useAppSelector(
    (state) => state.jobs,
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [dispatch, filters]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="min-h-screen lg:h-screen bg-gray-50 lg:flex lg:flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b lg:flex-shrink-0">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Find Your Dream Job
              </h1>
              <p className="mt-1 text-gray-600">
                {pagination.totalCount} jobs available
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full lg:flex-1 lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:h-full">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${showFilters ? "block" : "hidden"} lg:col-span-1 lg:h-full lg:overflow-y-auto`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              {" "}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700">
                  Clear all
                </button>
              </div>
              <JobFilters
                onFilterChange={handleFilterChange}
                currentFilters={filters}
              />
            </div>
          </aside>

          {/* Job List */}
          <div className="lg:col-span-3 lg:h-full lg:overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size="lg" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={handleClearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                      hasNext={pagination.hasNextPage}
                      hasPrevious={pagination.hasPreviousPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
