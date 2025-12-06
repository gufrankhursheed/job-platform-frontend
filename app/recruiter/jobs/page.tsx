"use client";

import { useState } from "react";
import { apiFetch } from "@/utils/api";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiLoader } from "react-icons/fi";
import ProtectedPage from "@/components/ProtectedPage";
import { useDispatch } from "react-redux";
import { addNewJob } from "@/redux/slices/jobsSlice";

export default function CreateJobPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    category: "",
    location: "",
    remote: false,
    salaryRange: "",
    experienceLevel: "",
    description: "",
    requirements: [""],
    responsibilities: [""],
    deadline: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  // Generic input handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggleRemote = () => {
    setForm({ ...form, remote: !form.remote });
  };

  // Dynamic list handlers
  const updateList = (
    key: "requirements" | "responsibilities",
    index: number,
    value: string
  ) => {
    const updated = [...(form as any)[key]];
    updated[index] = value;
    setForm({ ...form, [key]: updated });
  };

  const addToList = (key: "requirements" | "responsibilities") => {
    setForm({ ...form, [key]: [...(form as any)[key], ""] });
  };

  const removeFromList = (
    key: "requirements" | "responsibilities",
    index: number
  ) => {
    const updated = [...(form as any)[key]].filter((_, i) => i !== index);
    setForm({ ...form, [key]: updated });
  };

  // Form validation
  const validate = () => {
    const newErrors: any = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.deadline.trim()) newErrors.deadline = "Deadline is required";

    return newErrors;
  };

  // Submit job
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSubmitting(true);

      const res = await apiFetch("job/create", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        setErrors({ api: data.message || "Failed to create job" });
        return;
      }

       dispatch(addNewJob(data.job));

      router.push("/recruiter/jobs/manage");
    } catch (err) {
      setSubmitting(false);
      setErrors({ api: "Something went wrong. Try again!" });
    }
  };

  return (
    <ProtectedPage allowedRoles={["recruiter"]}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-10">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-8">
            Create Job
          </h1>

          {errors.api && (
            <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg">
              {errors.api}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="font-semibold">Job Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="font-semibold">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
              />
              {errors.companyName && (
                <p className="text-red-600 text-sm">{errors.companyName}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="font-semibold">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
              >
                <option value="">Select</option>
                <option value="Software">Software</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Location + Remote */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="font-semibold">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg mt-1"
                />
                {errors.location && (
                  <p className="text-red-600 text-sm">{errors.location}</p>
                )}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <input
                  type="checkbox"
                  checked={form.remote}
                  onChange={handleToggleRemote}
                  className="h-5 w-5"
                />
                <label className="font-semibold">Remote</label>
              </div>
            </div>

            {/* Salary + Experience */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="font-semibold">Salary Range</label>
                <input
                  type="text"
                  name="salaryRange"
                  value={form.salaryRange}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg mt-1"
                />
              </div>

              <div className="flex-1">
                <label className="font-semibold">Experience Level</label>
                <input
                  type="text"
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg mt-1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="font-semibold">Description</label>
              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
              />
              {errors.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="font-semibold">Requirements</label>
              <div className="space-y-3 mt-2">
                {form.requirements.map((req, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        updateList("requirements", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromList("requirements", index)}
                      className="bg-red-100 text-red-600 px-3 rounded-lg hover:bg-red-200"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addToList("requirements")}
                  className="flex items-center gap-2 text-indigo-600 font-semibold"
                >
                  <FiPlus /> Add Requirement
                </button>
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="font-semibold">Responsibilities</label>
              <div className="space-y-3 mt-2">
                {form.responsibilities.map((res, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={res}
                      onChange={(e) =>
                        updateList("responsibilities", index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromList("responsibilities", index)}
                      className="bg-red-100 text-red-600 px-3 rounded-lg hover:bg-red-200"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addToList("responsibilities")}
                  className="flex items-center gap-2 text-indigo-600 font-semibold"
                >
                  <FiPlus /> Add Responsibility
                </button>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="font-semibold">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
              />
              {errors.deadline && (
                <p className="text-red-600 text-sm">{errors.deadline}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? <FiLoader className="animate-spin" /> : null}
                {submitting ? "Creating..." : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </ProtectedPage>
  );
}
