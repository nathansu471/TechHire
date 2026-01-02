"use client";
import React, { useState, useEffect, useMemo } from "react";
import "../globals.css";
import Searchbar from "../components/Searchbar";
import Job from "../components/Job";
import FilterBar from "../components/FilterBar";
import JobListItem from "../components/JobListItem";

interface JobData {
    id: string;
    title: string;
    company: string;
    location: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    salary?: string;
    description: string;
    postedDate: string;
    employmentType: string;
    }

    export default function JobBoardPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        jobType: [] as string[],
        location: [] as string[],
        minSalary: null as number | null,
        maxSalary: null as number | null,
        daysAgo: null as number | null,
    });

    const [allJobs, setAllJobs] = useState<JobData[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch jobs when query changes
    useEffect(() => {
        const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("q", searchQuery);
            const url = `http://localhost:8080/api/jobs/search?${params.toString()}&limit=50`;
            const response = await fetch(url);

            if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(
                `HTTP ${response.status} ${response.statusText}: ${errorBody}`
            );
            }

            const data = await response.json();
            const jobsArray = Array.isArray(data) ? data : [];

            const formattedJobs: JobData[] = jobsArray.map((job: any) => ({
            id: job.id.toString(),
            title: job.title,
            company: job.companyName || "Unknown Company",
            location: job.location,
            salaryMin: job.salaryMin ?? null,
            salaryMax: job.salaryMax ?? null,
            salary:
                job.salaryMin && job.salaryMax
                ? `$${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                : undefined,
            description: job.description || job.descriptionMd || "",
            postedDate: job.datePosted,
            employmentType: job.jobType || "Unknown",
            }));

            setAllJobs(formattedJobs);
            console.log("Sample job:", formattedJobs[0]);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setAllJobs([]);
        } finally {
            setLoading(false);
        }
        };

        fetchJobs();
    }, [searchQuery]);

    //Locations for filter dropdown menu
    const availableLocations = useMemo(() => {
        const locs = allJobs
        .map((job) => job.location)
        .filter((loc): loc is string => !!loc && loc.trim().length > 0);
        return [...new Set(locs)].sort();
    }, [allJobs]);

    const visibleJobs = useMemo(() => {
        const now = new Date();

        return allJobs.filter((job) => {
        // Job type
        if (
            filters.jobType.length > 0 &&
            job.employmentType &&
            !filters.jobType.includes(job.employmentType)
        ) {
            return false;
        }

        // Location
        if (
            filters.location.length > 0 &&
            job.location &&
            job.location !== filters.location[0]
        ) {
            return false;
        }

        // Min salary
        if (
            filters.minSalary !== null &&
            job.salaryMin !== null &&
            job.salaryMin !== undefined &&
            job.salaryMin < filters.minSalary
        ) {
            return false;
        }

        // Max salary
        if (
            filters.maxSalary !== null &&
            job.salaryMax !== null &&
            job.salaryMax !== undefined &&
            job.salaryMax > filters.maxSalary
        ) {
            return false;
        }

        /*
        if (filters.daysAgo !== null && job.postedDate) {
            const cutoff = new Date(
            now.getTime() - filters.daysAgo * 24 * 60 * 60 * 1000
            );
            const posted = new Date(job.postedDate);
            if (posted < cutoff) return false;
        }
            */

        return true;
        });
    }, [allJobs, filters]);

    const selectedJob =
        selectedJobId != null
        ? visibleJobs.find((j) => j.id === selectedJobId) ?? visibleJobs[0]
        : null;

    return (
        <div className="flex flex-col h-screen bg-[var(--background)] text-[var(--foreground)]">
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">Job Board</h2>
            <p className="text-sm text-gray-500 mt-1">
            Find jobs that match your interests
            </p>
        </header>

        <div className="p-4 bg-gray-50 border-b border-gray-200">
            <Searchbar searchQuery={searchQuery} searchChange={setSearchQuery} />
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Filters */}
            <div className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <FilterBar
                filters={filters}
                setFilters={setFilters}
                availableLocations={availableLocations}
            />
            </div>

            {/* Job list */}
            <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
                <h2 className="font-semibold text-gray-700 mb-4">
                {loading ? "Loading..." : `${visibleJobs.length} Jobs Found`}
                </h2>
                <div className="space-y-2">
                {visibleJobs.map((job) => (
                    <JobListItem
                    key={job.id}
                    job={job}
                    isSelected={selectedJobId === job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    />
                ))}
                </div>
            </div>
            </div>

            {/* Job details */}
            <main className="flex-1 overflow-y-auto bg-gray-50 min-w-0">
            <div className="h-full p-4 sm:p-6">
                {selectedJob ? (
                <Job
                    {...selectedJob}
                    onApply={(id: string) => console.log("Applied to job:", id)}
                />
                ) : (
                <div className="text-gray-400 flex items-center justify-center h-full">
                    <div className="text-center">
                    <p className="text-lg">Select a job to view details</p>
                    </div>
                </div>
                )}
            </div>
            </main>
        </div>
        </div>
    );
}
