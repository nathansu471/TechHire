import React from "react";
import "../globals.css";
import Image from "next/image";

// Define props for Searchbar component
interface SearchbarProps {
    searchQuery: string;
    searchChange: (query: string) => void;
    placeholder?: string;
}

// Searchbar component for job search input
const Searchbar: React.FC<SearchbarProps> = ({
    searchQuery, searchChange, placeholder = "Search jobs by title, company, or keyword...",
        }) => {
            return (
                <div className="relative w-full mx-auto">
                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Image
                        src="/icons/search.svg"
                        alt="Search"
                        width={24}
                        height={24}
                        />
                    </div>

                    {/* Search Input Field */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => searchChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    />
                </div>

            );
};

export default Searchbar;