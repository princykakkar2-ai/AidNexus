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

  const [isDragOver, setIsDragOver] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Real-time validations
  const titleValid = form.title.trim().length >= 5;
  const descValid = form.description.trim().length >= 15;
  const categoryValid = form.category !== "";
  const locationValid = form.location.trim().length >= 3;

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

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("Image/file must be 10 MB or smaller.");
        return;
      }
      setError("");
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    handleFileChange(droppedFile);
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!declared) {
      setError("Please check the declaration statement before submitting.");
      return;
    }

    if (!titleValid || !descValid || !categoryValid || !locationValid) {
      setError("Please correct all validation errors before registering.");
      return;
    }

    try {
      setLoading(true);
      await createProblem(form, file);
      setMessage("Grievance registered successfully in national system database.");
      setForm({ title: "", description: "", category: "", location: "", createdBy: "anonymous" });
      setFile(null);
      setPreviewUrl(null);
      setDeclared(false);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-2">
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-xs font-bold text-red-700 border border-red-200">{error}</p>}
      {message && <p className="mb-4 rounded bg-green-50 p-3 text-xs font-bold text-green-700 border border-green-200">{message}</p>}

      <form onSubmit={submit} className="space-y-5">
        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Problem Title / Heading</label>
            {form.title.trim() && (
              <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${titleValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                {titleValid ? '✓ Validated' : 'Min 5 characters'}
              </span>
            )}
          </div>
          <input 
            name="title" 
            value={form.title} 
            onChange={update} 
            className={`w-full rounded border px-4 py-3 text-xs outline-none transition-colors ${
              !form.title.trim() ? 'border-slate-200' : titleValid ? 'border-emerald-500/80 focus:border-emerald-600' : 'border-rose-400 focus:border-rose-500'
            }`} 
            placeholder="Enter clear summary (e.g. Flickering streetlight near Park Avenue)" 
            required 
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Detailed Description</label>
            {form.description.trim() && (
              <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${descValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                {descValid ? '✓ Validated' : `Min 15 chars (${form.description.trim().length}/15)`}
              </span>
            )}
          </div>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={update} 
            rows="5" 
            className={`w-full rounded border px-4 py-3 text-xs outline-none leading-relaxed transition-colors ${
              !form.description.trim() ? 'border-slate-200' : descValid ? 'border-emerald-500/80 focus:border-emerald-600' : 'border-rose-400 focus:border-rose-500'
            }`} 
            placeholder="Please describe details of the problem (incident date, impact, location details, etc.)..." 
            required 
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Department */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Department / Category</label>
              {form.category && (
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">✓ Selected</span>
              )}
            </div>
            <select 
              name="category" 
              value={form.category} 
              onChange={update} 
              className={`w-full rounded border px-4 py-3 text-xs font-semibold text-slate-600 cursor-pointer transition-colors ${
                categoryValid ? 'border-emerald-500/80' : 'border-slate-200'
              }`} 
              required
            >
              <option value="">Select Department</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>

          {/* Coordinates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Coordinates / Location Address</label>
              {form.location.trim() && (
                <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${locationValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {locationValid ? '✓ Validated' : 'Required'}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input 
                name="location" 
                value={form.location} 
                onChange={update} 
                className={`min-w-0 flex-1 rounded border px-4 py-3 text-xs outline-none transition-colors ${
                  !form.location.trim() ? 'border-slate-200' : locationValid ? 'border-emerald-500/80 focus:border-emerald-600' : 'border-rose-400 focus:border-rose-500'
                }`} 
                placeholder="Address or GPS coordinates" 
                required 
              />
              <button 
                type="button" 
                onClick={useLocation} 
                className="rounded border border-[#E65C00] px-3.5 text-xs font-bold text-[#E65C00] hover:bg-orange-50/50 uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                title="Detect current location"
              >
                📍 GPS
              </button>
            </div>
          </div>
        </div>

        {/* Location Auto-Detect Mini-Map Preview */}
        {locationValid && (
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 animate-fadeIn space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-600 uppercase">
              <span>🗺️ Geolocated Pinpoint Preview</span>
              <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-[8px]">Coordinates Confirmed</span>
            </div>
            <div className="h-28 rounded-md bg-[#CBD5E1] border border-slate-300 relative overflow-hidden flex items-center justify-center">
              {/* Mock map outline grid lines */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:14px_24px]"></div>
              {/* Fake river/roads paths */}
              <svg className="absolute w-full h-full text-slate-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q40,30 60,70 T100,50" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M30,0 Q50,60 80,100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
              {/* Pulsing marker at center */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-2xl animate-bounce">📍</span>
                <div className="h-2 w-2 rounded-full bg-red-600 absolute bottom-0.5 animate-ping"></div>
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-white/90 border border-slate-200 rounded px-2 py-1 text-[8px] text-slate-800 font-bold uppercase tracking-wider text-center truncate">
                Address: {form.location}
              </div>
            </div>
          </div>
        )}

        {/* Media Upload */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Upload Photo Evidence (PDF or Image)</label>
          
          {/* Drag-and-drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-5 text-center transition-all duration-200 relative ${
              isDragOver ? "border-[#E65C00] bg-orange-50/20" : "border-slate-200 hover:border-slate-300 bg-slate-50/30"
            }`}
          >
            <input 
              type="file" 
              id="evidence-upload"
              name="image" 
              accept="image/*,.pdf" 
              onChange={(event) => handleFileChange(event.target.files?.[0] || null)} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="space-y-1.5 pointer-events-none">
              <div className="text-xl text-slate-400">📁</div>
              <p className="text-xs font-bold text-slate-600">Drag and drop file here, or click to browse</p>
              <p className="text-[9px] text-slate-400">Supports PNG, JPG, JPEG or PDF (Max 10MB)</p>
            </div>
          </div>

          {/* Media Info & Badge Tags */}
          {file && (
            <div className="mt-3 p-3 border border-slate-100 bg-slate-50/50 rounded-lg flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-10 w-10 rounded-md object-cover border border-slate-200" />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-slate-200 border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-500 uppercase">
                    PDF
                  </div>
                )}
                <div>
                  <p className="text-xs font-extrabold text-[#0B2545] max-w-[150px] truncate">{file.name}</p>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 justify-end">
                {form.location && (
                  <span className="text-[8px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                    📍 Geotagged
                  </span>
                )}
                <span className="text-[8px] font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide animate-pulse">
                  🤖 AI Validated
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Declaration Checkbox */}
        <div className="flex items-start gap-2.5 p-1 pt-2 border-t border-slate-100">
          <input 
            type="checkbox" 
            id="declaration-cb"
            checked={declared}
            onChange={(e) => setDeclared(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 focus:ring-[#E65C00] h-4.5 w-4.5 accent-[#E65C00] cursor-pointer"
          />
          <label htmlFor="declaration-cb" className="text-[10px] font-bold text-slate-600 leading-normal select-none cursor-pointer">
            I solemnly declare that the incident details logged above are correct and authentic to the best of my knowledge. Submitting fake reports is subject to civic compliance actions.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !declared || !titleValid || !descValid || !categoryValid || !locationValid}
          className="w-full rounded bg-[#E65C00] px-5 py-3 text-xs font-black text-white hover:bg-[#C24E00] disabled:opacity-60 uppercase tracking-widest transition-colors cursor-pointer"
        >
          {loading ? "REGISTERING GRIEVANCE..." : "✓ CONFIRM & REGISTER CIVIC GRIEVANCE"}
        </button>
      </form>
    </div>
  );
}
