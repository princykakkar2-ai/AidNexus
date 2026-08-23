import { useState } from "react";
import { createProblem } from "../services/api";

const categories = [
  "Infrastructure",
  "Environment",
  "Transportation",
  "Education",
  "Healthcare",
  "Waste Management",
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
          location: `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
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
      setMessage("Grievance registered successfully in national system database.");
      setForm({ title: "", description: "", category: "", location: "", createdBy: "anonymous" });
      setFile(null);
      event.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5 bg-white">
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Problem Title / Heading</label>
        <input name="title" value={form.title} onChange={update} className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-3 text-xs outline-none focus:border-[#E65C00]" placeholder="Enter clear summary" required />
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Detailed Description</label>
        <textarea name="description" value={form.description} onChange={update} rows="5" className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-3 text-xs outline-none focus:border-[#E65C00] leading-relaxed" placeholder="Please describe details of the problem..." required />
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Department / Category</label>
        <select name="category" value={form.category} onChange={update} className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-3 text-xs" required>
          <option value="">Select Department</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Coordinates / Location Address</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input name="location" value={form.location} onChange={update} className="min-w-0 flex-1 rounded-[2px] border border-[#CCCCCC] px-4 py-3 text-xs outline-none focus:border-[#E65C00]" placeholder="Address or GPS coordinates" required />
          <button type="button" onClick={useLocation} className="rounded-[2px] border border-[#E65C00] px-4 py-2 text-xs font-bold text-[#E65C00] hover:bg-amber-50 uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer">Use Current GPS</button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Upload Photo Evidence (PDF or Image)</label>
        <input type="file" name="image" accept="image/*,.pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full rounded-[2px] border border-[#CCCCCC] p-2.5 text-xs text-slate-500" />
      </div>

      {error && <p className="rounded-[2px] bg-red-50 p-3 text-xs font-bold text-red-700 border border-red-200">{error}</p>}
      {message && <p className="rounded-[2px] bg-green-50 p-3 text-xs font-bold text-green-700 border border-green-200">{message}</p>}

      <button disabled={loading} className="w-full rounded-[2px] bg-[#E65C00] px-5 py-3 text-xs font-bold text-white hover:bg-[#C24E00] disabled:opacity-60 uppercase tracking-widest transition-colors">
        {loading ? "REGISTERING GRIEVANCE..." : "REGISTER CIVIC GRIEVANCE"}
      </button>
    </form>
  );
}
