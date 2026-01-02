import React from "react";
import "../globals.css";

//Define props for Job component
interface JobInfo {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    description: string;
    postedDate: string;
    onApply: (id: string) => void;
}

// Job component to display detailed job information
const Job: React.FC<JobInfo> = ({
    id, title, company, location, salary, description: description, postedDate, onApply,
}) => {
    return (
        <div className="bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            {/* Job Header */}
            <header className="border-b border-gray-100 pb-4 mb-4">
                {/* Job Title */}
                <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h3>
                </div>

                {/* Company and Location */}
                <div>
                    <p className="text-sm text-gray-500 mt-1">{company} - {location}</p>
                </div>

                {/* Salary Info */}
                <div>
                    {salary && <p className="text-sm text-blue-500 font-medium mt-1">Salary: {salary}</p>}
                </div>
            </header>

            <section className="text-sm text-gray-700 leading-relaxed mb-6">
                {/* Job Description */}
                <p className="text-sm text-gray-700 leading-relaxed mb-6">{description}</p>
            </section>

            <div>
                {/* Posted Date */}
                <p className="text-xs text-gray-500">Posted on: {new Date(postedDate).toLocaleDateString()}</p>
            </div>

            {/* Footer with Apply Button */}
            <footer className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                <div>
                    {/* Apply Now Button */}
                    <button onClick={() => onApply(id)} className="mt-2 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-all duration-100">Apply Now</button>
                </div>
            </footer>
        </div>
    );
};

export default Job;