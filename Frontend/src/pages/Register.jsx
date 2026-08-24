import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const getPasswordCriteria = (pwd) => {
    return {
      minLength: pwd.length >= 8,
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
    };
  };

  const criteria = getPasswordCriteria(form.password);
  const metCount = Object.values(criteria).filter(Boolean).length;

  const handleUpdate = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill all required registration details.");
      return;
    }

    if (metCount < 5) {
      setError("Password does not meet the strength requirements. It must satisfy all five complexity criteria.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSuccess("Account registration simulated successfully! Redirecting to login...");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-12">
        <div className="card-gov p-8 bg-white border border-[#CCCCCC] shadow-none">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-[#0B2545] tracking-tight uppercase">Portal Registration</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Join the National Civic Action Network</p>
          </div>

          {error && (
            <div className="mb-4 rounded-[2px] bg-red-50 p-3 text-xs font-bold text-red-700 border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-[2px] bg-green-50 p-3 text-xs font-bold text-green-700 border border-green-200">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Full Name / Organization Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleUpdate}
                placeholder="Enter official name"
                className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-2.5 text-xs outline-none focus:border-[#E65C00]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleUpdate}
                placeholder="name@agency.gov.in"
                className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-2.5 text-xs outline-none focus:border-[#E65C00]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleUpdate}
                placeholder="••••••••"
                className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-2.5 text-xs outline-none focus:border-[#E65C00]"
                required
              />
              {form.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase">
                    <span className="text-slate-500">Strength:</span>
                    <span className={
                      metCount <= 1 ? "text-red-600" :
                      metCount === 2 ? "text-orange-500" :
                      metCount === 3 ? "text-yellow-600" :
                      metCount === 4 ? "text-emerald-500" :
                      "text-emerald-600"
                    }>
                      {metCount <= 1 && "Very Weak"}
                      {metCount === 2 && "Weak"}
                      {metCount === 3 && "Fair"}
                      {metCount === 4 && "Good"}
                      {metCount === 5 && "Strong"}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((index) => {
                      const isActive = index <= metCount;
                      let barColor = "bg-slate-200";
                      if (isActive) {
                        if (metCount <= 1) barColor = "bg-red-500";
                        else if (metCount === 2) barColor = "bg-orange-400";
                        else if (metCount === 3) barColor = "bg-yellow-400";
                        else if (metCount === 4) barColor = "bg-emerald-400";
                        else barColor = "bg-emerald-500";
                      }
                      return (
                        <div
                          key={index}
                          className={`h-1 rounded-sm transition-all duration-300 ${barColor}`}
                        />
                      );
                    })}
                  </div>

                  <ul className="mt-2 space-y-1 text-[11px] font-medium text-slate-500">
                    <li className="flex items-center gap-1.5">
                      <span className={`text-[12px] ${criteria.minLength ? "text-emerald-500" : "text-slate-300"}`}>
                        {criteria.minLength ? "✓" : "○"}
                      </span>
                      <span className={criteria.minLength ? "text-slate-800 font-semibold" : ""}>At least 8 characters</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`text-[12px] ${criteria.hasLower ? "text-emerald-500" : "text-slate-300"}`}>
                        {criteria.hasLower ? "✓" : "○"}
                      </span>
                      <span className={criteria.hasLower ? "text-slate-800 font-semibold" : ""}>At least 1 lowercase letter</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`text-[12px] ${criteria.hasUpper ? "text-emerald-500" : "text-slate-300"}`}>
                        {criteria.hasUpper ? "✓" : "○"}
                      </span>
                      <span className={criteria.hasUpper ? "text-slate-800 font-semibold" : ""}>At least 1 uppercase letter</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`text-[12px] ${criteria.hasNumber ? "text-emerald-500" : "text-slate-300"}`}>
                        {criteria.hasNumber ? "✓" : "○"}
                      </span>
                      <span className={criteria.hasNumber ? "text-slate-800 font-semibold" : ""}>At least 1 number</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`text-[12px] ${criteria.hasSpecial ? "text-emerald-500" : "text-slate-300"}`}>
                        {criteria.hasSpecial ? "✓" : "○"}
                      </span>
                      <span className={criteria.hasSpecial ? "text-slate-800 font-semibold" : ""}>At least 1 special character</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleUpdate}
                placeholder="••••••••"
                className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-2.5 text-xs outline-none focus:border-[#E65C00]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Register As Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleUpdate}
                className="w-full rounded-[2px] border border-[#CCCCCC] px-4 py-2.5 text-xs focus:border-[#E65C00]"
              >
                <option value="citizen">Citizen Reporter</option>
                <option value="student">Academic / Student Team</option>
                <option value="industry">Industry Sponsor / NGO</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-[2px] bg-[#E65C00] py-3 text-xs font-bold text-white hover:bg-[#C24E00] uppercase tracking-widest transition-colors mt-6"
            >
              CREATE NEW ACCOUNT
            </button>
          </form>

          <div className="mt-6 text-center border-t border-[#CCCCCC] pt-4">
            <p className="text-xs text-slate-600">
              Already have an official account?{" "}
              <Link to="/login" className="font-bold text-[#E65C00] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
