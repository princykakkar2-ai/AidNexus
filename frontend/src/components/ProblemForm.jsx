import { useState } from "react";
import { createProblem } from "../services/api";

const categories = [
  "Environment",
  "Transportation",
  "Education",
  "Healthcare",
  "Infrastructure",
  "Sanitation",
  "Safety",
  "Other",
];

export default function ProblemForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    createdBy: "anonymous",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const useLocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({
          ...current,
          location: `${coords.latitude}, ${coords.longitude}`,
        }));
      },
      () => setError("Unable to get your location. Please enter it manually."),
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.title || !form.description || !form.category || !form.location) {
      setError("Please fill all required fields.");
      return;
    }

    if (file && file.size > 10 * 1024 * 1024) {
      setError("Image/file must be 10 MB or smaller.");
      return;
    }

    try {
      setLoading(true);
      await createProblem(form, file);
      setMessage("Problem submitted successfully.");
      setForm({ title: "", description: "", category: "", location: "", createdBy: "anonymous" });
      setFile(null);
      event.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit the problem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Problem title</label>
        <input name="title" value={form.title} onChange={update} className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-500" placeholder="Enter problem title" required />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Problem description</label>
        <textarea name="description" value={form.description} onChange={update} rows="5" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-500" placeholder="Describe the problem" required />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
        <select name="category" value={form.category} onChange={update} className="w-full rounded-lg border border-slate-300 px-4 py-3" required>
          <option value="">Select category</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Location</label>
        <div className="flex gap-2">
          <input name="location" value={form.location} onChange={update} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3" placeholder="Enter location or coordinates" required />
          <button type="button" onClick={useLocation} className="rounded-lg border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-700">Use my location</button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Image/File upload</label>
        <input type="file" name="image" accept="image/*,.pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full rounded-lg border border-slate-300 p-3" />
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}

      <button disabled={loading} className="w-full rounded-lg bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-60">
        {loading ? "Submitting..." : "Submit Problem"}
      </button>
    </form>
  );
}
