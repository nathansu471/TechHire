"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../globals.css";
import TrackerJobCard from "@/app/components/TrackerJobCard";
import TrackerSearchbar from "@/app/components/TrackerSearchbar";
import ViewDropdown from "@/app/components/DropdownList";
import AddNewJob, { JobFormValues } from "@/app/components/AddNewJob";

const IconChevronDown = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function TrackerPage() {
  const [search, setSearch] = useState("");

  const columns = ["saved", "applied", "interviewing", "offer", "rejected"] as const;
  type ColumnKey = (typeof columns)[number];

  const tabs = ["Active", "Archived"] as const;
  type TabKey = (typeof tabs)[number];

  type SourceBucket = "active" | "archived";

  const [activeTab, setActiveTab] = useState<TabKey>("Active");
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number } | null>(
    null
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [closeMenus, setCloseMenus] = useState(0);

  // View mode shared by both tabs
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  // Visible columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>([...columns]);
  const handleVisibleChange = (value: string | string[]) => {
    if (Array.isArray(value)) setVisibleColumns(value);
  };
  const isVisible = (key: string) => visibleColumns.includes(key);

  // Jobs state
  type Job = {
    id: string;
    title: string;
    company: string;
    location: string;
    jobType: string;
    status: ColumnKey;
  };

  // Active and archived jobs
  const [activeJobs, setActiveJobs] = useState<Record<ColumnKey, Job[]>>({
    saved: [],
    applied: [],
    interviewing: [],
    offer: [],
    rejected: [],
  });

  const [archivedJobs, setArchivedJobs] = useState<Record<ColumnKey, Job[]>>({
    saved: [],
    applied: [],
    interviewing: [],
    offer: [],
    rejected: [],
  });

  // Drag state
  const [dragging, setDragging] = useState<{
    source: SourceBucket;
    fromStatus: ColumnKey;
    id: string;
  } | null>(null);

  // Add job modal
  const [openAdd, setOpenAdd] = useState(false);

  // Helpers
  const genId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const handleCreate = (v: JobFormValues) => {
    const j: Job = { id: genId(), ...v, status: v.status as ColumnKey };
    setActiveJobs((prev) => ({ ...prev, [j.status]: [j, ...prev[j.status]] }));
  };

  const totalActiveJobs = Object.values(activeJobs).reduce((sum, arr) => sum + arr.length, 0);
  const totalArchivedJobs = Object.values(archivedJobs).reduce((sum, arr) => sum + arr.length, 0);

  // Tracker Searchbar logic
  const searchTokens = useMemo(
    () => search.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [search]
  );

  const jobMatches = useCallback(
    (job: Job) => {
      if (searchTokens.length === 0) return true;
      const haystack =
        `${job.title} ${job.company} ${job.location} ${job.jobType} ${job.status}`.toLowerCase();
      return searchTokens.every((t) => haystack.includes(t));
    },
    [searchTokens]
  );

  // Archive a single job
  const archiveJob = (id: string, status: ColumnKey) => {
    setActiveJobs((prevActive) => {
      const jobToArchive = prevActive[status].find((j) => j.id === id);
      if (!jobToArchive) return prevActive;

      setArchivedJobs((prevArch) => {
        const existingIds = new Set(prevArch[status].map((j) => j.id));
        if (existingIds.has(jobToArchive.id)) return prevArch;

        return {
          ...prevArch,
          [status]: [jobToArchive, ...prevArch[status]],
        };
      });

      return {
        ...prevActive,
        [status]: prevActive[status].filter((j) => j.id !== id),
      };
    });
  };

  // Archive all active jobs
  const archiveAll = () => {
    setActiveJobs((prevActive) => {
      const hasAny = columns.some((c) => prevActive[c].length > 0);
      if (!hasAny) return prevActive;

      setArchivedJobs((prevArch) => {
        const nextArch: Record<ColumnKey, Job[]> = { ...prevArch };

        columns.forEach((col) => {
          const existingIds = new Set(prevArch[col].map((j) => j.id));
          const newOnes = prevActive[col].filter((j) => !existingIds.has(j.id));
          nextArch[col] = [...newOnes, ...prevArch[col]];
        });

        return nextArch;
      });

      return {
        saved: [],
        applied: [],
        interviewing: [],
        offer: [],
        rejected: [],
      };
    });
  };

  // Dragging handlers
  const handleDragStart = (job: Job) => {
    const source: SourceBucket = activeTab === "Active" ? "active" : "archived";
    setDragging({ source, fromStatus: job.status, id: job.id });
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  const handleDropOnColumn = (targetStatus: ColumnKey) => {
    if (!dragging) return;
    if (dragging.fromStatus === targetStatus) {
      setDragging(null);
      return;
    }

    if (dragging.source === "active") {
      setActiveJobs((prev) => {
        const fromList = prev[dragging.fromStatus];
        const job = fromList.find((j) => j.id === dragging.id);
        if (!job) return prev;

        const newFrom = fromList.filter((j) => j.id !== dragging.id);
        const newTo = [{ ...job, status: targetStatus }, ...prev[targetStatus]];

        return {
          ...prev,
          [dragging.fromStatus]: newFrom,
          [targetStatus]: newTo,
        };
      });
    } else {
      setArchivedJobs((prev) => {
        const fromList = prev[dragging.fromStatus];
        const job = fromList.find((j) => j.id === dragging.id);
        if (!job) return prev;

        const newFrom = fromList.filter((j) => j.id !== dragging.id);
        const newTo = [{ ...job, status: targetStatus }, ...prev[targetStatus]];

        return {
          ...prev,
          [dragging.fromStatus]: newFrom,
          [targetStatus]: newTo,
        };
      });
    }

    setDragging(null);
  };

  // Flatten for list view (and apply visible columns + search)
  const activeListRows = useMemo(() => {
    const rows = columns.flatMap((col) => activeJobs[col]);
    return rows.filter((j) => isVisible(j.status)).filter(jobMatches);
  }, [activeJobs, visibleColumns, jobMatches]);

  const archivedListRows = useMemo(() => {
    const rows = columns.flatMap((col) => archivedJobs[col]);
    return rows.filter((j) => isVisible(j.status)).filter(jobMatches);
  }, [archivedJobs, visibleColumns, jobMatches]);

  const currentListRows = activeTab === "Active" ? activeListRows : archivedListRows;
  const currentJobsByColumn = activeTab === "Active" ? activeJobs : archivedJobs;
  const currentBucket: SourceBucket = activeTab === "Active" ? "active" : "archived";
  const hasActiveSearch = searchTokens.length > 0;

  // Sliding underline like navbar
  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t === activeTab);
    const activeButton = tabRefs.current[activeIndex];

    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      const parentRect = activeButton.parentElement?.getBoundingClientRect();
      setUnderlineStyle({
        left: rect.left - (parentRect?.left || 0),
        width: rect.width,
      });
    } else {
      setUnderlineStyle(null);
    }
  }, [activeTab]);

  // List view column config options
  const LIST_COLUMNS: Array<{
    key: keyof Job;
    header: string;
    tdClass?: string;
  }> = [
    { key: "title", header: "Role", tdClass: "font-medium" },
    { key: "company", header: "Company", tdClass: "text-gray-700" },
    { key: "location", header: "Location", tdClass: "text-gray-700" },
    { key: "jobType", header: "Type", tdClass: "text-gray-700" },
    { key: "status", header: "Status", tdClass: "capitalize" },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="border-b border-gray-200">
        <h1 className="text-2xl font-semibold tracking-tight ml-6 mt-4">Job Tracker</h1>

        <div className="flex flex-row items-center gap-5 h-10">
          <h2 className="font-medium text-gray-600 ml-6">
            {activeTab === "Active"
              ? `${totalActiveJobs} Total Jobs`
              : `${totalArchivedJobs} Total Jobs`}
          </h2>

          {/* Tabs with sliding underline */}
          <div className="flex mx-5 gap-10 h-full relative">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                onClick={() => {
                  setActiveTab(tab);
                  setCloseMenus((n) => n + 1);
                }}
                className={`relative group font-semibold transition-colors duration-200 cursor-pointer ${
                  activeTab === tab ? "text-black" : "text-gray-600 hover:text-black"
                }`}
              >
                {tab}
                {/* Hover underline */}
                <span className="absolute left-0 bottom-0 h-0.5 bg-blue-400 rounded-full transition-all duration-200 w-0 group-hover:w-full" />
              </button>
            ))}

            {/* Sliding underline */}
            {underlineStyle && (
              <span
                className="pointer-events-none absolute bottom-0 h-0.5 bg-blue-400 rounded-full transition-all duration-400 ease-in-out"
                style={{
                  left: `${underlineStyle.left}px`,
                  width: `${underlineStyle.width}px`,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tracker Search Bar */}
      <div className="mt-5 mx-5">
        <TrackerSearchbar value={search} onChange={setSearch} />
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center ml-5 h-15 gap-5">
          {activeTab === "Active" && (
            <>
              <button className="cursor-pointer text-white bg-blue-400 rounded px-2 py-1 transition-all duration-200 hover:bg-blue-500">
                Manage Jobs
              </button>

              <button
                onClick={archiveAll}
                className="cursor-pointer text-white bg-blue-400 rounded px-2 py-1 transition-all duration-200 hover:bg-blue-500"
              >
                Archive all
              </button>
            </>
          )}

          {/* View type dropdown */}
          <ViewDropdown
            defaultValue="card"
            items={[
              { label: "Card View", value: "card" },
              { label: "List View", value: "list" },
            ]}
            onChange={(val) => {
              if (typeof val === "string" && (val === "card" || val === "list")) {
                setViewMode(val);
              }
            }}
            width="w-32"
          />

          {/* Visible columns dropdown */}
          <ViewDropdown
            defaultValue={[...columns]}
            listType="checklist"
            checklistLabel="Visible columns"
            items={[
              { label: "Saved", value: "saved" },
              { label: "Applied", value: "applied" },
              { label: "Interviewing", value: "interviewing" },
              { label: "Offer", value: "offer" },
              { label: "Rejected", value: "rejected" },
            ]}
            onChange={handleVisibleChange}
            width="w-42"
            closeOn={closeMenus}
          />
        </div>

        {/* Add New Job, only on Active tab */}
        <div className="flex justify-center items-center">
          {activeTab === "Active" && (
            <button
              onClick={() => setOpenAdd(true)}
              className="cursor-pointer text-white bg-blue-400 rounded px-2 py-1 transition-all duration-200 hover:bg-blue-500 mr-5"
            >
              + Add New Job
            </button>
          )}
        </div>
      </div>

      {/* Card View */}
      {viewMode === "card" && (
        <>
          <div className="grid grid-cols-5">
            {columns.map(
              (col) =>
                isVisible(col) && (
                  <div
                    key={col}
                    className="flex flex-col justify-start w-full border border-gray-300 bg-gray-100 p-4"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropOnColumn(col);
                    }}
                  >
                    <h3 className="flex justify-center items-center text-xl font-semibold pb-4 capitalize">
                      {col}
                    </h3>

                    <div className="flex flex-col gap-3 justify-center items-center">
                      {(() => {
                        const allInColumn = currentJobsByColumn[col];
                        const filtered = allInColumn.filter(jobMatches);

                        if (allInColumn.length === 0) {
                          return (
                            <p className="text-gray-500 italic">
                              {activeTab === "Active" ? "No jobs yet" : "No archived jobs yet"}
                            </p>
                          );
                        }

                        if (filtered.length === 0) {
                          return <p className="text-gray-500 italic">No matches</p>;
                        }

                        return filtered.map((job) => (
                          <TrackerJobCard
                            key={job.id}
                            title={job.title}
                            company={job.company}
                            location={job.location}
                            draggable
                            onDragStart={() => handleDragStart(job)}
                            onDragEnd={handleDragEnd}
                            isDragging={
                              dragging?.id === job.id &&
                              dragging.source === currentBucket &&
                              dragging.fromStatus === job.status
                            }
                          />
                        ));
                      })()}
                    </div>
                  </div>
                )
            )}
          </div>

          {visibleColumns.length === 0 && (
            <div className="m-6 border-2 border-dashed border-gray-300 rounded p-8 text-center text-gray-600">
              No columns selected. Use “Visible columns” to show lists.
            </div>
          )}
        </>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="mt-4 mx-5 overflow-x-auto">
          <div className="min-w-[720px] rounded-lg border border-gray-200 bg-white">
            <div className="px-4 py-3 border-b border-gray-300 bg-gray-50">
              <h3 className="font-semibold">{activeTab === "Active" ? "Jobs" : "Archived Jobs"}</h3>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 uppercase tracking-wide">
                  {LIST_COLUMNS.map((col) => (
                    <th key={String(col.key)} className="px-4 py-2">
                      {col.header}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-right">{activeTab === "Active" ? "Actions" : ""}</th>
                </tr>
              </thead>

              <tbody>
                {currentListRows.length > 0 ? (
                  currentListRows.map((job) => (
                    <tr
                      key={job.id}
                      className="border-t border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      {LIST_COLUMNS.map((col) => (
                        <td key={String(col.key)} className={`px-4 py-2 ${col.tdClass ?? ""}`}>
                          {String(job[col.key])}
                        </td>
                      ))}

                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            aria-label="View job details"
                            onClick={() => console.log("Open job details (not implemented yet)", job)}
                            className="text-gray-500 hover:text-blue-600 transition-transform hover:scale-110 bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center"
                          >
                            <IconChevronDown />
                          </button>

                          {activeTab === "Active" && (
                            <button
                              onClick={() => archiveJob(job.id, job.status)}
                              className="ml-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                            >
                              Archive
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={LIST_COLUMNS.length + 1}
                      className="px-4 py-6 text-center text-gray-600 italic"
                    >
                      {visibleColumns.length === 0
                        ? "No columns selected. Use “Visible columns” to show lists."
                        : hasActiveSearch
                        ? "No matches."
                        : activeTab === "Active"
                        ? "No jobs available."
                        : "No archived jobs yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Job modal */}
      <AddNewJob open={openAdd} onClose={() => setOpenAdd(false)} onCreate={handleCreate} />
    </div>
  );
}
