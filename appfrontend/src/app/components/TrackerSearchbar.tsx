"use client";
import React from "react";
import Image from "next/image";

interface TrackerSearchbarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function TrackerSearchbar({
  value,
  onChange,
  placeholder = "Search jobs by title, company, or keyword...",
  onClear,
}: TrackerSearchbarProps) {
  return (
    <div className="relative w-full mx-auto">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Image src="/icons/search.svg" alt="Search" width={24} height={24} />
      </div>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
      />

      {value.trim().length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      )}
    </div>
  );
}
