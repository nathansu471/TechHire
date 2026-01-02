"use client";
import * as React from "react";

export type JobFormValues = {
  title: string;
  company: string;
  location: string;
  jobType: "Full-Time" | "Part-Time" | "Internship" | "Contract";
  status: "saved" | "applied" | "interviewing" | "offer" | "rejected";
  link?: string;
};

type AddNewJobProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (values: JobFormValues) => void;
};

const AddNewJob: React.FC<AddNewJobProps> = ({ open, onClose, onCreate }) => {
  const [values, setValues] = React.useState<JobFormValues>({
    title: "",
    company: "",
    location: "",
    jobType: "Full-Time",
    status: "saved",
    link: "",
  });
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const firstInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (open) {
      setValues({
        title: "",
        company: "",
        location: "",
        jobType: "Full-Time",
        status: "applied",
        link: "",
      });
      setTouched({});
      // focus first field on open
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [open]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const requiredError = (k: keyof JobFormValues) =>
    touched[k as string] && !values[k];

  const handleChange =
    (k: keyof JobFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((v) => ({ ...v, [k]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, company: true, location: true });
    if (!values.title || !values.company || !values.location) return;
    onCreate(values);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-2xl rounded-xl border border-blue-200 bg-white shadow-xl animate-slideDown"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Add Application</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded px-2 py-1 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-5 py-4">
            {/* Title */}
            <label className="block text-sm font-medium mb-1">
              Position Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              value={values.title}
              onChange={handleChange("title")}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              placeholder="Title"
              className={`w-full rounded border px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-100 ${
                requiredError("title") ? "border-red-400" : "border-gray-300"
              }`}
            />

            {/* Company (with helper bar) */}
            <label className="block text-sm font-medium mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <div className="rounded border border-gray-300">
              <div className="px-3 py-2 text-sm bg-blue-50 text-gray-700 border-b border-gray-200">
                We couldn't find an exact match in our system. Please confirm or
                add by searching it below.
              </div>
              <div className="p-2">
                <input
                  value={values.company}
                  onChange={handleChange("company")}
                  onBlur={() => setTouched((t) => ({ ...t, company: true }))}
                  placeholder="Company"
                  className={`w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-100 ${
                    requiredError("company")
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            {/* Grid row */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  value={values.location}
                  onChange={handleChange("location")}
                  onBlur={() => setTouched((t) => ({ ...t, location: true }))}
                  placeholder="Location"
                  className={`w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-100 ${
                    requiredError("location")
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={values.jobType}
                  onChange={handleChange("jobType")}
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-100"
                >
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>

              {/* Job Status */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Status
                </label>
                <select
                  value={values.status}
                  onChange={handleChange("status")}
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-100"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium mb-1">Application Link</label>
                  <input
                    value={values.link || ""}
                    onChange={handleChange("link")}
                    placeholder="https://company.com/application"
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-100"
                  />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-blue-400 text-white px-4 py-2 hover:bg-blue-500 transition-all duration-200"
              >
                Add Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewJob;
