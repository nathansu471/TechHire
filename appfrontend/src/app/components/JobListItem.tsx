import React from 'react';
import '../globals.css';
import Job from './Job';

//Define JobData interface
interface JobData {
    job: {
        id: string;
        title: string;
        company: string;
        location: string;
        salary?: string;
        postedDate: string;
    };
    isSelected: boolean;
    onClick: () => void;
}

// JobListItem component to display job info in the list
const JobListItem: React.FC<JobData> = ({ job, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
                isSelected ? "bg-blue-50 border-2 border-blue-400" : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
            }`}
        >
            
            {/* Job Title */}
            <h3 className="font-semibold text-sm mb-1 truncate">{job.title}</h3>

            {/* Company Name and Location */}
            <p className="text-xs text-gray-600 mb-1">{job.company}</p>

            {/* Location, Salary, and Posted Date */}
            <p className="text-xs text-gray-500">{job.location}</p>
            {job.salary && <p className="text-xs text-green-600 mt-1">{job.salary}</p>}
            <p className="text-xs text-gray-400 mt-2">
                {new Date(job.postedDate).toLocaleDateString()}
            </p>
        </div>
    );
}

export default JobListItem;