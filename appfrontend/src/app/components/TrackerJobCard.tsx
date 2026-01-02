"use client";
import * as React from "react";
import Image from "next/image";

type TrackerJobCardProps = {
  title: string;
  company: string;
  location: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
};

export default function TrackerJobCard({
  title,
  company,
  location,
  draggable,
  onDragStart,
  onDragEnd,
  isDragging,
}: TrackerJobCardProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={
        "flex justify-center items-center w-full bg-white rounded-lg shadow-md p-4 " +
        "hover:bg-blue-50 hover:shadow-2xl hover:cursor-pointer transition-all duration-200 " +
        (isDragging ? "opacity-0" : "")
      }
    >
      {/* Job Icon */ }
      <div className="flex justify-center items-center rounded w-[60px] h-[60px] bg-blue-300">
        <Image
          src="/icons/jobIcon.svg"
          alt="Logo"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>

      <div className="flex flex-col w-4/5 ml-2">
        {/* Job Title */}
        <h1 className="font-bold truncate text-ellipsis">{title}</h1>

        {/* Company */}
        <div className="flex items-center gap-1">
          <Image src="/globe.svg" alt="icon" width={14} height={14} />
          <h2 className="text-gray-500 truncate text-ellipsis">{company}</h2>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1">
          <Image src="/globe.svg" alt="icon" width={14} height={14} />
          <p className="text-gray-500 truncate text-ellipsis">{location}</p>
        </div>
      </div>
    </div>
  );
}
