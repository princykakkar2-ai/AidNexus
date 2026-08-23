import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "citizen",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUpdate = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Please fill all required credentials.");
      return;
    }

    // Role-based redirection simulation
    switch (form.role) {
      case "citizen":
        navigate("/citizen");
        break;
      case "student":
        navigate("/student");
        break;
      case "industry":
        navigate("/industry");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-20">
        <div className="card-gov p-8 bg-white border border-[#CCCCCC] shadow-none">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-[#0B2545] tracking-tight uppercase">User Authentication</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">National Civic Action Network</p>
          </div>

          {error && (
            <div className="mb-4 rounded-[2px] bg-red-50 p-3 text-xs font-bold text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Username / Email</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleUpdate}
                placeholder="Enter your registered username"
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
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Select User Role</label>
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
              AUTHENTICATE & LOG IN
            </button>
          </form>

          <div className="mt-6 text-center border-t border-[#CCCCCC] pt-4">
            <p className="text-xs text-slate-600">
              New to CivicConnect?{" "}
              <Link to="/register" className="font-bold text-[#E65C00] hover:underline">
                Create an Official Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
