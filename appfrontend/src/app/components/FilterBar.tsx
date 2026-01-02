import React from "react";
import "../globals.css";

interface FilterBarProps {
    filters: {
        jobType: string[];
        location: string[];
        minSalary: number | null;
        maxSalary: number | null;
        daysAgo: number | null;
    };
    setFilters: React.Dispatch<
        React.SetStateAction<{
        jobType: string[];
        location: string[];
        minSalary: number | null;
        maxSalary: number | null;
        daysAgo: number | null;
        }>
    >;
    availableLocations: string[]; // Dynamically generated locations
    }

    const JOB_TYPE_OPTIONS = [
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Contract", value: "contract" },
    { label: "Internship", value: "internship" },
    ];

    const FilterBar: React.FC<FilterBarProps> = ({
    filters,
    setFilters,
    availableLocations,
    }) => {
    const handleJobTypeToggle = (value: string) => {
        setFilters((prev) => ({
        ...prev,
        jobType: prev.jobType.includes(value)
            ? prev.jobType.filter((v) => v !== value)
            : [...prev.jobType, value],
        }));
    };

    const handleSalaryChange = (type: "min" | "max", value: string) => {
        const numValue = value ? parseInt(value) : null;
        setFilters((prev) => ({
        ...prev,
        [type === "min" ? "minSalary" : "maxSalary"]: numValue,
        }));
    };

    const handleLocationChange = (value: string) => {
        setFilters((prev) => ({
        ...prev,
        location: value ? [value] : [],
        }));
    };

    return (
        <div className="h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold tracking-tight text-gray-800">
            Filters
            </h3>
            <p className="text-sm text-gray-500 mt-1">Refine your job search</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            {/* Job Type */}
            <div>
            <h4 className="font-medium text-sm uppercase text-gray-600 mb-3 tracking-wider">
                Job Type
            </h4>
            <div className="space-y-2">
                {JOB_TYPE_OPTIONS.map((opt) => (
                <label
                    key={opt.value}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                >
                    <span className="text-sm text-gray-700">{opt.label}</span>
                    <input
                    type="checkbox"
                    checked={filters.jobType.includes(opt.value)}
                    onChange={() => handleJobTypeToggle(opt.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                    />
                </label>
                ))}
            </div>
            </div>

            {/* Location (dynamic dropdown) */}
            <div>
            <h4 className="font-medium text-sm uppercase text-gray-600 mb-3 tracking-wider">
                Location
            </h4>
            <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                value={filters.location[0] || ""}
                onChange={(e) => handleLocationChange(e.target.value)}
            >
                <option value="">All locations</option>
                {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                    {loc}
                </option>
                ))}
            </select>
            </div>

            {/* Salary */}
            <div>
            <h4 className="font-medium text-sm uppercase text-gray-600 mb-3 tracking-wider">
                Salary Range
            </h4>
            <div className="space-y-3">
                <div>
                <label className="text-xs text-gray-600 mb-1 block">
                    Min Salary
                </label>
                <input
                    type="number"
                    placeholder="e.g., 50000"
                    value={filters.minSalary ?? ""}
                    onChange={(e) => handleSalaryChange("min", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                />
                </div>
                <div>
                <label className="text-xs text-gray-600 mb-1 block">
                    Max Salary
                </label>
                <input
                    type="number"
                    placeholder="e.g., 150000"
                    value={filters.maxSalary ?? ""}
                    onChange={(e) => handleSalaryChange("max", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                />
                </div>
            </div>
            </div>

        </div>

        {/* Clear Filters */}
        <div className="p-5 border-t border-gray-200">
            <button
            onClick={() =>
                setFilters({
                jobType: [],
                location: [],
                minSalary: null,
                maxSalary: null,
                daysAgo: null,
                })
            }
            className="w-full py-2 px-3 text-sm text-blue-600 border border-blue-100 rounded-md hover:bg-blue-50 transition-colors"
            >
            Clear All Filters
            </button>
        </div>
        </div>
    );
};

export default FilterBar;
