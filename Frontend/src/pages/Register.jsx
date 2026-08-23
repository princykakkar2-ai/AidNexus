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
