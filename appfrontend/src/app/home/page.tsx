"use client";
import React, { useState } from "react";
import "../globals.css";
import Link from "next/link";
import Searchbar from "@/app/components/Searchbar";

const recommendedJobs = [
	"Full Stack Developer",
	"Internship",
	"Backend Developer",
	"Machine Learning",
	"Software Engineer",
	"Data Scientist",
	"UX Designer",
];

export default function HomePage() {
	const [search, setSearch] = useState("");
	return (
		<div className="p-6">
			<h1 className="flex justify-center items-center mt-20 p-5 text-7xl text-center font-bold">Discover your next CS job</h1>
			<h2 className="flex justify-center items-center mx-50 p-2 text-4xl text-center font-light">Search through thousands of Computer Science and Engineering jobs from top companies</h2>

			{/* add search bar */}
			<div className="mt-10 mx-40">
				<Searchbar
					searchQuery={search}
					searchChange={setSearch}
				/>
			</div> {/* search bar has no functionality yet */}

			{/* recommended jobs buttons */}
			<div className="flex flex-col mx-40 py-10">
				<h1 className="flex justify-start items-center p-4 text-xl font-bold">Popular Job Searches</h1>
				<ul className="flex justify-center items-center gap-4 flex-wrap">
					{recommendedJobs.map((job, index) => (
						<Link href="/" key={index} className="bg-gray-100 rounded-lg text-center px-3 py-2 font-light transition-all duration-200 hover:bg-gray-200">{job}</Link>
					))}
				</ul>

				{/* add load more */}
				<div className="flex justify-center py-6">
					<Link 
						href="/job-board" 
						className="px-5 py-3 text-base font-semibold bg-gray-100 rounded-lg text-center transition-all duration-200 ease-in-out hover:bg-gray-200"
						>Load More
					</Link>
				</div>
			</div>
		</div>
	);
}
